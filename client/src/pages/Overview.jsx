import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../store/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, CheckSquare, Users, TrendingUp, History, ListTodo } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const Overview = () => {
    const { utilisateur } = useContext(AuthContext);
    const [stats, setStats] = useState({
        projetsDispos: 0,
        tachesAssignees: 0,
        tachesEffectuees: 0,
        collaborateurs: 0
    });
    const [adminData, setAdminData] = useState(null);
    const [historique, setHistorique] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/utilisateurs/stats');
                setStats({
                    projetsDispos: response.data.projetsDispos,
                    tachesAssignees: response.data.tachesAssignees,
                    tachesEffectuees: response.data.tachesEffectuees,
                    collaborateurs: response.data.collaborateurs
                });
                if (response.data.adminData) {
                    setAdminData(response.data.adminData);
                }
                
                if (utilisateur?.role === 'admin') {
                    const resHist = await api.get('/historique');
                    setHistorique(resHist.data);
                }
            } catch (error) {
                console.error("Erreur chargement statistiques :", error);
            } finally {
                setChargement(false);
            }
        };
        fetchStats();
    }, [utilisateur]);

    const statCards = [
        {
            titre: "Projets disponibles",
            valeur: stats.projetsDispos,
            icone: <FolderKanban className="w-8 h-8 text-blue-500" />,
            couleurTexte: "text-blue-600",
            couleurFond: "bg-blue-50 dark:bg-blue-500/10"
        },
        {
            titre: "Tâches assignées",
            valeur: stats.tachesAssignees,
            icone: <CheckSquare className="w-8 h-8 text-indigo-500" />,
            couleurTexte: "text-indigo-600",
            couleurFond: "bg-indigo-50 dark:bg-indigo-500/10"
        },
        {
            titre: "Tâches accomplies",
            valeur: stats.tachesEffectuees,
            icone: <TrendingUp className="w-8 h-8 text-emerald-500" />,
            couleurTexte: "text-emerald-600",
            couleurFond: "bg-emerald-50 dark:bg-emerald-500/10"
        },
        {
            titre: "Collaborateurs",
            valeur: stats.collaborateurs,
            icone: <Users className="w-8 h-8 text-amber-500" />,
            couleurTexte: "text-amber-600",
            couleurFond: "bg-amber-50 dark:bg-amber-500/10"
        }
    ];

    if (chargement) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Vue d'ensemble</h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                    Bienvenue, voici un résumé de votre activité sur ProjetManager.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <Card key={idx} className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                    {stat.titre}
                                </p>
                                <h3 className={`text-4xl font-extrabold ${stat.couleurTexte} dark:text-white`}>
                                    {stat.valeur}
                                </h3>
                            </div>
                            <div className={`${stat.couleurFond} p-4 rounded-2xl`}>
                                {stat.icone}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <Card className={`border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm ${utilisateur?.role === 'admin' ? '' : 'col-span-1 lg:col-span-2'}`}>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-800 dark:text-neutral-100">Aperçu Ratios des Tâches</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Toutes les Tâches', Assignées: stats.tachesAssignees, Accomplies: stats.tachesEffectuees }
                            ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#888" />
                                <YAxis axisLine={false} tickLine={false} stroke="#888" />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Legend />
                                <Bar dataKey="Assignées" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Accomplies" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {utilisateur?.role === 'admin' && adminData && (
                    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-neutral-100"><History className="h-5 w-5" /> Flux d'Activité (Historique)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px] overflow-y-auto">
                            <div className="space-y-4">
                                {historique.length === 0 ? (
                                    <p className="text-sm text-neutral-500">Aucune activité récente.</p>
                                ) : (
                                    historique.map(item => (
                                        <div key={item.id} className="flex gap-3 text-sm pb-3 border-b border-neutral-100 dark:border-neutral-800">
                                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                            <div>
                                                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                                    {item.utilisateur_nom} <span className="font-normal text-neutral-500">({item.action})</span>
                                                </p>
                                                <p className="text-xs text-neutral-500 mt-0.5">{item.details}</p>
                                                <p className="text-xs text-neutral-400 mt-1">{new Date(item.date_creation).toLocaleString('fr-FR')}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {utilisateur?.role === 'admin' && adminData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-slate-800 dark:text-neutral-100 mb-2">Tous les Projets en cours</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-800/50 dark:text-neutral-400">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-lg">Titre</th>
                                            <th className="px-4 py-3">Créateur</th>
                                            <th className="px-4 py-3 rounded-r-lg">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminData.derniersProjets.map(p => (
                                            <tr key={p.id} className="border-b dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                                                <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-200">{p.titre}</td>
                                                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{p.createur}</td>
                                                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{new Date(p.date_creation).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-slate-800 dark:text-neutral-100 mb-2">Tâches assignées & Membres</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto h-[300px]">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-800/50 dark:text-neutral-400 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-lg">Tâche (Projet)</th>
                                            <th className="px-4 py-3">Assigné à</th>
                                            <th className="px-4 py-3 rounded-r-lg">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminData.tachesEtAssignes.map((t, idx) => (
                                            <tr key={idx} className="border-b dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                                                <td className="px-4 py-3 text-neutral-900 dark:text-neutral-200">
                                                    <span className="font-medium">{t.titre}</span>
                                                    <div className="text-xs text-neutral-500">{t.projet}</div>
                                                </td>
                                                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{t.assigne}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${t.statut === 'Terminé' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                        {t.statut}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            
            {utilisateur?.role === 'admin' && adminData && (
                <div className="mt-8 mb-8">
                     <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-neutral-100"><ListTodo className="h-5 w-5" /> Productivité des membres</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {adminData.membresPerformants.map((m, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 flex flex-col items-center justify-center text-center">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg mb-2">
                                            {m.taches_accomplies}
                                        </div>
                                        <div className="font-medium text-sm text-neutral-800 dark:text-neutral-200">{m.nom}</div>
                                        <div className="text-xs text-neutral-500">Tâches finies</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Overview;
