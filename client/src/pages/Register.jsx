import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, Loader2, UserPlus } from 'lucide-react';

const Register = () => {
    const [erreurAPI, setErreurAPI] = useState('');
    const [chargement, setChargement] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            nom: '',
            email: '',
            motDePasse: '',
            confirmationMotDePasse: '',
            role: 'membre' // Valeur par défaut
        },
        validationSchema: Yup.object({
            nom: Yup.string()
                .required('Votre nom est obligatoire.'),
            email: Yup.string()
                .email('Adresse email invalide.')
                .required('L\'email est obligatoire.'),
            motDePasse: Yup.string()
                .min(6, 'Le mot de passe doit contenir au moins 6 caractères.')
                .required('Le mot de passe est obligatoire.'),
            confirmationMotDePasse: Yup.string()
                .oneOf([Yup.ref('motDePasse'), null], 'Les mots de passe doivent correspondre.')
                .required('Veuillez confirmer votre mot de passe.'),
            role: Yup.string()
                .oneOf(['admin', 'membre'], 'Rôle invalide.')
                .required('Le rôle est obligatoire.')
        }),
        onSubmit: async (valeurs) => {
            setErreurAPI('');
            setChargement(true);
            try {
                await axios.post('http://localhost:5000/api/auth/inscription', {
                    nom: valeurs.nom,
                    email: valeurs.email,
                    motDePasse: valeurs.motDePasse,
                    role: valeurs.role
                });
                // Inscription réussie, direction la page de connexion
                navigate('/connexion');
            } catch (err) {
                setErreurAPI(err.response?.data?.erreur || "Erreur lors de l'inscription.");
            } finally {
                setChargement(false);
            }
        }
    });

    return (
        <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
            <div className="w-full max-w-md animate-slide-up pb-8 pt-8">
                <Card className="bg-white border-0 shadow-2xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-red-500"></div>
                    <CardHeader className="space-y-4 text-center pb-6 pt-10">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <FolderKanban className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Créer un compte</CardTitle>
                            <CardDescription className="text-slate-500 text-base">
                                Rejoignez-nous pour gérer vos projets.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <form onSubmit={formik.handleSubmit}>
                        <CardContent className="space-y-4 px-8">
                            {erreurAPI && (
                                <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></div>
                                    {erreurAPI}
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <Label htmlFor="nom" className="text-slate-700 font-medium text-sm">Nom complet</Label>
                                <Input 
                                    id="nom" 
                                    name="nom"
                                    type="text" 
                                    placeholder="Jean Dupont" 
                                    value={formik.values.nom}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all h-12 rounded-xl px-4 ${formik.touched.nom && formik.errors.nom ? 'border-red-500 ring-red-500/20' : ''}`}
                                />
                                {formik.touched.nom && formik.errors.nom ? (
                                    <p className="text-sm text-red-500 mt-1">{formik.errors.nom}</p>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-medium text-sm">Adresse email</Label>
                                <Input 
                                    id="email" 
                                    name="email"
                                    type="email" 
                                    placeholder="nom@exemple.com" 
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all h-12 rounded-xl px-4 ${formik.touched.email && formik.errors.email ? 'border-red-500 ring-red-500/20' : ''}`}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
                                ) : null}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-slate-700 font-medium text-sm">Rôle utilisateur</Label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formik.values.role}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`flex w-full bg-slate-50 border-slate-200 text-slate-900 focus-visible:outline-none focus:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent transition-all h-12 rounded-xl px-4 border ${formik.touched.role && formik.errors.role ? 'border-red-500 ring-red-500/20' : ''}`}
                                >
                                    <option value="membre">Membre d'équipe</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                                {formik.touched.role && formik.errors.role ? (
                                    <p className="text-sm text-red-500 mt-1">{formik.errors.role}</p>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="motDePasse" className="text-slate-700 font-medium text-sm">Mot de passe</Label>
                                <Input 
                                    id="motDePasse" 
                                    name="motDePasse"
                                    type="password" 
                                    placeholder="••••••••"
                                    value={formik.values.motDePasse}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all h-12 rounded-xl px-4 ${formik.touched.motDePasse && formik.errors.motDePasse ? 'border-red-500 ring-red-500/20' : ''}`}
                                />
                                {formik.touched.motDePasse && formik.errors.motDePasse ? (
                                    <p className="text-sm text-red-500 mt-1">{formik.errors.motDePasse}</p>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmationMotDePasse" className="text-slate-700 font-medium text-sm">Répéter le mot de passe</Label>
                                <Input 
                                    id="confirmationMotDePasse" 
                                    name="confirmationMotDePasse"
                                    type="password" 
                                    placeholder="••••••••"
                                    value={formik.values.confirmationMotDePasse}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all h-12 rounded-xl px-4 ${formik.touched.confirmationMotDePasse && formik.errors.confirmationMotDePasse ? 'border-red-500 ring-red-500/20' : ''}`}
                                />
                                {formik.touched.confirmationMotDePasse && formik.errors.confirmationMotDePasse ? (
                                    <p className="text-sm text-red-500 mt-1">{formik.errors.confirmationMotDePasse}</p>
                                ) : null}
                            </div>

                        </CardContent>

                        <CardFooter className="flex flex-col gap-5 px-8 pb-10 pt-4">
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 h-12 rounded-xl text-base font-medium transition-all duration-300" disabled={chargement}>
                                {chargement ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Création en cours...</>
                                ) : (
                                    <><UserPlus className="mr-2 h-5 w-5" /> S'inscrire</>
                                )}
                            </Button>
                            <div className="text-center text-sm text-slate-500">
                                Vous avez déjà un compte ?{' '}
                                <Link to="/connexion" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                    Se connecter
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Register;
