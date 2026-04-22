import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../store/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, Clock, CircleDashed, PlusCircle, Users, CalendarIcon, Filter, MessageSquare, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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

        // Initialisation de la connexion WebSocket
        const socket = io('http://localhost:5000');
        
        socket.on('connect', () => {
             socket.emit('rejoindre_projet', id);
        });

        // Ecouter les changements envoyés par le serveur
        socket.on('NOUVELLE_TACHE', (data) => {
            // Recharge la liste en direct lorsqu'une nouvelle tâche est ajoutée
            if (data.projet_id === parseInt(id)) {
                api.get(`/taches/projet/${id}`).then(res => setTaches(res.data));
                toast.success('Une nouvelle tâche a été ajoutée au projet !', { icon: '✨' });
            }
        });

        socket.on('STATUT_TACHE_MAJ', (data) => {
            setTaches(prev => prev.map(t => t.id === parseInt(data.idTache) ? { ...t, statut: data.statut } : t));
            toast('Le statut d\'une tâche a été mis à jour', { icon: '🔄' });
        });

        return () => {
            socket.disconnect(); // Nettoyage lors de la sortie de la page
        };
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
            toast.success("Tâche créée avec succès !");
            // Le webhook va déclencher NOUVELLE_TACHE chez tout le monde (y compris moi)
        } catch (erreur) {
            console.error("Erreur d'ajout de tâche", erreur);
            toast.error("Erreur lors de la création de la tâche.");
        }
    };

    const changerStatutTache = async (idTache, nouveauStatut) => {
        try {
            await api.patch(`/taches/${idTache}/statut`, { statut: nouveauStatut });
            // Pas besoin de setTaches(taches.map...), le Websocket (STATUT_TACHE_MAJ) s'en chargera pour tous
        } catch (erreur) {
            console.error("Erreur update", erreur);
            toast.error("Erreur serveur lors de la mise à jour");
        }
    };

    const formaterDate = (dateString) => {
        if (!dateString) return "Aucune";
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const handleDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return; // Lâché en dehors d'une zone
        if (source.droppableId === destination.droppableId) return; // Même colonne

        const nouveauStatut = destination.droppableId;
        changerStatutTache(parseInt(draggableId), nouveauStatut);
    };

    // Filtrage des tâches
    // Filtrage des tâches selon le rôle
    const tachesFiltrees = taches.filter(tache => {
        const matchStatut = filtreStatut === 'Tous' || tache.statut === filtreStatut;
        
        if (utilisateur?.role !== 'admin') {
            // Un membre normal ne voit que les tâches qui lui sont assignées
            const estAssigne = tache.assignes && tache.assignes.some(a => a.id === utilisateur?.id);
            return matchStatut && estAssigne;
        } else {
            // Un admin peut tout voir et utiliser le filtre de membres
            let matchMembre = true;
            if (filtreMembre === 'Moi') {
                matchMembre = tache.assignes && tache.assignes.some(a => a.id === utilisateur?.id);
            } else if (filtreMembre !== 'Tous') {
                matchMembre = tache.assignes && tache.assignes.some(a => a.id === parseInt(filtreMembre));
            }
            return matchStatut && matchMembre;
        }
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
                    <h1 className="text-3xl font-extrabold text-red-600 mb-4">{projet.titre}</h1>
                    <p className="text-slate-600 text-lg leading-relaxed">{projet.description || "Aucune description"}</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 space-y-6">
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
                                {utilisateur?.role === 'admin' && (
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
                                )}
                            </div>
                        </div>

                        {/* Interface Kanban Drag & Drop */}
                        {tachesFiltrees.length === 0 ? (
                            <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center text-slate-500 shadow-sm">
                                Aucune tâche ne correspond à ces critères.
                            </div>
                        ) : (
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {['À faire', 'En cours', 'Terminé'].map(colonneStatut => (
                                        <div key={colonneStatut} className="flex flex-col bg-slate-50/50 rounded-xl border border-slate-200 p-4">
                                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                                                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                                    <StatusBadge statut={colonneStatut} />
                                                </h3>
                                                <span className="bg-white text-slate-500 text-xs font-bold px-2 py-1 rounded shadow-sm border border-slate-100">
                                                    {tachesFiltrees.filter(t => t.statut === colonneStatut).length}
                                                </span>
                                            </div>
                                            
                                            <Droppable droppableId={colonneStatut}>
                                                {(provided, snapshot) => (
                                                    <div 
                                                        ref={provided.innerRef} 
                                                        {...provided.droppableProps}
                                                        className={`flex-1 min-h-[150px] transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
                                                    >
                                                        {tachesFiltrees.filter(t => t.statut === colonneStatut).map((tache, index) => (
                                                            <Draggable key={tache.id.toString()} draggableId={tache.id.toString()} index={index}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        className={`bg-white border ${snapshot.isDragging ? 'border-blue-400 shadow-lg scale-105' : 'border-slate-200 shadow-sm'} p-4 rounded-xl mb-3 hover:border-blue-300 transition-all cursor-default group`}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2 gap-2">
                                                                            <span className={`text-base font-bold leading-tight break-words pr-2 ${tache.statut === 'Terminé' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                                                                {tache.titre}
                                                                            </span>
                                                                            <div {...provided.dragHandleProps} className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                                                                                <GripVertical className="h-4 w-4" />
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-slate-500 text-xs mb-3 line-clamp-2">{tache.description || "Aucune description."}</p>
                                                                        
                                                                        <div className="flex flex-wrap gap-2 mt-1 justify-between items-end border-t border-slate-50 pt-3">
                                                                            <div className="flex items-center text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                                                                <CalendarIcon className="w-3 h-3 mr-1" />
                                                                                {formaterDate(tache.echeance)}
                                                                            </div>
                                                                            <div className="flex items-center gap-1 flex-wrap justify-end">
                                                                                {tache.assignes && tache.assignes.length > 0 ? (
                                                                                    tache.assignes.map(a => (
                                                                                        <span key={a.id} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100" title={a.nom}>
                                                                                            {a.nom.substring(0, 2).toUpperCase()}
                                                                                        </span>
                                                                                    ))
                                                                                ) : (
                                                                                    <Users className="w-3.5 h-3.5 text-slate-300" />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    ))}
                                </div>
                            </DragDropContext>
                        )}
                    </div>

                    {/* Colonne de droite : Création de tâche uniquement pour Admin */}
                    {utilisateur?.role === 'admin' && (
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
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProjectDetails;
