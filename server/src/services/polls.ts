import { Request, Response } from 'express';
import { DatabaseSync, StatementSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import path, { join } from 'node:path';

interface PollData {
  playerName: string;
  fightTime: number;
}

const inDocker = process.argv.includes('--IN_DOCKER');

const dbPath = path.join(
  import.meta.dirname,
  '..',
  '..',
  inDocker ? 'docker_db' : 'db',
  'terraria.db'
);

const db = new DatabaseSync(dbPath);

const rawSql = readFileSync(
  join(import.meta.dirname, '..', '..', 'db', 'tables', 'polls.sql'),
  'utf-8'
);

if (!rawSql) {
  throw new Error('Missing SQL File');
}

let query: StatementSync;

try {
  query = db.prepare(`INSERT INTO polls (playername, bossname, fighttime) VALUES (?, ?, ?);`);
} catch (error) {
  console.log('No DB detected, creating one :)');
  db.exec(rawSql);
  query = db.prepare(`INSERT INTO polls (playername, bossname, fighttime) VALUES (?, ?, ?);`);
}

export function getPollResults(req: Request, res: Response) {
  const stmt = db.prepare('SELECT * FROM polls;');
  const rows: PollData[] = stmt.all() as unknown as PollData[];

  res.json(rows);
}

export function putPollResult(req: Request, res: Response) {
  const data: PollData = req.body;

  const currentBoss = db.prepare(`SELECT * FROM bosslist WHERE type = 'current';`).get() as {
    name: string;
  };

  query.run(data.playerName, currentBoss.name, data.fightTime);

  res.json();
}
