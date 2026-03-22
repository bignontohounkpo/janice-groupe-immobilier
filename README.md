# Horizon Bénin Properties

Projet de gestion immobilière moderne built with Next.js, Prisma, and Cloudflare R2.

## 🚀 Installation & Setup

Si tu viens de pull le projet, voici les étapes à suivre pour tout mettre en place :

### 1. Installation des dépendances
```bash
pnpm install
```

### 2. Configuration des variables d'environnement
Copie le fichier `.env.example` vers `.env` et remplis les valeurs :
```bash
cp .env.example .env
```

### 3. Génération du Client Prisma
C'est l'étape **cruciale** car le client généré est ignoré par Git :
```bash
npx prisma generate
```

### 4. Synchronisation de la Base de Données
Pour s'assurer que ta base de données (Neon ou locale) possède les bonnes tables :
```bash
npx prisma db push
```

### 5. Seeding (Données initiales)
Pour remplir les catégories et les quartiers du Bénin :
```bash
npx tsx prisma/seed.ts
```

### 6. Création du compte Admin
Pour pouvoir te connecter au dashboard (`/admin`) :
```bash
npx tsx scripts/create-admin.ts
```

### 7. Lancement du projet
```bash
pnpm dev
```

## 🛠 Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Base de données**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **Stockage**: Cloudflare R2 (S3 Compatible)
- **Auth**: NextAuth.js v5 (Auth.js)
- **Styling**: Tailwind CSS
