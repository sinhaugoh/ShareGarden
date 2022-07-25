from django.shortcuts import redirect, render
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, authenticate

# Create your views here.


def user_login(request):
    current_user = request.user

    # redirect to home page if already authenticated
    if current_user.is_authenticated:
        return redirect('/')

    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)

        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            user = authenticate(username=username, password=password)

            if user:
                login(request, user)
                return redirect('/')

    else:
        form = AuthenticationForm()

    return render(request, 'core/login_page.html', {'form': form})
