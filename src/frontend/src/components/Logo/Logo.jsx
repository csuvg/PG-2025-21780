import PropTypes from 'prop-types'
import styles from './Logo.module.css'

export default function Logo({showSubTitle = false}) {
    return (
        <header className={styles.logoHeader}>
            <div className={styles.logo}>
                <span className={styles.title}>TRACKMETRO</span>
                {showSubTitle && <span className={styles.subtitle}>Estimando llegadas del Transmetro</span>}
            </div>
        </header>
    )
}

Logo.propTypes = {
    showSubTitle: PropTypes.bool
}
