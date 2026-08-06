import React from 'react';
import Header from './components/Header';
import RightSidebar from './components/RightSidebar';
import SmacMapArea from './components/SmacMapArea';
import ElectricalNetworkMap from './components/ElectricalNetworkMap';
import Login from './components/Login';
import AlertsPanel from './components/AlertsPanel';
import { supabase } from './supabaseClient';
import './index.css';

function App() {
  const [session, setSession] = React.useState(null);
  const [loadingAuth, setLoadingAuth] = React.useState(true);
  
  // States for INMET Alerts
  const [inmetAlerts, setInmetAlerts] = React.useState([]);
  const [isAlertsOpen, setIsAlertsOpen] = React.useState(false);

  React.useEffect(() => {
    // Fetch user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Fetch INMET alerts
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api-prevmet/avisos/ativos');
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
          // API indisponível ou CORS bloqueado (ex: Cloudflare Pages) — falha silenciosa
          return;
        }
        const data = await res.json();
        if (data && data.hoje) {
          setInmetAlerts(data.hoje);
        }
      } catch (err) {
        // Suprime erro de CORS/rede silenciosamente
      }
    };
    
    fetchAlerts();

    return () => subscription.unsubscribe();
  }, []);

  // Estado principal
  const [activeLayer, setActiveLayer] = React.useState('wind');
  const [lastWeatherLayer, setLastWeatherLayer] = React.useState('wind');
  
  // Estado para múltiplas camadas SIG nativas (FUNCEME NOWCASTSIG)
  const [activeSigLayers, setActiveSigLayers] = React.useState([]);

  const handleSetActiveLayer = (layer) => {
    setActiveLayer(layer);
    if (layer !== 'electricalNetwork' && layer !== 'satellite' && layer !== 'none') {
      setLastWeatherLayer(layer);
    }
    if (layer !== 'none' && activeSigLayers.length > 0) {
      setActiveSigLayers([]);
    }
  };

  // Estado do mapa de fundo (light ou satellite)
  const [basemap, setBasemap] = React.useState('light');

  // Estado para as sub-camadas da Rede Elétrica
  const [electricLayers, setElectricLayers] = React.useState({
    subestacoes: true,
    reguladores: true,
    conjuntos: true,
    linha_at: true,
    linha_mt: false,
    linha_bt: false,
    transformadores: false,
    chaves: false
  });

  const isElectricalNetwork = activeLayer === 'electricalNetwork';
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  if (loadingAuth) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d2946' }}><h2 style={{ color: 'white' }}>Carregando...</h2></div>;
  }

  if (!session) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <div className="smac-app">
      <Header 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
        session={session}
        alertsCount={inmetAlerts.length}
        toggleAlerts={() => setIsAlertsOpen(!isAlertsOpen)}
      />
      <div className="smac-body">
        {/* Container principal dos mapas */}
        <div style={{ position: 'relative', flex: 1, height: '100%' }}>
          {isElectricalNetwork && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ElectricalNetworkMap isActive={isElectricalNetwork} electricLayers={electricLayers} basemap={basemap} setBasemap={setBasemap} />
            </div>
          )}
          
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: isElectricalNetwork ? 0 : 1, pointerEvents: isElectricalNetwork ? 'none' : 'auto' }}>
            <SmacMapArea isActive={!isElectricalNetwork} basemap={basemap} activeLayer={activeLayer} activeSigLayers={activeSigLayers} />
          </div>
        </div>

        {/* Right Sidebar for Map Layers */}
        {isSidebarOpen && (
          <RightSidebar 
            activeLayer={activeLayer}
            setActiveLayer={handleSetActiveLayer}
            lastWeatherLayer={lastWeatherLayer}
            setLastWeatherLayer={setLastWeatherLayer}
            electricLayers={electricLayers}
            setElectricLayers={setElectricLayers}
            activeSigLayers={activeSigLayers}
            setActiveSigLayers={setActiveSigLayers}
            basemap={basemap}
            setBasemap={setBasemap}
          />
        )}
        
        {isAlertsOpen && (
          <AlertsPanel 
            alerts={inmetAlerts} 
            onClose={() => setIsAlertsOpen(false)} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
