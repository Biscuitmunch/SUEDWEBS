import dayjs from 'dayjs';
import { Request, Response } from 'express';

const bossTimestamp = dayjs.tz('2026-01-19 19:00:00', 'Pacific/Auckland').unix();

export function nextbosstime(req: Request, res: Response) {
  res.json(bossTimestamp);
}
