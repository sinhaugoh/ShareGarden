from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase, override_settings
from unittest.mock import patch
import tempfile
import shutil


from core.model_factories import *
from core.tests.test_views import TEST_SERVER_DOMAIN, USER_PASSWORD

MEDIA_ROOT = tempfile.mkdtemp()
TEST_SERVER_DOMAIN = 'http://testserver'
USER_PASSWORD = 'ShareGarden'


# mocks
def _mocked_validate_location(self, value):
    return value


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

    def test_return405IfUserIsNotAuthenticated(self):
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

    def test_return405IfUserIsAlreadyAuthenticated(self):
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

    def test_return400IfUsernameIsBlank(self):
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

    def test_return400IfPasswordIsWeak(self):
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

    def test_return400IfPasswordAndPassword2DoesNotMatch(self):
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

    def test_return404IfUserNotFound(self):
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


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class ProfileUpdateTest(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory.create()
        self.rel_url = '/api/account/update/'
        self.url = reverse('account-update')
        self.valid_data = {
            'about': 'Test about',
            'address': 'Yew tee point'
        }

        # log in
        self.client.login(username=self.user.username, password=USER_PASSWORD)

    def tearDown(self):
        super().tearDown()
        User.objects.all().delete()
        UserFactory.reset_sequence(0)

        # delete temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    @patch('api.serializers.UserSerializer.validate_address', _mocked_validate_location)
    def test_urlByNameIsWorking(self):
        response = self.client.patch(self.url, self.valid_data)

        self.assertEqual(response.status_code, 200)

    @patch('api.serializers.UserSerializer.validate_address', _mocked_validate_location)
    def test_return403IfNotAuthenticated(self):
        # log out
        self.client.logout()

        response = self.client.patch(self.rel_url, self.valid_data)

        self.assertEqual(response.status_code, 403)

    @patch('api.serializers.UserSerializer.validate_address', _mocked_validate_location)
    def test_returnCorrectStatusCodeIfSuccessful(self):
        response = self.client.patch(self.rel_url, self.valid_data)

        self.assertEqual(response.status_code, 200)

    @patch('api.serializers.UserSerializer.validate_address', _mocked_validate_location)
    def test_userInfoShouldBeUpdatedIfSuccessful(self):
        response = self.client.patch(self.rel_url, self.valid_data)
        data = response.json()

        updated_user = User.objects.get(id=self.user.id)

        self.assertEqual(updated_user.about, self.valid_data['about'])
        self.assertEqual(updated_user.address, self.valid_data['address'])

    def test_return400IfAddressIsInvalid(self):
        invalid_data = {**self.valid_data, 'address': 'a'}
        response = self.client.patch(self.rel_url, invalid_data)

        self.assertEqual(response.status_code, 400)

    def test_returnCorrectResultIfAddressIsInvalid(self):
        invalid_data = {**self.valid_data, 'address': 'a'}
        response = self.client.patch(self.rel_url, invalid_data)
        data = response.json()

        self.assertEqual(data['address'][0], 'Please provide a valid address.')

    @patch('api.serializers.UserSerializer.validate_address', _mocked_validate_location)
    def test_return400IfTheUserTryToChangeUsername(self):
        invalid_data = {**self.valid_data, 'username': 'TEST'}
        response = self.client.patch(self.rel_url, invalid_data)

        self.assertEqual(response.status_code, 400)

    @patch('api.serializers.UserSerializer.validate_address', _mocked_validate_location)
    def test_returnCorrectResultIfTheUserTryToChangeUsername(self):
        invalid_data = {**self.valid_data, 'username': 'TEST'}
        response = self.client.patch(self.rel_url, invalid_data)
        data = response.json()

        self.assertEqual(data['username'][0], 'Username can only be set once.')


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class ItemPostListGETTest(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory.create()
        self.user_with_address = UserFactory.create(address='Pasir ris mrt')
        self.item_post_1 = ItemPostFactory.create()
        self.rel_url = '/api/itemposts/'
        self.url = reverse('item-post-list')

    def tearDown(self):
        super().tearDown()
        User.objects.all().delete()
        ItemPost.objects.all().delete()
        UserFactory.reset_sequence(0)
        ItemPostFactory.reset_sequence(0)

        # delete temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_urlIsWorking(self):
        response = self.client.get(self.rel_url)

        self.assertEqual(response.status_code, 200)

    def test_urlByNameIsWorking(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)

    def test_returnCorrectNumberOfItemPostsIfSuccessful(self):
        response = self.client.get(self.url)
        data = response.json()

        self.assertEqual(len(data), 1)

    def test_returnCorrectResultIfSuccessful(self):
        response = self.client.get(self.url)
        data = response.json()

        self.assertEqual(data, [{
            'id': self.item_post_1.id,
            'title': self.item_post_1.title,
            'description': self.item_post_1.description,
            'location': self.item_post_1.location,
            'category': self.item_post_1.category,
            'cover_image': self.item_post_1.cover_image.url,
            'is_active': self.item_post_1.is_active,
            'quantity': self.item_post_1.quantity,

        }])

    def test_returnCorrectResultIfAuthenticatedAndSuccessful(self):
        # login
        self.client.login(username=self.user,
                          password=USER_PASSWORD)
        response = self.client.get(self.url)
        data = response.json()

        self.assertEqual(data, [{
            'id': self.item_post_1.id,
            'title': self.item_post_1.title,
            'description': self.item_post_1.description,
            'location': self.item_post_1.location,
            'category': self.item_post_1.category,
            'cover_image': self.item_post_1.cover_image.url,
            'is_active': self.item_post_1.is_active,
            'quantity': self.item_post_1.quantity,

        }])

    def test_shouldIncludeDistancePropertyIfAuthenticatedAndUserHasAddress(self):
        # login
        self.client.login(username=self.user_with_address,
                          password=USER_PASSWORD)
        response = self.client.get(self.rel_url)
        data = response.json()

        self.assertTrue('distance' in data[0].keys())


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class ItemPostListPOSTTest(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory.create()
        self.item_post_1 = ItemPostFactory.create()
        self.rel_url = '/api/itemposts/'
        self.url = reverse('item-post-list')
        self.client.login(username=self.user.username, password=USER_PASSWORD)

        # image data binary
        image_data = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )

        self.valid_data = {
            'title': 'Test title',
            'quantity': 1,
            'pick_up_information': 'Test',
            'category': ItemPost.Category.GIVEAWAY,
            'item_type': ItemPost.ItemType.SEED_OR_PLANT,
            'location': 'Yew tee mrt',
            'cover_image': SimpleUploadedFile('small.jpg', image_data, content_type='imaeg/jpeg')
        }

    def tearDown(self):
        super().tearDown()
        User.objects.all().delete()
        ItemPost.objects.all().delete()
        UserFactory.reset_sequence(0)
        ItemPostFactory.reset_sequence(0)

        # delete temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    @patch('api.serializers.CreateItemPostSerializer.validate_location', _mocked_validate_location)
    def test_urlIsWorking(self):
        response = self.client.post(self.rel_url, self.valid_data)

        self.assertEqual(response.status_code, 201)

    @patch('api.serializers.CreateItemPostSerializer.validate_location', _mocked_validate_location)
    def test_urlByNameIsWorking(self):
        response = self.client.post(self.url, self.valid_data)

        self.assertEqual(response.status_code, 201)

    @patch('api.serializers.CreateItemPostSerializer.validate_location', _mocked_validate_location)
    def test_return401IfUnauthenticated(self):
        # logout
        self.client.logout()
        response = self.client.post(self.url, self.valid_data)

        self.assertEqual(response.status_code, 401)

    @patch('api.serializers.CreateItemPostSerializer.validate_location', _mocked_validate_location)
    def test_returnCorrectResultIfSuccessful(self):
        response = self.client.post(self.url, self.valid_data)
        data = response.json()

        self.assertEqual(data, {'status': 'success'})

    @patch('api.serializers.CreateItemPostSerializer.validate_location', _mocked_validate_location)
    def test_returnCorrectResultIfNoTitle(self):
        del self.valid_data['title']
        response = self.client.post(self.rel_url, self.valid_data)
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertTrue('title' in data.keys())

    @patch('api.serializers.CreateItemPostSerializer.validate_location', _mocked_validate_location)
    def test_returnCorrectResultIfNoQuantity(self):
        del self.valid_data['quantity']
        response = self.client.post(self.rel_url, self.valid_data)
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertTrue('quantity' in data.keys())

    @patch('api.serializers.CreateItemPostSerializer.validate_location', _mocked_validate_location)
    def test_returnCorrectResultIfNoLocation(self):
        del self.valid_data['location']
        response = self.client.post(self.rel_url, self.valid_data)
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertTrue('location' in data.keys())

    @patch('api.serializers.CreateItemPostSerializer.validate_location', _mocked_validate_location)
    def test_returnCorrectResultIfNoPickUpInformation(self):
        del self.valid_data['pick_up_information']
        response = self.client.post(self.rel_url, self.valid_data)
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertTrue('pick_up_information' in data.keys())

    @patch('api.serializers.CreateItemPostSerializer.validate_location', _mocked_validate_location)
    def test_returnCorrectResultIfNoCategory(self):
        del self.valid_data['category']
        response = self.client.post(self.rel_url, self.valid_data)
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertTrue('category' in data.keys())

    @patch('api.serializers.CreateItemPostSerializer.validate_location', _mocked_validate_location)
    def test_returnCorrectResultIfNoItemType(self):
        del self.valid_data['item_type']
        response = self.client.post(self.rel_url, self.valid_data)
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertTrue('item_type' in data.keys())

    def test_returnCorrectResultIfLocationNotValid(self):
        invalid_data = {**self.valid_data, 'location': '.'}
        response = self.client.post(self.rel_url, invalid_data)
        data = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertTrue('location' in data.keys())


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class ItemPostDetailGETTest(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory.create()
        self.item_post_1 = ItemPostFactory.create(created_by=self.user)
        self.rel_url = '/api/itempost/{}/'.format(self.item_post_1.id)
        self.url = reverse('item-post-detail',
                           kwargs={'pk': self.item_post_1.id})

    def tearDown(self):
        super().tearDown()
        User.objects.all().delete()
        ItemPost.objects.all().delete()
        UserFactory.reset_sequence(0)
        ItemPostFactory.reset_sequence(0)

        # delete temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_urlIsWorking(self):
        response = self.client.get(self.rel_url)

        self.assertEqual(response.status_code, 200)

    def test_urlByNameIsWorking(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)

    def test_return200IfAuthenticated(self):
        self.client.login(username=self.user.username, password=USER_PASSWORD)
        response = self.client.get(self.rel_url)

        self.assertEqual(response.status_code, 200)

    def test_return404IfInvalidId(self):
        response = self.client.get('/api/itempost/999/')

        self.assertEqual(response.status_code, 404)

    def test_returnCorrectResultIfSuccessful(self):
        response = self.client.get(self.url)
        data = response.json()

        self.assertEqual(data, {
            'title': self.item_post_1.title,
            'description': self.item_post_1.description,
            'quantity': self.item_post_1.quantity,
            'pick_up_information': self.item_post_1.pick_up_information,
            'category': self.item_post_1.category,
            'item_type': self.item_post_1.item_type,
            'days_to_harvest': self.item_post_1.days_to_harvest,
            'water_requirement': self.item_post_1.water_requirement,
            'growing_tips': self.item_post_1.growing_tips,
            'location': self.item_post_1.location,
            'created_by': {
                'username': self.item_post_1.created_by.username,
                'profile_image': TEST_SERVER_DOMAIN + self.item_post_1.created_by.profile_image.url,
                'about': self.item_post_1.created_by.about,
                'address': self.item_post_1.created_by.address
            },
            'itempostimage_set': [],
            'characteristics': self.item_post_1.characteristics,
            'soil_type': self.item_post_1.soil_type,
            'light_requirement': self.item_post_1.light_requirement,
            'cover_image': TEST_SERVER_DOMAIN + self.item_post_1.cover_image.url,
            'is_active': self.item_post_1.is_active
        })


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class ItemPostDetailPATCHTest(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory.create()
        self.item_post_1 = ItemPostFactory.create(created_by=self.user)
        self.rel_url = '/api/itempost/{}/'.format(self.item_post_1.id)
        self.url = reverse('item-post-detail',
                           kwargs={'pk': self.item_post_1.id})

    def tearDown(self):
        super().tearDown()
        User.objects.all().delete()
        ItemPost.objects.all().delete()
        UserFactory.reset_sequence(0)
        ItemPostFactory.reset_sequence(0)

        # delete temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    # TODO: implement test for this
