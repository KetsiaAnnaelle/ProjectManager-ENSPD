import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';
import { LogOut, User, FolderKanban } from 'lucide-react';

const NavBar = () => {
    const { utilisateur, deconnexion } = useContext(AuthContext);
    const navigate = useNavigate();

    const gererDeconnexion = () => {
        deconnexion();
        navigate('/connexion');
    };

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md shadow-sm h-16">
            <div className="flex h-full items-center justify-between px-4 sm:px-6">
                
                {/* Espace gauche pour alignement avec la sidebar (Logo mobile si besoin) */}
                <div className="flex items-center md:hidden gap-2">
                    <FolderKanban className="h-6 w-6 text-blue-600" />
                    <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">PM</span>
                </div>
                <div className="hidden md:block"></div>

                {/* Profil utilisateur à droite */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 py-1.5 px-3 rounded-full border border-neutral-200 dark:border-neutral-700">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-inner">
                            <User className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mr-2">
                            {utilisateur?.nom || 'Membre'}
                        </span>
                    </div>
                    
                    <button 
                        onClick={gererDeconnexion} 
                        className="text-neutral-500 hover:text-red-600 dark:hover:text-red-500 transition-colors p-2"
                        title="Se déconnecter"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
