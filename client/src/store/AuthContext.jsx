import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // On importe notre outil pour parler au serveur

// Création d'un Context : c'est un "magasin" global où on garde l'état de connexion
// Ainsi, n'importe quelle page peut savoir si on est connecté ou pas.
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null); // Les infos du profil courant
  const [chargement, setChargement] = useState(true);   // Pour afficher un "chargement" le temps de vérifier

  // Au lancement de l'application, on vérifie si on a déjà un token sauvegardé
  useEffect(() => {
    const verifierConnexion = async () => {
      const token = localStorage.getItem('token_projet_examen');
      if (token) {
        try {
          // On demande au serveur "Qui suis-je ?" avec le token
          const reponse = await api.get('/auth/profil');
          setUtilisateur(reponse.data); // On sauvegarde notre profil
        } catch (erreur) {
          console.error("Token invalide ou expiré");
          localStorage.removeItem('token_projet_examen'); // On nettoie si le token est périmé
        }
      }
      setChargement(false); // Fin du chargement initial
    };

    verifierConnexion();
  }, []);

  // Fonction pour se connecter
  const connexion = (token, profilUtilisateur) => {
    localStorage.setItem('token_projet_examen', token); // On sauvegarde le ticket
    setUtilisateur(profilUtilisateur); // On met à jour l'interface
  };

  // Fonction pour se déconnecter
  const deconnexion = () => {
    localStorage.removeItem('token_projet_examen');
    setUtilisateur(null);
  };

  return (
    <AuthContext.Provider value={{ utilisateur, chargement, connexion, deconnexion }}>
      {children}
    </AuthContext.Provider>
  );
};
