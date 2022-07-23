from django.views.generic import TemplateView
from django.urls import path, re_path
from .views import Login

urlpatterns = [
    path('', TemplateView.as_view(template_name="index.html"), name="home"),
    path('login/', Login.as_view(), name="login"),
    re_path('(^(?!(api|admin|media|static|login)).*$)',
            TemplateView.as_view(template_name="index.html"))
]
