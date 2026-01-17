import { Request, Response } from 'express';
import { DatabaseSync } from 'node:sqlite';
import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { Boss } from './bosslist.js';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(timezone);
dayjs.extend(utc);

interface BossKillData {
  bossName: string;
  bossKills: number;
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

function updateNextBosses() {
  const nextBoss = db
    .prepare(
      `
    SELECT * FROM bosslist
    WHERE type = 'future'
    ORDER BY id ASC
    LIMIT 1;
  `
    )
    .get() as Boss | undefined;

  if (!nextBoss) return;

  db.prepare(
    `
    UPDATE bosslist
    SET type = 'current'
    WHERE id = ?;
  `
  ).run(nextBoss.id);

  const futureMiniEvents = db
    .prepare(
      `
    SELECT id FROM bosslist
    WHERE id > ? AND type = 'future'
    ORDER BY id ASC;
  `
    )
    .all(nextBoss.id) as { id: number }[];

  for (const row of futureMiniEvents) {
    const note = db.prepare(`SELECT note FROM bosslist WHERE id = ?;`).get(row.id) as {
      note: string | null;
    };

    if (note.note === 'Mini Event') {
      db.prepare(`UPDATE bosslist SET type = 'current' WHERE id = ?;`).run(row.id);
    } else {
      break;
    }
  }
}

export function setBossKills(req: Request, res: Response) {
  const data: BossKillData = req.body;

  if (data.bossKills === 0) {
    return res.json();
  }

  const existing = db
    .prepare(
      `
    SELECT date FROM bosslist WHERE name = ?;
  `
    )
    .get(data.bossName) as { date: string | null } | undefined;

  if (existing?.date) {
    const query = db.prepare(`UPDATE bosslist SET kills=(?) WHERE name=(?);`);
    query.run(data.bossKills, data.bossName);
    return res.json();
  }

  const query = db.prepare(
    `UPDATE bosslist SET kills=(?), type='previous', date=(?) WHERE name=(?);`
  );

  const today = dayjs().tz('Pacific/Auckland').format('DD/MM/YYYY');

  query.run(data.bossKills, today, data.bossName);

  updateNextBosses();

  return res.json();
}
