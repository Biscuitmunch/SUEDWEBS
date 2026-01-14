import { Request, Response } from 'express';
import { DatabaseSync } from 'node:sqlite';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const inDocker = process.argv.includes('--IN_DOCKER');

const dbPath = path.join(
  import.meta.dirname,
  '..',
  '..',
  inDocker ? 'docker_db' : 'db',
  'terraria.db'
);

if (!existsSync(dbPath)) {
  writeFileSync(dbPath, '', 'utf-8');
}

const db = new DatabaseSync(dbPath);

interface PlayerData {
  playerName: string;
  playerDeaths: number;
}

export function deathcount(req: Request, res: Response) {
  const data: PlayerData = req.body;

  const query = db.prepare(`
    INSERT INTO deathcount (name, deaths) VALUES (?, ?)
    ON CONFLICT(name) DO UPDATE SET deaths=(?);
  `);

  query.run(data.playerName, data.playerDeaths, data.playerDeaths);

  return res.json();
}
