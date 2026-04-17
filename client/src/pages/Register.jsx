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
            confirmationMotDePasse: ''
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
                .required('Veuillez confirmer votre mot de passe.')
        }),
        onSubmit: async (valeurs) => {
            setErreurAPI('');
            setChargement(true);
            try {
                await axios.post('http://localhost:5000/api/auth/inscription', {
                    nom: valeurs.nom,
                    email: valeurs.email,
                    motDePasse: valeurs.motDePasse
                });
                // Inscription réussie, direction la page de connexion
                navigate('/connexion');
            } catch (err) {
                setErreurAPI(err.response?.data?.erreur || "Erreur de connexion.");
            } finally {
                setChargement(false);
            }
        }
    });

    return (
        <div className="flex min-h-screen bg-neutral-900">
            {/* Colonne Gauche - Image en Pixel */}
            <div className="hidden lg:flex w-1/2 relative bg-neutral-950 items-center justify-center overflow-hidden border-r border-neutral-800">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
                </div>
                <img 
                    src="/images/pixel_register.png" 
                    alt="Register Terminal Pixel Art" 
                    className="relative z-10 w-3/4 max-w-md animate-float drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity" 
                />
            </div>

            {/* Colonne Droite - Formulaire */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 overflow-y-auto">
                <Card className="w-full max-w-[420px] bg-transparent border-0 shadow-none">
                    <CardHeader className="space-y-4 text-center pb-6 pt-8 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
                            <FolderKanban className="h-10 w-10 text-white" />
                        </div>
                        <div className="space-y-1.5">
                            <CardTitle className="text-3xl font-extrabold tracking-tight text-white">Inscription</CardTitle>
                            <CardDescription className="text-neutral-400 text-base">
                                Rejoignez-nous pour gérer vos projets
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <form onSubmit={formik.handleSubmit}>
                        <CardContent className="space-y-5 animate-slide-up px-8" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                            {erreurAPI && (
                                <div className="p-4 text-sm text-red-200 bg-red-950/50 rounded-xl border border-red-500/30 flex items-center gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                                    {erreurAPI}
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <Label htmlFor="nom" className="text-neutral-300 font-medium">Nom complet</Label>
                                <Input 
                                    id="nom" 
                                    name="nom"
                                    type="text" 
                                    placeholder="Jean Dupont" 
                                    value={formik.values.nom}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all h-12 rounded-xl px-4 ${formik.touched.nom && formik.errors.nom ? 'border-red-500/50 ring-red-500/50' : ''}`}
                                />
                                {formik.touched.nom && formik.errors.nom ? (
                                    <p className="text-sm text-red-400 mt-1">{formik.errors.nom}</p>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-neutral-300 font-medium">Adresse email</Label>
                                <Input 
                                    id="email" 
                                    name="email"
                                    type="email" 
                                    placeholder="nom@exemple.com" 
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all h-12 rounded-xl px-4 ${formik.touched.email && formik.errors.email ? 'border-red-500/50 ring-red-500/50' : ''}`}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <p className="text-sm text-red-400 mt-1">{formik.errors.email}</p>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="motDePasse" className="text-neutral-300 font-medium">Mot de passe</Label>
                                <Input 
                                    id="motDePasse" 
                                    name="motDePasse"
                                    type="password" 
                                    placeholder="••••••••"
                                    value={formik.values.motDePasse}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all h-12 rounded-xl px-4 ${formik.touched.motDePasse && formik.errors.motDePasse ? 'border-red-500/50 ring-red-500/50' : ''}`}
                                />
                                {formik.touched.motDePasse && formik.errors.motDePasse ? (
                                    <p className="text-sm text-red-400 mt-1">{formik.errors.motDePasse}</p>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmationMotDePasse" className="text-neutral-300 font-medium">Répéter le mot de passe</Label>
                                <Input 
                                    id="confirmationMotDePasse" 
                                    name="confirmationMotDePasse"
                                    type="password" 
                                    placeholder="••••••••"
                                    value={formik.values.confirmationMotDePasse}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all h-12 rounded-xl px-4 ${formik.touched.confirmationMotDePasse && formik.errors.confirmationMotDePasse ? 'border-red-500/50 ring-red-500/50' : ''}`}
                                />
                                {formik.touched.confirmationMotDePasse && formik.errors.confirmationMotDePasse ? (
                                    <p className="text-sm text-red-400 mt-1">{formik.errors.confirmationMotDePasse}</p>
                                ) : null}
                            </div>

                        </CardContent>

                        <CardFooter className="flex flex-col px-8 pb-8 pt-2 animate-slide-up gap-4" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20 h-12 rounded-xl text-base font-semibold border-none transition-all duration-300" disabled={chargement}>
                                {chargement ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Création en cours...</>
                                ) : (
                                    <><UserPlus className="mr-2 h-5 w-5" /> S'inscrire</>
                                )}
                            </Button>
                            <div className="text-center text-sm text-neutral-400">
                                Vous avez déjà un compte ?{' '}
                                <Link to="/connexion" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
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
