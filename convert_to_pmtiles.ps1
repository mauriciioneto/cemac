$ErrorActionPreference = "Stop"
$ogr2ogr = "C:\Program Files\QGIS 3.40.15\bin\ogr2ogr.exe"

# 1. Instalar o pmtiles CLI localmente no projeto
Write-Host "Instalando pmtiles CLI..."
npm install pmtiles --legacy-peer-deps

$inputDir = "C:\Users\mauri\Downloads\arquivosgeojson"
$outputDir = "public\data\geo"

function Convert-To-Pmtiles {
    param(
        [string]$inputFile,
        [string]$baseName,
        [string]$layerName
    )
    $mbtilesPath = "$outputDir\$baseName.mbtiles"
    $pmtilesPath = "$outputDir\$baseName.pmtiles"

    if (Test-Path $pmtilesPath) {
        Write-Host "$pmtilesPath ja existe, pulando..."
        return
    }

    Write-Host "Processando $baseName..."
    Write-Host "  -> Gerando MVT/MBTiles usando QGIS (Isso vai demorar)..."
    
    # Executa ogr2ogr com configurações ideais para Vector Tiles
    & $ogr2ogr -f MVT "$mbtilesPath" "$inputFile" -dsco FORMAT=MBTILES -dsco MINZOOM=6 -dsco MAXZOOM=14 -nln $layerName

    Write-Host "  -> Convertendo MBTiles para PMTiles..."
    npx pmtiles convert "$mbtilesPath" "$pmtilesPath"

    Write-Host "  -> Limpando arquivos temporarios..."
    Remove-Item "$mbtilesPath" -Force
    Write-Host "  -> Concluido: $pmtilesPath"
}

Convert-To-Pmtiles "$inputDir\chaves_seccionadoras_mt.geojson" "chaves" "chaves_seccionadoras_mt"
Convert-To-Pmtiles "$inputDir\Transformadores MT.geojson" "transformadores" "Transformadores MT"
Convert-To-Pmtiles "$inputDir\Linha-MT_Enel-CE.geojson" "linha_mt" "Linha-MT_Enel-CE"
Convert-To-Pmtiles "$inputDir\Linha_BT_Enel-CE.geojson" "linha_bt" "Linha_BT_Enel-CE"

Write-Host "TUDO PRONTO! A conversao foi finalizada."
