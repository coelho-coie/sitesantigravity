from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name="Nome da Tag")
    slug = models.SlugField(max_length=60, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"#{self.name}"

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ['name']


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='uploads/avatars/', blank=True, null=True, verbose_name="Foto de Perfil")
    avatar_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="URL Alternativa de Avatar")
    bio = models.TextField(max_length=500, blank=True, verbose_name="Biografia")
    location = models.CharField(max_length=120, blank=True, verbose_name="Localização")
    website = models.URLField(max_length=200, blank=True, verbose_name="Website / Portfólio")
    is_pro = models.BooleanField(default=False, verbose_name="Membro PRO")
    is_curator = models.BooleanField(default=False, verbose_name="Curador Lumina")
    created_at = models.DateTimeField(auto_now_add=True)

    def get_avatar(self):
        if self.avatar:
            return self.avatar.url
        if self.avatar_url:
            return self.avatar_url
        # Fallback para SVG Avatar procedural com iniciais
        initials = (self.user.first_name[:1] + self.user.last_name[:1]) if (self.user.first_name and self.user.last_name) else self.user.username[:2].upper()
        return f"https://api.dicebear.com/7.x/identicon/svg?seed={self.user.username}&backgroundColor=131926"

    def __str__(self):
        return f"Perfil de @{self.user.username}"


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts', verbose_name="Autor")
    title = models.CharField(max_length=150, blank=True, verbose_name="Título da Foto")
    image = models.ImageField(upload_to='uploads/posts/', blank=True, null=True, verbose_name="Arquivo de Imagem")
    image_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="URL Direta da Imagem")
    caption = models.TextField(verbose_name="Legenda da Postagem")
    
    # Metadados EXIF e Fotografia
    camera_model = models.CharField(max_length=100, blank=True, default="Leica M11", verbose_name="Câmera")
    lens_spec = models.CharField(max_length=100, blank=True, default="35mm f/1.4", verbose_name="Lente")
    shutter_speed = models.CharField(max_length=50, blank=True, default="1/250s", verbose_name="Velocidade")
    aperture = models.CharField(max_length=50, blank=True, default="f/1.8", verbose_name="Abertura")
    iso = models.CharField(max_length=50, blank=True, default="ISO 100", verbose_name="Sensibilidade ISO")
    location_name = models.CharField(max_length=150, blank=True, default="Tokyo, Japan", verbose_name="Local da Foto")
    
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts', verbose_name="Hashtags")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True)

    def get_image(self):
        if self.image:
            return self.image.url
        if self.image_url:
            return self.image_url
        return "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&q=80"

    @property
    def total_likes(self):
        return self.likes.count()

    @property
    def total_comments(self):
        return self.comments.count()

    def is_liked_by(self, user):
        if not user or not user.is_authenticated:
            return False
        return self.likes.filter(user=user).exists()

    def __str__(self):
        return f"Post #{self.id} por @{self.author.username} ({self.created_at.strftime('%d/%m/%Y')})"

    class Meta:
        verbose_name = "Publicação"
        verbose_name_plural = "Publicações"
        ordering = ['-created_at']


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Curtida"
        verbose_name_plural = "Curtidas"
        unique_together = ('user', 'post')

    def __str__(self):
        return f"@{self.user.username} curtiu Post #{self.post.id}"


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments', verbose_name="Post")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments', verbose_name="Autor")
    content = models.TextField(verbose_name="Conteúdo do Comentário")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data do Comentário")

    def __str__(self):
        return f"Comentário de @{self.user.username} no Post #{self.post.id}"

    class Meta:
        verbose_name = "Comentário"
        verbose_name_plural = "Comentários"
        ordering = ['created_at']


class Story(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stories')
    image_url = models.URLField(max_length=500, blank=True, null=True)
    title = models.CharField(max_length=80, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Story de @{self.user.username}"

    class Meta:
        verbose_name = "Story"
        verbose_name_plural = "Stories"
        ordering = ['-created_at']
