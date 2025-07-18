import React, { useState, useEffect } from 'react';

export const FancyRedirectLoader = ({ onComplete, duration = 5000 }) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Calculer l'intervalle pour une animation fluide (environ 60 FPS)
    const intervalTime = 16; // ~60fps
    const increment = (intervalTime / duration) * 100;
    
    // Démarrer l'animation de progression
    const progressInterval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + increment;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, intervalTime);
    
    // Configurer la fin du chargement
    const timer = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Petit délai pour assurer que la barre arrive à 100%
      setTimeout(() => {
        setLoading(false);
        if (onComplete) onComplete();
      }, 300);
    }, duration);
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  return (
    <div className={`impressive-loader ${!loading ? 'fade-out' : ''}`}>
      <div className="loader-container center-align" style={{ padding: '2rem' }}>
        <div className="spinner-layer spinner-blue">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>

        <div className="spinner-layer spinner-red">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>

        <div className="spinner-layer spinner-yellow">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>

        <div className="spinner-layer spinner-green">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
        
        <h4 className="white-text pulse">Traitement en cours...</h4>
        
        <div className="progress">
          <div 
            className="determinate" 
            style={{ width: `${progress}%`, transition: 'width 0.1s ease-out' }}
          ></div>
        </div>
        
        <div className="row">
          <div className="col s12">
            <div className="progress-text white-text">
              <span className="flow-text">Chargement des données {Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .impressive-loader {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: opacity 0.5s ease;
        }
        
        .fade-out {
          opacity: 0;
          pointer-events: none;
        }
        
        .loader-container {
          background-color: #263238;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          width: 90%;
          max-width: 500px;
          padding: 2rem;
          animation: scale-up 0.5s ease-out;
        }
        
        @keyframes scale-up {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .progress {
          height: 10px;
          border-radius: 5px;
          background-color: #37474f;
          margin: 2rem 0;
          overflow: hidden;
        }
        
        .determinate {
          background: linear-gradient(90deg, #2196F3, #00BCD4, #4CAF50, #FFEB3B, #FF9800, #F44336);
          background-size: 400% 400%;
          animation: gradient 3s ease infinite;
          height: 100%;
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};