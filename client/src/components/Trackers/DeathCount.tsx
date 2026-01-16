import { useEffect, useState } from 'react';
import { BASE_URL } from '../../constants';
import styles from './DeathCount.module.css';

interface Player {
  id: number;
  name: string;
  deaths: number;
}

function DeathCount() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/deathcount`)
      .then((res) => res.json())
      .then((data) => setPlayers(data));
  }, []);

  return (
    <div className={styles.gridContainer}>
      <h2>Player Death Counts</h2>
      <div className={styles.grid}>
        {players.map((player) => (
          <div key={player.id} className={styles.playerItem}>
            <div className={styles.playerName}>{player.name}</div>
            <div className={styles.playerDeaths}>{player.deaths}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeathCount;
