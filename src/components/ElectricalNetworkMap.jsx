import React, { useRef, useEffect, useState } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import { Map as MapIcon, Satellite } from 'lucide-react';
import CircularProgress from './CircularProgress';
import 'maplibre-gl/dist/maplibre-gl.css';

const osmStyle = {
  version: 8,
  sources: {
    'osm': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-layer',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

const googleSatelliteStyle = {
  version: 8,
  sources: {
    'google-satellite': {
      type: 'raster',
      tiles: ['https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'],
      tileSize: 256,
      attribution: 'Map data &copy; Google'
    }
  },
  layers: [
    {
      id: 'satellite-layer',
      type: 'raster',
      source: 'google-satellite',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

const ElectricalNetworkMap = ({ electricLayers, basemap, setBasemap, isActive }) => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN || '';
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Quando o mapa ficar ativo, forçamos um resize para corrigir o problema da tela branca.
    if (isActive && mapRef.current) {
      setTimeout(() => {
        if (mapRef.current) mapRef.current.resize();
      }, 50); // um pequeno delay para garantir que o CSS já aplicou a visibilidade
    }
  }, [isActive]);

  const currentMapStyle = basemap === 'satellite' ? googleSatelliteStyle : osmStyle;

  return (
    <div className="map-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {isLoading && <CircularProgress />}
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -39.3,
          latitude: -5.0,
          zoom: 6,
          pitch: 0,
          bearing: 0
        }}
        mapStyle={currentMapStyle}
        style={{ width: '100%', height: '100%', flex: 1 }}
        onLoad={() => setIsLoading(false)}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {/* Conjuntos */}
        {electricLayers?.conjuntos && (
          <Source id="conjuntos" type="vector" tiles={[`https://api.mapbox.com/v4/mauriciioneto.ixagfswwjysq/{z}/{x}/{y}.vector.pbf?access_token=${token}`]}>
            <Layer id="conjuntos-layer" type="fill" source-layer="33ee91406a397ee1ccb1" paint={{ 'fill-color': '#00bcd4', 'fill-opacity': 0.1, 'fill-outline-color': '#00bcd4' }} />
            <Layer id="conjuntos-line" type="line" source-layer="33ee91406a397ee1ccb1" paint={{ 'line-color': '#00bcd4', 'line-width': 1, 'line-opacity': 0.5 }} />
          </Source>
        )}

        {/* Chaves */}
        {electricLayers?.chaves && (
          <Source id="chaves" type="vector" tiles={[`https://api.mapbox.com/v4/mauriciioneto.nrg844pkjrkk/{z}/{x}/{y}.vector.pbf?access_token=${token}`]}>
            <Layer id="chaves-layer" type="circle" source-layer="e4988396058f5c31e2a1" paint={{ 'circle-radius': 4, 'circle-color': '#9c27b0', 'circle-stroke-width': 1, 'circle-stroke-color': '#fff' }} />
          </Source>
        )}

        {/* Transformadores */}
        {electricLayers?.transformadores && (
          <Source id="transformadores" type="vector" tiles={[`https://api.mapbox.com/v4/mauriciioneto.84ef74fms4u7/{z}/{x}/{y}.vector.pbf?access_token=${token}`]}>
            <Layer id="transformadores-layer" type="circle" source-layer="9719bf6d642bfc5d48dc" paint={{ 'circle-radius': 3, 'circle-color': '#4caf50', 'circle-stroke-width': 0.5, 'circle-stroke-color': '#fff' }} />
          </Source>
        )}

        {/* Linha MT */}
        {electricLayers?.linha_mt && (
          <Source id="linha_mt" type="vector" tiles={[`https://api.mapbox.com/v4/mauriciioneto.xw4spim3mmtt/{z}/{x}/{y}.vector.pbf?access_token=${token}`]}>
            <Layer id="linha_mt-layer" type="line" source-layer="d62118f7cf86859fbd52" paint={{ 'line-color': '#ffeb3b', 'line-width': 1.5, 'line-opacity': 0.8 }} />
          </Source>
        )}

        {/* Linha AT */}
        {electricLayers?.linha_at && (
          <Source id="linha_at" type="vector" tiles={[`https://api.mapbox.com/v4/mauriciioneto.1xbdim5zuqfk/{z}/{x}/{y}.vector.pbf?access_token=${token}`]}>
            <Layer id="linha_at-layer" type="line" source-layer="d76a409366ad0d46acea" paint={{ 'line-color': '#ff4081', 'line-width': 3, 'line-opacity': 0.9 }} />
          </Source>
        )}

        {/* Subestações */}
        {electricLayers?.subestacoes && (
          <Source id="subestacoes" type="vector" tiles={[`https://api.mapbox.com/v4/mauriciioneto.kjsrrbzi8h5r/{z}/{x}/{y}.vector.pbf?access_token=${token}`]}>
            <Layer id="subestacoes-layer" type="fill" source-layer="c418e9c21637debadffc" paint={{ 'fill-color': '#ff4444', 'fill-opacity': 0.3 }} />
            <Layer id="subestacoes-line" type="line" source-layer="c418e9c21637debadffc" paint={{ 'line-color': '#ff4444', 'line-width': 2 }} />
          </Source>
        )}

      </Map>

      {/* Controle de Mapa Flutuante */}
      <div 
        style={{
          position: 'absolute',
          top: '10px',
          right: '50px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          display: 'flex',
          overflow: 'hidden',
          zIndex: 10
        }}
      >
        <button 
          onClick={() => setBasemap && setBasemap('light')}
          style={{
            padding: '8px 12px',
            border: 'none',
            backgroundColor: basemap === 'light' ? '#e0e0e0' : '#fff',
            color: '#333',
            fontWeight: basemap === 'light' ? 'bold' : 'normal',
            cursor: 'pointer',
            borderRight: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px'
          }}
        >
          <MapIcon size={16} />
          Ruas
        </button>
        <button 
          onClick={() => setBasemap && setBasemap('satellite')}
          style={{
            padding: '8px 12px',
            border: 'none',
            backgroundColor: basemap === 'satellite' ? '#e0e0e0' : '#fff',
            color: '#333',
            fontWeight: basemap === 'satellite' ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px'
          }}
        >
          <Satellite size={16} />
          Satélite
        </button>
      </div>
    </div>
  );
};

export default ElectricalNetworkMap;
