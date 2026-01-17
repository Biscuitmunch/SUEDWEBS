import express from 'express';
import cors from 'cors';
import { info } from './services/info.js';
import { getBossList } from './services/bosslist.js';
import { nextbosstime } from './services/nextbosstime.js';
import { getDeathCount, putDeathCount } from './services/deathcount.js';
import { setBossKills } from './services/bosskills.js';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get('/info', info);
app.get('/bosslist', getBossList);
app.get('/nextbosstime', nextbosstime);
app.get('/deathcount', getDeathCount);
app.put('/deathcount', putDeathCount);
app.put('/bosskills', setBossKills);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
