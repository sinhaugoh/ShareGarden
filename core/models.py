from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


def get_profile_image_path(instance, filename):
    return 'images/profile_images/{}/profile_image.jpg'.format(str(instance.pk))


class User(AbstractUser):
    profile_image = models.ImageField(null=True, blank=True,
                                      upload_to=get_profile_image_path)
    about = models.CharField(max_length=500, null=True, blank=True)
