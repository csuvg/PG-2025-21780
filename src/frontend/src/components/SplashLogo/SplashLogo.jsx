import { useLayoutEffect, useRef } from "react";
import styles from "./SplashLogo.module.css";
import gsap from "gsap";
import Air from '../../assets/svg/air.svg'
import Bus from '../../assets/svg/bus.svg'

export default function Splash() {
  const busRef = useRef(null);
  const airRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(busRef.current, { transformOrigin: "50% 80%" });

      gsap.timeline({ repeat: -1, yoyo: true })
        .to(busRef.current, { rotation: 4, y: -6, duration: 1.15, ease: "sine.inOut" })
        .to(busRef.current, { rotation: -4, y: 2, duration: 1.15, ease: "sine.inOut" });

      gsap.to(airRef.current, { opacity: 0.18, x: -8, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut" });

      // micro-vibe opcional
      gsap.to(busRef.current, { x: "+=0.6", yoyo: true, repeat: -1, duration: 0.1, ease: "sine.inOut" });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.splashLogoContainer}>
      <div className={styles.splashLogo}>
        <img ref={airRef} src={Air} alt="aire" className={styles.airImg} />
        <img ref={busRef} src={Bus} alt="bus" className={styles.busImg} />
      </div>
    </div>
  );
}
