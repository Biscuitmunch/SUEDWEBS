import express from 'express';
import cors from 'cors';
import { info } from './services/info.js';
import { bosslist } from './services/bosslist.js';
import { nextbosstime } from './services/nextbosstime.js';
import { getDeathCount, putDeathCount } from './services/deathcount.js';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get('/info', info);
app.get('/bosslist', bosslist);
app.get('/nextbosstime', nextbosstime);
app.get('/deathcount', getDeathCount);
app.put('/deathcount', putDeathCount);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
