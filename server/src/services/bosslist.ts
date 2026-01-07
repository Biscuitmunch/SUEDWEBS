import { Request, Response } from "express";

interface Boss {
  name: string;
  note?: string;
  date?: string;
  type: string;
}

const bosses: Boss[] = [
  {
    name: "Trojan Squirrel",
    note: "Mini Event",
    date: "02/01/2026",
    type: "previous",
  },
  {
    name: "King Slime",
    note: "Half Week",
    date: "04/01/2026",
    type: "previous",
  },
  { name: "Eye of Cthulhu", type: "previous", date: "06/01/2026" },
  { name: "Desert Scourge", note: "Half Week", type: "current" },
  { name: "Giant Clam", note: "Mini Event", type: "current" },
  { name: "Eater of Worlds", type: "future" },
  { name: "Hive Mind", note: "Half Week", type: "future" },
  { name: "Skeletron", type: "future" },
  { name: "Queen Bee", note: "Half Week", type: "future" },
  { name: "The Slime God", type: "future" },
  { name: "Deviantt", note: "Half Week", type: "future" },
  { name: "Wall of Flesh", type: "future" },
  { name: "Queen Slime", type: "future" },
  { name: "Cryogen", type: "future" },
  { name: "Bomboclaat", type: "future" },
  { name: "Banished Baron", note: "Half Week", type: "future" },
  { name: "The Destroyer", type: "future" },
  { name: "Aquatic Scourge", note: "Half Week", type: "future" },
  { name: "Skeletron Prime", type: "future" },
  { name: "Brimstone Elemental", note: "Half Week", type: "future" },
  { name: "The Twins", type: "future" },
  { name: "Aquatic Scourge", note: "Half Week", type: "future" },
  { name: "Lifelight", type: "future" },
  { name: "Calamitas Clone", type: "future" },
  { name: "Plantera", type: "future" },
  { name: "Anahita & The Leviathan", note: "Half Week", type: "future" },
  { name: "Astrum Aureus", type: "future" },
  { name: "Golem", type: "future" },
  { name: "Duke Fishron", note: "Half Week", type: "future" },
  { name: "Ravager", type: "future" },
  { name: "Empress of Light", note: "Half Week", type: "future" },
  { name: "Astrum Deus", type: "future" },
  {
    name: "Lunatic Cultist & Moon Lord",
    note: "Longer Session",
    type: "future",
  },
  { name: "Profaned Guardians", type: "future" },
  { name: "Dragonfolly", type: "future" },
  { name: "Providence", type: "future" },
  { name: "2 Champions", note: "Half Week", type: "future" },
  { name: "Ceaseless Void", type: "future" },
  { name: "2 Champions", note: "Half Week", type: "future" },
  { name: "Storm Weaver", type: "future" },
  { name: "2 Champions", note: "Half Week", type: "future" },
  { name: "Signus", type: "future" },
  { name: "2 Champions", note: "Half Week", type: "future" },
  { name: "Polterghast", type: "future" },
  { name: "Old Duke", type: "future" },
  { name: "Devourer of Gods", type: "future" },
  { name: "Eridanus", type: "future" },
  { name: "Yharon", type: "future" },
  { name: "Abominationn", type: "future" },
  { name: "Exo Mechs", type: "future" },
  { name: "Supreme Calamitas", type: "future" },
  { name: "Mutant", note: "Longer Session", type: "future" },
  { name: "Boss Rush", note: "Longer Session", type: "future" },
];

export function bosslist(req: Request, res: Response) {
  res.json(bosses);
}
