# Serializers define the API representation.

from django.contrib.auth.models import User
from rest_framework import serializers

from Capstone.settings import STATIC_URL
from .models import Song


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff', 'id')


class SongSerializer(serializers.ModelSerializer):
    midifile_url = serializers.SerializerMethodField()

    def get_midifile_url(self, obj):
        return obj.midifile.url
        # print(STATIC_URL)
        # print(obj.midifile.url)
        # return STATIC_URL + 'musilux/' + obj.midifile.url
        # return '/static/musilux/midifiles/Rudolph.mid'

    class Meta:
        model = Song
        fields = ('title', 'performer', 'composer', 'year', 'description', 'created',
                  'midifile_url', 'comments')