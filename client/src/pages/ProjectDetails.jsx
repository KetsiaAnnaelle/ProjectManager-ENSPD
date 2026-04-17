import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../store/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, Clock, CircleDashed, PlusCircle, Users, CalendarIcon, Filter } from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const { utilisateur } = useContext(AuthContext);
    
    // States des données
    const [projet, setProjet] = useState(null);
    const [taches, setTaches] = useState([]);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [chargement, setChargement] = useState(true);
    
    // States pour la nouvelle tâche
    const [nouvelleTache, setNouvelleTache] = useState({
        titre: '',
        description: '',
        echeance: '',
        assignes: []
    });

    // States pour les filtres
    const [filtreStatut, setFiltreStatut] = useState('Tous');
    const [filtreMembre, setFiltreMembre] = useState('Tous');

    const chargerDonnees = async () => {
        setChargement(true);
        try {
            const [repProjet, repTaches, repUsers] = await Promise.all([
                api.get(`/projets/${id}`),
                api.get(`/taches/projet/${id}`),
                api.get(`/utilisateurs`)
            ]);
            setProjet(repProjet.data);
            setTaches(repTaches.data);
            setUtilisateurs(repUsers.data);
        } catch (erreur) {
            console.error("Erreur chargement détails :", erreur);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        chargerDonnees();
    }, [id]);

    const handleAssignBoxChange = (idUser) => {
        setNouvelleTache(prev => {
            const assignes = prev.assignes.includes(idUser)
                ? prev.assignes.filter(uid => uid !== idUser)
                : [...prev.assignes, idUser];
            return { ...prev, assignes };
        });
    };

    const ajouterTache = async (e) => {
        e.preventDefault();
        if (!nouvelleTache.titre) return;
        
        try {
            await api.post(`/taches/projet/${id}`, {
                titre: nouvelleTache.titre,
                description: nouvelleTache.description,
                echeance: nouvelleTache.echeance,
                assignes: nouvelleTache.assignes
            });
            // Reset du formulaire
            setNouvelleTache({ titre: '', description: '', echeance: '', assignes: [] });
            // Recharger uniquement les tâches
            const repTaches = await api.get(`/taches/projet/${id}`);
            setTaches(repTaches.data);
        } catch (erreur) {
            console.error("Erreur d'ajout de tâche", erreur);
        }
    };

    const changerStatutTache = async (idTache, nouveauStatut) => {
        try {
            await api.patch(`/taches/${idTache}/statut`, { statut: nouveauStatut });
            setTaches(taches.map(t => t.id === idTache ? { ...t, statut: nouveauStatut } : t));
        } catch (erreur) {
            console.error("Erreur update", erreur);
        }
    };

    const formaterDate = (dateString) => {
        if (!dateString) return "Aucune";
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    // Filtrage des tâches
    const tachesFiltrees = taches.filter(tache => {
        const matchStatut = filtreStatut === 'Tous' || tache.statut === filtreStatut;
        let matchMembre = true;
        
        if (filtreMembre === 'Moi') {
            matchMembre = tache.assignes && tache.assignes.some(a => a.id === utilisateur?.id);
        } else if (filtreMembre !== 'Tous') {
            matchMembre = tache.assignes && tache.assignes.some(a => a.id === parseInt(filtreMembre));
        }
        
        return matchStatut && matchMembre;
    });

    const StatusBadge = ({ statut }) => {
        if (statut === 'Terminé') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 shadow-sm"><CheckCircle2 className="w-3.5 h-3.5" /> Terminé</span>;
        if (statut === 'En cours') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 shadow-sm"><Clock className="w-3.5 h-3.5" /> En cours</span>;
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 shadow-sm"><CircleDashed className="w-3.5 h-3.5" /> À faire</span>;
    };

    if (chargement) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div></div>;
    if (!projet) return <div className="min-h-screen pt-20 text-center text-slate-500">Projet introuvable.</div>;

    return (
        <div className="w-full">
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <Link to="/dashboard" className="inline-flex mb-6 hover:opacity-80 transition-opacity">
                    <Button variant="ghost" className="text-slate-500 hover:text-slate-900 bg-white shadow-sm border border-slate-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour aux projets
                    </Button>
                </Link>

                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{projet.titre}</h1>
                    <p className="text-slate-600 text-lg leading-relaxed">{projet.description || "Aucune description"}</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 space-y-6">
                        {/* Barre d'outils et de filtres */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                <Filter className="h-5 w-5 text-blue-600" />
                                <span>Filtres</span>
                            </div>
                            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                <select 
                                    value={filtreStatut} 
                                    onChange={(e) => setFiltreStatut(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                                >
                                    <option value="Tous">Tous les statuts</option>
                                    <option value="À faire">À faire</option>
                                    <option value="En cours">En cours</option>
                                    <option value="Terminé">Terminé</option>
                                </select>
                                <select 
                                    value={filtreMembre} 
                                    onChange={(e) => setFiltreMembre(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                                >
                                    <option value="Tous">Tous les membres</option>
                                    <option value="Moi">Mes tâches</option>
                                    {utilisateurs.map(u => (
                                        <option key={u.id} value={u.id}>{u.nom}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Liste des tâches */}
                        {tachesFiltrees.length === 0 ? (
                            <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center text-slate-500 shadow-sm">
                                Aucune tâche ne correspond à ces critères.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tachesFiltrees.map(tache => (
                                    <div key={tache.id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between hover:border-blue-300 transition-all gap-4">
                                        <div className="flex flex-col gap-3 flex-1">
                                            <div className="flex items-center gap-3">
                                                <StatusBadge statut={tache.statut} />
                                                <span className={`text-lg font-bold ${tache.statut === 'Terminé' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                                    {tache.titre}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-sm">{tache.description || "Aucune description."}</p>
                                            
                                            <div className="flex flex-wrap gap-4 mt-1">
                                                <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                                                    <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                                                    Échéance : {formaterDate(tache.echeance)}
                                                </div>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                                    {tache.assignes && tache.assignes.length > 0 ? (
                                                        tache.assignes.map(a => (
                                                            <span key={a.id} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                                                                {a.nom}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Non assignée</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-row md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4 mt-2 md:mt-0">
                                            {tache.statut !== 'À faire' && (
                                                <Button size="sm" variant="outline" className="w-full text-blue-700 bg-white border-slate-200 hover:bg-slate-50" onClick={() => changerStatutTache(tache.id, 'À faire')}>À faire</Button>
                                            )}
                                            {tache.statut !== 'En cours' && (
                                                <Button size="sm" variant="outline" className="w-full text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100 font-medium" onClick={() => changerStatutTache(tache.id, 'En cours')}>En cours</Button>
                                            )}
                                            {tache.statut !== 'Terminé' && (
                                                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium" onClick={() => changerStatutTache(tache.id, 'Terminé')}>Terminer</Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Colonne de droite : Création de tâche */}
                    <div className="xl:col-span-1">
                        <Card className="sticky top-24 shadow-xl border-slate-200/60 overflow-hidden bg-white">
                            <div className="h-1.5 bg-blue-600"></div>
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-5">
                                <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                                    <PlusCircle className="w-5 h-5 text-blue-600" />
                                    Nouvelle tâche
                                </CardTitle>
                                <CardDescription>Ajoutez une tâche et assignez-la à votre équipe.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={ajouterTache} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="titre" className="text-slate-700 font-semibold">Titre de la tâche</Label>
                                        <Input 
                                            id="titre" 
                                            placeholder="Ex: Refaire le design..." 
                                            value={nouvelleTache.titre}
                                            onChange={e => setNouvelleTache({...nouvelleTache, titre: e.target.value})}
                                            className="bg-slate-50"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="descritpion" className="text-slate-700 font-semibold">Description</Label>
                                        <textarea 
                                            id="description"
                                            rows={2}
                                            placeholder="Détails techniques..."
                                            value={nouvelleTache.description}
                                            onChange={e => setNouvelleTache({...nouvelleTache, description: e.target.value})}
                                            className="flex w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="echeance" className="text-slate-700 font-semibold">Délais (Échéance)</Label>
                                        <Input 
                                            id="echeance" 
                                            type="date"
                                            value={nouvelleTache.echeance}
                                            onChange={e => setNouvelleTache({...nouvelleTache, echeance: e.target.value})}
                                            className="bg-slate-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-semibold flex items-center gap-2 mb-3">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            Membres assignés
                                        </Label>
                                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 border rounded-md p-3 bg-slate-50">
                                            {utilisateurs.length === 0 ? (
                                                <p className="text-sm text-slate-500 italic">Aucun membre disponible.</p>
                                            ) : (
                                                utilisateurs.map(u => (
                                                    <label key={u.id} className="flex items-center space-x-3 cursor-pointer hover:bg-slate-100 p-1.5 rounded transition-colors border border-transparent hover:border-slate-200">
                                                        <input 
                                                            type="checkbox"
                                                            checked={nouvelleTache.assignes.includes(u.id)}
                                                            onChange={() => handleAssignBoxChange(u.id)}
                                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                                                        />
                                                        <span className="text-sm font-medium text-slate-700">{u.nom}</span>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl mt-4 shadow-md shadow-blue-500/20 transition-all" disabled={!nouvelleTache.titre}>
                                        <PlusCircle className="mr-2 h-5 w-5" /> Créer la tâche
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
