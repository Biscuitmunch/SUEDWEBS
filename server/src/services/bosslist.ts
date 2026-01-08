import { Request, Response } from "express";

interface Boss {
  name: string;
  note?: string;
  date?: string;
  type: string;
}

import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, writeFileSync } from "node:fs";

let dbPath: string;

if (process.argv.includes('--IN_DOCKER')) {
  dbPath = path.join(import.meta.dirname, "..", "..", "docker_db", "terraria.db");

  if (!existsSync(dbPath)) {
    // we can't do a create outside of Docker because if the user is running in
    // dev (which has hot reloading) we get an infinite reload loop
    writeFileSync(dbPath, '', 'utf-8');
  }
} else {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dbPath = path.join(__dirname, "..", "db", "terraria.db");
}

const db = new DatabaseSync(dbPath);

export function bosslist(req: Request, res: Response) {
  const query = db.prepare("SELECT * FROM bosslist where type = Boss");
  const bosses: Boss[] = query.all() as unknown as Boss[]; // Idk how to make this type safe...
  res.json(bosses);
}
