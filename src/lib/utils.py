from disposable_email_checker.validators import validate_disposable_email
from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email
from PIL import Image
from django.db import transaction
from io import BytesIO
import urllib.parse
from django.conf import settings
import boto3


def validate_email(value):
    """Validate a single email."""
    if not value:
        return False
    # Check the regex, using the validate_email from django.
    try:
        django_validate_email(value)
    except ValidationError:
        return False
    else:
        # Check with the disposable list.
        try:
            validate_disposable_email(value)
        except ValidationError:
            return False
        else:
            return True


def generate_full_plus_thumb(photo_data):
    data = {}
    im = Image.open(photo_data)
    bg = Image.new("RGB", im.size, (255, 255, 255))
    x, y = im.size
    bg.paste(im, (0, 0, x, y))

    # Max resolution of 1024 x 1024
    maxsize = (1024, 1024)
    bg.thumbnail(maxsize, Image.ANTIALIAS)
    buffer = BytesIO()
    bg.save(buffer, format="JPEG", quality=50, optimize=True)
    data['full_width'] = bg.size[0]
    data['full_height'] = bg.size[1]
    data['full'] = buffer.getvalue()

    # Thumbnail
    maxsize = (120, 90)
    bg.thumbnail(maxsize, Image.ANTIALIAS)
    buffer = BytesIO()
    bg.save(buffer, format="JPEG", quality=50, optimize=True)
    data['thumbnail'] = buffer.getvalue()

    return data


class AtomicMixin(object):
    """
    Ensure we rollback db transactions on exceptions.

    From https://gist.github.com/adamJLev/7e9499ba7e436535fd94
    """

    @transaction.atomic()
    def dispatch(self, *args, **kwargs):
        """Atomic transaction."""
        return super(AtomicMixin, self).dispatch(*args, **kwargs)

    def handle_exception(self, *args, **kwargs):
        """Handle exception with transaction rollback."""
        response = super(AtomicMixin, self).handle_exception(*args, **kwargs)

        if getattr(response, 'exception'):
            # We've suppressed the exception but still need to
            # rollback any transaction.
            transaction.set_rollback(True)

        return response


def savePublicPhotoToS3(
        uuid, description, filename, mimetype, imageBytes):
    path = 'uploads' + '/' + uuid + '/' + description + '/' + \
        urllib.parse.quote_plus(filename)
    client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
            )
    client.put_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=path, Body=imageBytes)
    url = client.generate_presigned_url(
            ClientMethod='get_object',
            Params={
                'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                'Key': path
                },
            )

    # Strip the expiry time
    return url.split('?', 1)[0]
