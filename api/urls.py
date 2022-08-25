from django.urls import path
from .apis import *

urlpatterns = [
    path('authuser/', AuthUser.as_view(), name='auth-user'),
    path('logout/', Logout.as_view(), name='logout'),
    path('register/', Register.as_view(), name='register'),
    path('itemposts/', ItemPostList.as_view(), name='item-post-list'),
    path('itempost/<int:pk>/', ItemPostDetail.as_view(), name='item-post-detail'),
    path('user/<str:username>/', UserApi.as_view(), name='user'),
    path('account/update/', ProfileUpdate.as_view(), name='account-update'),
    path('chats/', Chats.as_view(), name='chat-list'),
    path('transactions/', Transactions.as_view(), name='transactions'),
    path('transaction/markAsCompleted/', MarkTransactionAsCompleted.as_view(),
         name='mark-transaction-as-completed'),
]
