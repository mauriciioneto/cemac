import React from 'react';

const CircularProgress = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#202124', // Escuro para combinar com o tema do app e esconder o iframe carregando
      zIndex: 99, // Menor que o z-index da sidebar (1000) para não cobrir o menu
      transition: 'opacity 0.3s ease-out'
    }}>
      <svg className="mdc-circular-progress" viewBox="25 25 50 50" style={{ width: '48px', height: '48px', animation: 'mdc-circular-progress-rotate 2s linear infinite', willChange: 'transform' }}>
        <circle 
          className="mdc-circular-progress__path" 
          cx="50" cy="50" r="20" 
          fill="none" 
          stroke="#2b78d1" 
          strokeWidth="4" 
          strokeMiterlimit="10"
          style={{
            strokeDasharray: '1, 200',
            strokeDashoffset: '0',
            animation: 'mdc-circular-progress-dash 1.5s ease-in-out infinite',
            strokeLinecap: 'round',
            willChange: 'stroke-dasharray, stroke-dashoffset'
          }}
        />
      </svg>
      <style>{`
        @keyframes mdc-circular-progress-rotate {
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes mdc-circular-progress-dash {
          0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
          }
          100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
          }
        }
      `}</style>
    </div>
  );
};

export default CircularProgress;
