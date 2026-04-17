const jwt = require('jsonwebtoken');

// Ce middleware protège les routes : seuls les utilisateurs connectés (avec un token valide) peuvent passer
const protegerRoute = (requete, reponse, suite) => {
    // On cherche le token dans l'en-tête de la requête (Format attendu: "Bearer <token>")
    const enTeteAuth = requete.header('Authorization');

    // Si on ne trouve pas de token
    if (!enTeteAuth) {
        return reponse.status(401).json({ erreur: "Accès refusé. Aucun token fourni (vous devez être connecté)." });
    }

    try {
        // On extrait le token (on enlève le mot "Bearer ")
        const token = enTeteAuth.split(' ')[1];
        
        // On vérifie si le token est valide avec notre mot de passe secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // On sauvegarde les informations de l'utilisateur dans la requête pour les utiliser plus tard
        requete.utilisateur = decoded;
        
        // On permet de continuer à la fonction suivante (le controller)
        suite();
    } catch (erreur) {
        // En cas de token invalide ou expiré
        reponse.status(400).json({ erreur: "Token invalide ou expiré." });
    }
};

module.exports = { protegerRoute };
