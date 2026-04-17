// Importation des différentes bibliothèques nécessaires
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialisation de notre application express
const app = express();

// Configuration des middlewares middlewares (fonctions intermédiaires)
// cors permet à notre frontend React de parler avec notre backend Express sans erreur de sécurité
app.use(cors());

// express.json() permet à notre application de lire les données envoyées en format JSON dans les requêtes
app.use(express.json());

// Petite route de test pour voir si le backend fonctionne
app.get('/api', (requete, reponse) => {
    reponse.send("Bienvenue sur l'API de gestion de projet !");
});

// Importation de nos futurs routes (on va les créer juste après)
const routesAuthentification = require('./routes/authRoutes');
const routesProjets = require('./routes/projectRoutes');
const routesTaches = require('./routes/taskRoutes');
const routesUtilisateurs = require('./routes/userRoutes');

// Définitions des URL de base pour nos différentes fonctionnalités
app.use('/api/auth', routesAuthentification); // Tout ce qui concerne la connexion/inscription
app.use('/api/projets', routesProjets); // Tout ce qui concerne les projets
app.use('/api/taches', routesTaches); // Tout ce qui concerne les tâches
app.use('/api/utilisateurs', routesUtilisateurs); // Tout ce qui concerne les utilisateurs

// Définition du port sur lequel le serveur va écouter (Port 5000 par défaut)
const portServeur = process.env.PORT || 5000;

// Lancement du serveur
app.listen(portServeur, () => {
    console.log(`Le serveur tourne parfaitement sur http://localhost:${portServeur}`);
});
