import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom Icon for INMET Stations (Antenna)
const stationIcon = new L.DivIcon({
  html: `<div style="background-color: white; border: 2px solid #003a5c; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">📡</div>`,
  className: 'inmet-station-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const StationPopup = ({ st }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get today's date in YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        const res = await fetch(`/api-inmet/estacao/${today}/${today}/${st.CD_ESTACAO}`);
        const json = await res.json();
        
        if (json && json.length > 0) {
          // Find the most recent hour with data (iterate backwards)
          let recent = null;
          for (let i = json.length - 1; i >= 0; i--) {
            if (json[i].TEM_INS !== null) {
              recent = json[i];
              break;
            }
          }
          setData(recent || json[json.length - 1]);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [st.CD_ESTACAO]);

  return (
    <div style={{ textAlign: 'center', minWidth: '150px' }}>
      <h4 style={{ margin: '0 0 5px 0', color: '#003a5c' }}>{st.DC_NOME} - {st.SG_ESTADO}</h4>
      <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>Código: {st.CD_ESTACAO} | Alt: {st.VL_ALTITUDE}m</p>
      
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
        {loading ? (
          <p style={{ fontSize: '12px' }}>Carregando dados...</p>
        ) : data && data.TEM_INS ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', textAlign: 'left', fontSize: '12px' }}>
            <div><strong>🌡️ Temp:</strong> {data.TEM_INS}°C</div>
            <div><strong>💧 Umi:</strong> {data.UMD_INS}%</div>
            <div><strong>💨 Vento:</strong> {data.VEN_VEL} m/s</div>
            <div><strong>🌧️ Chuva:</strong> {data.CHUVA} mm</div>
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '5px', fontSize: '10px', color: '#888' }}>
              Hora: {data.HR_MEDICAO.slice(0, 2)}:{data.HR_MEDICAO.slice(2, 4)} UTC
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '12px', color: '#c00' }}>Dados indisponíveis no momento.</p>
        )}
      </div>
    </div>
  );
};

const InmetStationsLayer = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('/api-inmet/estacoes/T');
        const data = await response.json();
        const validStations = data.filter(st => 
          st.VL_LATITUDE && st.VL_LONGITUDE && !isNaN(parseFloat(st.VL_LATITUDE))
        );
        setStations(validStations);
      } catch (err) {
        console.error("Error fetching INMET stations:", err);
      }
    };
    
    fetchStations();
  }, []);

  return (
    <>
      {stations.map(st => {
        const lat = parseFloat(st.VL_LATITUDE);
        const lng = parseFloat(st.VL_LONGITUDE);
        
        return (
          <Marker 
            key={st.CD_ESTACAO} 
            position={[lat, lng]} 
            icon={stationIcon}
          >
            <Popup>
              <StationPopup st={st} />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default InmetStationsLayer;
