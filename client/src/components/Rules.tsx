import styles from "./Rules.module.css";

function Rules() {
  return (
    <>
      <div className={styles.title}>Rules</div>
      <div className={styles.rulesContainer}>
        <div className={styles.bulletedList}>
          <ul>
            <li>
              SUEDWEBS (Skylar's Ultimate Eternity-Death Weekly (Expert) Boss
              Server) is a long-running modded Terraria server, with a
              progression boss fight planned for each week. This website
              provides information and scheduling for upcoming and available
              boss fights.
            </li>
            <li>
              Some weeks will have multiple boss fights planned (but no more
              than two). Half week boss fights are considered less relevant and
              may be skipped by those who cannot otherwise make it.
            </li>
            <li>
              In addition, some fights are marked as being longer sessions or
              mini events (mini events don't contribute toward the boss count
              for a week).
            </li>
            <li>
              <b>IMPORTANT</b>: Do not fight bosses outside of the allowed
              schedule. Please see the boss list for which bosses you may fight
              freely - these will only ever include bosses that have been fought
              and defeated by everyone previously.
            </li>
            <li>
              Please make sure to have entered your preferred times for the next
              boss at least half a week (3 days) in advance.
            </li>
            <li>
              You may also enter or update preferred times for future bosses
              (beyond the next boss) at any time, but this is not required.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Rules;
