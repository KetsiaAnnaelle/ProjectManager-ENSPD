import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './store/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddProject from './pages/AddProject';
import ProjectDetails from './pages/ProjectDetails';

// Composant pour protéger les routes (ex: empêcher d'aller au dashboard si non connecté)
const RouteProtegee = ({ children }) => {
  const { utilisateur, chargement } = React.useContext(AuthContext);

  if (chargement) return <div>Chargement de l'application...</div>;
  
  // Si pas d'utilisateur, on redirige vers la page de connexion
  if (!utilisateur) return <Navigate to="/connexion" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route par défaut : on affiche la Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

          {/* Les pages ci-dessous sont protégées, on ne peut pas les voir si on n'est pas connecté */}
          <Route 
            path="/dashboard" 
            element={
               <RouteProtegee>
                <Dashboard />
               </RouteProtegee>
            } 
          />

          <Route 
            path="/nouveau-projet" 
            element={
              <RouteProtegee>
                 <AddProject />
              </RouteProtegee>
            } 
          />

          <Route 
            path="/projets/:id" 
            element={
              <RouteProtegee>
                <ProjectDetails />
              </RouteProtegee>
            } 
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
