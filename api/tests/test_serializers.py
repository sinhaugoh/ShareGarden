from django.test import TestCase, override_settings
from ..serializers import *
from chat.serializers import ChatroomSerializer, MessageSerializer
from core.model_factories import *
from chat.model_factories import ChatroomFactory, MessageFactory
from chat.models import Chatroom, Message
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


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class ItemPostSerializerTest(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.post_author = UserFactory.create()
        cls.item_post = ItemPostFactory.create(created_by=cls.post_author)
        cls.serializer = ItemPostSerializer(instance=cls.item_post)
        cls.serializer_data = cls.serializer.data

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        ItemPost.objects.all().delete()
        User.objects.all().delete()
        UserFactory.reset_sequence(0)
        ItemPostFactory.reset_sequence(0)

        # remove temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_itemPostSerializerHasCorrectKeys(self):
        self.assertEqual(set(self.serializer_data.keys()), set([
            'id',
            'title',
            'description',
            'quantity',
            'pick_up_information',
            'category',
            'item_type',
            'days_to_harvest',
            'water_requirement',
            'growing_tips',
            'location',
            'created_by',
            'itempostimage_set',
            'characteristics',
            'soil_type',
            'light_requirement',
            'cover_image',
            'is_active'
        ]))

    def test_idHasCorrectValue(self):
        self.assertEqual(self.serializer_data['id'], self.item_post.id)

    def test_titleHasCorrectValue(self):
        self.assertEqual(self.serializer_data['title'], self.item_post.title)

    def test_descriptionHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['description'], self.item_post.description)

    def test_quantityHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['quantity'], self.item_post.quantity)

    def test_pickUpInformationHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['pick_up_information'], self.item_post.pick_up_information)

    def test_categoryHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['category'], self.item_post.category)

    def test_itemTypeHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['item_type'], self.item_post.item_type)

    def test_daysToHarvestHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['days_to_harvest'], self.item_post.days_to_harvest)

    def test_waterRequirementHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['water_requirement'], self.item_post.water_requirement)

    def test_growingTipsHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['growing_tips'], self.item_post.growing_tips)

    def test_locationHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['location'], self.item_post.location)

    def test_createdByHasCorrectValue(self):
        self.assertEqual(dict(self.serializer_data['created_by']), {
            'username': self.item_post.created_by.username,
            'profile_image': self.item_post.created_by.profile_image.url,
            'address': self.item_post.created_by.address,
            'about': self.item_post.created_by.about
        })

    def test_characteristicsHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['characteristics'], self.item_post.characteristics)

    def test_soilTypeHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['soil_type'], self.item_post.soil_type
        )

    def test_lightRequirementHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['light_requirement'], self.item_post.light_requirement)

    def test_isActiveHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['is_active'], self.item_post.is_active)

    def test_coverImageHasCorrectvalue(self):
        self.assertEqual(
            self.serializer_data['cover_image'], self.item_post.cover_image.url)


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class ItemPostListSerializerTest(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.post_author = UserFactory.create()
        cls.item_post = ItemPostFactory.create(created_by=cls.post_author)
        cls.serializer = ItemPostListSerializer(instance=cls.item_post)
        cls.serializer_data = cls.serializer.data

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        ItemPost.objects.all().delete()
        User.objects.all().delete()
        UserFactory.reset_sequence(0)
        ItemPostFactory.reset_sequence(0)

        # remove temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_itemPostListSerializerHasCorrectKeys(self):
        self.assertEqual(set(self.serializer_data.keys()), set([
            'id',
            'title',
            'description',
            'location',
            'category',
            'cover_image',
            'is_active',
            'quantity'
        ]))

    def test_idHasCorrectValue(self):
        self.assertEqual(self.serializer_data['id'], self.item_post.id)

    def test_titleHasCorrectValue(self):
        self.assertEqual(self.serializer_data['title'], self.item_post.title)

    def test_descriptionHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['description'], self.item_post.description)

    def test_coverImageHasCorrectvalue(self):
        self.assertEqual(
            self.serializer_data['cover_image'], self.item_post.cover_image.url)

    def test_locationHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['location'], self.item_post.location)

    def test_categoryHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['category'], self.item_post.category)

    def test_isActiveHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['is_active'], self.item_post.is_active)

    def test_quantityHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['quantity'], self.item_post.quantity)


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class TransactionSerializerTest(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.requester = UserFactory.create()
        cls.post_author = UserFactory.create()
        cls.item_post = ItemPostFactory.create(created_by=cls.post_author)
        cls.transaction = TransactionFactory.create(
            requester=cls.requester, requestee=cls.post_author, item_post=cls.item_post)
        cls.serializer = TransactionSerializer(instance=cls.transaction)
        cls.serializer_data = cls.serializer.data

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        ItemPost.objects.all().delete()
        User.objects.all().delete()
        Transaction.objects.all().delete()
        UserFactory.reset_sequence(0)
        ItemPostFactory.reset_sequence(0)
        TransactionFactory.reset_sequence(0)

        # remove temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_transactionSerializerHasCorrectKeys(self):
        self.assertEqual(set(self.serializer_data.keys()), set([
            'id', 'request_amount', 'is_completed',
            'note', 'requester', 'requestee', 'item_post'
        ]))

    def test_idHasCorrectValue(self):
        self.assertEqual(self.serializer_data['id'], self.transaction.id)

    def test_requestAmountHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['request_amount'], self.transaction.request_amount)

    def test_isCompletedHasCorrectValue(self):
        self.assertEqual(
            self.serializer_data['is_completed'], self.transaction.is_completed)

    def test_noteHasCorrectValue(self):
        self.assertEqual(self.serializer_data['note'], self.transaction.note)

    def test_requesterHasCorrectValue(self):
        self.assertEqual(dict(self.serializer_data['requester']), {
            'username': self.transaction.requester.username,
            'profile_image': self.transaction.requester.profile_image.url,
            'about': self.transaction.requester.about,
            'address': self.transaction.requester.address
        })

    def test_requesteeHasCorrectValue(self):
        self.assertEqual(dict(self.serializer_data['requestee']), {
            'username': self.transaction.requestee.username,
            'profile_image': self.transaction.requestee.profile_image.url,
            'about': self.transaction.requestee.about,
            'address': self.transaction.requestee.address
        })

    def test_itemPostHasCorrectValue(self):
        self.assertEqual(dict(self.serializer_data['item_post']), {

            'id': self.transaction.item_post.id,
            'title': self.transaction.item_post.title,
            'description': self.transaction.item_post.description,
            'quantity': self.transaction.item_post.quantity,
            'pick_up_information': self.transaction.item_post.pick_up_information,
            'category': self.transaction.item_post.category,
            'item_type': self.transaction.item_post.item_type,
            'days_to_harvest': self.transaction.item_post.days_to_harvest,
            'water_requirement': self.transaction.item_post.water_requirement,
            'growing_tips': self.transaction.item_post.growing_tips,
            'location': self.transaction.item_post.location,
            'created_by': {
                'username': self.transaction.item_post.created_by.username,
                'profile_image': self.transaction.item_post.created_by.profile_image.url,
                'about': self.transaction.item_post.created_by.about,
                'address': self.transaction.item_post.created_by.address
            },
            'itempostimage_set': [],
            'characteristics': self.transaction.item_post.characteristics,
            'soil_type': self.transaction.item_post.soil_type,
            'light_requirement': self.transaction.item_post.light_requirement,
            'cover_image': self.transaction.item_post.cover_image.url,
            'is_active': self.transaction.item_post.is_active
        })


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class ChatroomSerializerTest(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.requester = UserFactory.create()
        cls.post_author = UserFactory.create()
        cls.item_post = ItemPostFactory.create(created_by=cls.post_author)
        cls.chatroom = ChatroomFactory.create(
            requester=cls.requester, requestee=cls.post_author, post=cls.item_post)
        cls.serializer = ChatroomSerializer(instance=cls.chatroom)
        cls.serializer_data = cls.serializer.data

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        ItemPost.objects.all().delete()
        User.objects.all().delete()
        Chatroom.objects.all().delete()
        UserFactory.reset_sequence(0)
        ItemPostFactory.reset_sequence(0)

        # remove temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_chatroomSerializerHasCorrectKeys(self):
        self.assertEqual(set(self.serializer_data.keys()), set([
            'name', 'post', 'requester', 'requestee'
        ]))

    def test_nameHasCorrectValue(self):
        self.assertEqual(self.serializer_data['name'], self.chatroom.name)

    def test_requesterHasCorrectValue(self):
        self.assertEqual(dict(self.serializer_data['requester']), {
            'id': self.chatroom.requester.id,
            'username': self.chatroom.requester.username,
            'profile_image': self.chatroom.requester.profile_image.url
        })

    def test_requesteeHasCorrectValue(self):
        self.assertEqual(dict(self.serializer_data['requestee']), {
            'id': self.chatroom.requestee.id,
            'username': self.chatroom.requestee.username,
            'profile_image': self.chatroom.requestee.profile_image.url
        })

    def test_postHasCorrectValue(self):
        self.assertEqual(dict(self.serializer_data['post']), {
            'id': self.chatroom.post.id,
            'title': self.chatroom.post.title,
            'cover_image': self.chatroom.post.cover_image.url,
            'quantity': self.chatroom.post.quantity
        })


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class MessageSerializerTest(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.requester = UserFactory.create()
        cls.post_author = UserFactory.create()
        cls.item_post = ItemPostFactory.create(created_by=cls.post_author)
        cls.chatroom = ChatroomFactory.create(
            requester=cls.requester, requestee=cls.post_author, post=cls.item_post)
        cls.message = MessageFactory.create(
            chatroom=cls.chatroom, sender=cls.requester)
        cls.serializer = MessageSerializer(instance=cls.message)
        cls.serializer_data = cls.serializer.data

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        ItemPost.objects.all().delete()
        User.objects.all().delete()
        Chatroom.objects.all().delete()
        Message.objects.all().delete()
        UserFactory.reset_sequence(0)
        ItemPostFactory.reset_sequence(0)

        # remove temp folder
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def test_messageSerializerHasCorrectKeys(self):
        self.assertEqual(set(self.serializer_data.keys()), set([
            'content', 'timestamp', 'sender'
        ]))

    def test_contentHasCorrectValue(self):
        self.assertEqual(self.serializer_data['content'], self.message.content)

    def test_senderHasCorrectValue(self):
        self.assertEqual(dict(self.serializer_data['sender']), {
            'id': self.message.sender.id,
            'username': self.message.sender.username,
            'profile_image': self.message.sender.profile_image.url
        })

    def test_timestampHasCorrectValue(self):
        formatted_timestamp = self.message.timestamp.strftime(
            "%Y-%m-%dT%H:%M:%S.%fZ")
        self.assertEqual(
            self.serializer_data['timestamp'], formatted_timestamp)
