const ModeleTache = require('../models/Task');
const ModeleProjet = require('../models/Project');

const ControllerTache = {
    // Obtenir toutes les tâches d'un projet ciblé
    tachesDuProjet: async (requete, reponse) => {
        try {
            const idProjet = requete.params.idProjet;
            // On vérifie d'abord que le projet existe
            const projetExistant = await ModeleProjet.trouverParId(idProjet);
            if (!projetExistant) {
                return reponse.status(404).json({ erreur: "Projet introuvable." });
            }

            const listeTaches = await ModeleTache.recupererPourProjet(idProjet);
            reponse.status(200).json(listeTaches);
        } catch (erreur) {
            console.error("Erreur tachesDuProjet: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors du chargement des tâches." });
        }
    },

    // Ajouter une nouvelle tâche dans un projet
    nouvelleTache: async (requete, reponse) => {
        try {
            const idProjet = requete.params.idProjet;
            const { titre, description, assignes, statut, echeance } = requete.body;

            // Il faut s'assurer que le projet est réel
            const projetExistant = await ModeleProjet.trouverParId(idProjet);
            if (!projetExistant) {
                return reponse.status(404).json({ erreur: "Projet introuvable pour y ajouter une tâche." });
            }

            // Statut par défaut si non fourni
            const statutFinal = statut || 'À faire';

            // assignes doit être un tableau d'ID d'utilisateurs
            const tableauAssignations = Array.isArray(assignes) ? assignes : (assignes ? [assignes] : []);

            const idNouvelleTache = await ModeleTache.creer(idProjet, titre, description, tableauAssignations, statutFinal, echeance);
            
            // WebSockets: Notifier les membres du projet
            const io = requete.app.get('io');
            if (io) {
                // On pourrait envoyer la tâche complète récupérée depuis la BD
                io.to(`projet_${idProjet}`).emit('NOUVELLE_TACHE', { idTache: idNouvelleTache, projet_id: idProjet });
            }

            reponse.status(201).json({ message: "La tâche a bien été créée.", idTache: idNouvelleTache });
        } catch (erreur) {
            console.error("Erreur nouvelleTache: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors de la création de la tâche." });
        }
    },

    // Mettre à jour l'état (le statut) pour savoir si c'est fini ou en cours
    miseAJourStatut: async (requete, reponse) => {
        try {
            const idTache = requete.params.idTache;
            const { statut } = requete.body;

            await ModeleTache.changerStatut(idTache, statut);

            // WebSockets: Informer la room (besoin de l'idProjet, donc on l'envoie côté front ou on cherche)
            const io = requete.app.get('io');
            if (io) {
                io.emit('STATUT_TACHE_MAJ', { idTache, statut });
            }

            reponse.status(200).json({ message: "Le statut de la tâche a été mis à jour." });
        } catch (erreur) {
            console.error("Erreur miseAJourStatut: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors de la mise à jour." });
        }
    },

    // Récupérer toutes les tâches (pour le Tableau de bord global)
    toutesLesTaches: async (requete, reponse) => {
        try {
            const ut = requete.utilisateur;
            const bd = require('../config/db');

            let reqSql = '';
            let params = [];

            if (ut.role === 'admin') {
                reqSql = `
                    SELECT t.*, p.titre as nom_projet 
                    FROM taches t 
                    LEFT JOIN projets p ON t.projet_id = p.id 
                    ORDER BY t.date_creation DESC
                `;
            } else {
                // Membres: on ne voit que ce qui nous est assigné
                reqSql = `
                    SELECT t.*, p.titre as nom_projet 
                    FROM taches t 
                    JOIN tache_assignations ta ON t.id = ta.tache_id
                    LEFT JOIN projets p ON t.projet_id = p.id 
                    WHERE ta.utilisateur_id = ? 
                    ORDER BY t.date_creation DESC
                `;
                params = [ut.id];
            }

            const [resultats] = await bd.execute(reqSql, params);
            reponse.status(200).json(resultats);

        } catch (erreur) {
            console.error("Erreur toutesLesTaches: ", erreur);
            reponse.status(500).json({ erreur: "Erreur serveur." });
        }
    }
};

module.exports = ControllerTache;
