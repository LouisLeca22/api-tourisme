# 🌍 API Touristique

API REST construite avec **NestJS** pour la diffusion et le partage de données touristiques : activités, manifestations, restaurants, hébergements, points d’intérêts et bien plus encore.

---

## ✨ Fonctionnalités

- 🔐 Authentification sécurisée par JWT (connexion standard) et OAuth via Google
- 🗂️ Gestion des entités touristiques (CRUD complet)
- ☁️ Upload et gestion de médias avec **Cloudinary**
- 📧 Envoi d’e-mails transactionnels avec **Nodemailer** et **Mailtrap**
- 🗄️ Base de données **PostgreSQL** (hébergée sur **Neon**, gérée avec **TypeORM**)
- 🚀 Déploiement simple et scalable via **Render**

---

## 🛠️ Stack technique

| Technologie  | Rôle |
|--------------|------|
| **NestJS**   | Framework backend Node.js |
| **TypeORM**  | ORM pour PostgreSQL |
| **PostgreSQL** | Base de données relationnelle |
| **Neon**     | Hébergement de la base de données |
| **Multer + Cloudinary** | Gestion et stockage des fichiers |
| **Render**   | Hébergement de l’API |
| **Nodemailer + Mailtrap** | Envoi d’e-mails |
| **JWT / Google OAuth** | Authentification |

---

## 🚀 Lancer le projet en local

### 1. Cloner le repo
```bash
git clone https://github.com/LouisLeca22/api-touristique.git
cd api-touristique
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d’environnement
Créer un fichier **.env** à la racine du projet :

```env
DATABASE_URL=...
JWT_SECRET=...
JWT_TOKEN_AUDIENCE=...
JWT_TOKEN_ISSUER=...
JWT_ACCESS_TOKEN_TTL=...
JWT_REFRESH_TOKEN_TTL=...
DATABASE_SYNC=true
DATABASE_AUTOLOAD=true
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
MAIL_HOST=...
SMTP_USERNAME=...
SMTP_PASSWORD=...
API_VERSION=v1
```

### 4. Lancer l’application
```bash
npm run start:dev
```

---

## 📦 Endpoints principaux

| Ressource         | Description |
|-------------------|-------------|
| `/auth`           | Inscription, connexion, OAuth Google, rafraîchissement de token |
| `/owners`          | Gestion des propriétaires |
| `/activities`     | CRUD sur les activités |
| `/events`         | CRUD sur les manifestations |
| `/restaurants`    | CRUD sur les restaurants |
| `/accommodations` | CRUD sur les hébergements |
| `/places`            | CRUD sur les points d’intérêts |
| `/uploads`            | Téléverser des imagess |

*(Les endpoints sont préfixés par `/api/v1` selon la variable `API_VERSION`.)*

---

🙌 Merci aux technologies open-source qui rendent ce projet possible ❤️
