import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../store/AuthContext';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { X, Send, Paperclip, FileText, Download, CheckCircle2, Clock, CircleDashed } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskModal = ({ tache, onClose, projetId }) => {
    const { utilisateur } = useContext(AuthContext);
    const [commentaires, setCommentaires] = useState([]);
    const [nouveauCommentaire, setNouveauCommentaire] = useState('');
    const [fichierSelectionne, setFichierSelectionne] = useState(null);
    const [chargement, setChargement] = useState(true);
    const commentsEndRef = useRef(null);

    // Fonction pour scroller en bas
    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const chargerCommentaires = async () => {
            try {
                const res = await api.get(`/commentaires/tache/${tache.id}`);
                setCommentaires(res.data);
            } catch (err) {
                console.error("Erreur de chargement des commentaires", err);
            } finally {
                setChargement(false);
            }
        };

        if (tache) {
            chargerCommentaires();
        }
    }, [tache]);

    useEffect(() => {
        scrollToBottom();
    }, [commentaires]);

    const handleEnvoyerCommentaire = async (e) => {
        e.preventDefault();
        if (!nouveauCommentaire.trim()) return;

        try {
            const res = await api.post(`/commentaires/tache/${tache.id}`, { contenu: nouveauCommentaire });
            // On ajoute localement en attendant que le socket ou le rechargement fasse le reste
            setCommentaires(prev => [...prev, {
                id: res.data.idCommentaire,
                contenu: nouveauCommentaire,
                utilisateur_id: utilisateur.id,
                nom: utilisateur.nom,
                date_creation: new Date().toISOString()
            }]);
            setNouveauCommentaire('');
            toast.success("Commentaire envoyé");
        } catch (err) {
            toast.error("Erreur lors de l'envoi du commentaire");
        }
    };

    const handleUpload = async () => {
        if (!fichierSelectionne) return;
        const formData = new FormData();
        formData.append('fichier', fichierSelectionne);

        try {
            const res = await api.post(`/taches/${tache.id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Fichier uploadé avec succès");
            tache.fichier_attache = res.data.cheminFichier; // Update local state for display
            setFichierSelectionne(null);
        } catch (err) {
            toast.error("Erreur d'upload");
        }
    };

    if (!tache) return null;

    const StatusBadge = ({ statut }) => {
        if (statut === 'Terminé') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3" /> Terminé</span>;
        if (statut === 'En cours') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><Clock className="w-3 h-3" /> En cours</span>;
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"><CircleDashed className="w-3 h-3" /> À faire</span>;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <StatusBadge statut={tache.statut} />
                        <h2 className="text-xl font-bold text-slate-800">{tache.titre}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Colonne gauche: Infos */}
                    <div className="md:w-1/2 p-6 border-r border-slate-100 overflow-y-auto space-y-6 bg-white">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
                                {tache.description || "Aucune description fournie pour cette tâche."}
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Fichiers joints</h3>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                                {tache.fichier_attache ? (
                                    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-blue-500" />
                                            <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                                                {tache.fichier_attache.split('/').pop()}
                                            </span>
                                        </div>
                                        <a 
                                            href={`http://localhost:5000${tache.fichier_attache}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Télécharger le fichier"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">Aucun fichier attaché.</p>
                                )}

                                {/* Zone Upload */}
                                <div className="pt-2 border-t border-slate-200">
                                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Ajouter un fichier</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="file" 
                                            onChange={(e) => setFichierSelectionne(e.target.files[0])}
                                            className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                        />
                                        <Button size="sm" onClick={handleUpload} disabled={!fichierSelectionne} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                                            Uploader
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonne droite: Commentaires */}
                    <div className="md:w-1/2 flex flex-col bg-slate-50/30">
                        <div className="p-4 border-b border-slate-100 bg-white">
                            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                Échanges et Commentaires
                            </h3>
                        </div>
                        
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {chargement ? (
                                <div className="text-center text-slate-400 py-8">Chargement...</div>
                            ) : commentaires.length === 0 ? (
                                <div className="text-center text-slate-400 py-8 italic text-sm">Soyez le premier à commenter cette tâche.</div>
                            ) : (
                                commentaires.map((c) => {
                                    const isMe = c.utilisateur_id === utilisateur.id;
                                    return (
                                        <div key={c.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <span className="text-[10px] text-slate-400 mb-1 ml-1 mr-1">{c.nom}</span>
                                            <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'}`}>
                                                {c.contenu}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={commentsEndRef} />
                        </div>

                        {/* Input Commentaire */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <form onSubmit={handleEnvoyerCommentaire} className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={nouveauCommentaire}
                                    onChange={(e) => setNouveauCommentaire(e.target.value)}
                                    placeholder="Écrivez un commentaire..." 
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                />
                                <Button type="submit" size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 shrink-0" disabled={!nouveauCommentaire.trim()}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
