from gndapts.settings.base import *  # NOQA (ignore all errors on this line)


DEBUG = True

PAGE_CACHE_SECONDS = 1

MAILGUN_API_KEY = 'key-442e50acc9cba4977bbcdd955bd00db4'
MAILGUN_DOMAIN = 'sandbox6601c4f014a44e0e87c37cc9baef28f1.mailgun.org'

DOMAIN = "http://localhost:8000"

AWS_SECRET_ACCESS_KEY = 'mMm3bttC8ko7UeArc8EfpT6LMVFyeK3ByF53VNsh'
AWS_STORAGE_BUCKET_NAME = 'gndapts-dev'
AWS_ACCESS_KEY_ID = 'AKIAJPDEQ5NPKXXFPRGA'

DATABASES = {}
DATABASES['default'] = {
    'ENGINE': 'django.db.backends.postgresql_psycopg2',
    'NAME': 'mydb',
    'USER': 'postgres',
    'PASSWORD': 'admin',
    'HOST': 'localhost',
    'PORT': ''
}

REST_FRAMEWORK['EXCEPTION_HANDLER'] = 'django_rest_logger.handlers.rest_exception_handler'  # NOQA (ignore all errors on this line)
WSGI_APPLICATION = 'gndapts.wsgi.application'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'root': {
        'level': 'DEBUG',
        'handlers': ['django_rest_logger_handler'],
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s '
                      '%(process)d %(thread)d %(message)s'
        },
    },
    'handlers': {
        'django_rest_logger_handler': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'ERROR',
            'handlers': ['django_rest_logger_handler'],
            'propagate': False,
        },
        'django_rest_logger': {
            'level': 'DEBUG',
            'handlers': ['django_rest_logger_handler'],
            'propagate': False,
        },
    },
}

DEFAULT_LOGGER = 'django_rest_logger'

LOGGER_EXCEPTION = DEFAULT_LOGGER
LOGGER_ERROR = DEFAULT_LOGGER
LOGGER_WARNING = DEFAULT_LOGGER
