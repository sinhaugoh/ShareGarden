from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ItemPost, ItemPostImage

# Register your models here.
# add new section
UserAdmin.fieldsets += ('Other information',
                        {'fields': ('profile_image', 'location', 'about')}),

admin.site.register(User, UserAdmin)
admin.site.register(ItemPost)
admin.site.register(ItemPostImage)
