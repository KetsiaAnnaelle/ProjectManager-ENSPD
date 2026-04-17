import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { AuthContext } from '../store/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, Loader2, LogIn } from 'lucide-react';

const Login = () => {
    const [erreurAPI, setErreurAPI] = useState('');
    const [chargement, setChargement] = useState(false);
    
    const { connexion } = useContext(AuthContext);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            motDePasse: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Adresse email invalide.')
                .required('L\'email est obligatoire.'),
            motDePasse: Yup.string()
                .required('Le mot de passe est obligatoire.')
        }),
        onSubmit: async (valeurs) => {
            setErreurAPI('');
            setChargement(true);
            try {
                const reponse = await axios.post('http://localhost:5000/api/auth/connexion', {
                    email: valeurs.email,
                    motDePasse: valeurs.motDePasse
                });

                connexion(reponse.data.token, reponse.data.utilisateur);
                navigate('/dashboard');
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
            <div className="hidden lg:flex w-1/2 relative bg-blue-950 items-center justify-center overflow-hidden border-r border-blue-900/50">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                </div>
                <img 
                    src="/images/pixel_login.png" 
                    alt="Login Terminal Pixel Art" 
                    className="relative z-10 w-3/4 max-w-md animate-float drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity" 
                />
            </div>

            {/* Colonne Droite - Formulaire */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
                <Card className="w-full max-w-[420px] bg-transparent border-0 shadow-none">
                    <CardHeader className="space-y-5 text-center pb-8 pt-8">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 animate-slide-up">
                            <FolderKanban className="h-10 w-10 text-white" />
                        </div>
                        <div className="animate-slide-up space-y-1.5" style={{ animationFillMode: 'both', animationDelay: '100ms' }}>
                            <CardTitle className="text-3xl font-extrabold tracking-tight text-white">Connexion</CardTitle>
                            <CardDescription className="text-neutral-400 text-base">
                                Accédez à votre espace projet sécurisé
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <form onSubmit={formik.handleSubmit}>
                        <CardContent className="space-y-5 animate-slide-up px-8" style={{ animationFillMode: 'both', animationDelay: '200ms' }}>
                            {erreurAPI && (
                                <div className="p-4 text-sm text-red-200 bg-red-950/50 rounded-xl border border-red-500/30 flex items-center gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                                    {erreurAPI}
                                </div>
                            )}
                            <div className="space-y-2.5">
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
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="motDePasse" className="text-neutral-300 font-medium">Mot de passe</Label>
                                    <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">Oublié ?</a>
                                </div>
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
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 px-8 pb-8 pt-4 animate-slide-up" style={{ animationFillMode: 'both', animationDelay: '300ms' }}>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20 h-12 rounded-xl text-base font-semibold transition-all duration-300 border-none" disabled={chargement}>
                                {chargement ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Connexion...</>
                                ) : (
                                    <><LogIn className="mr-2 h-5 w-5" /> Se connecter</>
                                )}
                            </Button>
                            <div className="text-center text-sm text-neutral-400">
                                Pas encore de compte ?{' '}
                                <Link to="/inscription" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                                    S'inscrire
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
