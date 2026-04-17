import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';
import { LogOut, LayoutDashboard, PlusCircle, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NavBar = () => {
    const { utilisateur, deconnexion } = useContext(AuthContext);
    const navigate = useNavigate();

    const gererDeconnexion = () => {
        deconnexion();
        navigate('/connexion');
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <FolderKanban className="h-6 w-6 text-red-600" />
                    <span className="text-xl font-bold tracking-tight text-blue-900">ProjetExamen</span>
                </div>
                
                <div className="flex items-center gap-6">
                    <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-blue-600 transition-colors">
                        <LayoutDashboard className="h-4 w-4" />
                        Tableau de bord
                    </Link>
                    <Link to="/nouveau-projet">
                        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2 shadow-red-500/20 shadow-md transition-all hover:-translate-y-0.5">
                            <PlusCircle className="h-4 w-4" />
                            Nouveau Projet
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-blue-900">
                        Hello, <span className="font-bold">{utilisateur?.nom || 'Membre'}</span>
                    </span>
                    <Button variant="ghost" size="sm" onClick={gererDeconnexion} className="text-neutral-500 hover:text-red-600 hover:bg-red-50 gap-2">
                        <LogOut className="h-4 w-4" />
                        Quitter
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
