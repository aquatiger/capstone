# ViewSets define the view behavior.

from django.contrib.auth.models import User
from rest_framework import viewsets

from .serializers import UserSerializer,  SongSerializer
from .models import Song


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer

