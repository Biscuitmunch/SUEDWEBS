import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import styles from './Countdown.module.css';
import type { Boss } from './Trackers/BossList.tsx';
import { BASE_URL } from '../constants';
// import bossSound from "./public";

function Countdown() {
  const [nextBossDateTime, setNextBossDateTime] = useState<dayjs.Dayjs | undefined>();
  const [now, setNow] = useState(dayjs());
  const [bosses, setBosses] = useState<Boss[] | undefined>(undefined); // Expects to receive [] for zero bosses.
  const [skullCounter, setSkullCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      fetch(`${BASE_URL}/nextbosstime`)
        .then((response) => response.json())
        .then((timestamp) => setNextBossDateTime(dayjs.unix(timestamp)))
        .catch(() => setNextBossDateTime(undefined));
      fetch(`${BASE_URL}/bosslist`)
        .then((response) => response.json())
        .then(setBosses)
        .catch(() => setBosses(undefined));
    };
    fetchData();
  }, []);

  const nextBosses = useMemo(() => {
    if (bosses !== undefined && bosses.length === 0) {
      return null;
    }
    return bosses?.filter((boss) => boss.type === 'current');
  }, [bosses]);

  const bossFight = useMemo(() => {
    return nextBossDateTime !== undefined && now.unix() >= nextBossDateTime.unix();
  }, [now, nextBossDateTime]);

  function getFormattedCountdown() {
    if (nextBossDateTime === undefined) return '';
    const timeUntilBoss = dayjs.duration(nextBossDateTime.diff(now));

    const timeUnits = [
      { duration: timeUntilBoss.days(), denomination: 'day' },
      { duration: timeUntilBoss.hours(), denomination: 'hour' },
      { duration: timeUntilBoss.minutes(), denomination: 'minute' },
      { duration: timeUntilBoss.seconds(), denomination: 'second' },
    ];

    const leadingDenominationIndex = timeUnits.findIndex((unit) => unit.duration > 0);
    const formattedCountdown = timeUnits
      .slice(leadingDenominationIndex)
      .map((unit) => {
        return `${unit.duration} ${
          unit.duration === 1 ? unit.denomination : unit.denomination + 's'
        }`;
      })
      .join(', ');
    return formattedCountdown;
  }

  const skullCount = useMemo(() => {
    let skullCount = 0;
    nextBosses?.map((boss) => {
      if (boss.note?.toLowerCase().includes('event')) {
        skullCount += 1;
      } else if (boss.note?.toLowerCase().includes('half')) {
        skullCount += 2;
      } else if (boss.note?.toLowerCase().includes('longer')) {
        skullCount += 5;
      } else {
        skullCount += 3;
      }
    });
    return skullCount;
  }, [nextBosses]);

  useEffect(() => {
    if (nextBosses !== null && bossFight) {
      function playBossSound() {
        new Audio('/bossSound.mp3').play();
      }

      const bossHalo = document.getElementById('bossHalo');
      if (bossHalo) {
        bossHalo.style.setProperty('--halo-colour', 'var(--ctp-red)');
      }
      document.getElementById('titleBox')?.style.setProperty('width', '0'); // Set title width to zero to allow skulls to place correctly.

      const placeBossSkull = () => {
        const bossTitleCard = document.getElementById('bossTitleCard');
        const skull = document.createElement('div');
        skull.classList.add(styles.bossSkull);
        bossTitleCard?.appendChild(skull);
      };

      const interval = setInterval(() => {
        setSkullCounter((skullCounter: number) => {
          const nextCount = skullCounter + 1;
          if (bossHalo && nextCount > 1) {
            bossHalo.classList.remove('spin');
            void bossHalo.offsetWidth; // Supposedly this is for reflow, not sure if needed.
            bossHalo.style.setProperty('--animation-duration', 12 / (nextCount + 1) + 's');
            bossHalo.classList.add('spin');
          }
          if (nextCount > skullCount) {
            clearInterval(interval);
            return skullCount;
          }
          return nextCount;
        });
        if (skullCounter < skullCount) {
          placeBossSkull();
          playBossSound();
        } // it's beautiful :.>
      }, 1200);

      const timeout = setTimeout(() => {
        document.getElementById('bossText')?.setAttribute('style', 'opacity: 1');
      }, 1500 + 500 * skullCount); // lmao
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [nextBosses, bossFight, skullCount, skullCounter]);

  return (
    <>
      <div id="bossHalo" className={styles.bossHalo}>
        <div id="bossTitleCard" className={styles.bossTitleCard}>
          <div id="titleBox" className={styles.titleBox}>
            {nextBosses !== null ? (
              <>
                {bossFight !== true &&
                  nextBosses?.map((boss, i) => (
                    <div className={styles.flexContainer}>
                      {i !== 0 && <hr className={styles.verticalRule} />}
                      {/* DO NOT COMBINE THESE DIVS*/}
                      <div key={boss.name} className={styles.bossNameContainer}>
                        <div className={styles.bossName}>{boss.name}</div>
                      </div>
                    </div>
                  ))}
              </>
            ) : (
              <div>No Upcoming Bosses</div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.timer}>
        {nextBossDateTime !== undefined && nextBossDateTime.unix() > now.unix() && (
          <div>{getFormattedCountdown()}</div>
        )}
        {nextBossDateTime !== undefined && nextBossDateTime.unix() <= now.unix() && (
          <div id="bossText" style={{ opacity: 0 }}>
            Boss Fight!
          </div>
        )}
      </div>
    </>
  );
}

export default Countdown;
