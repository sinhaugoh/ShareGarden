from django.urls import path
from .apis import *

urlpatterns = [
    path('authuser/', AuthUser.as_view(), name='auth-user')
]
