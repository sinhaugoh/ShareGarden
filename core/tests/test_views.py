from django.test import TestCase, override_settings
from django.urls import reverse
import tempfile
import shutil

from ..model_factories import *

USER_PASSWORD = 'ShareGarden'
MEDIA_ROOT = tempfile.mkdtemp()
TEST_SERVER_DOMAIN = 'http://testserver'


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
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

        # remove test images from temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_urlIsWorking(self):
        response = self.client.get(self.rel_path)
        self.assertEqual(response.status_code, 200)

    def test_urlByNameIsWorking(self):
        response = self.client.get(self.url)
        self.assertEqual(self.url, self.rel_path)
        self.assertEqual(response.status_code, 200)

    def test_usingCorrectTemplate(self):
        response = self.client.get(self.rel_path)
        self.assertTemplateUsed(response, 'core/login_page.html')

    def test_redirectToIndexIfAlreadyAuthenticated(self):
        # log in
        self.client.login(username=self.user.username,
                          password=USER_PASSWORD)

        response = self.client.get(self.rel_path)
        self.assertRedirects(response, '/')

    def test_redirectToIndexIfLoginSuccessful(self):
        response = self.client.post(self.rel_path, {
            'username': self.user.username,
            'password': USER_PASSWORD
        })

        self.assertRedirects(response, '/')
