import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../store/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderGit2, PlusCircle, Calendar, ArrowRight, Edit, Trash2, X } from 'lucide-react';

const Projects = () => {
    const [projets, setProjets] = useState([]);
    const [chargement, setChargement] = useState(true);
    
    // Pagination
    const [page, setPage] = useState(1);
    const elementsParPage = 6;

    // Edition
    const [projetAEditer, setProjetAEditer] = useState(null);
    const [editTitre, setEditTitre] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false);

    const { utilisateur } = useContext(AuthContext);

    const chargerProjets = async () => {
        setChargement(true);
        try {
            const reponse = await api.get('/projets');
            setProjets(reponse.data);
        } catch (erreur) {
            console.error("Erreur chargement projets : ", erreur);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        chargerProjets();
    }, []);

    // Formater la date
    const formaterDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    // Pagination Calcul
    const totalPages = Math.ceil(projets.length / elementsParPage);
    const indexDebut = (page - 1) * elementsParPage;
    const projetsAffiches = projets.slice(indexDebut, indexDebut + elementsParPage);

    // Actions CRUD
    const supprimerProjet = async (idProjet) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce projet ?")) {
            try {
                await api.delete(`/projets/${idProjet}`);
                chargerProjets(); // Rafraîchir
                if (projetsAffiches.length === 1 && page > 1) {
                    setPage(page - 1);
                }
            } catch (erreur) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    const ouvrirModaleEdition = (projet) => {
        setProjetAEditer(projet);
        setEditTitre(projet.titre);
        setEditDesc(projet.description);
    };

    const sauvegarderEdition = async (e) => {
        e.preventDefault();
        setSauvegardeEnCours(true);
        try {
            await api.put(`/projets/${projetAEditer.id}`, {
                titre: editTitre,
                description: editDesc
            });
            setProjetAEditer(null);
            chargerProjets();
        } catch (erreur) {
            alert("Erreur lors de la mise à jour.");
        } finally {
            setSauvegardeEnCours(false);
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Vos Projets</h1>
                        <p className="text-neutral-500 mt-1">Gérez et suivez l'avancement de toutes vos idées.</p>
                    </div>
                    {utilisateur?.role === 'admin' && (
                        <Link to="/nouveau-projet">
                            <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto shadow-sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Créer un projet
                            </Button>
                        </Link>
                    )}
                {/* </div> */}

                {chargement ? (
                    <div className="flex justify-center py-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                ) : projets.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-neutral-200 border-dashed rounded-2xl shadow-sm">
                        <FolderGit2 className="mx-auto h-12 w-12 text-neutral-300" />
                        <h3 className="mt-4 text-lg font-semibold text-neutral-900">Aucun projet</h3>
                        <p className="mt-2 text-sm text-neutral-500">Commencez par créer votre premier projet.</p>
                        {utilisateur?.role === 'admin' && (
                            <div className="mt-6">
                                <Link to="/nouveau-projet">
                                    <Button variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium">
                                        Nouveau projet
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {projetsAffiches.map((projet) => {
                                const peutModifier = utilisateur && (utilisateur.role === 'admin' || projet.createur_id === utilisateur.id);
                                return (
                                    <Card key={projet.id} className="group hover:shadow-md transition-all duration-300 hover:border-blue-200 bg-white flex flex-col h-full relative overflow-hidden">
                                        <CardHeader className="flex-none">
                                            <div className="flex justify-between items-start gap-4">
                                                <CardTitle className="line-clamp-2 text-xl pr-8">{projet.titre}</CardTitle>
                                                {peutModifier && (
                                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => ouvrirModaleEdition(projet)} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors" title="Modifier">
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button onClick={() => supprimerProjet(projet.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors" title="Supprimer">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <CardDescription className="flex items-center gap-1.5 mt-2">
                                                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                                Créé par {projet.nom_createur}
                                            </CardDescription>
                                        </CardHeader>
                                        
                                        <CardContent className="flex-grow">
                                            <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                                                {projet.description || "Aucune description fournie pour ce projet."}
                                            </p>
                                        </CardContent>
                                        
                                        <CardFooter className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 pb-4 pt-4 rounded-b-xl flex-none mt-auto">
                                            <div className="flex items-center text-xs text-neutral-500 font-medium">
                                                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                                {formaterDate(projet.date_creation)}
                                            </div>
                                            <Link to={`/projets/${projet.id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium p-0 px-3 transition-transform group-hover:translate-x-1">
                                                    Ouvrir
                                                    <ArrowRight className="ml-1.5 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                        
                        {/* Contrôles de pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                                    disabled={page === 1}
                                >
                                    Précédent
                                </Button>
                                <span className="text-sm font-medium text-neutral-600">
                                    Page {page} sur {totalPages}
                                </span>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                                    disabled={page === totalPages}
                                >
                                    Suivant
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modale d'édition */}
            {projetAEditer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-lg bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                            <div>
                                <CardTitle className="text-xl dark:text-white">Modifier le projet</CardTitle>
                                <CardDescription className="dark:text-neutral-400">Mettez à jour les informations du projet.</CardDescription>
                            </div>
                            <button onClick={() => setProjetAEditer(null)} className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </CardHeader>
                        <form onSubmit={sauvegarderEdition}>
                            <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="titre" className="dark:text-neutral-200">Nom du projet</Label>
                                    <Input 
                                        id="titre" 
                                        value={editTitre} 
                                        onChange={(e) => setEditTitre(e.target.value)} 
                                        required 
                                        className="bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="desc" className="dark:text-neutral-200">Description</Label>
                                    <textarea 
                                        id="desc"
                                        rows={4}
                                        value={editDesc} 
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        className="flex w-full rounded-md border border-input bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    ></textarea>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 pt-4 rounded-b-xl">
                                <Button type="button" variant="ghost" onClick={() => setProjetAEditer(null)} className="dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800">Annuler</Button>
                                <Button type="submit" disabled={sauvegardeEnCours || !editTitre.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {sauvegardeEnCours ? 'Enregistrement...' : 'Enregistrer'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            )}
        </>
    );
};

export default Projects;
