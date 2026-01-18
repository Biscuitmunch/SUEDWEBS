import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import { Request, Response } from 'express';

dayjs.extend(timezone);
dayjs.extend(utc);

const bossTimestamp = dayjs.tz('2026-01-18 19:00:00', 'Pacific/Auckland').unix();

export function nextbosstime(req: Request, res: Response) {
  res.json(bossTimestamp);
}
