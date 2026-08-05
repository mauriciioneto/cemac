import React, { useState } from 'react';
import { Menu, Globe, Bell, Volume2, Power, User, Settings, X } from 'lucide-react';

import { supabase } from '../supabaseClient';

const Header = ({ toggleSidebar, isSidebarOpen, session, alertsCount, toggleAlerts }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  const openProfile = () => {
    setShowProfile(true);
    setIsMenuOpen(false);
  };

  const openSettings = () => {
    setShowSettings(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="smac-header">
        <div className="header-left">
          <button className={`menu-btn ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <div className="logo-area" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/LOGO_CEMAC.svg" alt="CEMAC Logo" draggable="false" style={{ height: '30px', marginRight: '10px', pointerEvents: 'none', userSelect: 'none' }} />
          </div>
        </div>
        <div className="header-right">
          
          <div className="header-item" style={{ position: 'relative' }}>
            <div 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
            >
              <span>{session?.user?.email || 'Acesso Pessoal'}</span>
              <span style={{ fontSize: '10px' }}>▼</span>
            </div>
            
            {isMenuOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={openProfile}>
                  <User size={16} /> Meu Perfil
                </div>
                <div className="dropdown-item" onClick={openSettings}>
                  <Settings size={16} /> Configurações
                </div>
              </div>
            )}
          </div>
          
          <div className="header-item alert-badge" onClick={toggleAlerts} style={{ cursor: 'pointer' }}>
            <Bell size={18} />
            <span>Alertas ({alertsCount || 0})</span>
          </div>
          
          <div className="header-item">
            <Volume2 size={18} />
          </div>
          
          <button className="logout-btn" title="Sair" onClick={handleLogout}>
            <Power size={20} />
          </button>
        </div>
      </header>

      {/* Modais Flutuantes */}
      {showProfile && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Meu Perfil</h3>
              <button className="modal-close" onClick={() => setShowProfile(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <p><strong>Usuário:</strong> {session?.user?.email}</p>
              <p><strong>ID:</strong> {session?.user?.id}</p>
              <p><strong>Último Login:</strong> {new Date(session?.user?.last_sign_in_at).toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Configurações</h3>
              <button className="modal-close" onClick={() => setShowSettings(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <input type="checkbox" id="chk-darkmode" />
                <label htmlFor="chk-darkmode">Modo Escuro (Em breve)</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="chk-coords" defaultChecked />
                <label htmlFor="chk-coords">Exibir coordenadas no mouse</label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
