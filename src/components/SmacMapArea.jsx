import React, { useState, useEffect } from 'react';
import CircularProgress from './CircularProgress';
import { MapContainer, TileLayer } from 'react-leaflet';
import InmetStationsLayer from './InmetStationsLayer';
import FuncemeNowcastSigLayer from './FuncemeNowcastSigLayer';
import MapLegend from './MapLegend';
import 'leaflet/dist/leaflet.css';

const SmacMapArea = ({ activeLayer, lastWeatherLayer, weatherOverlays, activeSigLayers = [] }) => {
  const [position] = useState({ lat: -15.793, lon: -47.882, zoom: 4 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeLayer === 'inmet' || activeLayer === 'electricalNetwork' || activeSigLayers.length > 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [activeLayer, lastWeatherLayer, activeSigLayers]);

  const handleIframeLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const isSatellite = activeLayer === 'satellite';
  const isInmet = activeLayer === 'inmet';
  
  // Apenas as camadas que restaram no iFrame do FUNCEME
  const isFunceme = activeLayer === 'funceme_pcd' || 
                    activeLayer === 'funceme_radar' || 
                    activeLayer === 'funceme_satelite' || 
                    activeLayer === 'funceme_chuvas' || 
                    activeLayer === 'funceme_focoscalor' || 
                    activeLayer === 'funceme_apptempo';

  const isWeatherLayer = activeLayer !== 'satellite' && activeLayer !== 'electricalNetwork' && activeLayer !== 'inmet' && !isFunceme && activeLayer !== 'none';
  const effectiveWindyLayer = isWeatherLayer ? activeLayer : (lastWeatherLayer || 'wind');

  let windyOverlay = effectiveWindyLayer === 'windySatellite' ? 'satellite' : effectiveWindyLayer;
  let windyProduct = 'ecmwf';
  if (effectiveWindyLayer === 'fireDanger') {
    windyOverlay = 'fwi'; windyProduct = 'fireDanger';
  } else if (effectiveWindyLayer === 'extreme') {
    windyOverlay = 'efiTemp'; windyProduct = 'efi';
  }

  let windyIframeUrl = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km%2Fh&zoom=${position.zoom}&overlay=${windyOverlay}&level=surface&lat=${position.lat}&lon=${position.lon}&message=true`;
  if (windyProduct !== '') {
    windyIframeUrl += `&product=${windyProduct}`;
  }
  
  const dsatIframeUrl = `https://www.cptec.inpe.br/dsat/?product=ch13_cpt_IR4AVHRR6&product_opacity=1&zoom=4&x=3504.0000&y=3367.0000`;
  
  let funcemeIframeUrl = '';
  if (activeLayer === 'funceme_pcd') funcemeIframeUrl = 'https://pcd.funceme.br/home';
  else if (activeLayer === 'funceme_radar') funcemeIframeUrl = 'https://radar.funceme.br/';
  else if (activeLayer === 'funceme_satelite') funcemeIframeUrl = 'https://satelite.funceme.br/';
  else if (activeLayer === 'funceme_chuvas') funcemeIframeUrl = 'https://chuvas.funceme.br/';
  else if (activeLayer === 'funceme_focoscalor') funcemeIframeUrl = 'https://focoscalor.funceme.br/';
  else if (activeLayer === 'funceme_apptempo') funcemeIframeUrl = 'https://apptempo.funceme.br/ceara';

  return (
    <div className="map-container" style={{ position: 'relative', height: '100%', width: '100%', backgroundColor: isSatellite ? '#020205' : 'transparent' }}>
      {isLoading && <CircularProgress />}
      {activeSigLayers.length > 0 && <MapLegend activeSigLayers={activeSigLayers} />}
      
      {/* Módulo Satélite (INPE DSAT Oficial) */}
      {isSatellite && (
        <iframe 
          src={dsatIframeUrl} 
          title="INPE DSAT"
          style={{ width: '100%', height: '100%', position: 'absolute', border: 'none' }}
          onLoad={handleIframeLoad}
        ></iframe>
      )}

      {/* Módulo FUNCEME */}
      {isFunceme && (
        <iframe 
          src={funcemeIframeUrl} 
          title="FUNCEME"
          style={{ width: '100%', height: '100%', position: 'absolute', border: 'none', zIndex: 5 }}
          onLoad={handleIframeLoad}
        ></iframe>
      )}

      {/* Módulo Windy */}
      {!isSatellite && activeLayer !== 'electricalNetwork' && !isInmet && !isFunceme && activeLayer !== 'none' && (
        <iframe 
          className="windy-iframe"
          src={windyIframeUrl} 
          frameBorder="0"
          title="Windy Map"
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          onLoad={handleIframeLoad}
        ></iframe>
      )}

      {/* Mensagem Nenhuma Visualização */}
      {activeLayer === 'none' && activeSigLayers.length === 0 && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a', color: '#888', fontFamily: 'sans-serif' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', opacity: 0.5 }}>
            <path d="M21 3H3v18h18V3zM9 21v-9M3 9h18M15 21v-4" />
          </svg>
          <span style={{ fontSize: '20px', fontWeight: '500' }}>Nenhuma visualização ativada</span>
          <span style={{ fontSize: '14px', marginTop: '8px' }}>Selecione uma camada no menu lateral para visualizar os dados.</span>
        </div>
      )}

      {/* Camada das Estações INMET (Substitui o iframe quando ativada para permitir interação) */}
      {(isInmet || activeSigLayers.length > 0) && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}>
          <MapContainer 
            center={[position.lat, position.lon]} 
            zoom={position.zoom} 
            style={{ width: '100%', height: '100%', background: (isInmet || activeSigLayers.length > 0) ? 'transparent' : '#0d2946' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            />
            {isInmet && <InmetStationsLayer />}
            {activeSigLayers.length > 0 && <FuncemeNowcastSigLayer activeLayers={activeSigLayers} />}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default SmacMapArea;
