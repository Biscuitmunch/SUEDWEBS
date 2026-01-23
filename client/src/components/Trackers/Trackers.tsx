import { useState } from 'react';
import BossList from './BossList';
import DeathCount from './DeathCount';
import NextBossPoll from '../NextBossPoll';
import styles from './Trackers.module.css';

function Trackers() {
  const [bossPollVisibility, setBossPollVisibility] = useState(false);
  const [bossName, setBossName] = useState('');

  const toggleBossPoll = (bossName: string) => {
    setBossName(bossName);
    setBossPollVisibility(!bossPollVisibility);
  };

  return (
    <div className={styles.trackerContainer}>
      <div className={styles.deathCount}>
        <DeathCount />
      </div>
      <div className={styles.bossList}>
        <BossList onToggle={toggleBossPoll} />
      </div>
      <div className={styles.nextBossPoll}>
        <NextBossPoll visibility={bossPollVisibility} bossName={bossName} />
      </div>
      <div className={styles.space} />
    </div>
  );
}

export default Trackers;
