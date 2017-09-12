# Serializers define the API representation.

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Song

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff', 'id')


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('title', 'performer', 'composer', 'year_c', 'description', 'created',
                  'midifile', 'comments')