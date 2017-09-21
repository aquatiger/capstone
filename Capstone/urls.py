"""Capstone URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include
from django.contrib import admin
from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth.models import User
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static

from accounts.views import login
from accounts.views import register
from musilux.views import homepage
from musilux.viewsets import UserViewSet, SongViewSet

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'songs', SongViewSet)

urlpatterns = [
    url(r'^admin/', admin.site.urls),              # administrative functions for apps
    url(r'^home/', homepage, name='homepage'),     # homepage, the first the user sees
    url(r'^register/', register, name='register'), # future use for registering users
    url(r'^login/', login, name='login'),          # for user to login after registering
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
                                                   # api authentication
    url(r'^api/', include(router.urls)),           # application program interface
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

