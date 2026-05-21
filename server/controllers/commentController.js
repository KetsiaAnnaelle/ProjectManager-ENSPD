const ModeleCommentaire = require('../models/Comment');
const db = require('../config/db');
const ModeleHistorique = require('../models/History');
const ModeleNotification = require('../models/Notification');

const ControllerCommentaire = {
    // Lire les commentaires d'une tâche
    commentairesDuneTache: async (requete, reponse) => {
        try {
            const idTache = requete.params.idTache;
            const commentaires = await ModeleCommentaire.recupererParTache(idTache);
            reponse.status(200).json(commentaires);
        } catch (erreur) {
            console.error("Erreur commentairesDuneTache: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors du chargement des commentaires." });
        }
    },

    // Ajouter un commentaire
    nouveauCommentaire: async (requete, reponse) => {
        try {
            const idTache = requete.params.idTache;
            const { contenu } = requete.body;
            const idUtilisateur = requete.utilisateur.id; // Issu du middleware authMiddleware

            if (!contenu || contenu.trim() === '') {
                return reponse.status(400).json({ erreur: "Le contenu du commentaire est requis." });
            }

            const idCommentaire = await ModeleCommentaire.ajouter(idTache, idUtilisateur, contenu);

            // History and Notifications
            const [tacheInfo] = await db.execute(`
                SELECT t.titre, p.createur_id, p.id as projet_id
                FROM taches t
                JOIN projets p ON t.projet_id = p.id
                WHERE t.id = ?
            `, [idTache]);

            if (tacheInfo.length > 0) {
                const info = tacheInfo[0];
                const titreTache = info.titre;
                
                await ModeleHistorique.ajouter(idUtilisateur, `A commenté la tâche: ${titreTache}`, 'commentaire', idTache, contenu.substring(0, 100));
                
                const io = requete.app.get('io');
                
                if (idUtilisateur !== info.createur_id) {
                    await ModeleNotification.creer(info.createur_id, `Nouveau commentaire sur la tâche ${titreTache}`, 'commentaire', `/projects/${info.projet_id}`);
                    if (io) io.to(`user_${info.createur_id}`).emit('NOUVELLE_NOTIFICATION');
                }
                
                const [assignes] = await db.execute('SELECT utilisateur_id FROM tache_assignations WHERE tache_id = ?', [idTache]);
                for (let row of assignes) {
                    if (row.utilisateur_id !== idUtilisateur && row.utilisateur_id !== info.createur_id) {
                        await ModeleNotification.creer(row.utilisateur_id, `Nouveau commentaire sur la tâche ${titreTache}`, 'commentaire', `/projects/${info.projet_id}`);
                        if (io) io.to(`user_${row.utilisateur_id}`).emit('NOUVELLE_NOTIFICATION');
                    }
                }
            }

            reponse.status(201).json({ message: "Commentaire ajouté", idCommentaire });
        } catch (erreur) {
            console.error("Erreur nouveauCommentaire: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors de l'ajout du commentaire." });
        }
    }
};

module.exports = ControllerCommentaire;
