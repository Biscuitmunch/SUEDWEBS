import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import styles from "./Countdown.module.css";

const BASE_URL = import.meta.env.VITE_API_URL;

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

  useEffect(() => {
    fetch(`${BASE_URL}/nextbosstime`)
      .then((response) => response.json())
      .then((timestamp) => setNextBossDateTime(dayjs.unix(timestamp)));
  }, []);

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
          {nextBossDateTime.unix() - now.unix() > 86400 && `${days} days, `}
          {nextBossDateTime.unix() - now.unix() > 3600 && `${hours} hours, `}
          {nextBossDateTime.unix() - now.unix() > 60 && `${minutes} minutes, `}
          {nextBossDateTime.unix() - now.unix() > 0 && `${seconds} seconds`}
        </h1>
      )}
    </div>
  );
}

export default Countdown;
