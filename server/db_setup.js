const db = require('./config/db');

async function setup() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS \`notifications\` (
              \`id\` INT AUTO_INCREMENT PRIMARY KEY,
              \`utilisateur_id\` INT NOT NULL,
              \`message\` TEXT NOT NULL,
              \`type\` VARCHAR(50) NOT NULL,
              \`lien\` VARCHAR(255),
              \`lu\` BOOLEAN DEFAULT FALSE,
              \`date_creation\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (\`utilisateur_id\`) REFERENCES \`utilisateurs\`(\`id\`) ON DELETE CASCADE
            );
        `);
        console.log('Table notifications OK');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS \`historique_modifications\` (
              \`id\` INT AUTO_INCREMENT PRIMARY KEY,
              \`utilisateur_id\` INT NOT NULL,
              \`action\` VARCHAR(255) NOT NULL,
              \`entite_type\` VARCHAR(50) NOT NULL,
              \`entite_id\` INT NOT NULL,
              \`details\` TEXT,
              \`date_creation\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (\`utilisateur_id\`) REFERENCES \`utilisateurs\`(\`id\`) ON DELETE CASCADE
            );
        `);
        console.log('Table historique_modifications OK');

        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
setup();
