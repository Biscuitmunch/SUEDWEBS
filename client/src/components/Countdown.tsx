import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import styles from "./Countdown.module.css";
import type { Boss } from "./BossList.tsx";
import { useFetchBossList } from "./BossList.tsx";

const BASE_URL = import.meta.env.VITE_API_URL;

function Countdown() {
  const [nextBossDateTime, setNextBossDateTime] = useState<
    dayjs.Dayjs | undefined
  >();
  const [now, setNow] = useState(dayjs());
  const [bosses, setBosses] = useState<Boss[] | null>(null);

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
    return now.add(0, "day").add(0, "hour").add(0, "minute").add(8, "second");
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/nextbosstime`)
      .then((response) => response.json())
      .then((timestamp) => setNextBossDateTime(dayjs.unix(timestamp)))
      .then(() => setNextBossDateTime(future)); // Testing
  }, [future]); // future dependency for testing only.

  useFetchBossList(setBosses);

  const nextBosses = useMemo(() => {
    return bosses?.filter((boss) => boss.type === "current");
  }, [bosses]);

  function getFormattedCountdown() {
    if (nextBossDateTime === undefined) return "";
    const timeUntilBoss = dayjs.duration(nextBossDateTime.diff(now));

    const timeUnits = [
      { duration: timeUntilBoss.days(), denomination: "day" },
      { duration: timeUntilBoss.hours(), denomination: "hour" },
      { duration: timeUntilBoss.minutes(), denomination: "minute" },
      { duration: timeUntilBoss.seconds(), denomination: "second" },
    ];

    const leadingDenominationIndex = timeUnits.findIndex(
      (unit) => unit.duration > 0
    );
    const formattedCountdown = timeUnits
      .slice(leadingDenominationIndex)
      .map((unit) => {
        return `${unit.duration} ${
          unit.duration === 1 ? unit.denomination : unit.denomination + "s"
        }`;
      })
      .join(", ");
    return formattedCountdown;
  }

  // Safety?
  useEffect(() => {
    if (nextBossDateTime !== undefined) {
      const titleCard = document.getElementById("titleCard");
      // const title = document.getElementById("title");
      if (nextBossDateTime?.unix() <= now.unix()) {
        titleCard?.classList.add(styles.bossTitleCard);
        // title?.setAttribute("style", "opacity: 0;");
      } else {
        titleCard?.classList.remove(styles.bossTitleCard);
        // title?.setAttribute("style", "opacity: 1;");
      }
    }
  }, [getFormattedCountdown]);

  return (
    <>
      <div id="titleCard" className={styles.titleCard}>
        {nextBosses !== undefined ? (
          <div id="title" className={styles.title}>
            {nextBosses?.map((boss, i) => (
              <div key={boss.name} style={{ display: "flex" }}>
                {i !== 0 && <hr className={styles.verticalRule} />}
                <div className={styles.bossName}>{boss.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div>No Upcoming Bosses</div>
        )}
      </div>
      <div className={styles.timer}>
        {nextBossDateTime !== undefined &&
          nextBossDateTime?.unix() > now.unix() && (
            <div>{getFormattedCountdown()}</div>
          )}
        {nextBossDateTime !== undefined &&
          nextBossDateTime.unix() <= now.unix() && <div>Boss Time!</div>}
      </div>
    </>
  );
}

export default Countdown;
