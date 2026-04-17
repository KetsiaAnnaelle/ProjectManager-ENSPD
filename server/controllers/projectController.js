const ModeleProjet = require('../models/Project');

const ControllerProjet = {
    // Lister tous les projets disponibles
    listerProjets: async (requete, reponse) => {
        try {
            const projets = await ModeleProjet.recupererTous();
            reponse.status(200).json(projets);
        } catch (erreur) {
            console.error("Erreur listerProjets: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors du chargement des projets." });
        }
    },

    // Avoir les détails d'un seul projet en fournissant son id
    detailProjet: async (requete, reponse) => {
        try {
            // L'ID est passé dans l'URL (ex: /api/projets/3)
            const idProjet = requete.params.id; 
            const projet = await ModeleProjet.trouverParId(idProjet);
            
            if (!projet) {
                return reponse.status(404).json({ erreur: "Projet introuvable." });
            }
            
            reponse.status(200).json(projet);
        } catch (erreur) {
            console.error("Erreur detailProjet: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors du chargement de ce projet." });
        }
    },

    // Ajouter un tout nouveau projet
    nouveauProjet: async (requete, reponse) => {
        try {
            const { titre, description } = requete.body;
            // On récupère l'identifiant du créateur depuis le jeton (token) de connexion
            const createurId = requete.utilisateur.id; 

            const idNouveauProjet = await ModeleProjet.creer(titre, description, createurId);
            
            reponse.status(201).json({ 
                message: "Projet créé avec succès.", 
                idProjet: idNouveauProjet 
            });
        } catch (erreur) {
            console.error("Erreur nouveauProjet: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors de la création du projet." });
        }
    },

    // Modifier le titre ou la description d'un projet ciblé
    modifierProjet: async (requete, reponse) => {
        try {
            const idProjet = requete.params.id;
            const { titre, description } = requete.body;
            const profilUtilisateur = requete.utilisateur; // Récupéré du token de connexion

            // On s'assure d'abord que le projet existe
            const projetExistant = await ModeleProjet.trouverParId(idProjet);
            if (!projetExistant) {
                return reponse.status(404).json({ erreur: "Le projet n'existe pas." });
            }

            // On vérifie que seul le créateur originel (ou un admin) puisse le modifier
            if (projetExistant.createur_id !== profilUtilisateur.id && profilUtilisateur.role !== 'admin') {
                return reponse.status(403).json({ erreur: "Vous n'avez pas le droit de modifier ce projet." });
            }

            await ModeleProjet.modifier(idProjet, titre, description);
            reponse.status(200).json({ message: "Le projet a été bien mis à jour." });
        } catch (erreur) {
            console.error("Erreur modifierProjet: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors de la modification du projet." });
        }
    },

    // Supprimer un projet
    supprimerProjet: async (requete, reponse) => {
        try {
            const idProjet = requete.params.id;
            const profilUtilisateur = requete.utilisateur;

            const projetExistant = await ModeleProjet.trouverParId(idProjet);
            if (!projetExistant) {
                return reponse.status(404).json({ erreur: "Le projet n'existe pas." });
            }

            // Seul le créateur ou l'admin peut supprimer
            if (projetExistant.createur_id !== profilUtilisateur.id && profilUtilisateur.role !== 'admin') {
                return reponse.status(403).json({ erreur: "Vous n'avez pas le droit de supprimer ce projet." });
            }

            await ModeleProjet.supprimer(idProjet);
            reponse.status(200).json({ message: "Projet supprimé définitivement." });
        } catch (erreur) {
            console.error("Erreur supprimerProjet: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors de la suppression." });
        }
    }
};

module.exports = ControllerProjet;
