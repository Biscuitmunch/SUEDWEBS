import { useEffect, useRef, useState } from 'react';
import { BASE_URL } from '../../constants';
import styles from './DeathCount.module.css';
import titles from '../FontStyles.module.css';
import type { MouseEvent } from 'react';

interface Player {
  id: number;
  name: string;
  deaths: number;
}

const ascDesc = {
  asc: true,
  desc: false,
} as const;

function DeathCount() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [order, setOrder] = useState<typeof ascDesc.asc | typeof ascDesc.desc>(ascDesc.asc);
  const playerOrder = useRef<Player[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/deathcount`)
      .then((res) => res.json())
      .then((data) => setPlayers(data));
  }, []);

  function orderByDeaths() {
    setPlayers(playerOrder.current);
    setOrder(!order);
    console.log(order);
  }

  useEffect(() => {
    if (order) {
      const sortedPlayers = players.sort((a, b) => a.deaths - b.deaths);
      playerOrder.current = sortedPlayers;
    } else {
      const sortedPlayers = players.sort((a, b) => b.deaths - a.deaths);
      playerOrder.current = sortedPlayers;
    }
  }, [order, players]);

  // useEffect(() => {
  //   orderByDeaths();
  // }, []);

  const sortByDeaths = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    orderByDeaths();
  };

  return (
    <div className={styles.gridContainer}>
      <div className={titles.title2}>Player Info</div>
      <div className={styles.grid}>
        <div className={styles.gridHeaders}>Player Name</div>
        <div className={styles.gridHeaders}>
          Death Count
          <button id="button" onClick={sortByDeaths} className={styles.ascDescButton} />
        </div>
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
