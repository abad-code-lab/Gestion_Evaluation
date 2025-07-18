import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

export default function AppCalendar() {
    const externalEventsRef = useRef(null);
    const [removeAfterDrop, setRemoveAfterDrop] = useState(false);

    const events = [
        { title: 'Date de Fermeture ', color: '#009688' },
        { title: 'Date de Soutenance', color: '#4CAF50' },
        { title: 'Graduation', color: '#ff5722' },
        { title: 'Gamou', color: '#3f51b5' },
        { title: 'Marriage', color: '#e91e63' }
    ];
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    useEffect(() => {
        // Make the divs draggable
        new Draggable(externalEventsRef.current, {
            itemSelector: '.fc-event',
            eventData: function (eventEl) {
                return {
                    title: eventEl.innerText,
                    color: eventEl.getAttribute('data-color'),
                };
            },
        });
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 h-full bg-white">
            {/* Draggable events section */}
            <div className="md:w-64 w-full">
                <div className="bg-gray-50 rounded-lg shadow-md p-4 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Evenements a Glisser</h2>
                    <div ref={externalEventsRef} className="space-y-2">
                        {events.map((event, index) => (
                            <div
                                key={index}
                                className="fc-event p-2 rounded-md text-white cursor-move text-sm font-medium shadow-sm transition-transform hover:scale-105"
                                data-color={event.color}
                                style={{ backgroundColor: event.color }}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center">
                        <input
                            type="checkbox"
                            id="drop-remove"
                            className="mr-2 h-4 w-4 text-blue-600"
                            checked={removeAfterDrop}
                            onChange={e => setRemoveAfterDrop(e.target.checked)}
                        />
                        <label htmlFor="drop-remove" className="text-sm text-gray-700">
                            Remove after drop
                        </label>
                    </div>
                </div>
            </div>

            {/* Calendar section */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek,dayGridDay'
                    }}
                    editable={true}
                    droppable={true}
                    eventReceive={(info) => {
                        if (removeAfterDrop && info.draggedEl.parentNode) {
                            info.draggedEl.parentNode.removeChild(info.draggedEl);
                        }
                    }}
                    height="700px"
                    eventColor="#378006"
                    themeSystem="standard"
                    dayMaxEvents={true}
                    weekends={true}
                    eventBackgroundColor="#3788d8"
                    eventBorderColor="#3788d8"
                    eventTextColor="#fff"
                />
            </div>
        </div>
    );
}