from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from .models import Post, Comment, Profile, Tag


class UserRegisterForm(forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'lumina-input', 'placeholder': 'Digite uma senha segura'}),
        label="Senha"
    )
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'lumina-input', 'placeholder': 'Confirme sua senha'}),
        label="Confirmar Senha"
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'ex: lumina_artist'}),
            'email': forms.EmailInput(attrs={'class': 'lumina-input', 'placeholder': 'seu@email.com'}),
            'first_name': forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'Nome'}),
            'last_name': forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'Sobrenome'}),
        }
        labels = {
            'username': 'Nome de Usuário (@handle)',
            'email': 'E-mail',
            'first_name': 'Primeiro Nome',
            'last_name': 'Sobrenome',
        }

    def clean(self):
        cleaned_data = super().clean()
        p1 = cleaned_data.get('password')
        p2 = cleaned_data.get('confirm_password')
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError("As senhas informadas não conferem.")
        return cleaned_data


class UserLoginForm(AuthenticationForm):
    username = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'Seu usuário ou @handle'}),
        label="Usuário"
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'lumina-input', 'placeholder': 'Sua senha'}),
        label="Senha"
    )


class PostCreateForm(forms.ModelForm):
    tags_string = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'ex: cyberpunk, street, tokyo, leica'}),
        label="Hashtags (separadas por vírgula)"
    )

    class Meta:
        model = Post
        fields = [
            'title', 'image', 'image_url', 'caption',
            'camera_model', 'lens_spec', 'shutter_speed', 'aperture', 'iso', 'location_name'
        ]
        widgets = {
            'title': forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'Título da obra visual (opcional)'}),
            'image': forms.FileInput(attrs={'class': 'lumina-file-input', 'accept': 'image/*'}),
            'image_url': forms.URLInput(attrs={'class': 'lumina-input', 'placeholder': 'https://exemplo.com/foto-alta-resolucao.jpg'}),
            'caption': forms.Textarea(attrs={'class': 'lumina-textarea', 'rows': 4, 'placeholder': 'Compartilhe o conceito artístico, iluminação e contexto deste disparo...'}),
            'camera_model': forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'ex: Leica M11 / Sony A7 IV'}),
            'lens_spec': forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'ex: 35mm f/1.4 Summilux'}),
            'shutter_speed': forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'ex: 1/250s'}),
            'aperture': forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'ex: f/1.8'}),
            'iso': forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'ex: ISO 100'}),
            'location_name': forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'ex: Shibuya Crossing, Tóquio'}),
        }
        labels = {
            'title': 'Título da Imagem',
            'image': 'Arquivo de Imagem (Upload)',
            'image_url': 'Ou URL Direta da Imagem',
            'caption': 'Legenda & Conceito Artístico',
            'camera_model': 'Corpo da Câmera',
            'lens_spec': 'Lente',
            'shutter_speed': 'Velocidade do Obturador',
            'aperture': 'Abertura de Diafragma',
            'iso': 'Sensibilidade ISO',
            'location_name': 'Local do Disparo',
        }


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.TextInput(attrs={
                'class': 'lumina-comment-input',
                'placeholder': 'Adicione um comentário ou feedback estético...',
                'autocomplete': 'off'
            })
        }
        labels = {
            'content': ''
        }


class ProfileEditForm(forms.ModelForm):
    first_name = forms.CharField(max_length=30, required=False, widget=forms.TextInput(attrs={'class': 'lumina-input'}))
    last_name = forms.CharField(max_length=30, required=False, widget=forms.TextInput(attrs={'class': 'lumina-input'}))
    email = forms.EmailField(required=False, widget=forms.EmailInput(attrs={'class': 'lumina-input'}))

    class Meta:
        model = Profile
        fields = ['avatar', 'avatar_url', 'bio', 'location', 'website']
        widgets = {
            'avatar': forms.FileInput(attrs={'class': 'lumina-file-input'}),
            'avatar_url': forms.URLInput(attrs={'class': 'lumina-input', 'placeholder': 'https://exemplo.com/avatar.jpg'}),
            'bio': forms.Textarea(attrs={'class': 'lumina-textarea', 'rows': 3, 'placeholder': 'Sua declaração artística, prêmios ou estilo fotográfico...'}),
            'location': forms.TextInput(attrs={'class': 'lumina-input', 'placeholder': 'ex: Berlim, Alemanha'}),
            'website': forms.URLInput(attrs={'class': 'lumina-input', 'placeholder': 'https://seuportflio.art'}),
        }
