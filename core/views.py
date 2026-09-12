from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Q, Count
from django.utils.text import slugify

from .models import Post, Tag, Like, Comment, Profile, Story
from .forms import UserRegisterForm, UserLoginForm, PostCreateForm, CommentForm, ProfileEditForm


def feed_view(request):
    """Feed principal com posts, stories, criadores recomendados e trending tags."""
    posts = Post.objects.select_related('author', 'author__profile').prefetch_related('tags', 'likes', 'comments').all()
    stories = Story.objects.select_related('user', 'user__profile')[:10]
    
    # Criadores recomendados (excluindo o usuário logado se autenticado)
    creators_qs = User.objects.exclude(id=request.user.id) if request.user.is_authenticated else User.objects.all()
    suggested_creators = creators_qs.annotate(num_posts=Count('posts')).filter(num_posts__gt=0)[:5]
    
    # Tags mais populares
    trending_tags = Tag.objects.annotate(num_posts=Count('posts')).order_by('-num_posts')[:8]

    # Prepara lista de IDs curtidos pelo usuário logado para renderização imediata do ícone
    user_liked_post_ids = set()
    if request.user.is_authenticated:
        user_liked_post_ids = set(Like.objects.filter(user=request.user).values_list('post_id', flat=True))

    comment_form = CommentForm()

    context = {
        'posts': posts,
        'stories': stories,
        'suggested_creators': suggested_creators,
        'trending_tags': trending_tags,
        'user_liked_post_ids': user_liked_post_ids,
        'comment_form': comment_form,
    }
    return render(request, 'feed.html', context)


def explore_view(request):
    """Página de exploração e descoberta com busca por texto e filtro por tags."""
    query = request.GET.get('q', '').strip()
    tag_slug = request.GET.get('tag', '').strip()

    posts = Post.objects.select_related('author', 'author__profile').prefetch_related('tags', 'likes').all()

    if tag_slug:
        posts = posts.filter(tags__slug=tag_slug)
    
    if query:
        posts = posts.filter(
            Q(caption__icontains=query) |
            Q(title__icontains=query) |
            Q(author__username__icontains=query) |
            Q(tags__name__icontains=query) |
            Q(location_name__icontains=query)
        ).distinct()

    tags = Tag.objects.all()[:15]

    context = {
        'posts': posts,
        'tags': tags,
        'current_tag': tag_slug,
        'query': query,
    }
    return render(request, 'explore.html', context)


def post_detail_view(request, pk):
    """Visualização ampliada do post, metadados EXIF e comentários encadeados."""
    post = get_object_or_404(
        Post.objects.select_related('author', 'author__profile').prefetch_related('tags', 'comments__user__profile'),
        pk=pk
    )
    
    is_liked = post.is_liked_by(request.user) if request.user.is_authenticated else False

    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect('login')
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.user = request.user
            comment.save()
            messages.success(request, "Comentário publicado com sucesso!")
            return redirect('post_detail', pk=post.pk)
    else:
        form = CommentForm()

    context = {
        'post': post,
        'is_liked': is_liked,
        'comment_form': form,
    }
    return render(request, 'post_detail.html', context)


@login_required
def create_post_view(request):
    """Publicação de nova fotografia autoral com metadados EXIF e tags."""
    if request.method == 'POST':
        form = PostCreateForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()

            # Processamento de tags digitadas
            tags_str = form.cleaned_data.get('tags_string', '')
            if tags_str:
                tag_names = [t.strip().lstrip('#') for t in tags_str.split(',') if t.strip()]
                for tag_name in tag_names:
                    tag_obj, _ = Tag.objects.get_or_create(
                        name=tag_name.lower(),
                        defaults={'slug': slugify(tag_name)}
                    )
                    post.tags.add(tag_obj)

            messages.success(request, "Fotografia publicada no Lumina com sucesso!")
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostCreateForm()

    return render(request, 'create_post.html', {'form': form})


@login_required
def like_toggle_view(request, pk):
    """Endpoint AJAX / Fallback para curtir/descurtir um post."""
    post = get_object_or_404(Post, pk=pk)
    like_obj = Like.objects.filter(user=request.user, post=post).first()

    if like_obj:
        like_obj.delete()
        liked = False
    else:
        Like.objects.create(user=request.user, post=post)
        liked = True

    total_likes = post.likes.count()

    if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.GET.get('ajax') == '1':
        return JsonResponse({'liked': liked, 'total_likes': total_likes})

    return redirect(request.META.get('HTTP_REFERER', 'feed'))


def profile_view(request, username):
    """Página de perfil do fotógrafo com estatísticas e galeria de publicações."""
    profile_user = get_object_or_404(User.objects.select_related('profile'), username=username)
    user_posts = profile_user.posts.prefetch_related('likes', 'comments').all()
    
    total_likes_received = sum(post.likes.count() for post in user_posts)

    context = {
        'profile_user': profile_user,
        'profile': profile_user.profile,
        'posts': user_posts,
        'total_posts': user_posts.count(),
        'total_likes_received': total_likes_received,
        'is_self': request.user.is_authenticated and request.user.id == profile_user.id
    }
    return render(request, 'profile.html', context)


@login_required
def profile_edit_view(request):
    """Edição das informações do perfil do usuário logado."""
    profile = request.user.profile
    if request.method == 'POST':
        form = ProfileEditForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            # Atualiza dados no User
            request.user.first_name = form.cleaned_data.get('first_name', '')
            request.user.last_name = form.cleaned_data.get('last_name', '')
            request.user.email = form.cleaned_data.get('email', '')
            request.user.save()

            form.save()
            messages.success(request, "Seu perfil foi atualizado com sucesso!")
            return redirect('profile', username=request.user.username)
    else:
        initial_data = {
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'email': request.user.email,
        }
        form = ProfileEditForm(instance=profile, initial=initial_data)

    return render(request, 'profile_edit.html', {'form': form})


def user_register_view(request):
    """Cadastro de novo criador."""
    if request.user.is_authenticated:
        return redirect('feed')

    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            
            # Login automático pós cadastro
            login(request, user)
            messages.success(request, f"Bem-vindo ao Lumina, @{user.username}! Seu canvas está pronto.")
            return redirect('feed')
    else:
        form = UserRegisterForm()

    return render(request, 'auth/register.html', {'form': form})


def user_login_view(request):
    """Login de usuário com visual Glassmorphism."""
    if request.user.is_authenticated:
        return redirect('feed')

    if request.method == 'POST':
        form = UserLoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"Bem-vindo de volta, @{user.username}!")
            next_url = request.GET.get('next', 'feed')
            return redirect(next_url)
        else:
            messages.error(request, "Usuário ou senha inválidos. Por favor, verifique seus dados.")
    else:
        form = UserLoginForm()

    return render(request, 'auth/login.html', {'form': form})


def user_logout_view(request):
    """Logout do usuário."""
    logout(request)
    messages.info(request, "Você encerrou sua sessão no Lumina com segurança.")
    return redirect('login')
