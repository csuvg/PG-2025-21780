import styles from './ETAPage.module.css'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import { API_URL } from '../../config'

import Logo from '../../components/Logo/Logo'
import UnitMap from '../../components/UnitMap/UnitMap'
import { CircularProgress } from '@mui/material'
import { useEffect } from 'react'

export default function ETAPage() {
  const { stationId } = useParams();

  const { callFetch: getStation, result: resultGetStation, error: errorGetStation, loading: loadingGetStation } = useFetch();
  const { callFetch: getETA, result: resultGetETA, error: errorGetETA, loading: loadingGetETA } = useFetch();

  const directionText = {
        'IDA': {
            'Línea 2': 'Recorrido hacia Hipódromo del Norte',
            'Línea 6': 'Recorrido hacia Cerro del Carmen',
            'Línea 7': 'Recorrido hacia Centro',
            'Línea 12': 'Recorrido hacia Plaza Barrios',
            'Línea 13-A': 'Recorrido hacia Tipografía',
            'Línea 13-B': 'Recorrido hacia Hangares',
            'Línea 18-A': 'Recorrido hacia Francos y Monroy',
            'Línea 18-B': 'Recorrido hacia Paraíso',
        },
        "VUELTA": {
            'Línea 2': 'Recorrido hacia Jocotengango',
            'Línea 6': 'Recorrido hacia Proyectos',
            'Línea 7': 'Recorrido hacia USAC',
            'Línea 12': 'Recorrido hacia CENMA',
            'Línea 13-A': 'Recorrido hacia Hangares',
            'Línea 13-B': 'Recorrido hacia Hangares',
            'Línea 18-A': 'Recorrido hacia Atlántida',
            'Línea 18-B': 'Recorrido hacia Atlántida',
        }
    }

  const secondsToMinutesAndHours = (totalSeconds) => {
    if (!Number.isFinite(totalSeconds)) return '—';

    const sign = totalSeconds < 0 ? '-' : '';
    let s = Math.abs(totalSeconds);

    let secs  = Math.round(s % 60);
    let mins  = Math.floor((s / 60) % 60);
    let hours = Math.floor(s / 3600);

    // Correcciones por redondeo (59.6s -> 60s, etc.)
    if (secs === 60) { secs = 0; mins += 1; }
    if (mins === 60) { mins = 0; hours += 1; }

    if (hours > 0) {
        // Cuando hay horas, muestra mm y ss con cero a la izquierda
        return `${sign}${hours}h ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    // Solo minutos:segundos
    return `${sign}${mins}:${String(secs).padStart(2, '0')}`;
  };

  const handleGetETA = () => {
    const uri = `${API_URL}/eta`;

    const body = {
        target_line: resultGetStation.line,
        target_direction: resultGetStation.direction,
        target_station: resultGetStation.name, 
    }

    getETA({ 
        uri,
        method: 'POST',
        body
    });
  }

  useEffect(() => {
    getStation({ uri: `${API_URL}/stations/${stationId}` });
  }, []);

  useEffect(() => {
    if (!resultGetStation) return;
    handleGetETA();
  }, [resultGetStation]);

  useEffect(() => {
    if (!resultGetETA) return;
    console.log('ETA Data:', resultGetETA);
  }, [resultGetETA]);

  return (
    <main className={styles.etaPage} role="region" aria-labelledby="warning-title">
      <Logo />
      <div className={styles.content}>
        {errorGetStation && <p>Error: {errorGetStation.message}</p>}
        {!loadingGetStation && !errorGetStation && resultGetStation && (
            <div className={styles.stationInfo}>
                <h1 className={styles.stationTitle}>{resultGetStation?.name}</h1>
                <h2 className={styles.lineTitle}>{resultGetStation?.line.replace('Linea_', 'Línea ')}</h2>
                <span className={styles.directionText}>{directionText[resultGetStation?.direction]?.[resultGetStation?.line.replace('Linea_', 'Línea ')]}</span>
            </div>
        )}

        {resultGetETA && !loadingGetETA && !errorGetETA && (
            <div className={styles.etaInfo}>
                <h3 className={styles.etaTitle}>ETA Unidad más cercana (u{resultGetETA?.closest_unit?.unit}):</h3>
                <p className={styles.etaTime}>{secondsToMinutesAndHours(resultGetETA.prediction)}</p>
            </div>
        )}
        {(loadingGetETA || loadingGetStation) && <CircularProgress />}
        {errorGetETA && <p>{errorGetETA.message.replace('Linea_', '')}</p>}
        {resultGetETA && (
            <div className={styles.mapContainer}>
                <span className={styles.mapLabel}>Ubicación de la unidad más cercana:</span>
                <UnitMap lat={resultGetETA?.closest_unit?.latitude} lon={resultGetETA?.closest_unit?.longitude} stationLat={resultGetStation?.lat} stationLon={resultGetStation?.lon} stationTitle={resultGetStation?.name} />
            </div>
        )}
      </div>
    </main>
  )
}
