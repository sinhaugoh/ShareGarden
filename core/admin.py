from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.
# add new section
UserAdmin.fieldsets += ('Other information', {'fields': ('profile_image',)}),

admin.site.register(User, UserAdmin)
