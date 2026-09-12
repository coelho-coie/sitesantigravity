"""
Lumina Platform — Seed Data Generator
Popula o banco de dados com criadores fictícios, posts de alta qualidade estética,
tags, comentários e curtidas.
"""

import os
import sys
import django

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lumina_core.settings')
django.setup()


from django.contrib.auth.models import User
from core.models import Profile, Tag, Post, Comment, Like, Story
from django.utils.text import slugify


def run_seed():
    print("🌱 Iniciando carga de dados de demonstração Lumina...")

    # 1. Criação de Tags
    tag_names = [
        'cyberpunk', 'streetphotography', 'brutalism', 'monochrome',
        'portrait', 'tokyo', 'mediumformat', 'minimalism', 'leica', 'atacama'
    ]
    tags_dict = {}
    for name in tag_names:
        tag, _ = Tag.objects.get_or_create(name=name, defaults={'slug': slugify(name)})
        tags_dict[name] = tag
    print(f"✅ {len(tags_dict)} Tags criadas.")

    # 2. Criação de Usuários
    creators_data = [
        {
            'username': 'lumina_demo',
            'email': 'demo@lumina.art',
            'first_name': 'Aiden',
            'last_name': 'Mercer',
            'password': 'lumina123456',
            'is_pro': True,
            'is_curator': False,
            'bio': 'Fotógrafo conceitual explorando a intersecção entre o futurismo e a solidão urbana em 35mm.',
            'location': 'Berlim / São Paulo',
            'website': 'https://aidenmercer.art',
            'avatar_url': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'
        },
        {
            'username': 'kenji_shibuya',
            'email': 'kenji@lumina.art',
            'first_name': 'Kenji',
            'last_name': 'Sato',
            'password': 'lumina123456',
            'is_pro': True,
            'is_curator': True,
            'bio': 'Fotografia de rua em Tóquio. Caçando reflexos de neon em noites chuvosas. Leica M11 shooter.',
            'location': 'Shibuya, Tóquio',
            'website': 'https://kenjisato.photo',
            'avatar_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
        },
        {
            'username': 'elena_rostova',
            'email': 'elena@lumina.art',
            'first_name': 'Elena',
            'last_name': 'Rostova',
            'password': 'lumina123456',
            'is_pro': False,
            'is_curator': True,
            'bio': 'Arquiteta e fotógrafa de grande formato. Fascinada pelo concreto brutalista e horizontes áridos.',
            'location': 'Santiago, Chile',
            'website': 'https://rostova-arch.com',
            'avatar_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'
        },
        {
            'username': 'aria_lens',
            'email': 'aria@lumina.art',
            'first_name': 'Aria',
            'last_name': 'Vance',
            'password': 'lumina123456',
            'is_pro': True,
            'is_curator': False,
            'bio': 'Retratos editoriais e iluminação volumétrica experimental. Cores cinematográficas.',
            'location': 'Londres, Reino Unido',
            'website': 'https://ariavance.visuals',
            'avatar_url': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80'
        }
    ]

    users = {}
    for data in creators_data:
        user, created = User.objects.get_or_create(
            username=data['username'],
            defaults={
                'email': data['email'],
                'first_name': data['first_name'],
                'last_name': data['last_name']
            }
        )
        if created:
            user.set_password(data['password'])
            user.save()

        profile = user.profile
        profile.bio = data['bio']
        profile.location = data['location']
        profile.website = data['website']
        profile.is_pro = data['is_pro']
        profile.is_curator = data['is_curator']
        profile.avatar_url = data['avatar_url']
        profile.save()

        users[data['username']] = user
    print(f"✅ {len(users)} Usuários e perfis configurados.")

    # 3. Criação de Stories
    Story.objects.all().delete()
    for username, user in users.items():
        Story.objects.create(
            user=user,
            title="Destaque",
            image_url=user.profile.get_avatar()
        )
    print("✅ Stories de destaque criados.")

    # 4. Criação de Postagens
    Post.objects.all().delete()
    posts_data = [
        {
            'author': users['kenji_shibuya'],
            'title': 'Dilúvio da Meia-Noite em Shibuya',
            'caption': 'Tempestade de meia-noite no corredor de neon. A luz de mercúrio e os letreiros holográficos refletem no asfalto molhado. Capturado em 35mm ótica pura sem pós-processamento digital excessivo.',
            'image_url': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&q=85',
            'camera_model': 'Leica M11',
            'lens_spec': '35mm f/1.4 Summilux',
            'shutter_speed': '1/250s',
            'aperture': '1.4',
            'iso': 'ISO 400',
            'location_name': 'Shibuya Crossing, Tóquio',
            'tags': ['cyberpunk', 'streetphotography', 'tokyo', 'leica']
        },
        {
            'author': users['elena_rostova'],
            'title': 'Ressonância Monolítica ao Crepúsculo',
            'caption': 'A convergência entre o brutalismo de concreto cru e o silêncio infinito das dunas. A geometria austera corta o horizonte exatamente quando os últimos feixes de luz solar tingem o céu de violeta.',
            'image_url': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=85',
            'camera_model': 'Hasselblad H6D-100c',
            'lens_spec': 'HC 2,2/100',
            'shutter_speed': '1/60s',
            'aperture': '5.6',
            'iso': 'ISO 64',
            'location_name': 'Deserto de Atacama, Chile',
            'tags': ['brutalism', 'mediumformat', 'minimalism', 'atacama']
        },
        {
            'author': users['aria_lens'],
            'title': 'Prisma Íris: Retrato Cinematográfico',
            'caption': 'Estudo de iluminação volumétrica dividida com difusores de gel ciano e fúcsia. O foco cravado no reflexo da pupila revela a paleta sutil da pele sob iluminação experimental.',
            'image_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=85',
            'camera_model': 'Sony A7 IV',
            'lens_spec': '85mm f/1.2 GM',
            'shutter_speed': '1/400s',
            'aperture': '1.2',
            'iso': 'ISO 100',
            'location_name': 'Soho Studio, Londres',
            'tags': ['portrait', 'cyberpunk', 'minimalism']
        },
        {
            'author': users['lumina_demo'],
            'title': 'Geometrias e Silêncios Monocromáticos',
            'caption': 'Linhas puras de uma fachada modernista em Berlim. A escala tonal do preto e branco enfatiza a textura do concreto e as sombras diagonais das 16h.',
            'image_url': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=85',
            'camera_model': 'Fujifilm X-T5',
            'lens_spec': '23mm f/2.0 WR',
            'shutter_speed': '1/500s',
            'aperture': '4.0',
            'iso': 'ISO 125',
            'location_name': 'Mitte, Berlim',
            'tags': ['monochrome', 'brutalism', 'streetphotography']
        }
    ]

    created_posts = []
    for pdata in posts_data:
        post = Post.objects.create(
            author=pdata['author'],
            title=pdata['title'],
            caption=pdata['caption'],
            image_url=pdata['image_url'],
            camera_model=pdata['camera_model'],
            lens_spec=pdata['lens_spec'],
            shutter_speed=pdata['shutter_speed'],
            aperture=pdata['aperture'],
            iso=pdata['iso'],
            location_name=pdata['location_name']
        )
        for tname in pdata['tags']:
            post.tags.add(tags_dict[tname])
        created_posts.append(post)
    print(f"✅ {len(created_posts)} Postagens autorais criadas.")

    # 5. Criação de Comentários e Curtidas
    comments_sample = [
        ("A iluminação e o controle de reflexos nessa lente são inacreditáveis.", users['aria_lens']),
        ("Composição monumental! O enquadramento em terços funciona com perfeição aqui.", users['lumina_demo']),
        ("Essa aberração cromática natural do vidro analógico dá uma textura única.", users['kenji_shibuya']),
        ("Simplesmente inspirador. Dá vontade de pegar a câmera e sair agora.", users['elena_rostova'])
    ]

    for i, post in enumerate(created_posts):
        # Curtidas
        for user in users.values():
            Like.objects.get_or_create(user=user, post=post)

        # Comentários
        c_text, c_user = comments_sample[i % len(comments_sample)]
        Comment.objects.create(post=post, user=c_user, content=c_text)

        c_text2, c_user2 = comments_sample[(i + 1) % len(comments_sample)]
        Comment.objects.create(post=post, user=c_user2, content=c_text2)

    print("✅ Curtidas e comentários simulados com sucesso.")
    print("✨ Carga de dados concluída!")


if __name__ == '__main__':
    run_seed()
