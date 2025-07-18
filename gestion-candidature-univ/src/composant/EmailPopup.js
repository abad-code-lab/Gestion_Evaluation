import React, { useEffect, useState } from 'react';
import { createEnvoyerMailGroupe } from '../ServiceAPi/Microservice-AppelCandidature';

export const EmailPopup = ({type}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [emailData, setEmailData] = useState({
        subject: '',
        content: '',
        type
    });
    const [isSending, setIsSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setStatusMessage('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailData({
            ...emailData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        // Réinitialiser le message de statut
        setStatusMessage('');
        
        // Validation approfondie
        const errors = [];
        
        if (!emailData.subject.trim()) {
            errors.push('Le sujet est obligatoire');
        }
        
        if (!emailData.content.trim()) {
            errors.push('Le contenu de l\'email est obligatoire');
        }
        //  else if (!emailData.content.includes('{{prenom}}') || !emailData.content.includes('{{nom}}')) {
        //     // Vérifier la présence des variables de personnalisation
        //     errors.push('Le contenu doit contenir les variables {{prenom}} et {{nom}} pour la personnalisation');
        // }
        
        // Vérifier si des erreurs ont été détectées
        if (errors.length > 0) {
            setStatusMessage(errors.join('. '));
            return;
        }
    
        // Démarrer le processus d'envoi
        setIsSending(true);
        setStatusMessage('Envoi en cours...');
    
        try {
            // Appel à l'API d'envoi de mail avec gestion de la réponse
            const response = await createEnvoyerMailGroupe(emailData);
            
            // Vérifier la réponse de l'API
            if (response && response.status===200) {
                // Envoi réussi
                setStatusMessage('Emails envoyés avec succès!');
                
                // Journaliser les informations (facultatif)
                console.log(`Envoi réussi à ${response.sentCount || 'plusieurs'} destinataires`);
                
                // Fermer la fenêtre et réinitialiser le formulaire après un court délai
                setTimeout(() => {
                    handleClose();
                    setEmailData({ subject: '', content: '', recipients: [] });
                }, 2000);
            } else {
                // L'API a retourné une erreur
                setStatusMessage(`Échec de l'envoi: ${response?.message || 'Erreur inconnue'}`);
            }
        } catch (error) {
            // Erreur réseau ou exception lors de l'appel API
            console.error('Erreur lors de l\'envoi:', error);
            setStatusMessage(`Erreur lors de l'envoi: ${error.message || 'Veuillez réessayer'}`);
        } finally {
            setIsSending(false);
        }
    };
    return (
        <div>
            {/* Bouton pour ouvrir la popup */}
            <button
                onClick={handleOpen}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {/* Envoyer un email groupé */}
            </button>

            {/* Overlay et popup */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-50">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-indigo-900">Envoyer un email groupé</h3>
                                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="subject">
                                    Objet *
                                </label>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    value={emailData.subject}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="content">
                                    Contenu du message *
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={emailData.content}
                                    onChange={handleChange}
                                    rows="15"
                                    style={{
                                      width: "100%",
                                      minHeight: "300px",
                                      resize: "none", // empêche le redimensionnement manuel
                                      fontSize: "16px", // meilleure lisibilité
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                ></textarea>
                            </div>

                            {statusMessage && (
                                <div className={`mb-4 p-2 rounded ${statusMessage.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {statusMessage}
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                                    disabled={isSending}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    disabled={isSending}
                                >
                                    {isSending ? 'Envoi en cours...' : 'Envoyer'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
