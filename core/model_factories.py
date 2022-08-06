import factory

from .models import *


class UserFactory(factory.django.DjangoModelFactory):
    username = factory.Sequence(lambda n: 'user{}'.format(n))
    # set the password of user instance once it is created
    password = factory.PostGenerationMethodCall('set_password', 'ShareGarden')
    profile_image = factory.django.ImageField()
    about = 'this is about section'
    address = 'Yew tee Mrt'

    class Meta:
        model = User
