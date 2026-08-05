import React from 'react';

// Configuração das legendas por tipo de camada
const LEGENDS = {
  radar: {
    title: 'Radar (Chuva agora)',
    unit: 'dBZ',
    type: 'gradient',
    stops: [
      { value: 0, color: '#808080' },
      { value: 10, color: '#00ffff' },
      { value: 20, color: '#0000ff' },
      { value: 30, color: '#00ff00' },
      { value: 40, color: '#ffff00' },
      { value: 50, color: '#ff8800' },
      { value: 60, color: '#ff0000' },
      { value: 70, color: '#ff00ff' }
    ]
  },
  accumulation: {
    title: 'Acumulado de Chuva',
    unit: 'mm',
    type: 'gradient',
    stops: [
      { value: 0, color: '#f0f9ff' },
      { value: 5, color: '#80d4f0' },
      { value: 15, color: '#0099cc' },
      { value: 30, color: '#0055aa' },
      { value: 50, color: '#003388' },
      { value: 80, color: '#001166' },
      { value: 120, color: '#000033' }
    ]
  },
  lightning: {
    title: 'Raios GLM GOES-16',
    unit: '',
    type: 'dots',
    items: [
      { color: '#ff2200', border: '#ffee00', label: '0–10 min' },
      { color: '#ff7700', border: '#ffee00', label: '10–20 min' },
      { color: '#ffbb00', border: '#ffffff', label: '20–30 min' },
      { color: '#ffee88', border: '#aaaaaa', label: '30–40 min' }
    ]
  },
  municipalities_rain: {
    title: 'Municípios com Chuva',
    unit: '',
    type: 'solid',
    items: [{ color: '#0099ff', label: 'Chuva agora' }]
  },
  municipalities_lightning: {
    title: 'Municípios com Raios',
    unit: '',
    type: 'solid',
    items: [{ color: '#ffdd00', label: 'Raios nos últ. 30 min' }]
  },
  satellite_ir: {
    title: 'Satélite Infravermelho (GOES-16)',
    unit: '°C (topo nuvem)',
    type: 'gradient',
    stops: [
      { value: -80, color: '#ffffff' },
      { value: -60, color: '#ffccff' },
      { value: -40, color: '#6666ff' },
      { value: -20, color: '#0000ff' },
      { value: 0, color: '#00ccff' },
      { value: 20, color: '#00ff00' },
      { value: 40, color: '#888888' }
    ]
  },
  satellite_vis: {
    title: 'Satélite Visível (GOES-16)',
    unit: 'Canal 2',
    type: 'gradient',
    stops: [
      { value: 0, color: '#000000' },
      { value: 50, color: '#888888' },
      { value: 100, color: '#ffffff' }
    ]
  },
  cape: {
    title: 'Índice CAPE',
    unit: 'J/kg',
    type: 'gradient',
    stops: [
      { value: 0, color: '#000066' },
      { value: 500, color: '#0033ff' },
      { value: 1000, color: '#00ccff' },
      { value: 2000, color: '#00ff88' },
      { value: 3000, color: '#ffff00' },
      { value: 4000, color: '#ff8800' },
      { value: 5000, color: '#ff0000' }
    ]
  },
  lightning_prob: {
    title: 'Probabilidade de Raios',
    unit: 'Canal WV - IR (K)',
    type: 'gradient',
    stops: [
      { value: 0, color: '#000000' },
      { value: 1, color: '#440066' },
      { value: 3, color: '#ff00ff' },
      { value: 5, color: '#ff8800' },
      { value: 7, color: '#ffff00' }
    ]
  },
  updraft: {
    title: 'Updraft (Correntes Ascendentes)',
    unit: '6.2μm – 11.2μm (K)',
    type: 'gradient',
    stops: [
      { value: 0, color: '#000000' },
      { value: 1, color: '#00aaff' },
      { value: 2, color: '#00ffaa' },
      { value: 3, color: '#ffff00' }
    ]
  },
  sandwich: {
    title: 'Sandwich (Morfologia + Temperatura)',
    unit: 'Composto',
    type: 'text',
    description: 'Combina canal visível (cinza) com canal 13 realçado para destacar temperatura do topo das nuvens.'
  }
};

