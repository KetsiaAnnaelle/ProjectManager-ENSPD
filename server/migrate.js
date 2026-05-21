require('dotenv').config();
const db = require('./config/db');

async function executerMigration() {
    try {
        const queryAssignations = `
        CREATE TABLE IF NOT EXISTS \`tache_assignations\` (
          \`tache_id\` INT NOT NULL,
          \`utilisateur_id\` INT NOT NULL,
          PRIMARY KEY (\`tache_id\`, \`utilisateur_id\`),
          FOREIGN KEY (\`tache_id\`) REFERENCES \`taches\`(\`id\`) ON DELETE CASCADE,
          FOREIGN KEY (\`utilisateur_id\`) REFERENCES \`utilisateurs\`(\`id\`) ON DELETE CASCADE
        );
        `;
        await db.execute(queryAssignations);
        console.log("Migration réussie : Table tache_assignations créée !");

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
        console.log("Migration réussie : Table commentaires créée !");

        try {
            await db.execute("ALTER TABLE `projets` ADD COLUMN `cahier_charges_url` VARCHAR(255) NULL;");
            console.log("Migration: Colonne cahier_charges_url ajoutée à projets");
        } catch(err) {
            if(err.code !== 'ER_DUP_FIELDNAME') {
                 console.log("Info: Colonne cahier_charges_url existe peut-être déjà ou erreur:", err.message);
            } else {
                 console.log("Info: Colonne cahier_charges_url existe déjà.");
            }
        }

        const queryFichiers = `
        CREATE TABLE IF NOT EXISTS \`tache_fichiers\` (
          \`id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`tache_id\` INT NOT NULL,
          \`utilisateur_id\` INT NOT NULL,
          \`nom_fichier\` VARCHAR(255) NOT NULL,
          \`fichier_url\` VARCHAR(255) NOT NULL,
          \`date_ajout\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (\`tache_id\`) REFERENCES \`taches\`(\`id\`) ON DELETE CASCADE,
          FOREIGN KEY (\`utilisateur_id\`) REFERENCES \`utilisateurs\`(\`id\`) ON DELETE CASCADE
        );
        `;
        await db.execute(queryFichiers);
        console.log("Migration réussie : Table tache_fichiers créée !");
        
        process.exit(0);
    } catch (e) {
        console.error("Erreur migration:", e);
        process.exit(1);
    }
}

executerMigration();
