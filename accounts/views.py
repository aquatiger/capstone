from django.shortcuts import render, redirect

# from .forms import CustomUserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.core.mail import send_mail

# Create your views here.

def register(request):

    if request.method == 'GET':
        form = CustomUserCreationForm()

    elif request.method == 'POST':
        form = CustomUserCreationForm(data=request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.save()
            send_mail(
                'Welcome',
                'Thank you for your business',
                'rls4jc@gmail.com',
                [user.email, ],
                fail_silently=False
            )
            return redirect('/thanks')

    context = {'form': form}
    return render(request, 'register.html', context)


def login(request):
    if request.method == 'GET':
        form = AuthenticationForm()

    elif request.method == 'POST':
        form = AuthenticationForm(data=request.POST)

        if form.is_valid():
            username = request.POST['username']
            password = request.POST['login']
            user = authenticate(request, username=username, password=password)

            if user:
                django_login(request, user)
                return redirect('home')

    form = AuthenticationForm()
    context = {'form': form}
    return render(request, 'register.html', context)