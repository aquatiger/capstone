

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


# this function shows the lights above the "bottom" piano generated image as midi file is played
def colorgen():
    midinums = range(21, 109, 1)

    colors = {}
    for midinum in midinums:
        preshownumber = (midinum - 20) * 4                   # Key: int: 4
        lightshowcolor = f'hsl({preshownumber}, 100%, 50%)'  # Value: str: 'hsl(4, 100, 50)'
        colors[midinum] = lightshowcolor

    return colors


def homepage(request):
    # messages.add_message(request, messages.INFO, 'Welcome to Musilux')
    songs = Song.objects.all()
    colors = colorgen()
    context = {'songs': songs, 'colors': colors}
    return render(request, 'base.html', context)

# todo: Zack, can I delete all of this? Will it do any good?
# @api_view(['GET'])
# def get_song(request, pk):
#     song = Song.objects.get(pk=pk)
#     serializer = SongSerializer(song)
#
#     # base 64 encoding
#     # fixme: delete the hardcoded file path
#     # with open(song.midifile.path, 'rb') as f:
#     with open('Capstone/musilux/static/musilux/midifiles/Rudolph.mid', 'rb') as f:
#         data = f.read()
#         encoded = 'data:audio/midi;base64,'+ base64.encodebytes(data)
#
#     data = {'song': serializer.data, 'base64': encoded}
#     return Response(data, status=status.HTTP_200_OK)