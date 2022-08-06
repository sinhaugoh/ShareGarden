from django.urls import reverse
from rest_framework.test import APITestCase, override_settings
import tempfile
import shutil
import json

from core.model_factories import *
from core.tests.test_views import TEST_SERVER_DOMAIN, USER_PASSWORD

MEDIA_ROOT = tempfile.mkdtemp()
TEST_SERVER_DOMAIN = 'http://testserver'
USER_PASSWORD = 'ShareGarden'


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class AuthUserTest(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory.create()
        self.rel_url = '/api/authuser/'
        self.url = reverse('auth-user')

    def tearDown(self):
        super().tearDown()
        User.objects.all().delete()
        UserFactory.reset_sequence(0)

        # delete temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_urlByNameIsWorking(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)

    def test_returnCorrectKeyIfUserIsNotAuthenticated(self):
        response = self.client.get(self.rel_url)
        data = response.json()

        self.assertTrue('user' in data.keys())

    def test_returnCorrectResultIfUserIsNotAuthenticated(self):
        response = self.client.get(self.rel_url)
        data = response.json()

        self.assertEqual(data, {'user': None})

    def test_returnCorrectStatusCodeIfUserIsNotAuthenticated(self):
        response = self.client.get(self.rel_url)

        self.assertEqual(response.status_code, 200)

    def test_returnCorrectKeyIfUserIsAuthenticated(self):
        self.client.login(username=self.user.username, password=USER_PASSWORD)
        response = self.client.get(self.rel_url)
        data = response.json()

        self.assertTrue('user' in data.keys())

    def test_returnCorrectResultIfUserIsAuthenticated(self):
        self.client.login(username=self.user.username, password=USER_PASSWORD)
        response = self.client.get(self.rel_url)
        data = response.json()

        self.assertEqual(data, {'user': {
            'username': self.user.username,
            'profile_image': self.user.profile_image.url,
            'about': self.user.about,
            'address': self.user.address
        }})

    def test_returnCorrectStatusCodeIfUserIsAuthenticated(self):
        self.client.login(username=self.user.username, password=USER_PASSWORD)
        response = self.client.get(self.rel_url)

        self.assertEqual(response.status_code, 200)


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class LogoutTest(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory.create()
        # make user logged in by default
        self.client.login(username=self.user.username, password=USER_PASSWORD)
        self.rel_url = '/api/logout/'
        self.url = reverse('logout')

    def tearDown(self):
        super().tearDown()
        User.objects.all().delete()
        UserFactory.reset_sequence(0)

        # delete temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_urlIsWorking(self):
        response = self.client.get(self.rel_url)

        self.assertEqual(response.status_code, 204)

    def test_urlByNameIsWorking(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 204)

    def test_returnCorrectStatusCodeIfSuccessful(self):
        response = self.client.get(self.rel_url)

        self.assertEqual(response.status_code, 204)

    def test_returnCorrectKeyIfUserIsNotAuthenticated(self):
        # log out
        self.client.logout()
        response = self.client.get(self.rel_url)

        self.assertEqual(response.status_code, 405)


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class RegisterTest(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory.create()
        self.rel_url = '/api/register/'
        self.url = reverse('register')
        self.valid_input = {
            'username': 'VALID_USER',
            'password': 'ShareGarden',
            'password2': 'ShareGarden'
        }

    def tearDown(self):
        super().tearDown()
        User.objects.all().delete()
        UserFactory.reset_sequence(0)

        # delete temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_urlByNameIsWorking(self):
        response = self.client.post(self.url, self.valid_input)

        self.assertEqual(response.status_code, 201)

    def test_returnCorrectStatusCodeIfUserIsAlreadyAuthenticated(self):
        self.client.login(username=self.user.username, password=USER_PASSWORD)
        response = self.client.post(self.rel_url, self.valid_input)

        self.assertEqual(response.status_code, 405)

    def test_returnCorrectStatusCodeIfInputIsValid(self):
        response = self.client.post(self.rel_url, self.valid_input)

        self.assertEqual(response.status_code, 201)

    def test_returnCorrectResultIfInputIsValid(self):
        response = self.client.post(self.rel_url, self.valid_input)
        data = response.json()

        self.assertEqual(data['user']['username'],
                         self.valid_input['username'])

    def test_returnCorrectStatusCodeIfUsernameIsBlank(self):
        invalid_input = self.valid_input
        invalid_input['username'] = ''
        response = self.client.post(self.rel_url, invalid_input)

        self.assertTrue(response.status_code, 400)

    def test_returnCorrectKeyIfUsernameIsBlank(self):
        invalid_input = self.valid_input
        invalid_input['username'] = ''
        response = self.client.post(self.rel_url, invalid_input)
        data = response.json()

        self.assertTrue('username' in data.keys())

    def test_returnCorrectStatusCodeIfPasswordIsWeak(self):
        invalid_input = {**self.valid_input,
                         'password': 'weak', 'password2': 'weak'}
        response = self.client.post(self.rel_url, invalid_input)

        self.assertTrue(response.status_code, 400)

    def test_returnCorrectKeyIfPasswordIsWeak(self):
        invalid_input = {**self.valid_input,
                         'password': 'weak', 'password2': 'weak'}
        response = self.client.post(self.rel_url, invalid_input)
        data = response.json()

        self.assertTrue('password' in data.keys())

    def test_returnCorrectStatusCodeIfPasswordAndPassword2DoesNotMatch(self):
        invalid_input = {**self.valid_input,
                         'password': 'ShareGarden', 'password2': 'NOT_MATCHING'}
        response = self.client.post(self.rel_url, invalid_input)

        self.assertTrue(response.status_code, 400)

    def test_returnCorrectKeyIfPasswordAndPassword2DoesNotMatch(self):
        invalid_input = {**self.valid_input,
                         'password': 'ShareGarden', 'password2': 'NOT_MATCHING'}
        response = self.client.post(self.rel_url, invalid_input)
        data = response.json()

        self.assertTrue('password' in data.keys())


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class UserApiTest(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory.create()
        self.rel_url = '/api/user/{}/'.format(self.user.username)
        self.url = reverse('user', kwargs={'username': self.user.username})

    def tearDown(self):
        super().tearDown()
        User.objects.all().delete()
        UserFactory.reset_sequence(0)

        # delete temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_urlIsWorking(self):
        response = self.client.get(self.rel_url)

        self.assertEqual(response.status_code, 200)

    def test_urlByNameIsWorking(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)

    def test_returnCorrectStatusCodeIfUserNotFound(self):
        response = self.client.get('/api/user/random/')

        self.assertEqual(response.status_code, 404)

    def test_returnCorrectResultIfSuccessful(self):
        response = self.client.get(self.rel_url)
        data = response.json()

        self.assertEqual(data, {
            'username': self.user.username,
            'profile_image': TEST_SERVER_DOMAIN + self.user.profile_image.url,
            'about': self.user.about,
            'address': self.user.address
        })
