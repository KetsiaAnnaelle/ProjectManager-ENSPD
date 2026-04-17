import axios from 'axios';

// On configure axios pour qu'il sache où joindre notre backend Express
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // L'adresse de notre backend
});

// Middleware pour automatiser l'envoi du token (ticket de sécurité)
// A chaque fois qu'on fait une requête vers le backend, cette fonction s'exécute
api.interceptors.request.use((config) => {
  // On essaye de récupérer le token sauvegardé dans le navigateur de l'utilisateur
  const token = localStorage.getItem('token_projet_examen');
  
  if (token) {
    // Si on a le token, on l'attache à la requête comme une carte d'identité
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;
