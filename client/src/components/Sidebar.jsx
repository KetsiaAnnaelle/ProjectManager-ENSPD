import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FolderKanban, LayoutDashboard, CheckSquare, Sun, Moon, Menu, X } from 'lucide-react';
import { ThemeContext } from '../store/ThemeContext';

const Sidebar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Fermer le menu mobile lors du changement de route
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    // Empêcher le scroll du body quand le menu mobile est ouvert
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const navItems = [
        { path: '/dashboard', nom: 'Tableau de bord', icone: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/projets', nom: 'Gestion des Projets', icone: <FolderKanban className="w-5 h-5" /> },
        { path: '/taches', nom: 'Gestion des Tâches', icone: <CheckSquare className="w-5 h-5" /> }
    ];

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-blue-800 dark:border-blue-900 bg-blue-900 dark:bg-gray-900 flex-shrink-0">
                <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center mr-3">
                    <FolderKanban className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">ProjetManager</span>
            </div>

            {/* Navigation Menus */}
            <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
                <div className="px-3 mb-2 text-xs font-semibold text-blue-300 dark:text-blue-400 uppercase tracking-wider">
                    Menu Principal
                </div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                                isActive 
                                ? 'bg-red-600 text-white shadow-lg' 
                                : 'text-blue-100 hover:bg-blue-800 hover:text-white dark:text-gray-300 dark:hover:bg-gray-800'
                            }`
                        }
                    >
                        {item.icone}
                        <span>{item.nom}</span>
                        {({ isActive }) => isActive && (
                            <div className="ml-auto w-1 h-6 rounded-full bg-white" />
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-blue-800 dark:border-blue-900 flex-shrink-0">
                <button 
                    onClick={toggleTheme}
                    className="flex items-center justify-between w-full p-3 rounded-lg bg-blue-800 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-blue-100 dark:text-gray-300 transition-colors"
                >
                    <div className="flex items-center gap-3 text-sm font-medium">
                        {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        <span>Apparence</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-black/20 rounded">
                        {theme === 'dark' ? 'Sombre' : 'Clair'}
                    </span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Barre de navigation mobile (offcanvas trigger) */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-blue-900 dark:bg-gray-900 border-b border-blue-800 dark:border-blue-900">
                <div className="flex items-center justify-between px-4 h-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center">
                            <FolderKanban className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">ProjetManager</span>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 rounded-lg text-blue-100 hover:bg-blue-800 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Ouvrir le menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Overlay pour mobile */}
            {mobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Fermer le menu"
                />
            )}

            {/* Sidebar Desktop */}
            <aside className="hidden md:flex w-64 bg-blue-900 dark:bg-gray-900 text-white flex-col h-screen sticky top-0 border-r border-blue-800 dark:border-blue-900 shadow-xl z-40 transition-colors duration-300">
                <SidebarContent />
            </aside>

            {/* Offcanvas Menu Mobile */}
            <div className={`
                md:hidden fixed top-0 left-0 bottom-0 w-80 bg-blue-900 dark:bg-gray-900
                transform transition-transform duration-300 ease-in-out z-50
                flex flex-col shadow-2xl border-r border-blue-800 dark:border-blue-900
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* En-tête du menu mobile */}
                <div className="flex items-center justify-between p-4 border-b border-blue-800 dark:border-blue-900">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center">
                            <FolderKanban className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">Menu</span>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-lg text-blue-100 hover:bg-blue-800 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Fermer le menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Contenu du menu mobile */}
                <div className="flex-1 overflow-y-auto">
                    <div className="py-4 px-3">
                        <div className="px-3 mb-2 text-xs font-semibold text-blue-300 dark:text-blue-400 uppercase tracking-wider">
                            Menu Principal
                        </div>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) => 
                                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 font-medium mb-1 ${
                                        isActive 
                                        ? 'bg-red-600 text-white shadow-lg' 
                                        : 'text-blue-100 hover:bg-blue-800 hover:text-white dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`
                                }
                            >
                                {item.icone}
                                <span>{item.nom}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Bouton thème dans le menu mobile */}
                <div className="p-4 border-t border-blue-800 dark:border-blue-900">
                    <button 
                        onClick={() => {
                            toggleTheme();
                            setMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-between w-full p-3 rounded-lg bg-blue-800 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-blue-100 dark:text-gray-300 transition-colors"
                    >
                        <div className="flex items-center gap-3 text-sm font-medium">
                            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            <span>Apparence</span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-black/20 rounded">
                            {theme === 'dark' ? 'Sombre' : 'Clair'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Espace pour le contenu principal sur mobile (à cause de la navbar fixe) */}
            <div className="md:hidden h-16" />
        </>
    );
};

export default Sidebar;