const fs = require('fs');

async function splitFile() {
  const inputFile = 'C:/Users/mauri/Downloads/arquivosgeojson/Linha_BT_Enel-CE.geojson';
  console.log('Lendo arquivo de 522MB na memoria (isso pode levar alguns segundos)...');
  const data = fs.readFileSync(inputFile, 'utf8');
  
  console.log('Analisando arquivo...');
  const geojson = JSON.parse(data);

  console.log('Total de features encontradas:', geojson.features.length);
  const half = Math.ceil(geojson.features.length / 2);

  const part1 = { ...geojson, features: geojson.features.slice(0, half) };
  const part2 = { ...geojson, features: geojson.features.slice(half) };

  console.log('Gravando Parte 1 (aprox. 260MB)...');
  fs.writeFileSync('C:/Users/mauri/Downloads/arquivosgeojson/Linha_BT_parte1.geojson', JSON.stringify(part1));
  
  console.log('Gravando Parte 2 (aprox. 260MB)...');
  fs.writeFileSync('C:/Users/mauri/Downloads/arquivosgeojson/Linha_BT_parte2.geojson', JSON.stringify(part2));
  
  console.log('CONCLUIDO! Arquivo dividido com sucesso.');
}

splitFile().catch(console.error);
