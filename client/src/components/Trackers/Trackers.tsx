import { useState } from 'react';
import BossList from './BossList';
import DeathCount from './DeathCount';
import NextBossPoll from '../NextBossPoll';
import styles from './Trackers.module.css';

function Trackers() {
  const [bossName, setBossName] = useState('');

  return (
    <div className={styles.trackerContainer}>
      <div className={styles.deathCount}>
        <DeathCount />
      </div>
      <BossList setBossName={setBossName} />
      <div className={styles.nextBossPoll}>
        <NextBossPoll bossName={bossName} />
      </div>
    </div>
  );
}

export default Trackers;