// Mapeia ID da camada para configuração da legenda
const LAYER_TO_LEGEND = {
  'precipitacao_superficie_rmt0100ds.json': 'radar',
  'acumulado6h_rtm0100ds.json': 'accumulation',
  'g16raios_10min.json': 'lightning',
  'g16raios_10_20min.json': 'lightning',
  'g16raios_20_30min.json': 'lightning',
  'g16raios_30_40min.json': 'lightning',
  'municipios_com_chuva_ce.json': 'municipalities_rain',
  'municipios_com_raios_ce.json': 'municipalities_lightning',
  'municipios_com_raios_br.json': 'municipalities_lightning',
  'ch13.png': 'satellite_ir',
  'ch02.png': 'satellite_vis',
  'DSI_CAPE.png': 'cape',
  'lightning_overlay.png': 'lightning_prob',
  'Sandwich_overlay.png': 'sandwich',
  'updraft_overlay2.png': 'updraft'
};

const GradientLegend = ({ legend }) => {
  const stops = legend.stops;
  const gradient = stops.map((s, i) => `${s.color} ${Math.round((i / (stops.length - 1)) * 100)}%`).join(', ');
  const first = stops[0];
  const last = stops[stops.length - 1];

  return (
    <div style={{ marginTop: '6px' }}>
      <div style={{
        height: '14px',
        borderRadius: '4px',
        background: `linear-gradient(to right, ${gradient})`,
        border: '1px solid rgba(255,255,255,0.2)'
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
        {stops.filter((_, i) => i % Math.ceil(stops.length / 5) === 0 || i === stops.length - 1).map((s, i) => (
          <span key={i} style={{ fontSize: '10px', color: '#bbb' }}>{s.value}</span>
        ))}
      </div>
      {legend.unit && (
        <div style={{ textAlign: 'center', fontSize: '10px', color: '#888', marginTop: '1px' }}>
          {legend.unit}
        </div>
      )}
    </div>
  );
};

const DotsLegend = ({ legend }) => (
  <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
    {legend.items.map((item, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '12px', height: '12px', borderRadius: '50%',
          backgroundColor: item.color, border: `2px solid ${item.border}`,
          flexShrink: 0
        }} />
        <span style={{ fontSize: '11px', color: '#bbb' }}>{item.label}</span>
      </div>
    ))}
  </div>
);

const SolidLegend = ({ legend }) => (
  <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
    {legend.items.map((item, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '20px', height: '12px', borderRadius: '3px',
          backgroundColor: item.color, border: '1px solid rgba(255,255,255,0.2)',
          flexShrink: 0
        }} />
        <span style={{ fontSize: '11px', color: '#bbb' }}>{item.label}</span>
      </div>
    ))}
  </div>
);

const MapLegend = ({ activeSigLayers }) => {
  // Coleta legendas únicas das camadas ativas
  const legendKeys = [...new Set(
    activeSigLayers
      .map(id => LAYER_TO_LEGEND[id])
      .filter(Boolean)
  )];

  if (legendKeys.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '30px',
      left: '12px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '240px'
    }}>
      {legendKeys.map(key => {
        const legend = LEGENDS[key];
        if (!legend) return null;

        return (
          <div key={key} style={{
            backgroundColor: 'rgba(13, 41, 70, 0.92)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '10px 12px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e0e8ff', marginBottom: '2px' }}>
              {legend.title}
            </div>

            {legend.type === 'gradient' && <GradientLegend legend={legend} />}
            {legend.type === 'dots' && <DotsLegend legend={legend} />}
            {legend.type === 'solid' && <SolidLegend legend={legend} />}
            {legend.type === 'text' && (
              <p style={{ fontSize: '10px', color: '#aaa', margin: '4px 0 0', lineHeight: '1.4' }}>
                {legend.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MapLegend;
