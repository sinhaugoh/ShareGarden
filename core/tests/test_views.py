from django.test import TestCase
from django.urls import reverse
import tempfile
import shutil

from ..model_factories import *

MEDIA_ROOT = tempfile.mkdtemp()
TEST_SERVER_DOMAIN = 'http://testserver'


class LoginViewTest(TestCase):
    rel_path = '/login/'

    def setUp(self):
        super().setUp()
        self.user = UserFactory.create()
        self.url = reverse('login')

    def tearDown(self):
        super().tearDown()
        User.objects.all().delete()
        UserFactory.reset_sequence(0)

    def test_urlIsWorking(self):
        response = self.client.get(self.rel_path)
        self.assertEqual(response.status_code, 200)

    def test_urlByNameIsWorking(self):
        response = self.client.get(self.url)
        self.assertEqual(self.url, self.rel_path)
        self.assertEqual(response.status_code, 200)
