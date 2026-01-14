import dayjs from 'dayjs';
import { Request, Response } from 'express';

import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const bossTimestamp = dayjs.tz('2026-01-16 19:00:00', 'Pacific/Auckland').unix();

export function nextbosstime(req: Request, res: Response) {
  res.json(bossTimestamp);
}
