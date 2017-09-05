from django.shortcuts import render

# Create your views here.

def homepage(request):
    squash = ['yellow']

    context = {'type': squash}
    return render(request, 'base.html', context)