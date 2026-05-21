const db = require('./server/config/db');

async function executerMigration() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS \`commentaires\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`tache_id\` INT NOT NULL,
          \`utilisateur_id\` INT NOT NULL,
          \`contenu\` TEXT NOT NULL,
          \`date_creation\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (\`tache_id\`) REFERENCES \`taches\`(\`id\`) ON DELETE CASCADE,
          FOREIGN KEY (\`utilisateur_id\`) REFERENCES \`utilisateurs\`(\`id\`) ON DELETE CASCADE
        );
        `;
        await db.execute(query);

        try {
            await db.execute('ALTER TABLE projets ADD COLUMN date_echeance DATE DEFAULT NULL');
        } catch (e) { /* Ignore si existe déjà */ }
        
        try {
            await db.execute('ALTER TABLE projets ADD COLUMN fichier_cahier_charges VARCHAR(255) DEFAULT NULL');
        } catch (e) { /* Ignore */ }

        try {
            await db.execute('ALTER TABLE taches ADD COLUMN fichier_attache VARCHAR(255) DEFAULT NULL');
        } catch (e) { /* Ignore */ }

        console.log("Migration réussie : Table commentaires créée et colonnes ajoutées !");
        process.exit(0);
    } catch (e) {
        console.error("Erreur migration:", e);
        process.exit(1);
    }
}

executerMigration();
