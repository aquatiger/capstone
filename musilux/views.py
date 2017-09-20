

from django.shortcuts import render
from .models import Song
from rest_framework.response import Response
from rest_framework import status
from .serializers import SongSerializer
from rest_framework.decorators import api_view
import base64

# from PIL import Image, ImageFilter
# from django.contrib import messages


# need accounts
# for use in default of user creation

# from django.contrib.auth.forms import UserCreationForm
# from django.contrib.auth.decorators import login_required used

# Create your views here.
# @login_required() used if you want login to be required


def homepage(request):
    # messages.add_message(request, messages.INFO, 'Welcome to Musilux')
    songs = Song.objects.all()
    context = {'songs': songs}
    return render(request, 'base.html', context)


@api_view(['GET'])
def get_song(request, pk):
    song = Song.objects.get(pk=pk)
    serializer = SongSerializer(song)

    # base 64 encoding
    # fixme: delete the hardcoded file path
    # with open(song.midifile.path, 'rb') as f:
    with open('Capstone/musilux/static/musilux/midifiles/Rudolph.mid', 'rb') as f:
        data = f.read()
        encoded = 'data:audio/midi;base64,'+ base64.encodebytes(data)

    data = {'song': serializer.data, 'base64': encoded}
    return Response(data, status=status.HTTP_200_OK)