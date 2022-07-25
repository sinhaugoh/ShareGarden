from django.views.generic import TemplateView
from django.urls import path, re_path
from .views import user_login

urlpatterns = [
    path('', TemplateView.as_view(template_name="index.html"), name="home"),
    path('login/', user_login, name="login"),
    re_path('(^(?!(api|admin|media|static|login)).*$)',
            TemplateView.as_view(template_name="index.html"))
]
