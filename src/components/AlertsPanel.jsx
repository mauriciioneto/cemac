import React from 'react';
import { X, AlertTriangle, CloudLightning, Wind, Umbrella } from 'lucide-react';
import './AlertsPanel.css';

const AlertsPanel = ({ alerts, onClose }) => {
  return (
    <div className="alerts-panel">
      <div className="alerts-header">
        <h2>Alertas INMET ({alerts.length})</h2>
        <button className="close-alerts-btn" onClick={onClose} title="Fechar Painel">
          <X size={24} />
        </button>
      </div>

      <div className="alerts-content">
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <p>Não há alertas severos no momento.</p>
          </div>
        ) : (
          alerts.map((alerta) => (
            <div key={alerta.id} className="alert-card" style={{ borderLeftColor: alerta.aviso_cor || '#ccc' }}>
              <div className="alert-card-header">
                <div className="alert-title">
                  <AlertTriangle size={18} color={alerta.aviso_cor || '#ccc'} />
                  <h3>{alerta.descricao}</h3>
                </div>
                <span className="alert-severity" style={{ backgroundColor: alerta.aviso_cor || '#ccc', color: alerta.aviso_cor === '#FFFE00' ? '#333' : '#fff' }}>
                  {alerta.severidade}
                </span>
              </div>
              
              <div className="alert-location" style={{ marginBottom: '10px', fontSize: '13px', color: '#003a5c', fontWeight: '500' }}>
                📍 Estados: {alerta.estados || 'Não especificado'}
              </div>
              
              <div className="alert-time">
                <p><strong>Início:</strong> {alerta.inicio}</p>
                <p><strong>Fim:</strong> {alerta.fim}</p>
              </div>

              {alerta.riscos && alerta.riscos.length > 0 && (
                <div className="alert-section">
                  <h4>Riscos:</h4>
                  <ul>
                    {alerta.riscos.map((risco, idx) => (
                      <li key={idx}>{risco}</li>
                    ))}
                  </ul>
                </div>
              )}

              {alerta.instrucoes && alerta.instrucoes.length > 0 && (
                <div className="alert-section">
                  <h4>Instruções:</h4>
                  <ul>
                    {alerta.instrucoes.map((inst, idx) => (
                      <li key={idx}>{inst}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
