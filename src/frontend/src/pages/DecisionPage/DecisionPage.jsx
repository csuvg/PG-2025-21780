import styles from './DecisionPage.module.css'
import { useNavigate } from 'react-router-dom'

import Logo from '../../components/Logo/Logo'
import BusStop from '../../assets/svg/bus-stop.svg'
import sideBus from '../../assets/svg/side-bus.svg'

export default function DecisionPage() {
  const navigate = useNavigate()

  return (
    <main className={styles.decisionPage} role="region" aria-labelledby="warning-title">
      <Logo showSubTitle />
      <div className={styles.content}>
        <h1 className={styles.bigTitle}>¿Qué deseas consultar?</h1>
        <div className={styles.choicesContainer}>
            <div className={styles.choice} onClick={() => navigate('/stations')}>
                <div className={styles.choiceImageContainer}>
                    <img
                        src={BusStop}
                        alt="Bus stop icon"
                        className={styles.choiceImage}
                    />
                </div>
                <span className={styles.choiceLabel}>Estoy esperando una unidad</span>
            </div>
            <div className={styles.choice} onClick={() => navigate('/trip')}>
                <div className={styles.choiceImageContainer}>
                    <img
                        src={sideBus}
                        alt="Side bus icon"
                        className={styles.choiceImage}
                    />
                </div>
                <span className={styles.choiceLabel}>Estoy realizando un viaje</span>
            </div>
        </div>
        <div className={styles.btnRow}>
          <button className={styles.btnDecision} onClick={() => navigate('/stations')} aria-label="Consult ETA">Estoy esperando una unidad</button>
          <button className={styles.btnDecision} onClick={() => navigate('/trip')} aria-label="Consult trip">Estoy realizando un viaje</button>
        </div>
      </div>
    </main>
  )
}
