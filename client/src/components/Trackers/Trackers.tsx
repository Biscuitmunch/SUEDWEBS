import { useState } from 'react';
import BossList from './BossList';
import DeathCount from './DeathCount';
import NextBossPoll from '../NextBossPoll';
import styles from './Trackers.module.css';

function Trackers() {
  const [bossPollVisibility, setBossPollVisibility] = useState(false);
  const [bossName, setBossName] = useState('');

  const toggleBossPoll = (name: string | null) => {
    if (name === null) {
      setBossPollVisibility(false);
    } else if (name != bossName) {
      setBossPollVisibility(true);
      setBossName(name);
    } else {
      setBossPollVisibility(!bossPollVisibility);
    }
  };

  return (
    <div className={styles.trackerContainer}>
      <div className={styles.deathCount}>
        <DeathCount />
      </div>
      <BossList onToggle={toggleBossPoll} />
      <div className={styles.nextBossPoll}>
        <NextBossPoll
          onToggle={toggleBossPoll}
          visibility={bossPollVisibility}
          bossName={bossName}
        />
      </div>
    </div>
  );
}

export default Trackers;
