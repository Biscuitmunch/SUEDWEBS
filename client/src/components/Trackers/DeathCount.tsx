import { useCallback, useEffect, useMemo, useState, useReducer } from 'react';
import { BASE_URL } from '../../constants';
import styles from './DeathCount.module.css';
import titles from '../FontStyles.module.css';
import OrderButton from '../OrderButton.tsx';

interface Player {
  id: number;
  name: string;
  deaths: number;
}

const Order = {
  Ascending: 'ASC',
  Descending: 'DESC',
} as const;

type OrderType = (typeof Order)[keyof typeof Order];

const Update = {
  PlayerName: 'PLAYERNAME',
  DeathCount: 'DEATHCOUNT',
} as const;

type UpdateType = (typeof Update)[keyof typeof Update];

interface ColumnOrder {
  playerName: OrderType;
  deathCount: OrderType;
  mostRecent: UpdateType;
}

type Action = { type: 'UPDATE_PLAYERNAME_ORDER' } | { type: 'UPDATE_DEATHCOUNT_ORDER' };

function DeathCount() {
  const [players, setPlayers] = useState<Player[]>([]);

  const initialColumnOrders = {
    playerName: Order.Ascending,
    deathCount: Order.Ascending,
    mostRecent: Update.DeathCount,
  };

  function orderReducer(column: ColumnOrder, action: Action) {
    switch (action.type) {
      case 'UPDATE_PLAYERNAME_ORDER':
        return {
          ...column,
          playerName: column.playerName === Order.Ascending ? Order.Descending : Order.Ascending,
          mostRecent: Update.PlayerName,
        };
      case 'UPDATE_DEATHCOUNT_ORDER':
        return {
          ...column,
          deathCount: column.deathCount === Order.Ascending ? Order.Descending : Order.Ascending,
          mostRecent: Update.DeathCount,
        };
      default:
        return column;
    }
  }

  const [columnOrders, dispatch] = useReducer(orderReducer, initialColumnOrders);

  useEffect(() => {
    fetch(`${BASE_URL}/deathcount`)
      .then((res) => res.json())
      .then((data) => setPlayers(data));
  }, []);

  const sortedPlayers = useMemo(() => {
    if (columnOrders.mostRecent === Update.PlayerName) {
      if (columnOrders.playerName === Order.Ascending) {
        return players.sort((a, b) => {
          const aLower = a.name.toLowerCase();
          const bLower = b.name.toLowerCase();
          if (aLower < bLower) return -1;
          if (aLower > bLower) return 1;
          return 0;
        });
      } else {
        return players.sort((a, b) => {
          const aLower = a.name.toLowerCase();
          const bLower = b.name.toLowerCase();
          if (aLower > bLower) return -1;
          if (aLower < bLower) return 1;
          return 0;
        });
      }
    } else if (columnOrders.mostRecent === Update.DeathCount) {
      if (columnOrders.deathCount === Order.Ascending) {
        return players.sort((a, b) => a.deaths - b.deaths);
      }
      return players.sort((a, b) => b.deaths - a.deaths);
    }
    return players.sort((a, b) => a.deaths - b.deaths);
  }, [columnOrders, players]);

  const sortByPlayerName = useCallback(() => {
    dispatch({ type: 'UPDATE_PLAYERNAME_ORDER' });
  }, []);

  const sortByDeathCount = useCallback(() => {
    dispatch({ type: 'UPDATE_DEATHCOUNT_ORDER' });
  }, []);

  return (
    <div className={styles.gridContainer}>
      <div className={titles.title2}>Player Info</div>
      <div className={styles.grid}>
        <div className={styles.gridHeaders} onClick={sortByPlayerName}>
          Player Name <OrderButton order={columnOrders.playerName} />
        </div>
        <div className={styles.gridHeaders} onClick={sortByDeathCount}>
          Death Count <OrderButton order={columnOrders.deathCount} />
        </div>
        {sortedPlayers.map((player) => (
          <div key={player.id} className={styles.playerItem}>
            <div className={styles.playerName}>{player.name}</div>
            <div className={styles.deathCount}>{player.deaths}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeathCount;
