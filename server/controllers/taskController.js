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
            const { titre, description, assigneA, statut, echeance } = requete.body;

            // Il faut s'assurer que le projet est réel
            const projetExistant = await ModeleProjet.trouverParId(idProjet);
            if (!projetExistant) {
                return reponse.status(404).json({ erreur: "Projet introuvable pour y ajouter une tâche." });
            }

            // Statut par défaut si non fourni
            const statutFinal = statut || 'À faire';

            const idNouvelleTache = await ModeleTache.creer(idProjet, titre, description, assigneA, statutFinal, echeance);
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
            reponse.status(200).json({ message: "Le statut de la tâche a été mis à jour." });
        } catch (erreur) {
            console.error("Erreur miseAJourStatut: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors de la mise à jour." });
        }
    }
};

module.exports = ControllerTache;
