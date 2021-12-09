from .models import *
from django.forms import ModelForm, TextInput, Textarea, FileInput, Select


class Post_Form(ModelForm):
    class Meta:
        model = Article
        exclude = ['user', 'time', 'important']
        widgets = {
            'title': TextInput(attrs={'class': 'form-control', 'id': 'title' }),
            'body': Textarea(attrs={'id': 'editor' }),
            'head_image': FileInput(attrs={'class': 'form-control'})
        }

class Service_Booking(ModelForm):
    class Meta:
        model = Appointment
        fields = ['pet_name', 'pet_type', 'service']
        widgets = {
            'pet_name': TextInput(attrs={'class': 'form-control', 'id': 'title'}),
            'pet_type': TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g Dog, Cat, Bunny...'}),
            'service': Select(attrs={'class': 'form-select'}),
        }

class Anonymous_Service_Booking(ModelForm):
    class Meta:
        model = Appointment
        fields = ['pet_name', 'pet_type', 'service', 'email', 'phone']
        widgets = {
            'pet_name': TextInput(attrs={'class': 'form-control', 'id': 'title'}),
            'pet_type': TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g Dog, Cat, Bunny...'}),
            'email': TextInput(attrs={'class': 'form-control'}),
            'phone': TextInput(attrs={'class': 'form-control'}),
            'service': Select(attrs={'class': 'form-select'}),
        }   

    