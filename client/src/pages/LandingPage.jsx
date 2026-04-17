import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthContext } from '../store/AuthContext';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Zap,
  LayoutDashboard
} from 'lucide-react';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const { utilisateur } = useContext(AuthContext);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Intersection Observer pour les animations au scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    // Retirer cette ligne si on veut que l'animation ne se joue qu'une seule fois
                    entry.target.classList.remove('is-visible');
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 font-sans text-neutral-900 dark:text-neutral-50 selection:bg-blue-200">
            <style>{`
                .reveal-on-scroll {
                    opacity: 0;
                    transform: translateY(40px);
                    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .reveal-on-scroll.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .reveal-delay-100 { transition-delay: 100ms; }
                .reveal-delay-200 { transition-delay: 200ms; }
                .reveal-delay-300 { transition-delay: 300ms; }
                .reveal-delay-400 { transition-delay: 400ms; }
                .reveal-delay-500 { transition-delay: 500ms; }
            `}</style>
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 shadow-sm py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/30">
                            <FolderKanban className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">ProjetManager</span>
                    </div>
                    <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                        {utilisateur ? (
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-sm hidden sm:block">Salut, {utilisateur.nom}</span>
                                <Link to="/dashboard">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 shadow-md">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Tableau de bord
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link to="/connexion" className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block">
                                    Connexion
                                </Link>
                                <Link to="/inscription">
                                    <Button className="bg-neutral-900 dark:bg-white hover:bg-black dark:hover:bg-neutral-200 text-white dark:text-neutral-900 hover:scale-105 border-0 shadow-xl shadow-neutral-900/20 dark:shadow-white/10 rounded-xl px-6 h-11 transition-all">
                                        Commencer
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 z-10">
                           
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 leading-[1.1] reveal-on-scroll reveal-delay-100">
                                L'outil <span className="text-blue-600">Premium</span> pour vos projets.
                            </h1>
                            <p className="text-xl text-neutral-600 max-w-lg leading-relaxed font-medium reveal-on-scroll reveal-delay-200">
                                Planifiez, collaborez et livrez vos projets en toute simplicité. Conçu spécifiquement pour les équipes ambitieuses.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 reveal-on-scroll reveal-delay-300">
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

                        <div className="relative lg:h-[600px] flex items-center justify-center reveal-on-scroll reveal-delay-400">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-[120px] opacity-20 animate-pulse-slow"></div>
                            <img 
                                src="/images/hero.png" 
                                alt="Équipe professionnelle collaborant sur un projet" 
                                className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-2xl border-4 border-white dark:border-neutral-800 transition-transform duration-700"
                            />
                            {/* Floating Element */}
                            <div className="absolute -left-12 bottom-1/4 z-20 bg-white p-5 rounded-2xl shadow-2xl shadow-neutral-900/10 border border-neutral-100 reveal-on-scroll reveal-delay-500">
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
            <section className="py-32 bg-white relative z-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20 reveal-on-scroll">
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
                            <div key={index} className="relative group bg-neutral-50 dark:bg-neutral-900 p-10 rounded-3xl border border-red-500 shadow-md shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-2 transition-all duration-500 cursor-default reveal-on-scroll overflow-hidden" style={{ transitionDelay: `${index * 150}ms` }}>
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
                        <div className="order-2 lg:order-1 relative group reveal-on-scroll">
                            <img 
                                src="/images/collab.png" 
                                alt="Professionnelle concentrée" 
                                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl shadow-black/50 border-4 border-neutral-800 transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <div className="bg-indigo-900/50 text-indigo-300 font-bold inline-flex items-center px-4 py-2 rounded-xl text-sm mb-2 shadow-inner border border-indigo-500/20 reveal-on-scroll">
                                <ShieldCheck className="h-5 w-5 mr-2" /> Sécurité maximale
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight reveal-on-scroll reveal-delay-100">
                                Concentrez-vous sur vos objectifs.
                            </h2>
                            <p className="text-xl text-neutral-400 leading-relaxed font-medium reveal-on-scroll reveal-delay-200">
                                Les professionnels les plus exigeants utilisent notre solution pour piloter leurs projets complexes. Un environnement d'une fiabilité totale.
                            </p>
                            <ul className="space-y-6 pt-6 reveal-on-scroll reveal-delay-300">
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

            {/* Nouveau Footer Professionnel */}
            <footer className="bg-neutral-950 pt-20 pb-10 border-t border-neutral-800 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 reveal-on-scroll">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg">
                                    <FolderKanban className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-extrabold text-white tracking-tight">ProjetManager</span>
                            </div>
                            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                                La plateforme nouvelle génération pour planifier, concevoir et livrer vos projets avec une efficacité redoutable.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-semibold mb-6">Produit</h4>
                            <ul className="space-y-4 text-sm text-neutral-400">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Fonctionnalités</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Tarifs</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Sécurité</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Mises à jour</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-semibold mb-6">Ressources</h4>
                            <ul className="space-y-4 text-sm text-neutral-400">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Guides pratiques</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Centre d'aide</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">Prêt à commencer ?</h4>
                            <p className="text-sm text-neutral-400 mb-6">
                                Rejoignez plus de 10 000 équipes qui gèrent déjà leurs projets plus intelligemment.
                            </p>
                            <Link to="/inscription">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-xl transition-all">
                                    Créer un compte
                                </Button>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
                        <p>© {new Date().getFullYear()} ProjetManager. Tous droits réservés.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Conditions Générales</a>
                            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
                            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
