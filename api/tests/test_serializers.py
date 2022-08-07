from django.test import TestCase, override_settings

from ..serializers import *
from core.model_factories import *
import tempfile
import shutil

MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class UserSerializerTest(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = UserFactory.create()
        cls.serializer = UserSerializer(instance=cls.user)
        cls.serializer_data = cls.serializer.data

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        User.objects.all().delete()
        UserFactory.reset_sequence(0)

        # remove temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_userSerializerHasCorrectKeys(self):
        self.assertEqual(set(self.serializer_data.keys()), set([
            'username',
            'profile_image',
            'about',
            'address'
        ]))

    def test_usernameHasCorrectValue(self):
        self.assertEqual(self.serializer_data['username'], self.user.username)

    def test_profileImageHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['profile_image'], self.user.profile_image.url)

    def test_aboutHasCorrectValue(self):
        self.assertEqual(self.serializer_data['about'], self.user.about)

    def test_addressHasCorrectValue(self):
        self.assertEqual(self.serializer_data['address'], self.user.address)
