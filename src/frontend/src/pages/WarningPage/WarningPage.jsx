import styles from './WarningPage.module.css'
import { useNavigate } from 'react-router-dom'

import Logo from '../../components/Logo/Logo'
import WarningImage from '../../assets/svg/warning.svg'

export default function WarningPage() {
  const navigate = useNavigate()

  const onAcknowledge = () => {
    navigate('/decision')
  }

  return (
    <main className={styles.warningPage} role="region" aria-labelledby="warning-title">
      <Logo showSubTitle />
      <div className={styles.content}>
        <div className={styles.warningImageContainer}>
          <img
            src={WarningImage}
            alt="Warning icon"
            className={styles.warningImage}
          />
        </div>
        <h1 id="warning-title" className={styles.bigTitle}>¡Atención!</h1>
        <p className={styles.muted}>Esta aplicación pretende dar un tiempo estimado de llegada de las unidades de Transmetro a las estaciones</p>
        <p>La precisión de estas predicciones puede verse afectada por factores como tráfico, desvíos o condiciones operativas.
          <span className={styles.importantText}> Se recomienda utilizar esta información únicamente como una guía aproximada y tomar las precauciones necesarias al planificar tu viaje.</span>
        </p>
        <div className={styles.btnRow}>
          <button className={styles.btnWarn} onClick={onAcknowledge} aria-label="Acknowledge warning">¡Entendido!</button>
        </div>
      </div>
    </main>
  )
}
