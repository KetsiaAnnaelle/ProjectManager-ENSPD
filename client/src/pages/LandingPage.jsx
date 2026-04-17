import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-blue-200">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-sm py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/30">
                            <FolderKanban className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-extrabold text-neutral-900 tracking-tight">ProjetManager</span>
                    </div>
                    <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                        <Link to="/connexion" className="text-sm font-semibold text-neutral-600 hover:text-blue-600 transition-colors hidden sm:block">
                            Connexion
                        </Link>
                        <Link to="/inscription">
                            <Button className="bg-neutral-900 hover:bg-black text-white hover:scale-105 border-0 shadow-xl shadow-neutral-900/20 rounded-xl px-6 h-11 transition-all">
                                Commencer
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-bold shadow-sm animate-slide-up" style={{ animationFillMode: 'both', animationDelay: '300ms' }}>
                                <Sparkles className="h-4 w-4 animate-pulse" />
                                Plateforme N°1 en Europe
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 leading-[1.1] animate-slide-up" style={{ animationFillMode: 'both', animationDelay: '400ms' }}>
                                L'outil <span className="text-blue-600">Premium</span> pour vos projets.
                            </h1>
                            <p className="text-xl text-neutral-600 max-w-lg leading-relaxed font-medium animate-slide-up" style={{ animationFillMode: 'both', animationDelay: '500ms' }}>
                                Planifiez, collaborez et livrez vos projets en toute simplicité. Conçu spécifiquement pour les équipes ambitieuses.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up" style={{ animationFillMode: 'both', animationDelay: '600ms' }}>
                                <Link to="/inscription">
                                    <Button className="w-full sm:w-auto h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-2xl shadow-blue-600/40 group hover:-translate-y-1 transition-all duration-300">
                                        Essai Gratuit
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link to="/connexion">
                                    <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-base bg-white border-2 border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-xl hover:-translate-y-1 transition-all duration-300 font-semibold">
                                        Se connecter
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-in" style={{ animationFillMode: 'both', animationDelay: '700ms' }}>
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-[120px] opacity-20 animate-pulse-slow"></div>
                            <img 
                                src="/images/hero.png" 
                                alt="Équipe professionnelle collaborant sur un projet" 
                                className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-2xl border-4 border-white transform hover:rotate-0 transition-transform duration-700 animate-float"
                            />
                            {/* Floating Element */}
                            <div className="absolute -left-12 bottom-1/4 z-20 bg-white p-5 rounded-2xl shadow-2xl shadow-neutral-900/10 border border-neutral-100 animate-slide-up" style={{ animationDelay: '1000ms', animationFillMode: 'both' }}>
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-xl text-green-600 shadow-inner">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-neutral-900">Projet livré</p>
                                        <p className="text-sm font-medium text-neutral-500">Il y a 2 minutes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 bg-white relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
                        <div className="bg-blue-50 text-blue-600 font-bold inline-flex px-4 py-1.5 rounded-full text-sm mb-4">
                            <Zap className="h-4 w-4 mr-2" /> Fonctionnalités
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 mb-6 font-sans">Tout ce dont vous avez besoin</h2>
                        <p className="text-xl text-neutral-600 font-medium">
                            Une interface qui va à l'essentiel et révèle toute sa puissance.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <Clock className="h-8 w-8 text-blue-600" />,
                                bg: "bg-blue-50",
                                title: "Gain de temps absolu",
                                desc: "Automatisez vos suivis et concentrez-vous sur l'action plutôt que la gestion."
                            },
                            {
                                icon: <Users className="h-8 w-8 text-indigo-600" />,
                                bg: "bg-indigo-50",
                                title: "Collaboration Unifiée",
                                desc: "Vos équipes peuvent interagir instantanément sur la moindre tâche du projet."
                            },
                            {
                                icon: <BarChart3 className="h-8 w-8 text-rose-600" />,
                                bg: "bg-rose-50",
                                title: "Métriques & Suivi",
                                desc: "Prenez de meilleures décisions grâce aux tableaux de bords ultra clairs."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="relative group bg-neutral-50 hover:bg-white p-10 rounded-3xl border-2 border-neutral-100 hover:border-blue-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-default animate-slide-up hover:-translate-y-2 overflow-hidden" style={{ animationDelay: `${index * 200}ms`, animationFillMode: 'both' }}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-bl-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className={`relative z-10 h-16 w-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                    {feature.icon}
                                </div>
                                <h3 className="relative z-10 text-2xl font-bold text-neutral-900 mb-4">{feature.title}</h3>
                                <p className="relative z-10 text-neutral-600 text-lg font-medium leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Section (Secondary Image) */}
            <section className="py-32 bg-neutral-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative group animate-fade-in" style={{ animationFillMode: 'both' }}>
                            <img 
                                src="/images/collab.png" 
                                alt="Professionnelle concentrée" 
                                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl shadow-black/50 border-4 border-neutral-800 transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <div className="bg-indigo-900/50 text-indigo-300 font-bold inline-flex items-center px-4 py-2 rounded-xl text-sm mb-2 shadow-inner border border-indigo-500/20 animate-slide-up" style={{ animationFillMode: 'both' }}>
                                <ShieldCheck className="h-5 w-5 mr-2" /> Sécurité maximale
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                                Concentrez-vous sur vos objectifs.
                            </h2>
                            <p className="text-xl text-neutral-400 leading-relaxed font-medium animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                                Les professionnels les plus exigeants utilisent notre solution pour piloter leurs projets complexes. Un environnement d'une fiabilité totale.
                            </p>
                            <ul className="space-y-6 pt-6 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                                {[
                                    "Accès 100% protégé et sécurisé", 
                                    "Hébergement de données en Europe", 
                                    "Support technique réactif 24/7"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center text-lg font-medium text-neutral-200">
                                        <div className="bg-blue-600/20 p-2 rounded-xl text-blue-400 mr-4 border border-blue-500/30">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <footer className="bg-blue-600 py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 animate-slide-up">Prêt à dominer vos projets ?</h2>
                    <p className="text-blue-100 font-medium mb-12 text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
                        Inscrivez-vous en 30 secondes et découvrez notre interface taillée pour la performance.
                    </p>
                    <Link to="/inscription">
                        <Button className="bg-white hover:bg-neutral-50 text-blue-700 h-16 px-12 text-xl font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
                            Créer mon compte
                        </Button>
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
