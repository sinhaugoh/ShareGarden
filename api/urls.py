from django.urls import path
from .apis import *

urlpatterns = [
    path('authuser/', AuthUser.as_view(), name='auth-user'),
    path('logout/', Logout.as_view(), name='logout'),
    path('register/', Register.as_view(), name='register'),
    path('itempost/', ItemPostList.as_view(), name='item-post-list'),
]
