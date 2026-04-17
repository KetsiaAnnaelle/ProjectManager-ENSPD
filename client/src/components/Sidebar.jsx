import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FolderKanban, LayoutDashboard, CheckSquare, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../store/ThemeContext';

const Sidebar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const navItems = [
        { path: '/dashboard', nom: 'Tableau de bord', icone: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/projets', nom: 'Gestion des Projets', icone: <FolderKanban className="w-5 h-5" /> },
        { path: '/taches', nom: 'Gestion des Tâches', icone: <CheckSquare className="w-5 h-5" /> }
    ];

    return (
        <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col h-screen sticky top-0 border-r border-blue-800 shadow-xl z-50 transition-colors duration-300 dark:bg-neutral-950 dark:border-neutral-900">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-blue-800 dark:border-neutral-800 bg-blue-950/30 dark:bg-neutral-900/50">
                <FolderKanban className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-xl font-bold tracking-tight">ProjetManager</span>
            </div>

            {/* Navigation Menus */}
            <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
                <div className="px-3 mb-2 text-xs font-semibold text-blue-300/70 dark:text-neutral-500 uppercase tracking-wider">
                    Menu Principal
                </div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                                isActive 
                                ? 'bg-blue-600 text-white shadow-md dark:bg-blue-800' 
                                : 'text-blue-100 hover:bg-blue-800/50 hover:text-white dark:text-neutral-400 dark:hover:bg-neutral-900'
                            }`
                        }
                    >
                        {item.icone}
                        {item.nom}
                    </NavLink>
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-blue-800 dark:border-neutral-800">
                <button 
                    onClick={toggleTheme}
                    className="flex items-center justify-between w-full p-3 rounded-lg bg-blue-950/50 hover:bg-blue-800/50 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-blue-200 dark:text-neutral-300 transition-colors"
                >
                    <div className="flex items-center gap-3 text-sm font-medium">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                        Apparence
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-black/20 rounded shadow-inner">
                        {theme === 'dark' ? 'Sombre' : 'Clair'}
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
