import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import styles from "./Countdown.module.css";
import type { Boss } from "./BossList.tsx";
import { useFetchBossList } from "./BossList.tsx";
import { BASE_URL } from "../constants";

function Countdown() {
  const [nextBossDateTime, setNextBossDateTime] = useState<
    dayjs.Dayjs | undefined
  >();
  const [now, setNow] = useState(dayjs());
  const [bosses, setBosses] = useState<Boss[] | null>(null);
  const [bossFight, setBossFight] = useState(false);

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
    return now.add(0, "day").add(0, "hour").add(0, "minute").add(4, "second");
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
      if (nextBossDateTime?.unix() <= now.unix()) {
        setBossFight(true);
      }
    }
  }, [getFormattedCountdown]);

  useEffect(() => {
    if (bossFight === true) {
      const titleCard = document.getElementById("titleCard");
      titleCard?.classList.add(styles.bossTitleCard);
      placeBossSkulls();
    }
  }, [bossFight]);

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  async function placeBossSkulls() {
    let skullCount = 0;
    const skullContainer = document.getElementById("bossSkullContainer");
    nextBosses?.map((boss) => {
      if (boss.note?.toLowerCase().includes("event")) {
        skullCount += 1;
      } else if (boss.note?.toLowerCase().includes("half")) {
        skullCount += 2;
      } else if (boss.note?.toLowerCase().includes("longer")) {
        skullCount += 5;
      } else {
        skullCount += 3;
      }
    });
    for (let i = 0; i < skullCount; i++) {
      const skull = document.createElement("div");
      skull.classList.add(styles.bossSkull);
      skullContainer?.appendChild(skull);
      await sleep(500);
    }
    await sleep(1500); // Allow time for the skulls to move before rendering text.
    document.getElementById("bossText")?.setAttribute("style", "opacity: 1");
  }

  return (
    <>
      <div id="titleCard" className={styles.titleCard}>
        {nextBosses !== undefined ? (
          <div id="bossSkullContainer" className={styles.bossSkullContainer}>
            <div id="title" className={styles.title}>
              {bossFight !== true &&
                nextBosses?.map((boss, i) => (
                  <div key={boss.name} style={{ display: "flex" }}>
                    {i !== 0 && <hr className={styles.verticalRule} />}
                    <div className={styles.bossName}>{boss.name}</div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div>No Upcoming Bosses</div>
        )}
      </div>
      <div className={styles.timer}>
        {nextBossDateTime !== undefined &&
          nextBossDateTime.unix() > now.unix() && (
            <div>{getFormattedCountdown()}</div>
          )}
        {nextBossDateTime !== undefined &&
          nextBossDateTime.unix() <= now.unix() && (
            <div id="bossText" style={{ opacity: 0 }}>
              Boss Fight!
            </div>
          )}
      </div>
    </>
  );
}

export default Countdown;
