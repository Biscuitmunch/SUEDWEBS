import { Request, Response } from 'express';
import { DatabaseSync, StatementSync } from 'node:sqlite';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path, { join } from 'node:path';

interface PlayerData {
  playerName: string;
  playerDeaths: number;
}

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

const rawSql = readFileSync(
  join(import.meta.dirname, '..', '..', 'db', 'tables', 'deathcount.sql'),
  'utf-8'
);

const splitInd = rawSql.indexOf(');');

const createTable = rawSql.slice(0, splitInd + 2).trim();

if (!createTable) {
  throw new Error('Missing SQL File');
}

let query: StatementSync;

try {
  query = db.prepare(`
    INSERT INTO deathcount (name, deaths) VALUES (?, ?)
    ON CONFLICT(name) DO UPDATE SET deaths=(?);
  `);
} catch (error) {
  console.log('No DB detected, creating one :)');
  db.exec(createTable);
  query = db.prepare(`
    INSERT INTO deathcount (name, deaths) VALUES (?, ?)
    ON CONFLICT(name) DO UPDATE SET deaths=(?);
  `);
}

export function deathcount(req: Request, res: Response) {
  const data: PlayerData = req.body;

  query.run(data.playerName, data.playerDeaths, data.playerDeaths);

  return res.json();
}
