const ModeleUtilisateur = require('../models/User');

const ControllerUtilisateur = {
    // Obtenir la liste de tous les utilisateurs (pour assigner les tâches)
    recupererTous: async (requete, reponse) => {
        try {
            const requeteSql = 'SELECT id, email, nom, role FROM utilisateurs ORDER BY nom ASC';
            const baseDeDonnees = require('../config/db');
            const [lignes] = await baseDeDonnees.execute(requeteSql);
            
            reponse.status(200).json(lignes);
        } catch (erreur) {
            console.error("Erreur recupererTous utilisateurs: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors de la récupération des utilisateurs." });
        }
    },

    // Obtenir les statistiques du tableau de bord
    recupererStats: async (requete, reponse) => {
        try {
            const utilisateurId = requete.utilisateur.id;
            const baseDeDonnees = require('../config/db');

            // 1. Projets dispos
            const [reqProjets] = await baseDeDonnees.execute('SELECT COUNT(*) as nb FROM projets');
            const projetsDispos = reqProjets[0].nb;

            // 2. Tâches assignées
            const [reqTaches] = await baseDeDonnees.execute('SELECT COUNT(*) as nb FROM tache_assignations WHERE utilisateur_id = ?', [utilisateurId]);
            const tachesAssignees = reqTaches[0].nb;

            // 3. Tâches accomplies
            const [reqEffectuees] = await baseDeDonnees.execute('SELECT COUNT(*) as nb FROM taches t JOIN tache_assignations ta ON t.id = ta.tache_id WHERE ta.utilisateur_id = ? AND t.statut = "Terminé"', [utilisateurId]);
            const tachesEffectuees = reqEffectuees[0].nb;

            // 4. Collaborateurs (utilisateurs travaillant sur les mêmes tâches/projets)
            // On compte les autres utilisateurs assignés aux mêmes projets.
            // Simplified: select count distinct of users in the system (for MVP) or those related.
            const [reqCollabs] = await baseDeDonnees.execute('SELECT COUNT(DISTINCT utilisateur_id) as nb FROM tache_assignations WHERE tache_id IN (SELECT tache_id FROM tache_assignations WHERE utilisateur_id = ?) AND utilisateur_id != ?', [utilisateurId, utilisateurId]);
            const collaborateurs = reqCollabs[0].nb;

            reponse.status(200).json({
                projetsDispos,
                tachesAssignees,
                tachesEffectuees,
                collaborateurs
            });
        } catch (erreur) {
            console.error("Erreur recupererStats: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors de la récupération des statistiques." });
        }
    }
};

module.exports = ControllerUtilisateur;
