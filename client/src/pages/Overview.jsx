import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../store/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, CheckSquare, Users, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const Overview = () => {
    const { utilisateur } = useContext(AuthContext);
    const [stats, setStats] = useState({
        projetsDispos: 0,
        tachesAssignees: 0,
        tachesEffectuees: 0,
        collaborateurs: 0
    });
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/utilisateurs/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Erreur chargement statistiques :", error);
            } finally {
                setChargement(false);
            }
        };
        fetchStats();
    }, []);

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
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-800">Aperçu Ratios des Tâches</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Toutes les Tâches', Assignées: stats.tachesAssignees, Accomplies: stats.tachesEffectuees }
                            ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Legend />
                                <Bar dataKey="Assignées" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Accomplies" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Overview;
