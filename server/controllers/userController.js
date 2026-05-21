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
            const role = requete.utilisateur.role;
            const baseDeDonnees = require('../config/db');

            let projetsDispos, tachesAssignees, tachesEffectuees, collaborateurs;

            if (role === 'admin') {
                const [reqP] = await baseDeDonnees.execute('SELECT COUNT(*) as nb FROM projets');
                projetsDispos = reqP[0].nb;
                const [reqT] = await baseDeDonnees.execute('SELECT COUNT(*) as nb FROM tache_assignations');
                tachesAssignees = reqT[0].nb;
                const [reqE] = await baseDeDonnees.execute('SELECT COUNT(*) as nb FROM taches WHERE statut = "Terminé"');
                tachesEffectuees = reqE[0].nb;
                const [reqC] = await baseDeDonnees.execute('SELECT COUNT(DISTINCT utilisateur_id) as nb FROM tache_assignations');
                collaborateurs = reqC[0].nb;

                const [projets] = await baseDeDonnees.execute(`SELECT p.*, u.nom as createur FROM projets p JOIN utilisateurs u ON p.createur_id = u.id ORDER BY p.date_creation DESC LIMIT 10`);
                
                const [tachesAssigneesList] = await baseDeDonnees.execute(`
                    SELECT t.titre, t.statut, t.echeance, u.nom as assigne, p.titre as projet, p.id as projet_id
                    FROM taches t
                    JOIN tache_assignations ta ON t.id = ta.tache_id
                    JOIN utilisateurs u ON ta.utilisateur_id = u.id
                    JOIN projets p ON t.projet_id = p.id
                    ORDER BY t.date_creation DESC
                    LIMIT 20
                `);

                const [membresPerformants] = await baseDeDonnees.execute(`
                    SELECT u.nom, COUNT(t.id) as taches_accomplies
                    FROM utilisateurs u
                    JOIN tache_assignations ta ON u.id = ta.utilisateur_id
                    JOIN taches t ON ta.tache_id = t.id
                    WHERE t.statut = 'Terminé'
                    GROUP BY u.id
                    ORDER BY taches_accomplies DESC
                `);

                return reponse.status(200).json({
                    projetsDispos, tachesAssignees, tachesEffectuees, collaborateurs,
                    adminData: {
                        derniersProjets: projets,
                        tachesEtAssignes: tachesAssigneesList,
                        membresPerformants: membresPerformants
                    }
                });
            } else {
                const [reqProjets] = await baseDeDonnees.execute('SELECT COUNT(*) as nb FROM projets');
                projetsDispos = reqProjets[0].nb;
                const [reqTaches] = await baseDeDonnees.execute('SELECT COUNT(*) as nb FROM tache_assignations WHERE utilisateur_id = ?', [utilisateurId]);
                tachesAssignees = reqTaches[0].nb;
                const [reqEffectuees] = await baseDeDonnees.execute('SELECT COUNT(*) as nb FROM taches t JOIN tache_assignations ta ON t.id = ta.tache_id WHERE ta.utilisateur_id = ? AND t.statut = "Terminé"', [utilisateurId]);
                tachesEffectuees = reqEffectuees[0].nb;
                const [reqCollabs] = await baseDeDonnees.execute('SELECT COUNT(DISTINCT utilisateur_id) as nb FROM tache_assignations WHERE tache_id IN (SELECT tache_id FROM tache_assignations WHERE utilisateur_id = ?) AND utilisateur_id != ?', [utilisateurId, utilisateurId]);
                collaborateurs = reqCollabs[0].nb;

                return reponse.status(200).json({
                    projetsDispos, tachesAssignees, tachesEffectuees, collaborateurs
                });
            }
        } catch (erreur) {
            console.error("Erreur recupererStats: ", erreur);
            reponse.status(500).json({ erreur: "Erreur lors de la récupération des statistiques." });
        }
    }
};

module.exports = ControllerUtilisateur;
