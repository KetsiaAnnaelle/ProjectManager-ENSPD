import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, Clock, CircleDashed, PlusCircle } from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const [projet, setProjet] = useState(null);
    const [taches, setTaches] = useState([]);
    const [chargement, setChargement] = useState(true);
    
    // Pour la nouvelle tâche
    const [nouvelleTacheTitre, setNouvelleTacheTitre] = useState('');

    useEffect(() => {
        const chargerDonnees = async () => {
            try {
                // Requêtes parallèles pour le projet et ses tâches
                const [repProjet, repTaches] = await Promise.all([
                    api.get(`/projets/${id}`),
                    api.get(`/taches/projet/${id}`)
                ]);
                setProjet(repProjet.data);
                setTaches(repTaches.data);
            } catch (erreur) {
                console.error("Erreur chargement détails :", erreur);
            } finally {
                setChargement(false);
            }
        };
        chargerDonnees();
    }, [id]);

    const ajouterTache = async (e) => {
        e.preventDefault();
        if (!nouvelleTacheTitre) return;
        
        try {
            await api.post(`/taches/projet/${id}`, { titre: nouvelleTacheTitre });
            setNouvelleTacheTitre(''); // Rafraichit le champ
            // Recharger les tâches
            const repTaches = await api.get(`/taches/projet/${id}`);
            setTaches(repTaches.data);
        } catch (erreur) {
            console.error("Erreur d'ajout de tâche", erreur);
        }
    };

    const changerStatutTache = async (idTache, nouveauStatut) => {
        try {
            await api.patch(`/taches/${idTache}/statut`, { statut: nouveauStatut });
            // Mettre à jour l'état local pour ne pas recharger toute la page
            setTaches(taches.map(t => t.id === idTache ? { ...t, statut: nouveauStatut } : t));
        } catch (erreur) {
            console.error("Erreur update", erreur);
        }
    };

    const StatusBadge = ({ statut }) => {
        if (statut === 'Terminé') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3.5 h-3.5" /> Terminé</span>;
        if (statut === 'En cours') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock className="w-3.5 h-3.5" /> En cours</span>;
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"><CircleDashed className="w-3.5 h-3.5" /> À faire</span>;
    };

    if (chargement) return <div className="min-h-screen pt-20 text-center">Chargement...</div>;
    if (!projet) return <div className="min-h-screen pt-20 text-center">Projet introuvable.</div>;

    return (
        <div className="min-h-screen bg-neutral-50/50">
            <NavBar />
            
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <Link to="/dashboard" className="inline-flex mb-6">
                    <Button variant="ghost" className="text-neutral-500 pl-0 hover:bg-transparent">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                </Link>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 mb-8">
                    <h1 className="text-3xl font-bold text-blue-900 mb-4">{projet.titre}</h1>
                    <p className="text-neutral-600 text-lg">{projet.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-neutral-800">Tâches ({taches.length})</h2>
                        </div>

                        {taches.length === 0 ? (
                            <div className="bg-white border rounded-xl p-8 text-center text-neutral-500 shadow-sm">
                                Aucune tâche pour le moment.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {taches.map(tache => (
                                    <div key={tache.id} className="bg-white border border-neutral-200 p-4 rounded-xl shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <StatusBadge statut={tache.statut} />
                                            <span className={`font-medium ${tache.statut === 'Terminé' ? 'line-through text-neutral-400' : 'text-neutral-800'}`}>
                                                {tache.titre}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {tache.statut !== 'À faire' && (
                                                <Button size="sm" variant="outline" onClick={() => changerStatutTache(tache.id, 'À faire')}>À faire</Button>
                                            )}
                                            {tache.statut !== 'En cours' && (
                                                <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 bg-blue-50" onClick={() => changerStatutTache(tache.id, 'En cours')}>En cours</Button>
                                            )}
                                            {tache.statut !== 'Terminé' && (
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => changerStatutTache(tache.id, 'Terminé')}>Terminer</Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1 border-l border-neutral-200 pl-8">
                        <Card className="sticky top-24 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Nouvelle tâche</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={ajouterTache} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tache">Que faut-il faire ?</Label>
                                        <Input 
                                            id="tache" 
                                            placeholder="Titre de la tâche..." 
                                            value={nouvelleTacheTitre}
                                            onChange={e => setNouvelleTacheTitre(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full bg-neutral-900" disabled={!nouvelleTacheTitre}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Ajouter
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetails;
