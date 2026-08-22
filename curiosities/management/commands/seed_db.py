from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from curiosities.models import Curiosity
from django.conf import settings
from pathlib import Path

class Command(BaseCommand):
    help = "Popula o banco de dados com usuarios de teste (user1, user2, user3) e historias/curiosidades completas do Homem de Ferro."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("=== Iniciando Seed do Banco de Dados (Homem de Ferro) ==="))

        # 1. Criacao dos Usuarios Solicitados
        users_data = [
            {"username": "user1", "password": "123", "email": "tony.stark@starkindustries.com", "first_name": "Tony", "last_name": "Stark", "is_staff": True},
            {"username": "user2", "password": "123", "email": "peter.parker@dailybugle.com", "first_name": "Peter", "last_name": "Parker", "is_staff": False},
            {"username": "user3", "password": "123", "email": "pepper.potts@starkindustries.com", "first_name": "Pepper", "last_name": "Potts", "is_staff": False},
            {"username": "admin", "password": "123", "email": "admin@marvelhub.com", "first_name": "Stan", "last_name": "Lee", "is_staff": True, "is_superuser": True},
        ]

        created_users = {}
        for u_data in users_data:
            user, created = User.objects.get_or_create(username=u_data["username"])
            user.set_password(u_data["password"])
            user.email = u_data.get("email", "")
            user.first_name = u_data.get("first_name", "")
            user.last_name = u_data.get("last_name", "")
            user.is_staff = u_data.get("is_staff", False)
            if u_data.get("is_superuser", False):
                user.is_superuser = True
            user.save()
            created_users[u_data["username"]] = user
            status_text = "criado" if created else "atualizado"
            self.stdout.write(self.style.SUCCESS(f"[OK] Usuario '{user.username}' {status_text} com sucesso (Senha: 123)."))

        # 2. Criacao da pasta /media caso nao exista
        media_dir = Path(settings.MEDIA_ROOT)
        media_dir.mkdir(parents=True, exist_ok=True)
        self.stdout.write(self.style.NOTICE(f"Pasta de midia verificada em: {media_dir}"))

        # 3. Limpar entradas antigas do seed se existirem
        Curiosity.objects.all().delete()

        # 4. Populacao de Historias, Criacao, Datas e Gibis do Homem de Ferro
        curiosities_seed = [
            {
                "title": "A Criacao por Stan Lee, Larry Lieber, Don Heck e Jack Kirby (1963)",
                "subtitle": "O desafio de criar um heroi capitalista amado pelo publico",
                "category": "CRIACAO",
                "date_or_era": "Marco de 1963",
                "comic_issue": "Tales of Suspense #39",
                "image_filename": "ironman_1.jpg",
                "image_caption": "Capa historica de Tales of Suspense #39 (1963) com a primeira armadura Mark I.",
                "accent_color": "#10b981",
                "order": 1,
                "author": created_users["user1"],
                "content": (
                    "O Homem de Ferro foi criado por Stan Lee, com roteiro desenvolvido por Larry Lieber e design artistico "
                    "de Don Heck e Jack Kirby em marco de 1963, estreando na revista Tales of Suspense #39. "
                    "Stan Lee propos a si mesmo um ousado desafio criativo em plena Guerra Fria: criar um heroi que representasse "
                    "tudo o que a juventude da epoca rejeitava — um fabricante de armas militar, bilionario e capitalista industrial. "
                    "Inspirado na personalidade excentrica do magnata real Howard Hughes ('um inventor, aventureiro, bilionario e mulherengo'), "
                    "Lee criou Anthony Edward Stark. Apos ser ferido por estilhacos no coracao durante uma missao e capturado, "
                    "Tony constroi com a ajuda do cientista Ho Yinsen uma placa peitoral magnetizada e a monumental armadura cinzenta Mark I para sobreviver e escapar."
                )
            },
            {
                "title": "A Evolucao Visual: Do Cinza Ruste a Armadura Dourada e Escarlate",
                "subtitle": "Como Steve Ditko e Jack Kirby refinaram o design do Vingador",
                "category": "ARMADURAS",
                "date_or_era": "1963 - Tales of Suspense #40 e #48",
                "comic_issue": "Tales of Suspense #40 & #48",
                "image_filename": "ironman_2.jpg",
                "image_caption": "A transicao da pesada couraça de ferro para o elegante traje vermelho e ouro desenhado por Steve Ditko.",
                "accent_color": "#34d399",
                "order": 2,
                "author": created_users["user2"],
                "content": (
                    "A primeira armadura do Homem de Ferro (Mark I) era um traje pesado, cinzento e intimidador de metal bruto. "
                    "Logo na edicao seguinte (Tales of Suspense #40), Tony Stark percebeu que a aparencia assustava civis inocentes "
                    "e decidiu banhar a armadura em ouro reluzente, tornando-se o 'Cavaleiro Dourado'. "
                    "No entanto, o peso excessivo ainda limitava seus movimentos. Na historica edicao #48, o lendario desenhista "
                    "Steve Ditko (co-criador do Homem-Aranha) remodelou completamente o heroi, criando a iconic armadura vermelha e dourada "
                    "composta por micro-malha flexivel e capacete anatomico com fendas luminosas, definindo o visual definitivo do heroi para sempre."
                )
            },
            {
                "title": "A Dinamica com o Homem-Aranha: Mentor, Conflito e Tecnologia",
                "subtitle": "Da armadura Aranha de Ferro a fase Um Novo Dia",
                "category": "CROSSOVER",
                "date_or_era": "Guerra Civil & Era Um Novo Dia",
                "comic_issue": "Amazing Spider-Man #529-538 / Invincible Iron Man",
                "image_filename": "ironman_3.jpg",
                "image_caption": "Tony Stark e Peter Parker: a fusao da engenharia Stark com o intelecto cientifico do Aranha.",
                "accent_color": "#059669",
                "order": 3,
                "author": created_users["user2"],
                "content": (
                    "A relacao entre Tony Stark e Peter Parker e uma das mais fascinantes e complexas da Marvel Comics. "
                    "Reconhecendo a mente brilhante de Parker, Tony acolheu o Homem-Aranha como seu protegido e desenvolveu a lendaria "
                    "armadura 'Aranha de Ferro' (Iron Spider) com tres bracos mecanicos dourados e sensores neurais avancados. "
                    "Durante os eventos que culminaram na fase 'Um Novo Dia', os dois genios colidiram filosoficamente sobre vigilancia, "
                    "liberdade individual e seguranca publica. Mesmo em lados opostos em diversas crises, o respeito mutuo pelo intelecto "
                    "e dedicao a protecao da vida humana sempre manteve uma ligacao inquebravel entre ambos."
                )
            },
            {
                "title": "Linha do Tempo: 6 Decadas de Genialidade e Inovacao",
                "subtitle": "As datas que consagraram Tony Stark como lider dos Vingadores",
                "category": "DATAS",
                "date_or_era": "1963 - 2026",
                "comic_issue": "Avengers #1, Iron Man #1, Extremis, MCU",
                "image_filename": "ironman_4.jpg",
                "image_caption": "Cronologia dos grandes momentos e armaduras tecnologicas da Stark Industries.",
                "accent_color": "#047857",
                "order": 4,
                "author": created_users["user3"],
                "content": (
                    "Grandes marcos historicos do Homem de Ferro:\n"
                    "- 1963: Estreia em Tales of Suspense #39 e co-fundacao dos Vingadores em The Avengers #1.\n"
                    "- 1968: Estreia de sua revista solo em The Invincible Iron Man #1 ('O Homem de Ferro Contra o Homem de Ferro!').\n"
                    "- 1979: A aclamada saga 'Demonio na Garrafa' (Iron Man #120-128), que humanizou o heroi ao abordar sua luta contra o alcoolismo.\n"
                    "- 1987-1988: 'A Guerra das Armaduras' (Armor Wars), onde Tony caca sua propria tecnologia roubada por viloes e governos.\n"
                    "- 2005-2006: A revolucao biotecnologica 'Extremis' de Warren Ellis e a saga 'Guerra Civil'.\n"
                    "- 2008-2026: A explosao cinematografica no MCU estrelada por Robert Downey Jr., tornando Tony Stark o rosto supremo da Marvel no cinema mundial."
                )
            },
            {
                "title": "Gibis Historicos e Obras-Primas Essenciais de Tony Stark",
                "subtitle": "As maiores sagas dos quadrinhos para qualquer fa e colecionador",
                "category": "GIBIS",
                "date_or_era": "Classicos Marvel",
                "comic_issue": "Demon in a Bottle, Armor Wars, Extremis, Iron Metropolitan",
                "image_filename": "ironman_5.jpg",
                "image_caption": "Capas das sagas mais emblemáticas que redefiniram o personagem ao longo das décadas.",
                "accent_color": "#10b981",
                "order": 5,
                "author": created_users["user1"],
                "content": (
                    "Tres obras-primas fundamentais do Homem de Ferro:\n\n"
                    "1. Demonio na Garrafa (1979 - Iron Man #120-128): Considerada uma das maiores HQs de todos os tempos, escrita por David Michelinie e Bob Layton, "
                    "onde o maior inimigo de Tony Stark nao e um supervilao, mas suas proprias fraquezas internas e o alcoolismo.\n\n"
                    "2. A Guerra das Armaduras (1987 - Iron Man #225-231): Ao descobrir que os projetos de suas armaduras foram pirateados por Justin Hammer e vendidos a viloes, "
                    "Tony inicia uma cruzada implacavel ao redor do mundo para neutralizar qualquer blindagem baseada em seu design.\n\n"
                    "3. Extremis (2005 - Iron Man Vol 4 #1-6): Warren Ellis e Adi Granov revolucionam o heroi integrando a armadura diretamente ao sistema nervoso de Stark "
                    "atraves de bio-nanotecnologia, servindo de base para o filme de 2008."
                )
            },
            {
                "title": "A Ciencia do Reator Arc e as Armaduras Especializadas",
                "subtitle": "Hulkbuster, Centuriao Prateado, Stealth Armor e Bleeding Edge",
                "category": "ARMADURAS",
                "date_or_era": "Tecnologia Stark",
                "comic_issue": "Iron Man #300, #304 & Invincible Iron Man #25",
                "image_filename": "ironman_6.jpg",
                "image_caption": "As armaduras modulares: da maciça Hulkbuster ao traje de nanotecnologia pura Bleeding Edge.",
                "accent_color": "#6ee7b7",
                "order": 6,
                "author": created_users["user3"],
                "content": (
                    "O verdadeiro superpoder de Tony Stark e seu intelecto de nivel genial e capacidade de engenharia adaptativa:\n"
                    "- Reator Arc (Arc Reactor): Um reator de fusao limpa miniatura que manteve seu coracao batendo e alimenta toda a energia dos repulsores de plasma.\n"
                    "- Armadura Hulkbuster (Mark XLIV): Criada com exoesqueleto massivo modular e blindagem reforçada para conter o Hulk em momentos de furia incontrolavel.\n"
                    "- Stealth Armor (Armadura Furtiva): Traje fosco que absorve radares e cameras, projetado para infiltracoes espioes indetectaveis.\n"
                    "- Bleeding Edge (Mark 37): Armadura totalmente guardada dentro dos ossos de Stark atraves de nanobots que se materializam ao comando de seu pensamento."
                )
            },
        ]

        for item in curiosities_seed:
            curiosity, created = Curiosity.objects.update_or_create(
                title=item["title"],
                defaults=item
            )
            action_text = "criada" if created else "atualizada"
            self.stdout.write(self.style.SUCCESS(f"[OK] Historia '{curiosity.title}' {action_text}."))

        self.stdout.write(self.style.SUCCESS("=== Seed do Homem de Ferro Concluido com Sucesso! ==="))
