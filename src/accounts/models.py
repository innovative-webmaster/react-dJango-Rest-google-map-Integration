from uuid import uuid4

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from json import JSONEncoder
from django.contrib.auth.models import PermissionsMixin
from gndapts.utils import NewJSONEncoder


JSONEncoder.default = NewJSONEncoder


class MyUserManager(BaseUserManager):
    def _create_user(self, email, password, first_name, last_name, is_staff,
                     is_superuser, **extra_fields):
        now = timezone.now()
        email = self.normalize_email(email)
        user = self.model(email=email,
                          first_name=first_name,
                          last_name=last_name,
                          is_staff=is_staff,
                          is_active=True,
                          is_superuser=is_superuser,
                          last_login=now,
                          date_joined=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, email, first_name, last_name, password,
                    **extra_fields):
        return self._create_user(email, password, first_name, last_name,
                                 is_staff=False, is_superuser=False,
                                 **extra_fields)

    def create_superuser(self, email, first_name='', last_name='',
                         password=None, **extra_fields):
        return self._create_user(email, password, first_name, last_name,
                                 is_staff=True, is_superuser=True,
                                 **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    uuid = models.UUIDField(primary_key=True, unique=True, default=uuid4,
                            editable=False)
    first_name = models.CharField(_('First Name'), max_length=50)
    last_name = models.CharField(_('Last Name'), max_length=50)
    email = models.EmailField(_('Email address'), unique=True)

    confirmed_email = models.BooleanField(default=False)

    is_staff = models.BooleanField(_('staff status'), default=False)
    is_superuser = models.BooleanField(_('superuser status'), default=False)
    is_active = models.BooleanField(_('active'), default=True)

    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)

    activation_key = models.UUIDField(unique=True, default=uuid4)  # email
    recovery_key = models.UUIDField(null=True, blank=True)

    USERNAME_FIELD = 'email'

    objects = MyUserManager()

    def __str__(self):
        return self.email

    def get_full_name(self):
        return "{0} {1}".format(self.first_name, self.last_name)

    def get_short_name(self):
        return self.first_name

    def confirm_email(self):
        self.confirmed_email = True
        self.save()
