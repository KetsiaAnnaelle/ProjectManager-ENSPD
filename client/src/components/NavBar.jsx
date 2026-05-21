import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';
import { LogOut, User, FolderKanban, Bell, Check } from 'lucide-react';
import api from '../services/api';
import io from 'socket.io-client';

const NavBar = () => {
    const { utilisateur, deconnexion } = useContext(AuthContext);
    const navigate = useNavigate();

    const gererDeconnexion = () => {
        deconnexion();
        navigate('/connexion');
    };

    const [notifications, setNotifications] = useState([]);
    const [afficherNotifs, setAfficherNotifs] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if(utilisateur?.id) {
            const fetchNotifs = async () => {
                try {
                    const res = await api.get('/notifications');
                    setNotifications(res.data);
                } catch(e) { console.error(e) }
            };
            fetchNotifs();

            const URL_APIURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const socket = io(URL_APIURL.replace('/api', '')); // just host
            
            socket.emit('login', utilisateur.id);
            socket.on('NOUVELLE_NOTIFICATION', () => {
                 fetchNotifs();
            });
            
            return () => socket.disconnect();
        }
    }, [utilisateur]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setAfficherNotifs(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const nonLues = notifications.filter(n => !n.lu).length;

    const lireNotif = async (id) => {
        try {
            await api.patch(`/notifications/${id}/lire`);
            setNotifications(notifications.map(n => n.id === id ? {...n, lu: true} : n));
        } catch(e) { console.error(e) }
    };

    const lireTout = async () => {
        try {
            await api.patch('/notifications/lire-tout');
            setNotifications(notifications.map(n => ({...n, lu: true})));
        } catch(e) { console.error(e) }
    };

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md shadow-sm h-16">
            <div className="flex h-full items-center justify-between px-4 sm:px-6">
                
                {/* Espace gauche pour alignement avec la sidebar (Logo mobile si besoin) */}
                <div className="flex items-center md:hidden gap-2">
                    <img src='/images/IMG_0806.jpeg' className="h-12 w-12" />
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

                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setAfficherNotifs(!afficherNotifs)}
                            className="relative p-2 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                            title="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                            {nonLues > 0 && (
                                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-neutral-950"></span>
                            )}
                        </button>

                        {afficherNotifs && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden py-2 z-50">
                                <div className="px-4 py-2 flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800">
                                    <h3 className="font-semibold text-sm text-neutral-800 dark:text-white">Notifications</h3>
                                    {nonLues > 0 && (
                                        <button onClick={lireTout} className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium">
                                            Tout marquer comme lu
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="px-4 py-6 text-center text-sm text-neutral-500">Aucune notification</div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div 
                                                key={notif.id} 
                                                onClick={() => lireNotif(notif.id)}
                                                className={`px-4 py-3 border-b border-neutral-50 dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${!notif.lu ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                            >
                                                <p className={`text-sm ${!notif.lu ? 'font-medium text-neutral-900 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-400'}`}>
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    {new Date(notif.date_creation).toLocaleString('fr-FR')}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
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
