import styles from './TripQuestionsPage.module.css'
import { useNavigate } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import { API_URL } from '../../config'

import Logo from '../../components/Logo/Logo'
import InputSelect from '../../components/InputSelect/InputSelect'
import { CircularProgress, Collapse } from '@mui/material'
import { useState, useEffect } from 'react'

export default function TripQuestionsPage() {
    const navigate = useNavigate();

    const [line, setLine] = useState('');
    const [originStation, setOriginStation] = useState(null);
    const [destinationStation, setDestinationStation] = useState(null);

    const { callFetch: getLines, result: resultGetLines, error: errorGetLines, loading: loadingGetLines } = useFetch();
    const { callFetch: getStationsByLine, result: resultGetStationsByLine, error: errorGetStationsByLine, loading: loadingGetStationsByLine } = useFetch();

    useEffect(() => {
        getLines({ uri: `${API_URL}/lines` });
    }, []);

    useEffect(() => {
        if (!line) return;
        const lineParam = line.replace('Línea ', 'Linea_');
        getStationsByLine({ uri: `${API_URL}/stations/line/${lineParam}` });
    }, [line]);

    useEffect(() => {
        if (!originStation || !destinationStation) return;
        console.log({ line, originStation, destinationStation });
        navigate(`/trip/eta/${originStation}/${destinationStation}`);
    }, [destinationStation]);


  return (
    <main className={styles.tripQuestionsPage} role="region" aria-labelledby="warning-title">
      <Logo />
      <div className={styles.content}>
        

        {/* Preguntar por la línea */}
        <Collapse in={!line} timeout="auto" unmountOnExit>
            <div className={styles.lineQuestion}>
                <h1 className={styles.bigTitle}>¿Qué línea estás utilizando?</h1>
                {loadingGetLines && <CircularProgress />}
                {errorGetLines && <p>Error: {errorGetLines.message}</p>}
                {resultGetLines && !loadingGetLines && !errorGetLines && (
                    <InputSelect
                        value={line}
                        options={resultGetLines.map(lineItem => { return { id: lineItem, name: lineItem.replace('Linea_', 'Línea ') } })}
                        onChange={(e) => setLine(e.target.value)}
                        placeholder="Selecciona una línea"
                    />
                )}
            </div>
        </Collapse>

        {/* Preguntar por estación de origen */}

        <Collapse in={!!line && !originStation} timeout="auto" unmountOnExit>
            <div className={styles.stationQuestion}>
                <h1 className={styles.bigTitle}>¿En qué estación te encuentras?</h1>
                {loadingGetStationsByLine && <CircularProgress />}
                {errorGetStationsByLine && <p>Error: {errorGetStationsByLine.message}</p>}
                {resultGetStationsByLine && !loadingGetStationsByLine && !errorGetStationsByLine && (
                    <InputSelect
                        value={originStation || ''}
                        options={resultGetStationsByLine.map(station => ({ id: `${station.id}`, name: station.name }))}
                        onChange={(e) => setOriginStation(e.target.value)}
                        placeholder="Selecciona una estación"
                    />
                )}
            </div>
        </Collapse>

        {/* Preguntar por estación de destino */}

        <Collapse in={!!line && !!originStation && !destinationStation} timeout="auto" unmountOnExit>
            <div className={styles.stationQuestion}>
                <h1 className={styles.bigTitle}>¿A qué estación te diriges?</h1>
                {loadingGetStationsByLine && <CircularProgress />}
                {errorGetStationsByLine && <p>Error: {errorGetStationsByLine.message}</p>}
                {resultGetStationsByLine && !loadingGetStationsByLine && !errorGetStationsByLine && (
                    <InputSelect
                        value={destinationStation || ''}
                        options={resultGetStationsByLine
                            .filter(station => station.id.toString() !== originStation)
                            .map(station => ({ id: `${station.id}`, name: station.name }))}
                        onChange={(e) => setDestinationStation(e.target.value)}
                        placeholder="Selecciona una estación"
                    />
                )}
            </div>
        </Collapse>

      </div>
    </main>
  )
}
