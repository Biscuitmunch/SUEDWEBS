import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import styles from "./Countdown.module.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const Times = {
  Hours: 24,
  Minutes: 60,
  Seconds: 60
} as const

function Countdown() {
  const [nextBossDateTime, setNextBossDateTime] = useState<
    dayjs.Dayjs | undefined
  >();
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // For testing hypothetical boss timers.
  const future = useMemo(() => {
    return now
    .add(1, 'day')
    .add(1, 'hour')
    .add(1, 'minute')
    .add(8, 'second');
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/nextbosstime`)
      .then((response) => response.json())
      .then((timestamp) => setNextBossDateTime(dayjs.unix(timestamp)))
      .then(() => setNextBossDateTime(future)); // Testing 
  }, [future]); // future dependency for testing only.

  const [days, hours, minutes, seconds] = useMemo(() => {
    if (!nextBossDateTime) return ["0", "0", "0", "0"];
    
    return dayjs
      .duration(nextBossDateTime.diff(now))
      .format("D:H:m:s")
      .split(":");
  }, [now, nextBossDateTime]);

  return (
    <div className={styles.timer}>
      {nextBossDateTime !== undefined && (
        <h1>
          {nextBossDateTime.unix() - now.unix() > Times.Hours*Times.Minutes*Times.Seconds ? ((nextBossDateTime.unix() - now.unix()) <= 2*Times.Hours*Times.Minutes*Times.Seconds && (nextBossDateTime.unix() - now.unix()) > Times.Hours*Times.Minutes*Times.Seconds ? `${days} day, ` : `${days} days, `) : ``}
          {nextBossDateTime.unix() - now.unix() > Times.Minutes*Times.Seconds ? ((nextBossDateTime.unix() - now.unix()) % (Times.Hours*Times.Minutes*Times.Seconds) <= 2*Times.Minutes*Times.Seconds && (nextBossDateTime.unix() - now.unix()) % (Times.Hours*Times.Minutes*Times.Seconds) > Times.Minutes*Times.Seconds ? `${hours} hour, ` : `${hours} hours, `) : ``}
          {nextBossDateTime.unix() - now.unix() > Times.Seconds ? ((nextBossDateTime.unix() - now.unix()) % (Times.Minutes*Times.Seconds) <= 2*Times.Seconds && (nextBossDateTime.unix() - now.unix()) % (Times.Minutes*Times.Seconds) > Times.Seconds ? `${minutes} minute, ` : `${minutes} minutes, `) : ``}
          {nextBossDateTime.unix() - now.unix() > 0 ? ((nextBossDateTime.unix() - now.unix()) % Times.Seconds <= 2 && (nextBossDateTime.unix() - now.unix()) % Times.Seconds > 1 ? `${seconds} second` : `${seconds} seconds`) : ``}
        </h1>
      )}
      {nextBossDateTime !== undefined &&
        nextBossDateTime.unix() <= now.unix() && <h1>Boss Time!</h1>}
    </div>
  );
}

export default Countdown;
