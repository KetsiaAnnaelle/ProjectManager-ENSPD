import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, CircleDashed, Filter } from 'lucide-react';

const GlobalTasks = () => {
    const [taches, setTaches] = useState([]);
    const [ chargement, setChargement ] = useState(true);
    const [filtreStatut, setFiltreStatut] = useState('Tous');

    useEffect(() => {
        const fetchTaches = async () => {
            try {
                // Endpoint que nous créerons dans le backend
                const response = await api.get('/taches/liste/toutes');
                setTaches(response.data);
            } catch (error) {
                console.error("Erreur chargement des tâches :", error);
            } finally {
                setChargement(false);
            }
        };
        fetchTaches();
    }, []);

    const tachesFiltrees = taches.filter(t => filtreStatut === 'Tous' || t.statut === filtreStatut);

    const changerStatut = async (idTache, nouveauStatut) => {
        try {
            await api.patch(`/taches/${idTache}/statut`, { statut: nouveauStatut });
            setTaches(taches.map(t => t.id === idTache ? { ...t, statut: nouveauStatut } : t));
        } catch (erreur) {
            console.error("Erreur mise à jour statut", erreur);
        }
    };

    const StatusBadge = ({ statut }) => {
        if (statut === 'Terminé') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 shadow-sm"><CheckCircle2 className="w-3.5 h-3.5" /> Terminé</span>;
        if (statut === 'En cours') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 shadow-sm"><Clock className="w-3.5 h-3.5" /> En cours</span>;
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 shadow-sm"><CircleDashed className="w-3.5 h-3.5" /> À faire</span>;
    };

    if (chargement) {
        return <div className="flex h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Gestion des tâches</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        Consultez et gérez l'ensemble des tâches qui vous sont assignées.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <Filter className="h-5 w-5 text-neutral-400 ml-2" />
                    <select 
                        value={filtreStatut} 
                        onChange={(e) => setFiltreStatut(e.target.value)}
                        className="bg-transparent border-none text-sm font-medium focus:ring-0 dark:text-white"
                    >
                        <option value="Tous">Tous les statuts</option>
                        <option value="À faire">À faire</option>
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                    </select>
                </div>
            </div>

            {tachesFiltrees.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-dashed rounded-2xl shadow-sm">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-neutral-300" />
                    <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">Aucune tâche trouvée</h3>
                    <p className="mt-2 text-sm text-neutral-500">Vous êtes à jour dans votre travail.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tachesFiltrees.map((tache) => (
                        <Card key={tache.id} className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                            <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-3">
                                        <StatusBadge statut={tache.statut} />
                                        <span className={`text-lg font-bold ${tache.statut === 'Terminé' ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-800 dark:text-neutral-100'}`}>
                                            {tache.titre}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                        {tache.description || "Aucune description fournie."}
                                    </p>
                                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 inline-block px-2.5 py-1 rounded">
                                        Projet: {tache.nom_projet || "Projet associé"}
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-neutral-100 dark:border-neutral-800 pt-4 md:pt-0 md:pl-4">
                                    {tache.statut !== 'À faire' && (
                                        <button onClick={() => changerStatut(tache.id, 'À faire')} className="px-3 py-1.5 text-sm font-medium border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors w-full">À faire</button>
                                    )}
                                    {tache.statut !== 'En cours' && (
                                        <button onClick={() => changerStatut(tache.id, 'En cours')} className="px-3 py-1.5 text-sm font-medium border border-amber-200 bg-amber-50 text-amber-700 rounded-md hover:bg-amber-100 transition-colors w-full">En cours</button>
                                    )}
                                    {tache.statut !== 'Terminé' && (
                                        <button onClick={() => changerStatut(tache.id, 'Terminé')} className="px-3 py-1.5 text-sm font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors w-full">Terminer</button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GlobalTasks;
