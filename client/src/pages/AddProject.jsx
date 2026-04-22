import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Rocket, Loader2, Target, AlignLeft } from 'lucide-react';

const AddProject = () => {
    const [erreurAPI, setErreurAPI] = useState('');
    const [chargement, setChargement] = useState(false);
    
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            titre: '',
            description: ''
        },
        validationSchema: Yup.object({
            titre: Yup.string()
                .required('Un nom de projet est requis.'),
            description: Yup.string()
                .max(500, 'La description ne doit pas dépasser 500 caractères.')
                .optional()
        }),
        onSubmit: async (valeurs) => {
            setErreurAPI('');
            setChargement(true);
            try {
                await api.post('/projets', { 
                    titre: valeurs.titre, 
                    description: valeurs.description 
                });
                navigate('/dashboard');
            } catch (err) {
                setErreurAPI(err.response?.data?.erreur || err.response?.data?.erreurs?.[0]?.msg || "Erreur lors de la création.");
            } finally {
                setChargement(false);
            }
        }
    });

    return (
        <div className="w-full">
            <main className="container mx-auto px-4 py-6 max-w-2xl">
                <div className="mb-6">
                    <Link to="/dashboard">
                        <Button variant="ghost" className="text-neutral-500 hover:text-blue-600 pl-0 hover:bg-transparent -ml-2">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour au tableau de bord
                        </Button>
                    </Link>
                </div>

                <div className="text-center mb-10">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-600/30 transform rotate-3">
                        <Rocket className="h-8 w-8 text-white -rotate-3" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 pb-2">Lancez une nouvelle idée</h1>
                    <p className="text-lg text-neutral-500 max-w-md mx-auto">Structurez votre vision et donnez vie à votre prochain grand projet d'équipe.</p>
                </div>

                <Card className="shadow-2xl shadow-neutral-200/50 border-0 bg-white overflow-hidden ring-1 ring-neutral-200/50">
                    <div className="h-2 w-full bg-blue-600"></div>
                    
                    <form onSubmit={formik.handleSubmit}>
                        <CardContent className="p-8 space-y-6">
                            {erreurAPI && (
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex gap-3">
                                    <div className="w-1 h-full bg-red-600 rounded-full"></div>
                                    {erreurAPI}
                                </div>
                            )}

                            <div className="space-y-3">
                                <Label htmlFor="titre" className="text-base font-semibold flex items-center gap-2">
                                    <Target className="w-4 h-4 text-blue-600" />
                                    Nom du projet
                                </Label>
                                <Input 
                                    id="titre" 
                                    name="titre"
                                    className={`h-12 bg-neutral-50 border-neutral-200 text-base shadow-inner focus-visible:ring-blue-600 ${formik.touched.titre && formik.errors.titre ? 'border-red-500 ring-red-500' : ''}`} 
                                    placeholder="Ex: Refonte de l'application mobile" 
                                    value={formik.values.titre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.titre && formik.errors.titre ? (
                                    <p className="text-sm text-red-500">{formik.errors.titre}</p>
                                ) : (
                                    <p className="text-xs text-neutral-400 pl-1">Soyez clair et concis. Ce nom sera visible par toute l'équipe.</p>
                                )}
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label htmlFor="description" className="text-base font-semibold flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4 text-blue-600" />
                                    Description détaillée
                                </Label>
                                <textarea 
                                    id="description" 
                                    name="description"
                                    className={`flex w-full rounded-md border text-neutral-900 border-neutral-200 bg-neutral-50 px-4 py-3 text-base shadow-inner placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent min-h-[160px] resize-y transition-all ${formik.touched.description && formik.errors.description ? 'border-red-500 ring-red-500' : ''}`}
                                    placeholder="Expliquez brièvement l'objectif principal, les contraintes et ce que vous espérez accomplir..."
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.description && formik.errors.description ? (
                                    <p className="text-sm text-red-500">{formik.errors.description}</p>
                                ) : null}
                            </div>
                        </CardContent>
                        
                        <CardFooter className="bg-neutral-50 p-6 sm:px-8 border-t border-neutral-100 flex items-center justify-end gap-3">
                            <Link to="/dashboard" className="hidden sm:inline-block">
                                <Button variant="ghost" type="button" className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50">
                                    Annuler
                                </Button>
                            </Link>
                            <Button 
                                type="submit" 
                                className="w-full sm:w-auto h-12 px-8 text-base font-semibold shadow-md shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.02] border-none text-white block" 
                                disabled={chargement}
                            >
                                {chargement ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Création en cours...
                                    </div>
                                ) : (
                                    "Créer le projet"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </main>
        </div>
    );
};

export default AddProject;
