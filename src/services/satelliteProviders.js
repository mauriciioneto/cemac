/**
 * Configuração dos Provedores de Satélite do CEMAC
 */
export const providers = {
  NASA_GIBS: {
    id: 'NASA_GIBS',
    name: 'NASA Global Imagery Browse Services',
    enabled: true,
    type: 'WMTS',
    baseUrl: 'https://gibs.earthdata.nasa.gov/wmts',
    projection: 'epsg3857',
    matrixSet: 'GoogleMapsCompatible_Level9'
  },
  NOAA_GOES: {
    id: 'NOAA_GOES',
    name: 'NOAA GOES-R Open Data (AWS / NOAA)',
    enabled: false,
    type: 'DIRECT_RASTER'
  }
};
