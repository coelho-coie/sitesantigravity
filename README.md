# ⚡ Portal de Curiosidades do Homem de Ferro • Stark Hub & Marvel

Projeto Full-Stack desenvolvido com **Django (Python)** no backend e **React (Vite)** no frontend (Mobile-First), preparado para hospedagem no **Vercel**. O tema é inspirado nas origens do **Homem de Ferro (Tony Stark)**, suas datas históricas, evolução das armaduras, sagas clássicas e parcerias com o **Homem-Aranha (Aranha de Ferro / Um Novo Dia)** e **Vingadores**.

---

## 🚀 Tecnologias Utilizadas

- **Backend**: Python 3.12, Django 5, Django REST Framework, WhiteNoise, django-cors-headers, python-dotenv, Pillow.
- **Frontend**: React 19, Vite, Lucide Icons, Modern Soft Dark Palette com contraste Verde Reator Arc / Esmeralda (Mobile-First).
- **Banco de Dados**: SQLite pré-populado (compatível com PostgreSQL no Vercel).
- **Deploy**: Vercel Native Python/Django.

---

## 👥 Contas de Acesso Pré-populadas

O banco de dados já vem populado com as credenciais solicitadas:

| Usuário | Senha | Perfil | Ações |
| :--- | :--- | :--- | :--- |
| `user1` | `123` | Tony Stark (Iron Man) | Editar / Adicionar Histórias |
| `user2` | `123` | Peter Parker (Spider-Man) | Editar / Adicionar Histórias |
| `user3` | `123` | Pepper Potts (Rescue) | Editar / Adicionar Histórias |
| `admin` | `123` | Stan Lee (Admin) | Acesso total ao Django Admin (`/admin/`) |

---

## 📸 Inserção das 6 Fotos na pasta `/media`

A pasta `media/` foi configurada para comportar as 6 fotos da história do Homem de Ferro. Basta baixar suas imagens da internet e salvá-las com os nomes:

1. `ironman_1.jpg` -> Foto da Criação (Stan Lee, Larry Lieber, Don Heck & Jack Kirby / Tales of Suspense #39 - Mark I)
2. `ironman_2.jpg` -> Foto da Evolução das Armaduras (Mark II Dourada e o Clássico Vermelho e Ouro de Steve Ditko)
3. `ironman_3.jpg` -> Foto Tony Stark & Homem-Aranha (Armadura Aranha de Ferro / Um Novo Dia)
4. `ironman_4.jpg` -> Foto da Armadura Pesada Hulkbuster (Mark XLIV)
5. `ironman_5.jpg` -> Foto dos Gibis Históricos (Demônio na Garrafa / Guerra das Armaduras)
6. `ironman_6.jpg` -> Foto das Armaduras Especiais & Tecnologia (Reator Arc, Bleeding Edge e Model-Prime)

> *Nota: Enquanto as fotos não forem inseridas, o frontend exibe cartões técnicos com design Reator Arc temático.*

---

## 🛠️ Como Executar Localmente

### 1. Iniciar o Servidor Django (Backend)
```powershell
# Ativar o ambiente virtual
.\.venv\Scripts\activate

# Executar migrações e seed (se necessário)
python manage.py migrate
python manage.py seed_db

# Iniciar o servidor
python manage.py runserver
```
O backend e a aplicação compilada estarão disponíveis em: **`http://127.0.0.1:8000/`**

### 2. Iniciar o Frontend em Modo Desenvolvimento (Hot-Reload)
```powershell
cd frontend
npm run dev
```
O frontend interativo estará em: **`http://localhost:5173/`** (com proxy automático para o Django).

---

## ☁️ Como Hospedar no Vercel

1. Instale a CLI do Vercel ou conecte seu repositório no [vercel.com](https://vercel.com).
2. Configure as variáveis de ambiente no painel da Vercel:
   - `DJANGO_SECRET_KEY`: sua chave segura
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `.vercel.app`
3. Execute o comando de deploy:
   ```bash
   vercel
   ```
O Vercel detectará o Django nativamente e fará o build do React e do backend automaticamente!
