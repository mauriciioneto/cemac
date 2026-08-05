import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const RightSidebar = ({ activeLayer, setActiveLayer, lastWeatherLayer, electricLayers, setElectricLayers, activeSigLayers, setActiveSigLayers, basemap, setBasemap }) => {
  const [openSection, setOpenSection] = useState('weather');

  useEffect(() => {
    if (activeLayer === 'electricalNetwork') setOpenSection('electricalNetwork');
    else if (activeLayer === 'satellite') setOpenSection('satellite');
    else if (activeLayer === 'inmet') setOpenSection('inmet');
    else if (activeLayer.startsWith('funceme_') || activeSigLayers.length > 0) setOpenSection('funceme');
    else if (activeLayer !== 'none') setOpenSection('weather');
  }, [activeLayer, activeSigLayers]);

  const toggleElectricLayer = (layerKey) => {
    setElectricLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const toggleSigLayer = (layerId) => {
    if (!activeSigLayers.includes(layerId)) {
      if (activeLayer !== 'none') {
        setActiveLayer('none');
      }
    }
    setActiveSigLayers(prev => {
      if (prev.includes(layerId)) return prev.filter(id => id !== layerId);
      return [...prev, layerId];
    });
  };

  const essenciais = [
    { id: 'thunder', label: 'Tempestades' },
    { id: 'gust', label: 'Rajadas de vento' },
    { id: 'radar', label: 'Radar meteorológico' },
    { id: 'windySatellite', label: 'Satélite' },
    { id: 'fireDanger', label: 'Perigo de incêndio' },
    { id: 'capAlerts', label: 'Alertas de clima' },
    { id: 'rain', label: 'Chuva, trovão' },
    { id: 'rainAccu', label: 'Acumulação de chuva' },
    { id: 'wind', label: 'Vento' },
    { id: 'temp', label: 'Temperatura' },
    { id: 'rh', label: 'Humidade' }
  ];

  const recomendadas = [
    { id: 'cape', label: 'Índice de CAPE' },
    { id: 'extreme', label: 'Previsões extremas' },
    { id: 'pressure', label: 'Pressão' },
    { id: 'visibility', label: 'Visibilidade' },
    { id: 'fog', label: 'Neblina' },
    { id: 'clouds', label: 'Nuvens' },
    { id: 'cbase', label: 'Base de nuvens' },
    { id: 'dewpoint', label: 'Ponto de orvalho' },
    { id: 'solarpower', label: 'Energia solar' },
    { id: 'uvindex', label: 'Índice UV' }
  ];

  const funcemeLayers = [
    { id: 'funceme_pcd', label: 'Estações PCD' },
    { id: 'funceme_radar', label: 'Radar Meteorológico' },
    { id: 'funceme_satelite', label: 'Satélite' },
    { id: 'funceme_chuvas', label: 'Calendário de Chuvas' },
    { id: 'funceme_focoscalor', label: 'Focos de Calor' },
    { id: 'funceme_apptempo', label: 'Previsão do Tempo' }
  ];

  const nowcastsigLayers = [
    { id: 'precipitacao_superficie_rmt0100ds.json', label: 'Radar Quixeramobim (Chuva)' },
    { id: 'acumulado6h_rtm0100ds.json', label: 'Acumulado de Chuva (6h)' },
    { id: 'municipios_com_chuva_ce.json', label: 'Municípios com Chuva (CE)' },
    { id: 'g16raios_10min.json', label: 'Raios (últimos 10 min)' },
    { id: 'g16raios_10_20min.json', label: 'Raios (10–20 min)' },
    { id: 'g16raios_20_30min.json', label: 'Raios (20–30 min)' },
    { id: 'g16raios_30_40min.json', label: 'Raios (30–40 min)' },
    { id: 'municipios_com_raios_ce.json', label: 'Municípios com Raios (CE)' },
    { id: 'municipios_com_raios_br.json', label: 'Municípios com Raios (BR)' },
    { id: 'ch13.png', label: 'Satélite Infravermelho' },
    { id: 'ch02.png', label: 'Satélite Visível' },
    { id: 'DSI_CAPE.png', label: 'Índice CAPE' },
    { id: 'lightning_overlay.png', label: 'Prob. de Raios' },
    { id: 'Sandwich_overlay.png', label: 'Sandwich (Vis + IR)' },
    { id: 'updraft_overlay2.png', label: 'Updraft' }
  ];

  const allLayers = [...essenciais, ...recomendadas];

  const isRedeEletricaOpen = openSection === 'electricalNetwork';
  const isTempoOpen = openSection === 'weather';

  return (
    <div className="right-sidebar">
      {/* Menu da Rede Elétrica */}
      <div className="sidebar-section">
        <div
          className="sidebar-title"
          onClick={() => {
            if (isRedeEletricaOpen) {
              setOpenSection(null);
            } else {
              setActiveLayer('electricalNetwork');
              setOpenSection('electricalNetwork');
            }
          }}
          style={{ cursor: 'pointer', backgroundColor: isRedeEletricaOpen ? 'rgba(255,255,255,0.1)' : 'transparent', padding: '10px', borderRadius: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: isRedeEletricaOpen ? 'bold' : 'normal' }}>Rede Elétrica AT/MT</span>
          </div>
          {isRedeEletricaOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {/* Opções das sub-camadas (só aparece se a Rede Elétrica estiver ativa) */}
        {isRedeEletricaOpen && (
          <ul className="layer-list">
            <li className="layer-item">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                <input type="checkbox" checked={electricLayers?.linha_at} onChange={() => toggleElectricLayer('linha_at')} style={{ marginRight: '8px', cursor: 'pointer' }} />
                <span>Linhas de Alta Tensão (AT)</span>
              </label>
            </li>
            <li className="layer-item">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                <input type="checkbox" checked={electricLayers?.subestacoes} onChange={() => toggleElectricLayer('subestacoes')} style={{ marginRight: '8px', cursor: 'pointer' }} />
                <span>Subestações</span>
              </label>
            </li>
            <li className="layer-item">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                <input type="checkbox" checked={electricLayers?.conjuntos} onChange={() => toggleElectricLayer('conjuntos')} style={{ marginRight: '8px', cursor: 'pointer' }} />
                <span>Conjuntos (Limites)</span>
              </label>
            </li>
            <li className="layer-item">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                <input type="checkbox" checked={electricLayers?.linha_mt} onChange={() => toggleElectricLayer('linha_mt')} style={{ marginRight: '8px', cursor: 'pointer' }} />
                <span>Linhas de Média Tensão (MT)</span>
              </label>
            </li>
            <li className="layer-item">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                <input type="checkbox" checked={electricLayers?.transformadores} onChange={() => toggleElectricLayer('transformadores')} style={{ marginRight: '8px', cursor: 'pointer' }} />
                <span>Transformadores MT</span>
              </label>
            </li>
            <li className="layer-item">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                <input type="checkbox" checked={electricLayers?.chaves} onChange={() => toggleElectricLayer('chaves')} style={{ marginRight: '8px', cursor: 'pointer' }} />
                <span>Chaves Seccionadoras</span>
              </label>
            </li>
          </ul>
        )}
      </div>

      <div className="sidebar-section">
        <div
          className="sidebar-title"
          onClick={() => {
            if (openSection === 'satellite') {
              setOpenSection(null);
            } else {
              setActiveLayer('satellite');
              setOpenSection('satellite');
            }
          }}
          style={{ cursor: 'pointer', backgroundColor: openSection === 'satellite' ? 'rgba(255,255,255,0.1)' : 'transparent', padding: '10px', borderRadius: '0', display: 'flex', alignItems: 'center' }}
        >
          <span style={{ fontSize: '14px', fontWeight: openSection === 'satellite' ? 'bold' : 'normal' }}>Satélite (GOES-19)</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div
          className="sidebar-title"
          style={{ backgroundColor: isTempoOpen ? 'rgba(255,255,255,0.1)' : 'transparent', padding: '10px', borderRadius: '0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          onClick={() => {
            if (isTempoOpen) {
              setOpenSection(null);
            } else {
              setActiveLayer(lastWeatherLayer || 'wind');
              setOpenSection('weather');
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: isTempoOpen ? 'bold' : 'normal' }}>Tempo no momento</span>
          </div>
          {isTempoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {isTempoOpen && (
          <div>
            <ul className="layer-list">
              {allLayers.map(layer => (
                <li
                  key={layer.id}
                  className={`layer-item ${activeLayer === layer.id ? 'active' : ''}`}
                >
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={activeLayer === layer.id}
                      onChange={() => {
                        if (activeLayer === layer.id) {
                          setActiveLayer('none');
                        } else {
                          setActiveLayer(layer.id);
                        }
                      }}
                    />
                    <span>{layer.label}</span>
                  </label>
                </li>
              ))}
            </ul>

            {/* Controle visual de Transparência igual ao SMAC original */}
            {activeLayer === 'radar' && (
              <div className="transparency-slider" style={{ marginTop: '15px' }}>
                Transparência
                <input type="range" min="0" max="100" defaultValue="70" />
              </div>
            )}
          </div>
        )}

      </div>

      <div className="sidebar-section">
        {/* NOVA SEÇÃO: DADOS FUNCEME */}
        <div 
          className="sidebar-title"
          style={{ 
            backgroundColor: openSection === 'funceme' ? 'rgba(255,255,255,0.1)' : 'transparent', 
            padding: '10px', 
            borderRadius: '0', 
            cursor: 'pointer', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
          onClick={() => {
            if (openSection === 'funceme') {
              setOpenSection(null);
            } else {
              setOpenSection('funceme');
              setActiveLayer('funceme_pcd');
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: openSection === 'funceme' ? 'bold' : 'normal' }}>Dados FUNCEME</span>
          </div>
          {openSection === 'funceme' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSection === 'funceme' && (
          <div>
            <ul className="layer-list">
              {funcemeLayers.map(layer => (
                <li
                  key={layer.id}
                  className={`layer-item ${activeLayer === layer.id ? 'active' : ''}`}
                >
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={activeLayer === layer.id}
                      onChange={() => {
                        if (activeLayer === layer.id) {
                          setActiveLayer('none');
                        } else {
                          setActiveLayer(layer.id);
                          if (activeSigLayers.length > 0) {
                            setActiveSigLayers([]);
                          }
                        }
                      }}
                    />
                    <span>{layer.label}</span>
                  </label>
                </li>
              ))}
            </ul>

            <div style={{ padding: '10px 5px 5px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#999', textTransform: 'uppercase' }}>Camadas SIG (Nativas)</span>
            </div>
            
            <ul className="layer-list" style={{ marginTop: '5px' }}>
              {nowcastsigLayers.map(layer => (
                <li
                  key={layer.id}
                  className={`layer-item ${activeSigLayers.includes(layer.id) ? 'active' : ''}`}
                >
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={activeSigLayers.includes(layer.id)}
                      onChange={() => toggleSigLayer(layer.id)}
                    />
                    <span>{layer.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
