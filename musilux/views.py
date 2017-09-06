from django.shortcuts import render

# need accounts
# for use in default of user creation
#from django.contrib.auth.forms import UserCreationForm
#from django.contrib.auth.decorators import login_required used

# Create your views here.
# @login_required() used if you want login to be required
def homepage(request):

    context = {'type': squash}
    return render(request, 'base.html', context)