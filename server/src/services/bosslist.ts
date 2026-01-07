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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "..", "db", "terraria.db");

const db = new DatabaseSync(dbPath);

export function bosslist(req: Request, res: Response) {
  const query = db.prepare("SELECT * FROM bosslist where type = Boss");
  const bosses: Boss[] = query.all() as unknown as Boss[]; // Idk how to make this type safe...
  res.json(bosses);
}
