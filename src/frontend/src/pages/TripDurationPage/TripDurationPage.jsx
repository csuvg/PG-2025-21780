import styles from './TripDurationPage.module.css'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import { API_URL } from '../../config'

import Logo from '../../components/Logo/Logo'
import UnitMap from '../../components/UnitMap/UnitMap'
import { CircularProgress } from '@mui/material'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { useEffect } from 'react'

export default function TripDurationPage() {
  const { originStationId, destinationStationId } = useParams();

  const { callFetch: getOriginStation, result: resultGetOriginStation, error: errorGetOriginStation, loading: loadingGetOriginStation } = useFetch();
  const { callFetch: getDestinationStation, result: resultGetDestinationStation, error: errorGetDestinationStation, loading: loadingGetDestinationStation } = useFetch();
  const { callFetch: getTripDuration, result: resultGetTripDuration, error: errorGetTripDuration, loading: loadingGetTripDuration } = useFetch();

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

  const handleGetTripDuration = () => {
    const uri = `${API_URL}/trip`;

    const body = {
        target_line: resultGetOriginStation.line,
        origin_station: resultGetOriginStation.name,
        origin_direction: resultGetOriginStation.direction,
        dest_station: resultGetDestinationStation.name,
        dest_direction: resultGetDestinationStation.direction,
    }

    getTripDuration({ 
        uri,
        method: 'POST',
        body
    });
  }

  useEffect(() => {
    getOriginStation({ uri: `${API_URL}/stations/${originStationId}` });
    getDestinationStation({ uri: `${API_URL}/stations/${destinationStationId}` });
  }, []);

  useEffect(() => {
    if (!resultGetOriginStation || !resultGetDestinationStation) return;
    handleGetTripDuration();
  }, [resultGetOriginStation, resultGetDestinationStation]);

  useEffect(() => {
    if (!resultGetTripDuration) return;
    console.log('Trip Duration Data:', resultGetTripDuration);
  }, [resultGetTripDuration]);

  return (
    <main className={styles.tripDurationPage} role="region" aria-labelledby="warning-title">
      <Logo />
      <div className={styles.content}>

        {errorGetOriginStation && <p>Error: {errorGetOriginStation.message}</p>}
        {errorGetDestinationStation && <p>Error: {errorGetDestinationStation.message}</p>}

        {!loadingGetOriginStation && !errorGetOriginStation && resultGetOriginStation && (

            <div className={styles.stationsInfo}>

                <div className={styles.stationInfo}>
                    <h1 className={styles.stationTitle}>{resultGetOriginStation?.name}</h1>
                    <h2 className={styles.lineTitle}>{resultGetOriginStation?.line.replace('Linea_', 'Línea ')}</h2>
                    <span className={styles.directionText}>{directionText[resultGetOriginStation?.direction]?.[resultGetOriginStation?.line.replace('Linea_', 'Línea ')]}</span>
                </div>

                <ArrowCircleRightIcon className={styles.rightArrowIcon} />

                <div className={styles.stationInfo}>
                    <h1 className={styles.stationTitle}>{resultGetDestinationStation?.name}</h1>
                    <h2 className={styles.lineTitle}>{resultGetDestinationStation?.line.replace('Linea_', 'Línea ')}</h2>
                    <span className={styles.directionText}>{directionText[resultGetDestinationStation?.direction]?.[resultGetDestinationStation?.line.replace('Linea_', 'Línea ')]}</span>
                </div>

            </div>
        )}

        {resultGetTripDuration && !loadingGetTripDuration && !errorGetTripDuration && (
            <div className={styles.etaInfo}>
                <h3 className={styles.etaTitle}>Duración total de tu viaje:</h3>
                <p className={styles.etaTime}>{secondsToMinutesAndHours(resultGetTripDuration.prediction)}</p>
                <p className={styles.etaInfo}>desde ahora</p>
            </div>
        )}
        {(loadingGetOriginStation || loadingGetDestinationStation || loadingGetTripDuration) && <CircularProgress />}
        {errorGetTripDuration && <p>{errorGetTripDuration.message.replace('Linea_', '')}</p>}
        {resultGetTripDuration && (
            <div className={styles.mapContainer}>
                <span className={styles.mapLabel}>Ubicación de la unidad más cercana (u{resultGetTripDuration?.closest_unit?.unit}):</span>
                <UnitMap lat={resultGetTripDuration?.closest_unit?.latitude} lon={resultGetTripDuration?.closest_unit?.longitude} stationLat={resultGetOriginStation?.lat} stationLon={resultGetOriginStation?.lon}/>
            </div>
        )}
      </div>
    </main>
  )
}
