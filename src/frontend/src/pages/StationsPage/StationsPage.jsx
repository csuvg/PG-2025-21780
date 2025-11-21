import styles from './StationsPage.module.css'
import useFetch from '../../hooks/useFetch'
import { API_URL } from '../../config'

import Logo from '../../components/Logo/Logo'
import Station from '../../components/Station/Station'
import { CircularProgress } from '@mui/material'
import { useEffect } from 'react'

export default function StationsPage() {

  const { callFetch: getStations, result: resultGetStations, error: errorGetStations, loading: loadingGetStations } = useFetch();


  useEffect(() => {
    getStations({ uri: `${API_URL}/stations` });
  }, []);

  return (
    <main className={styles.stationsPage} role="region" aria-labelledby="warning-title">
      <Logo />
      <div className={styles.content}>
        <h1 className={styles.bigTitle}>Estaciones</h1>
        {!loadingGetStations && !errorGetStations && resultGetStations && (
          <div className={styles.stationsContainer}>
            {resultGetStations.map((station, idx) => (
              <div key={idx}>
                <Station
                  id={station.id}
                  stationName={station.name}
                  line={station.line.replace('Linea_', 'Línea ')}
                  direction={station.direction}
                  latitude={station.lat}
                  longitude={station.lon}
                />
              </div>
            ))}
        </div>
        )}
        {loadingGetStations && <CircularProgress />}
        {errorGetStations && <p>Error: {errorGetStations.message}</p>}
      </div>
    </main>
  )
}
