from django.contrib import admin
from django.apps import apps
from accounts.models import User
from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group

accounts_app = apps.get_app_config('accounts')
base_app = apps.get_app_config('base')

for model_name, model in base_app.models.items():
    admin.site.register(model)


# Everything below this is for forms in django-admin
class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.confirmed_email = True
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ('email', 'first_name',
                  'last_name', 'password', 'is_active', 'is_superuser')


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'first_name',
                    'last_name', 'is_superuser')
    list_filter = ('is_superuser', )
    ordering = ('email',)
    fieldsets = (
            (None, {'fields': ('email', 'password')}),
            ('Personal info', {'fields': ('first_name', 'last_name', )}),
            ('Permissions', {'fields': ('is_superuser',)}),
            )
    add_fieldsets = (
            (None, {
                'classes': ('wide',),
                'fields': ('email', 'first_name', 'last_name', 'password1')}
                ),
            )

admin.site.register(User, UserAdmin)
admin.site.unregister(Group)
