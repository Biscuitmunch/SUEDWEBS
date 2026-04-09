import DeathCount from './DeathCount';
import BossList from './BossList';
import styles from './Trackers.module.css';

function Trackers() {
  return (
    <div className={styles.trackerContainer}>
      <div className={styles.deathCount}>
        <DeathCount />
      </div>
      <div className={styles.bossList}>
        <BossList />
      </div>
      <div className={styles.space} />
    </div>
  );
}

export default Trackers;
