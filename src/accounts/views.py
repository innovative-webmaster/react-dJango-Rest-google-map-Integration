from django_rest_logger import log
from rest_framework import status, parsers, renderers
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.serializers import JSONWebTokenSerializer
from rest_framework_jwt.utils import jwt_response_payload_handler
from django.core.exceptions import ObjectDoesNotExist

from accounts.models import User
from accounts.serializers import UserRegistrationSerializer
from lib.utils import AtomicMixin
from rest_framework_jwt.settings import api_settings
from django.conf import settings
import requests


class UserRegisterView(AtomicMixin, CreateModelMixin, GenericAPIView):
    serializer_class = UserRegistrationSerializer
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        user = self.create(request)

        # Send email to user here
        domain = settings.DOMAIN + "/confirm/email/" +\
            str(user.data['activation_key'])

        email_text = "Confirm your account on GNDAPTs: " +\
            "<br/><br/>" +\
            "<a href='" + domain + "'/>Confirm account</a>"

        url = "https://api.mailgun.net/v3/" +\
            settings.MAILGUN_DOMAIN + "/messages"

        files = {
            'from': 'gndapts@mail.gndapts.com',
            'to': user.data['email'],
            'subject': "Confirm your account on GNDAPTS",
            'html': email_text
            }

        requests.post(url, auth=('api', settings.MAILGUN_API_KEY), data=files)
        return Response({}, status=status.HTTP_200_OK)


class UserLoginView(APIView):
    throttle_classes = ()
    permission_classes = ()
    authentication_classes = ()
    parser_classes = (parsers.FormParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = JSONWebTokenSerializer

    def post(self, request):
        """
        User login view.

        Based on JSONWebTokenAPIView from rest_framework_jwt.
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.object.get('user') or request.user
            token = serializer.object.get('token')
            response_data = jwt_response_payload_handler(token, user, request)

            return Response(response_data)

        log.warning(
                message='Authentication failed.',
                details={'http_status_code': status.HTTP_401_UNAUTHORIZED})
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class UserConfirmEmailView(GenericAPIView):
    serializer_class = None
    authentication_classes = ()
    permission_classes = ()

    def get(self, request, activation_key):
        try:
            user = User.objects.get(activation_key=str(activation_key))
        except ObjectDoesNotExist:
            return Response({'message': 'Invalid confirmation code'},
                            status=status.HTTP_404_NOT_FOUND)

        user.confirm_email()

        # Generate JWT from just the user object
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(user)
        return Response({'token': jwt_encode_handler(payload)},
                        status=status.HTTP_200_OK)
