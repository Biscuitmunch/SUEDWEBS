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
      <h1>
        {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
      </h1>
    </div>
  );
}

export default Countdown;
