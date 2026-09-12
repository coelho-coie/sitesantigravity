from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from .models import Post, Tag, Comment, Like, Profile


class LuminaCoreTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='test_photographer',
            email='test@lumina.art',
            password='testpassword123'
        )
        self.user2 = User.objects.create_user(
            username='viewer_user',
            email='viewer@lumina.art',
            password='testpassword123'
        )

        self.tag = Tag.objects.create(name='cyberpunk', slug='cyberpunk')

        self.post = Post.objects.create(
            author=self.user,
            title='Neon Dusk Test',
            caption='Capturing electric violet and cyan in the night rain.',
            camera_model='Leica M11',
            lens_spec='35mm f/1.4',
            shutter_speed='1/250s',
            aperture='1.4',
            iso='ISO 200',
            location_name='Tokyo'
        )
        self.post.tags.add(self.tag)

    def test_user_profile_signal(self):
        """Verifica se o perfil foi criado automaticamente pelo signal post_save."""
        self.assertTrue(hasattr(self.user, 'profile'))
        self.assertIsNotNone(self.user.profile.get_avatar())

    def test_post_creation_and_properties(self):
        """Verifica a criação do post e métodos de contagem."""
        self.assertEqual(self.post.total_likes, 0)
        self.assertEqual(self.post.total_comments, 0)
        self.assertFalse(self.post.is_liked_by(self.user2))

        # Adiciona uma curtida
        Like.objects.create(user=self.user2, post=self.post)
        self.assertEqual(self.post.total_likes, 1)
        self.assertTrue(self.post.is_liked_by(self.user2))

    def test_feed_view(self):
        """Testa o carregamento da página inicial do feed."""
        response = self.client.get(reverse('feed'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'feed.html')
        self.assertContains(response, 'Neon Dusk Test')
        self.assertContains(response, 'Leica M11')

    def test_explore_view_and_filtering(self):
        """Testa a página de busca e filtros por tag."""
        # Busca sem filtro
        res = self.client.get(reverse('explore'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Neon Dusk Test')

        # Busca com tag válida
        res_tag = self.client.get(reverse('explore') + '?tag=cyberpunk')
        self.assertEqual(res_tag.status_code, 200)
        self.assertContains(res_tag, 'Neon Dusk Test')

        # Busca com termo inexistente
        res_empty = self.client.get(reverse('explore') + '?q=nonexistent_xyz')
        self.assertEqual(res_empty.status_code, 200)
        self.assertNotContains(res_empty, 'Neon Dusk Test')

    def test_post_detail_view(self):
        """Testa a visualização individual de uma obra."""
        response = self.client.get(reverse('post_detail', kwargs={'pk': self.post.pk}))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'post_detail.html')
        self.assertContains(response, 'Capturing electric violet')

    def test_comment_creation(self):
        """Testa o envio de comentário por usuário autenticado."""
        self.client.login(username='viewer_user', password='testpassword123')
        response = self.client.post(
            reverse('post_detail', kwargs={'pk': self.post.pk}),
            {'content': 'Excelente iluminação e composição!'}
        )
        self.assertEqual(response.status_code, 302)  # Redireciona após POST
        self.assertEqual(self.post.comments.count(), 1)
        self.assertEqual(self.post.comments.first().content, 'Excelente iluminação e composição!')

    def test_like_toggle_ajax(self):
        """Testa o endpoint assíncrono de curtir/descurtir."""
        self.client.login(username='viewer_user', password='testpassword123')

        # Primeira chamada: curte o post
        res_like = self.client.get(
            reverse('like_toggle', kwargs={'pk': self.post.pk}) + '?ajax=1',
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )
        self.assertEqual(res_like.status_code, 200)
        data = res_like.json()
        self.assertTrue(data['liked'])
        self.assertEqual(data['total_likes'], 1)

        # Segunda chamada: descurte o post
        res_unlike = self.client.get(
            reverse('like_toggle', kwargs={'pk': self.post.pk}) + '?ajax=1',
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )
        self.assertEqual(res_unlike.status_code, 200)
        data_unlike = res_unlike.json()
        self.assertFalse(data_unlike['liked'])
        self.assertEqual(data_unlike['total_likes'], 0)

    def test_profile_view(self):
        """Testa o carregamento da página de perfil do usuário."""
        response = self.client.get(reverse('profile', kwargs={'username': 'test_photographer'}))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'profile.html')
        self.assertContains(response, 'test_photographer')
        self.assertContains(response, 'Disparos')
