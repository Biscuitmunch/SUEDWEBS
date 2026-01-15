import { useEffect, useState } from 'react';
import { BASE_URL } from '../constants';

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
    <div>
      <h2>Player Death Counts</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Deaths</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.deaths}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeathCount;
