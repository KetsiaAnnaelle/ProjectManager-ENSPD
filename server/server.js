// Importation des différentes bibliothèques nécessaires
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();

// Initialisation de notre application express
const app = express();
const server = http.createServer(app);

// Configuration de Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // En production, mettre l'URL du frontend
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

io.on('connection', (socket) => {
    console.log('Nouveau client WebSocket :', socket.id);
    
    // Lorsqu'un utilisateur ouvre un projet, il rejoint une room spécifique
    socket.on('rejoindre_projet', (projetId) => {
        socket.join(`projet_${projetId}`);
        console.log(`Client ${socket.id} a rejoint la salle : projet_${projetId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client déconnecté :', socket.id);
    });
});

// Pour utiliser 'io' dans les contrôleurs via req.app.get('socketio')
app.set('io', io);

// Configuration des middlewares
app.use(cors());
app.use(express.json());

// Petite route de test
app.get('/api', (requete, reponse) => {
    reponse.send("Bienvenue sur l'API de gestion de projet avec WebSockets !");
});

// Importation de nos routes
const routesAuthentification = require('./routes/authRoutes');
const routesProjets = require('./routes/projectRoutes');
const routesTaches = require('./routes/taskRoutes');
const routesUtilisateurs = require('./routes/userRoutes');
const routesCommentaires = require('./routes/commentRoutes');

// Définitions des URL de base
app.use('/api/auth', routesAuthentification); 
app.use('/api/projets', routesProjets); 
app.use('/api/taches', routesTaches); 
app.use('/api/utilisateurs', routesUtilisateurs); 
app.use('/api/commentaires', routesCommentaires);

// Définition du port
const portServeur = process.env.PORT || 5000;

// Lancement du serveur Web + WebSockets
server.listen(portServeur, () => {
    console.log(`Le serveur tourne parfaitement sur http://localhost:${portServeur}`);
});
