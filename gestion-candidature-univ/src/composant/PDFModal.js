import React, { useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Modal component for PDF viewer with enhanced design
export const PDFModal = ({ isOpen, onClose, file, title }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  
  // S'assurer que l'URL du fichier est créée et révoquée correctement
  const [fileUrl, setFileUrl] = React.useState(null);
  
  useEffect(() => {
    // Créer l'URL du fichier quand le modal est ouvert et le fichier existe
    if (isOpen && file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      
      // Nettoyer l'URL quand le composant est démonté ou quand les props changent
      return () => {
        URL.revokeObjectURL(url);
        setFileUrl(null);
      };
    }
  }, [isOpen, file]);
  
  if (!isOpen) return null;
  
  // Spécifier explicitement la même version pour le Worker
  const workerUrl = 'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js';
  
  return (
    <div id="modal-justificatif" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-11/12 h-5/6 max-w-6xl flex flex-col shadow-2xl transform transition-all duration-300">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-xl">
  <h5 className="font-bold text-xl text-gray-800 dark:text-white flex items-center">
    <i className="material-icons font-bold  text-xl mr-2">description</i>
    {title || "Justificatif"}
  </h5>
  <div className="right-align">
  <button 
    onClick={onClose}
    className="btn waves-effect waves-light red right-align"
  >
    <i className="material-icons left">close</i>
    Fermer
  </button>
</div>
</div>

        {/* Modal Body - PDF Viewer */}
        <div className="flex-grow p-4 bg-gray-100 dark:bg-gray-700 overflow-hidden">
          {fileUrl ? (
            <div className="w-full h-full rounded-lg overflow-hidden shadow-inner border border-gray-200 dark:border-gray-600">
               <Worker workerUrl={`${process.env.PUBLIC_URL}/pdf.worker.min.js`}>
                <div style={{ width: '100%', height: '100%' }}>
                  <Viewer
                    fileUrl={fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                    renderError={(error) => (
                      <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-900 rounded-lg">
                         <i className="material-icons font-bold text-red-500">close</i>
                        <p className="text-red-600 dark:text-red-400 text-lg font-medium mb-2">Erreur d'affichage du PDF</p>
                        <p className="text-gray-600 dark:text-gray-300">{error.message}</p>
                      </div>
                    )}
                  />
                </div>
              </Worker>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-900 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Aucun document à afficher</p>
            </div>
          )}
        </div>
        
        {/* Modal Footer */}
        <div className="modal-footer center-align">
  <button 
    onClick={onClose}
    className="btn waves-effect waves-light red"
  >
    <i className="material-icons left">close</i>
    Fermer
  </button>
</div>
      </div>
    </div>
  );
};

export default PDFModal;