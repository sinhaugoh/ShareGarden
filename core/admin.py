from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ItemPost, ItemPostImage, Transaction

# Register your models here.
# add new section
UserAdmin.fieldsets += ('Other information',
                        {'fields': ('profile_image', 'address', 'about')}),

admin.site.register(User, UserAdmin)
admin.site.register(ItemPost)
admin.site.register(ItemPostImage)
admin.site.register(Transaction)
