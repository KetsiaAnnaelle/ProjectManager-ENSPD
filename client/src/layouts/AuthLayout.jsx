import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import { AuthContext } from '../store/AuthContext';

const AuthLayout = () => {
    const { utilisateur, chargement } = useContext(AuthContext);

    if (chargement) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-900 dark:text-white">Chargement du tableau de bord...</div>;
    
    if (!utilisateur) return <Navigate to="/connexion" />;

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-neutral-900 transition-colors duration-300">
            {/* Sidebar Fixe (cachée sur petit écran, gérée par ses propres classes) */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Navbar Fixe en haut de la zone de contenu */}
                <NavBar />
                
                {/* Zone de contenu défilable */}
                <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
