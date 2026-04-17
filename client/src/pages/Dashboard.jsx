import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import NavBar from '../components/NavBar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderGit2, PlusCircle, Calendar, ArrowRight } from 'lucide-react';

const Dashboard = () => {
    const [projets, setProjets] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        const chargerProjets = async () => {
            try {
                // api s'occupe tout seul d'envoyer le token grâce à notre interceptor
                const reponse = await api.get('/projets');
                setProjets(reponse.data);
            } catch (erreur) {
                console.error("Erreur chargement projets : ", erreur);
            } finally {
                setChargement(false);
            }
        };

        chargerProjets();
    }, []);

    // Formater la date en français
    const formaterDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    return (
        <div className="min-h-screen bg-neutral-50/50">
            <NavBar />
            
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Vos Projets</h1>
                        <p className="text-neutral-500 mt-1">Gérez et suivez l'avancement de toutes vos idées.</p>
                    </div>
                    <Link to="/nouveau-projet">
                        <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto shadow-sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Créer un projet
                        </Button>
                    </Link>
                </div>

                {chargement ? (
                    <div className="flex justify-center py-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                ) : projets.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-neutral-200 border-dashed rounded-2xl">
                        <FolderGit2 className="mx-auto h-12 w-12 text-neutral-300" />
                        <h3 className="mt-4 text-lg font-semibold text-neutral-900">Aucun projet</h3>
                        <p className="mt-2 text-sm text-neutral-500">Commencez par créer votre premier projet.</p>
                        <div className="mt-6">
                            <Link to="/nouveau-projet">
                                <Button variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium">
                                    Nouveau projet
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projets.map((projet) => (
                            <Card key={projet.id} className="group hover:shadow-md transition-all duration-300 hover:border-blue-200 bg-white flex flex-col h-full">
                                <CardHeader className="flex-none">
                                    <div className="flex justify-between items-start gap-4">
                                        <CardTitle className="line-clamp-2 text-xl">{projet.titre}</CardTitle>
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
                                        <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium p-0 px-2 transition-transform group-hover:translate-x-1">
                                            Ouvrir
                                            <ArrowRight className="ml-1.5 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
