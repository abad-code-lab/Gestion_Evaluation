import React, { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const SimplePDFPreview = ({ file }) => {
  const [fileUrl, setFileUrl] = useState(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      return () => {
        URL.revokeObjectURL(url);
        setFileUrl(null);
      };
    }
  }, [file]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[95vw] h-[90vh] bg-white rounded shadow-md border border-gray-300 overflow-hidden">
        {fileUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
            <Viewer
              fileUrl={fileUrl}
              plugins={[defaultLayoutPluginInstance]}
            />
          </Worker>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Aucun fichier PDF sélectionné
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplePDFPreview;
