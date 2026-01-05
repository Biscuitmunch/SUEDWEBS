import express from "express";
import cors from "cors";
import { info } from "./services/info.js";
import { bosslist } from "./services/bosslist.js";
import { nextbosstime } from "./services/nextbosstime.js";

const app = express();
const port = 3000;
app.use(cors());

app.get("/info", info);
app.get("/bosslist", bosslist);
app.get("/nextbosstime", nextbosstime);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
