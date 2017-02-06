from django.contrib import admin
from django.apps import apps
from accounts.models import User
from django.contrib.auth.admin import UserAdmin


accounts_app = apps.get_app_config('accounts')
base_app = apps.get_app_config('base')

# for model_name, model in accounts_app.models.items():
 #   admin.site.register(model)

for model_name, model in base_app.models.items():
    admin.site.register(model)


admin.site.register(User, UserAdmin)

