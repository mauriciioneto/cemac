/**
 * CEMAC Satellite Service
 * Serviço responsável por prover as URLs dos tiles geostacionários do CPTEC DSAT.
 */

const PRODUCT_MAPPING = {
  'true_color': 'true_color_ch13_dsa',
  'visible': 'ch02',
  'infrared': 'ch13',
  'water_vapor': 'ch09',
  'air_mass': 'airmass_dsa',
  'dust': 'dust_dsa',
  'cloud_top_temp': 'ch14'
};

/**
 * Retorna o ID oficial do produto no servidor do CPTEC
 */
export const getDsatProductId = (product) => {
  return PRODUCT_MAPPING[product] || PRODUCT_MAPPING['true_color'];
};

/**
 * Formata a data no formato YYYYMMDD do CPTEC
 */
export const getDsatDateStr = (dateObj) => {
  if (!dateObj) return '';
  const yyyy = dateObj.getUTCFullYear();
  const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getUTCDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

/**
 * Formata o horário no formato HHMM do CPTEC
 */
export const getDsatTimeStr = (dateObj) => {
  if (!dateObj) return '';
  const hh = String(dateObj.getUTCHours()).padStart(2, '0');
  const mm = String(dateObj.getUTCMinutes()).padStart(2, '0');
  return `${hh}${mm}`;
};

/**
 * Retorna o timestamp amigável para exibição
 */
export const getFriendlyTimestamp = (dateObj) => {
  if (!dateObj) return '';
  const hh = String(dateObj.getUTCHours()).padStart(2, '0');
  const mm = String(dateObj.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm} UTC`;
};

/**
 * Gera os frames da timeline das últimas 3 horas com base na data selecionada
 */
export const generateTimelineFrames = (dateStr) => {
  const frames = [];
  let baseTime = new Date();
  
  if (dateStr) {
    // Definir para o final do dia escolhido em UTC
    baseTime = new Date(`${dateStr}T23:50:00Z`);
  } else {
    // Hoje: recuar 20 min (atraso operacional padrão do CPTEC)
    baseTime = new Date(baseTime.getTime() - (20 * 60 * 1000));
  }
  
  baseTime.setMinutes(Math.floor(baseTime.getMinutes() / 10) * 10, 0, 0);

  for (let i = 18; i >= 0; i--) {
    const frameTime = new Date(baseTime.getTime() - (i * 10 * 60 * 1000));
    frames.push(frameTime);
  }
  return frames;
};
