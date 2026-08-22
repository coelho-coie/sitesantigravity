from django.test import TestCase, Client
from django.contrib.auth.models import User
from curiosities.models import Curiosity
import json

class CuriositiesAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='user1', password='123')
        self.user2 = User.objects.create_user(username='user2', password='123')
        self.user3 = User.objects.create_user(username='user3', password='123')
        
        self.story = Curiosity.objects.create(
            title="História Teste Homem de Ferro",
            subtitle="Subtítulo",
            category="CRIACAO",
            date_or_era="1963",
            content="Conteúdo sobre a criação do Homem de Ferro por Stan Lee e Jack Kirby.",
            comic_issue="Tales of Suspense #39",
            image_filename="ironman_1.jpg",
            order=1,
            author=self.user1
        )

    def test_public_curiosities_list(self):
        response = self.client.get('/api/curiosities/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], "História Teste Homem de Ferro")
        self.assertEqual(data[0]['media_url'], "/media/ironman_1.jpg")

    def test_login_user1(self):
        response = self.client.post(
            '/api/auth/login/',
            data=json.dumps({'username': 'user1', 'password': '123'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['user']['username'], 'user1')

    def test_login_invalid_password(self):
        response = self.client.post(
            '/api/auth/login/',
            data=json.dumps({'username': 'user1', 'password': 'wrongpassword'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)

    def test_create_curiosity_authenticated(self):
        self.client.login(username='user2', password='123')
        payload = {
            "title": "Armadura Aranha de Ferro",
            "subtitle": "Parceria Tony e Peter",
            "category": "CROSSOVER",
            "date_or_era": "Guerra Civil & Um Novo Dia",
            "content": "A armadura Aranha de Ferro desenvolvida por Tony Stark para Peter Parker.",
            "comic_issue": "Amazing Spider-Man #529",
            "image_filename": "ironman_3.jpg",
            "accent_color": "#059669",
            "order": 7
        }
        response = self.client.post(
            '/api/curiosities/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['title'], "Armadura Aranha de Ferro")
        self.assertEqual(data['author_username'], "user2")

    def test_media_status_endpoint(self):
        response = self.client.get('/api/media-status/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['slots']), 6)
