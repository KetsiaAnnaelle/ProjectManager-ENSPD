import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './store/AuthContext';
import { ThemeProvider } from './store/ThemeContext';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
import AuthLayout from './layouts/AuthLayout';
import Overview from './pages/Overview';
import Projects from './pages/Projects';
import GlobalTasks from './pages/GlobalTasks';
import AddProject from './pages/AddProject';
import ProjectDetails from './pages/ProjectDetails';

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route par défaut : on affiche la Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

          {/* Les pages protégées qui utilisent le nouveau Layout complet avec Sidebar */}
          <Route element={<AuthLayout />}>
             <Route path="/dashboard" element={<Overview />} />
             <Route path="/projets" element={<Projects />} />
             <Route path="/taches" element={<GlobalTasks />} />
             <Route path="/nouveau-projet" element={<AddProject />} />
             <Route path="/projets/:id" element={<ProjectDetails />} />
          </Route>

        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
