CREATE TABLE IF NOT EXISTS polls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playername INTEGER NOT NULL,
    bossname INTEGER NOT NULL,
    fighttime INTEGER NOT NULL,
    FOREIGN KEY (playername) REFERENCES users(name),
    FOREIGN KEY (bossname) REFERENCES bosslist(name),
    UNIQUE (playername, bossname)
);
