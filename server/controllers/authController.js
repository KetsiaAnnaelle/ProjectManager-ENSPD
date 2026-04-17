const bcrypt = require('bcrypt'); // Pour sécuriser (hacher) les mots de passe
const jwt = require('jsonwebtoken'); // Pour créer le ticket d'accès (token)
const ModeleUtilisateur = require('../models/User');

const ControllerAuthentification = {
    // Fonction d'inscription d'un nouvel utilisateur
    inscription: async (requete, reponse) => {
        try {
            const { email, motDePasse, nom } = requete.body;

            // Vérifier si l'utilisateur existe déjà
            const utilisateurExistant = await ModeleUtilisateur.trouverParEmail(email);
            if (utilisateurExistant) {
                return reponse.status(400).json({ erreur: "Cet email est déjà utilisé." });
            }

            // Hacher le mot de passe (le rendre illisible) avec une complexité de 10
            const motDePasseHache = await bcrypt.hash(motDePasse, 10);

            // Créer le profil dans la base de données
            await ModeleUtilisateur.creer(email, motDePasseHache, nom);

            reponse.status(201).json({ message: "Utilisateur créé avec succès !" });
        } catch (erreur) {
            console.error(erreur);
            reponse.status(500).json({ erreur: "Erreur serveur lors de l'inscription." });
        }
    },

    // Fonction de connexion
    connexion: async (requete, reponse) => {
        try {
            const { email, motDePasse } = requete.body;

            // Chercher l'utilisateur avec son adresse email
            const utilisateur = await ModeleUtilisateur.trouverParEmail(email);
            
            // Si on ne trouve personne avec cet email
            if (!utilisateur) {
                return reponse.status(401).json({ erreur: "Email ou mot de passe incorrect." });
            }

            // Vérifier si le mot de passe fourni correspond au mot de passe sécurisé (haché) en base
            const motDePasseCorrect = await bcrypt.compare(motDePasse, utilisateur.mot_de_passe);
            if (!motDePasseCorrect) {
                return reponse.status(401).json({ erreur: "Email ou mot de passe incorrect." });
            }

            // Création du Token pour se souvenir que l'utilisateur est connecté. Il expirera dans 24 heures.
            const token = jwt.sign(
                { id: utilisateur.id, email: utilisateur.email, role: utilisateur.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '24h' }
            );

            // On envoie le token ainsi que des informations basiques du profil
            reponse.status(200).json({ 
                message: "Connexion réussie", 
                token: token, 
                utilisateur: { id: utilisateur.id, email: utilisateur.email, nom: utilisateur.nom, role: utilisateur.role } 
            });
        } catch (erreur) {
            console.error(erreur);
            reponse.status(500).json({ erreur: "Erreur serveur lors de la connexion." });
        }
    },

    // Fonction pour récupérer le profil de l'utilisateur connecté
    profil: async (requete, reponse) => {
        try {
            // L'ID vient du token décrypté dans le middleware 'protegerRoute'
            const idUtilisateur = requete.utilisateur.id;
            const profil = await ModeleUtilisateur.trouverParId(idUtilisateur);
            
            if(!profil) return reponse.status(404).json({ erreur: "Profil introuvable" });

            reponse.status(200).json(profil);
        } catch (erreur) {
            console.error(erreur);
            reponse.status(500).json({ erreur: "Erreur serveur lors du chargement du profil." });
        }
    }
};

module.exports = ControllerAuthentification;
