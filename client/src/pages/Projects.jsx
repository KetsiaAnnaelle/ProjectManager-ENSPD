import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../store/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderGit2, PlusCircle, Calendar, ArrowRight, Edit, Trash2, X, Search } from 'lucide-react';

const Projects = () => {
    const [projets, setProjets] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [recherche, setRecherche] = useState('');
    
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

    // Filtrage et Pagination Calcul
    const projetsFiltres = projets.filter(p => 
        p.titre.toLowerCase().includes(recherche.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(recherche.toLowerCase()))
    );
    const totalPages = Math.ceil(projetsFiltres.length / elementsParPage);
    const indexDebut = (page - 1) * elementsParPage;
    const projetsAffiches = projetsFiltres.slice(indexDebut, indexDebut + elementsParPage);

    // Actions CRUD
    const supprimerProjet = async (idProjet) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce projet ?")) {
            try {
                await api.delete(`/projets/${idProjet}`);
                chargerProjets();
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
                {/* En-tête avec disposition responsive */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                            Vos Projets
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1 sm:text-base text-sm">
                            Gérez et suivez l'avancement de toutes vos idées.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input 
                                type="text"
                                placeholder="Rechercher par titre ou description..."
                                value={recherche}
                                onChange={(e) => {
                                    setRecherche(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm dark:text-white dark:placeholder-gray-400"
                            />
                        </div>
                        {utilisateur?.role === 'admin' && (
                            <Link to="/nouveau-projet" className="w-full sm:w-auto">
                                <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 w-full sm:w-auto shadow-sm text-white">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Créer un projet
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Contenu principal */}
                {chargement ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
                    </div>
                ) : projets.length === 0 ? (
                    <div className="text-center py-12 sm:py-20 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 border-dashed rounded-2xl shadow-sm">
                        <FolderGit2 className="mx-auto h-12 w-12 text-neutral-300 dark:text-gray-600" />
                        <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">Aucun projet</h3>
                        <p className="mt-2 text-sm text-neutral-500 dark:text-gray-400">Commencez par créer votre premier projet.</p>
                        {utilisateur?.role === 'admin' && (
                            <div className="mt-6">
                                <Link to="/nouveau-projet">
                                    <Button variant="outline" className="border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-medium dark:border-red-800 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30">
                                        Nouveau projet
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Grille de projets responsive */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            {projetsAffiches.map((projet) => {
                                const peutModifier = utilisateur && (utilisateur.role === 'admin' || projet.createur_id === utilisateur.id);
                                return (
                                    <Card key={projet.id} className="group hover:shadow-xl transition-all duration-300 hover:border-red-200 dark:hover:border-red-800 bg-white dark:bg-gray-800 flex flex-col h-full relative overflow-hidden">
                                        <CardHeader className="flex-none pb-3">
                                            <div className="flex justify-between items-start gap-4">
                                                <CardTitle className="line-clamp-2 text-lg sm:text-xl pr-8 dark:text-white">
                                                    {projet.titre}
                                                </CardTitle>
                                                {peutModifier && (
                                                    <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => ouvrirModaleEdition(projet)} 
                                                            className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => supprimerProjet(projet.id)} 
                                                            className="p-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <CardDescription className="flex items-center gap-1.5 mt-2 dark:text-gray-400">
                                                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                                                Créé par {projet.nom_createur}
                                            </CardDescription>
                                        </CardHeader>
                                        
                                        <CardContent className="flex-grow pt-0">
                                            <p className="text-sm text-neutral-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                                                {projet.description || "Aucune description fournie pour ce projet."}
                                            </p>
                                        </CardContent>
                                        
                                        <CardFooter className="flex items-center justify-between border-t border-neutral-100 dark:border-gray-700 bg-neutral-50/50 dark:bg-gray-900/50 pb-4 pt-4 rounded-b-xl flex-none mt-auto">
                                            <div className="flex items-center text-xs text-neutral-500 dark:text-gray-400 font-medium">
                                                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                                {formaterDate(projet.date_creation)}
                                            </div>
                                            <Link to={`/projets/${projet.id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium p-0 px-3 transition-transform group-hover:translate-x-1">
                                                    Ouvrir
                                                    <ArrowRight className="ml-1.5 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                        
                        {/* Contrôles de pagination responsive */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                                    disabled={page === 1}
                                    className="w-full sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Précédent
                                </Button>
                                <span className="text-sm font-medium text-neutral-600 dark:text-gray-400">
                                    Page {page} sur {totalPages}
                                </span>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                                    disabled={page === totalPages}
                                    className="w-full sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Suivant
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modale d'édition responsive */}
            {projetAEditer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-lg mx-4 bg-white dark:bg-gray-800 border-neutral-200 dark:border-gray-700 shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-neutral-100 dark:border-gray-700">
                            <div>
                                <CardTitle className="text-xl dark:text-white">Modifier le projet</CardTitle>
                                <CardDescription className="dark:text-gray-400">Mettez à jour les informations du projet.</CardDescription>
                            </div>
                            <button 
                                onClick={() => setProjetAEditer(null)} 
                                className="p-2 text-neutral-400 hover:text-neutral-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </CardHeader>
                        <form onSubmit={sauvegarderEdition}>
                            <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="titre" className="dark:text-gray-200">Nom du projet</Label>
                                    <Input 
                                        id="titre" 
                                        value={editTitre} 
                                        onChange={(e) => setEditTitre(e.target.value)} 
                                        required 
                                        className="bg-neutral-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="desc" className="dark:text-gray-200">Description</Label>
                                    <textarea 
                                        id="desc"
                                        rows={4}
                                        value={editDesc} 
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        className="flex w-full rounded-md border border-input bg-neutral-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                        placeholder="Description du projet..."
                                    ></textarea>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-neutral-100 dark:border-gray-700 bg-neutral-50 dark:bg-gray-900 pt-4 rounded-b-xl">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setProjetAEditer(null)} 
                                    className="w-full sm:w-auto dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                                >
                                    Annuler
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={sauvegardeEnCours || !editTitre.trim()} 
                                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white"
                                >
                                    {sauvegardeEnCours ? 'Enregistrement...' : 'Enregistrer'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Projects;