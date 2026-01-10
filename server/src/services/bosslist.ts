import { Request, Response } from "express";
import { DatabaseSync, StatementSync } from "node:sqlite";
import path, { join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

interface Boss {
  name: string;
  note?: string;
  date?: string;
  type: string;
}

const inDocker = process.argv.includes("--IN_DOCKER");

const dbPath = path.join(
  import.meta.dirname,
  "..",
  "..",
  inDocker ? "docker_db" : "db",
  "terraria.db"
);

if (!existsSync(dbPath)) {
  writeFileSync(dbPath, "", "utf-8");
}

const db = new DatabaseSync(dbPath);

const rawSql = readFileSync(
  join(import.meta.dirname, "..", "..", "db", "tables", "bosslist.sql"),
  "utf-8"
);

const splitInd = rawSql.indexOf(");");

const createTable = rawSql.slice(0, splitInd + 2).trim();
const insertInto = rawSql.slice(splitInd + 2).trim();

if (!createTable || !insertInto) {
  throw new Error("Missing SQL File");
}

let query: StatementSync;

try {
  query = db.prepare("SELECT * FROM bosslist");
} catch (error) {
  console.log("No DB detected, creating one :)");
  db.exec(createTable);
  db.exec(insertInto);
  query = db.prepare("SELECT * FROM bosslist");
}

// Empty boss list for testing.
// export function bosslist(req: Request, res: Response) {
//   const bosses: Boss[] = [];
//   res.json(bosses);
// }

export function bosslist(req: Request, res: Response) {
  const bosses: Boss[] = query.all() as unknown as Boss[]; // Idk how to make this type safe...
  res.json(bosses);
}
