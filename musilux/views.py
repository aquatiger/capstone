

from django.shortcuts import render
from .models import Song
# from PIL import Image, ImageFilter
from django.contrib import messages


# need accounts
# for use in default of user creation
#from django.contrib.auth.forms import UserCreationForm
#from django.contrib.auth.decorators import login_required used

# Create your views here.
# @login_required() used if you want login to be required



def homepage(request):
    squash = 'Hello World'
    # messages.add_message(request, messages.INFO, 'Welcome to Musilux')
    songs = Song.objects.all()
    context = {'songs': songs}
    return render(request, 'base.html', context)