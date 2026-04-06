import { useState } from 'react';
import PollArea from './PollArea';
import PollResults from './PollResults';
import styles from './NextBossPoll.module.css';

interface NextBossPollProps {
  bossName: string;
}

function NextBossPoll({ bossName }: NextBossPollProps) {
  const [showResults, setShowResults] = useState(false);
  return (
    <div className={styles.pollContainer}>
      <div className={styles.titleBox}>
        <div className={styles.title}>{bossName} Poll</div>
      </div>
      <PollArea showResults={showResults} setShowResults={setShowResults} />
      <PollResults showResults={showResults} setShowResults={setShowResults} />
    </div>
  );
}

export default NextBossPoll;
