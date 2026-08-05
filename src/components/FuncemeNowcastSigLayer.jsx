import React, { useState, useEffect } from 'react';
import { GeoJSON, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';

// Proxy do Vite para evitar CORS
const BASE_URL = '/api-nowcastsig/media/temporeal/camadas_sig/';

// Estilos por camada GeoJSON
const layerStyles = {
  'municipios_com_chuva_ce': {
    color: '#00aaff', weight: 2, fillColor: '#0099ff', fillOpacity: 0.5
  },
  'municipios_com_raios_ce': {
    color: '#ffcc00', weight: 2, fillColor: '#ffdd00', fillOpacity: 0.45
  },
  'precipitacao_superficie_rmt0100ds': {
    color: '#00ff88', weight: 1, fillColor: '#00ee77', fillOpacity: 0.5
  },
  'acumulado6h_rtm0100ds': {
    color: '#0066ff', weight: 1, fillColor: '#0055ee', fillOpacity: 0.55
  }
};

// Cores dos raios por faixa de tempo (mais recente = mais vermelho)
const LIGHTNING_COLORS = {
  'g16raios_10min.json':       { fill: '#ff2200', border: '#ffee00' },
  'g16raios_10_20min.json':    { fill: '#ff7700', border: '#ffee00' },
  'g16raios_20_30min.json':    { fill: '#ffbb00', border: '#ffffff' },
  'g16raios_30_40min.json':    { fill: '#ffee88', border: '#aaaaaa' }
};

const makeLightningLayer = (layerId) => (feature, latlng) => {
  const c = LIGHTNING_COLORS[layerId] || { fill: '#ff2200', border: '#ffee00' };
  return L.circleMarker(latlng, {
    radius: 3,
    fillColor: c.fill,
    color: c.border,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.85
  });
};

const FuncemeNowcastSigLayer = ({ activeLayers }) => {
  const [geoJsonData, setGeoJsonData] = useState({});

  useEffect(() => {
    const fetchLayers = async () => {
      const layersToFetch = activeLayers.filter(id => id.endsWith('.json'));
      if (layersToFetch.length === 0) return;

      const newData = { ...geoJsonData };
      let changed = false;

      for (const layerId of layersToFetch) {
        if (!newData[layerId]) {
          try {
            const response = await fetch(`${BASE_URL}${layerId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            newData[layerId] = data;
            changed = true;
          } catch (error) {
            console.error(`Erro ao buscar ${layerId}:`, error);
          }
        }
      }

      if (changed) setGeoJsonData({ ...newData });
    };

    fetchLayers();
  }, [activeLayers]);

  // Bounds do GOES-16 cobrindo América do Sul + Atlântico
  const southAmericaBounds = [
    [-55.0, -82.0],
    [13.5, -25.0]
  ];

  return (
    <>
      {activeLayers.map(layerId => {
        if (layerId.endsWith('.json') && geoJsonData[layerId]) {
          const styleKey = layerId.replace('.json', '');
          const isLightning = layerId.startsWith('g16raios');
          return (
            <GeoJSON
              key={layerId}
              data={geoJsonData[layerId]}
              style={!isLightning ? (layerStyles[styleKey] || { color: '#ff6600', weight: 1, fillOpacity: 0.4 }) : undefined}
              pointToLayer={isLightning ? makeLightningLayer(layerId) : undefined}
            />
          );
        }

        if (layerId.endsWith('.png')) {
          return (
            <ImageOverlay
              key={layerId}
              url={`${BASE_URL}${layerId}`}
              bounds={southAmericaBounds}
              opacity={0.65}
              zIndex={500}
            />
          );
        }

        return null;
      })}
    </>
  );
};

export default FuncemeNowcastSigLayer;
