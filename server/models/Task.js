const baseDeDonnees = require('../config/db');

// Objet pour interagir avec les Tâches
const ModeleTache = {
    // Obtenir toutes les tâches d'un projet ciblé avec leurs multiples assignations
    recupererPourProjet: async (idProjet) => {
        // Obtenir d'abord les tâches
        const requeteSqlTaches = 'SELECT * FROM taches WHERE projet_id = ? ORDER BY date_creation DESC';
        const [taches] = await baseDeDonnees.execute(requeteSqlTaches, [idProjet]);
        
        if (taches.length === 0) return [];

        // Obtenir toutes les assignations pour ces tâches
        const idsTaches = taches.map(t => t.id);
        const requeteSqlAssignations = `
            SELECT ta.tache_id, u.id, u.nom, u.email 
            FROM tache_assignations ta 
            JOIN utilisateurs u ON ta.utilisateur_id = u.id 
            WHERE ta.tache_id IN (${idsTaches.join(',')})
        `;
        const [assignations] = await baseDeDonnees.execute(requeteSqlAssignations);

        // Fusionner les données
        const tachesAvecAssignes = taches.map(tache => {
            tache.assignes = assignations
                .filter(a => a.tache_id === tache.id)
                .map(a => ({ id: a.id, nom: a.nom, email: a.email }));
            return tache;
        });

        return tachesAvecAssignes;
    },

    // Ajouter une nouvelle tâche à un projet et créer ses assignations
    creer: async (idProjet, titre, description, tableauAssignations, statut, echeance) => {
        const dateEcheance = echeance ? echeance : null;
        const descValid = description ? description : null;
        const requeteSql = 'INSERT INTO taches (projet_id, titre, description, statut, echeance) VALUES (?, ?, ?, ?, ?)';
        const [resultat] = await baseDeDonnees.execute(requeteSql, [idProjet, titre, descValid, statut, dateEcheance]);
        const idNouvelleTache = resultat.insertId;

        // Gérer les multiples assignations
        if (tableauAssignations && Array.isArray(tableauAssignations) && tableauAssignations.length > 0) {
            // Création dynamique des (valeurs) pour INSERT
            const placeHolders = tableauAssignations.map(() => '(?, ?)').join(', ');
            const params = tableauAssignations.flatMap(idUtilisateur => [idNouvelleTache, idUtilisateur]);
            
            const requeteAssignation = `INSERT INTO tache_assignations (tache_id, utilisateur_id) VALUES ${placeHolders}`;
            await baseDeDonnees.execute(requeteAssignation, params);
        }

        return idNouvelleTache;
    },

    // Modifier seulement le statut d'une tâche
    changerStatut: async (idTache, nouveauStatut) => {
        const requeteSql = 'UPDATE taches SET statut = ? WHERE id = ?';
        await baseDeDonnees.execute(requeteSql, [nouveauStatut, idTache]);
    }
};

module.exports = ModeleTache;
