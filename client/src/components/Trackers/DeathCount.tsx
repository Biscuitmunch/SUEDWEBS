import { useCallback, useEffect, useMemo, useState } from 'react';
import { BASE_URL } from '../../constants';
import styles from './DeathCount.module.css';
import titles from '../FontStyles.module.css';
import type { MouseEvent } from 'react';

interface Player {
  id: number;
  name: string;
  deaths: number;
}

function DeathCount() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetch(`${BASE_URL}/deathcount`)
      .then((res) => res.json())
      .then((data) => setPlayers(data));
  }, []);

  const sortedPlayers = useMemo(() => {
    if (order === 'asc') {
      return players.sort((a, b) => a.deaths - b.deaths);
    }
    return players.sort((a, b) => b.deaths - a.deaths);
  }, [order, players]);

  const sortByDeaths = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  }, []);

  return (
    <div className={styles.gridContainer}>
      <div className={titles.title2}>Player Info</div>
      <div className={styles.grid}>
        <div className={styles.gridHeaders}>Player Name</div>
        <div className={styles.gridHeaders}>
          Death Count
          <button id="button" onClick={sortByDeaths} className={styles.ascDescButton} />
        </div>
        {sortedPlayers.map((player) => (
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
