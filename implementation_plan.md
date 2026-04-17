# Plan d'implémentation : MVP Application de Gestion de Projet

Ce document décrit la structure, la conception et les étapes de développement pour construire l'application de gestion de projet full-stack, conformément à vos exigences.

## User Review Required

> [!IMPORTANT]
> Avant de commencer, veuillez confirmer ou fournir les informations suivantes :
> 1.  Êtes-vous d'accord pour que j'utilise **Vite** pour initialiser l'application React dans le dossier client (c'est plus rapide et recommandé par rapport à l'ancien Create React App) ?
> 2.  Voulez-vous que je crée le backend en utilisant `mysql2` comme pilote de base de données asynchrone (avec les promesses) ou avez-vous une préférence pour un ORM comme Sequelize (les consignes parlent de "Scripts SQL" donc j'utiliserai de préférence du SQL natif/query builder) ?
> 3.  **Identifiants de base de données** : Pourrai-je avoir les informations de connexion à votre base de données MySQL locale (utilisateur, mot de passe, nom de la base) afin de configurer le projet pour l'environnement de développement ?

## Architecture Technologique

- **Frontend** : React.js (Vite), React Router (Routing), Context API (État global), CSS Vanilla (Couleurs : Bleu, Blanc, Rouge), `lucide-react` (Icônes).
- **Backend** : Node.js, Express.js.
- **Base de données** : MySQL via le package `mysql2`.
- **Sécurité** : `bcrypt` (hashage de mot de passe), `jsonwebtoken` (JWT), `cors`, `express-validator` (validation).

## Proposed Changes

---

### [Structure de Base et Documentation]

Création des dossiers et de la documentation initiale.

#### [NEW] docs/README.md
#### [NEW] docs/API.md

---

### [Database Setup]

Mise en place de la base de données relationnelle et des données de test.

#### [NEW] database/schema.sql
Contiendra les requêtes SQL de création des tables :
- `utilisateurs` (id, email, password_hash, nom, role, date_inscription)
- `projets` (id, titre, description, createur_id, date_creation)
- `taches` (id, projet_id, titre, description, assigne_a, statut, echeance)
#### [NEW] database/seed.sql
Contiendra des données factices pour tester l'application.

---

### [Backend (Server)]

Mise en place de l'API RESTful avec Express.

#### [NEW] server/package.json
#### [NEW] server/server.js
Point d'entrée principal.
#### [NEW] server/config/db.js
Configuration de la connexion MySQL.
#### [NEW] server/middleware/authMiddleware.js
Vérification des tokens JWT.
#### [NEW] server/middleware/validateMiddleware.js
Sanitisation et validation.
#### [NEW] server/models/User.js, Project.js, Task.js
Logique d'accès aux données (requêtes SQL).
#### [NEW] server/controllers/authController.js, projectController.js, taskController.js
Logique métier des différentes routes.
#### [NEW] server/routes/authRoutes.js, projectRoutes.js, taskRoutes.js
Définition des endpoints.

---

### [Frontend (Client)]

Mise en place de l'application React avec un design (Bleu, Blanc, Rouge).

#### [NEW] client/package.json & configuration Vite
#### [NEW] client/src/styles/index.css & variables.css
Thème centré sur les couleurs demandées, et design moderne responsive.
#### [NEW] client/src/store/AuthContext.js
Gestion de l'état d'authentification.
#### [NEW] client/src/services/api.js
Client Axios ou Fetch pour communiquer avec le backend.
#### [NEW] client/src/components/
Fichiers pour Header, Sidebar, Card, Button, Input (avec des icônes `lucide-react`).
#### [NEW] client/src/pages/
- `Login.jsx` / `Register.jsx` : Authentification.
- `Dashboard.jsx` : Liste des projets.
- `ProjectDetails.jsx` : Détails d'un projet et liste de ses tâches.
- `Profile.jsx` : Profil utilisateur.

## Open Questions

- Avez-vous une préférence pour l'initialisation de la base de données de manière automatique via Node.js au démarrage ou via une commande NPM (ex: `npm run db:init`) ?
- Quel ensemble précis de couleurs (codes hexa spécifiques) préféreriez-vous pour le Bleu et le Rouge, ou puis-je choisir un palette "premium et dynamique" pour le rendu final (comme un bleu royal et un rouge écarlate subtil) ?

## Verification Plan

### Test & Validation
1. **Initialisation** : Exécution de `schema.sql` et vérification de la création des tables dans MySQL.
2. **Backend API** : Je testerai les routes principales en simulant des appels (Register/Login, création de projet, attribution de tâche) via un script ou l'interface au fil du développement.
3. **Frontend UI** : Je vérifierai le rendu, que le système d'authentification connecte bien l'utilisateur (token stocké) et que les requêtes CORS passent avec succès.
4. **Sécurité** : Validation du hachage de mot de passe en base de données et de l'interception de l'authentification par le middleware si le token manque.
