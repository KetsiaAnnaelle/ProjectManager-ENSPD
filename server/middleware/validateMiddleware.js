const { validationResult } = require('express-validator');

// Ce middleware gère l'affichage des erreurs venant de express-validator
const verifierValidation = (requete, reponse, suite) => {
    // On collecte les éventuelles erreurs trouvées par la validation
    const erreurs = validationResult(requete);
    
    // S'il y a des erreurs (par exemple un email mal écrit ou un mot de passe trop court)
    if (!erreurs.isEmpty()) {
        // On renvoie une erreur 400 (Mauvaise requête) avec la liste des soucis
        return reponse.status(400).json({ erreurs: erreurs.array() });
    }
    
    // Si tout va bien, on passe à l'étape suivante (le controller)
    suite();
};

module.exports = { verifierValidation };
