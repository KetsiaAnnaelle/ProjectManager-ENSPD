const baseDeDonnees = require('../config/db');

// Objet pour interagir avec les Tâches
const ModeleTache = {
    // Obtenir toutes les tâches d'un projet ciblé
    recupererPourProjet: async (idProjet) => {
        // On récupère les tâches et on y joint le nom de la personne assignée
        const requeteSql = `
            SELECT taches.*, utilisateurs.nom AS nom_assigne 
            FROM taches 
            LEFT JOIN utilisateurs ON taches.assigne_a = utilisateurs.id
            WHERE projet_id = ?
            ORDER BY taches.date_creation DESC
        `;
        const [lignes] = await baseDeDonnees.execute(requeteSql, [idProjet]);
        return lignes;
    },

    // Ajouter une nouvelle tâche à un projet
    creer: async (idProjet, titre, description, assigneA, statut, echeance) => {
        // Si aucune personne n'est assignée (chaîne vide), on met null dans la bd
        const cible = assigneA ? assigneA : null;
        
        const requeteSql = 'INSERT INTO taches (projet_id, titre, description, assigne_a, statut, echeance) VALUES (?, ?, ?, ?, ?, ?)';
        const [resultat] = await baseDeDonnees.execute(requeteSql, [idProjet, titre, description, cible, statut, echeance]);
        return resultat.insertId;
    },

    // Modifier seulement le statut d'une tâche
    changerStatut: async (idTache, nouveauStatut) => {
        const requeteSql = 'UPDATE taches SET statut = ? WHERE id = ?';
        await baseDeDonnees.execute(requeteSql, [nouveauStatut, idTache]);
    }
};

module.exports = ModeleTache;
