import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr'; // Pour mettre le calendrier en français
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CheckCircle2, Clock, CircleDashed } from 'lucide-react';

moment.locale('fr');
const localizer = momentLocalizer(moment);

const ProjectCalendar = ({ taches, onTacheClick }) => {
    
    // On formate les tâches pour qu'elles correspondent au format attendu par react-big-calendar
    const events = taches.map(tache => {
        // L'échéance sert de date de début et de fin pour avoir un événement sur la journée
        const dateEcheance = tache.echeance ? new Date(tache.echeance) : new Date();
        return {
            id: tache.id,
            title: tache.titre,
            start: dateEcheance,
            end: dateEcheance,
            allDay: true,
            resource: tache // On garde l'objet entier pour pouvoir l'utiliser
        };
    });

    const eventStyleGetter = (event, start, end, isSelected) => {
        const statut = event.resource.statut;
        let backgroundColor = '#3b82f6'; // Bleu par défaut (À faire)
        let borderColor = '#2563eb';

        if (statut === 'En cours') {
            backgroundColor = '#f59e0b'; // Orange
            borderColor = '#d97706';
        } else if (statut === 'Terminé') {
            backgroundColor = '#10b981'; // Vert
            borderColor = '#059669';
        }

        const style = {
            backgroundColor,
            borderRadius: '5px',
            opacity: 0.9,
            color: 'white',
            border: `1px solid ${borderColor}`,
            display: 'block',
            fontWeight: '600',
            fontSize: '0.8rem',
            padding: '2px 5px'
        };
        return {
            style: style
        };
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-4" style={{ height: '700px' }}>
            <div className="flex gap-4 mb-4 text-xs font-semibold">
                <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded"><CircleDashed className="w-3 h-3"/> À faire</span>
                <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded"><Clock className="w-3 h-3"/> En cours</span>
                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded"><CheckCircle2 className="w-3 h-3"/> Terminé</span>
            </div>
            
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100% - 40px)' }}
                messages={{
                    next: "Suivant",
                    previous: "Précédent",
                    today: "Aujourd'hui",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour",
                    agenda: "Planning"
                }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => onTacheClick(event.resource)}
                views={['month', 'week', 'day']}
            />
        </div>
    );
};

export default ProjectCalendar;
