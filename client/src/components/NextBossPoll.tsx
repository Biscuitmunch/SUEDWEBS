import { useState } from 'react';
import styles from './NextBossPoll.module.css';

interface Props {
  bossName: string;
  visibility: boolean;
}

function NextBossPoll({ bossName, visibility }: Props) {
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  // const [selectedUser, setSelectedUser] = useState(0);
  // const [selectedTimes, setSelectedTimes] = useState(0);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = [12, ...[...Array(11).keys()].slice(1)];

  function toggleDropdown() {
    setDropdownVisibility(!dropdownVisibility);
  }

  return (
    <>
      {visibility && (
        <div className={styles.pollArea}>
          <div className={styles.titleBox}>
            <div className={styles.title}>{bossName} Poll</div>
          </div>
          <div className={styles.legend}>
            <span className={styles.legendToday}>■ Today's Date</span>
            <span className={styles.legendAvailable}>■ Available Dates</span>
          </div>
          <div className={styles.dayTimeSelectionGrid}>
            {days.map((day: string, index: number) => (
              <div key={index}>
                <div className={styles.dayGridHeaders}>{day[0]}</div>
                <div className={styles.dayGridItem}>
                  {times.map((time: number, index: number) => (
                    <div key={index} className={styles.timeGridItem}>
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.buttonBar}>
            <div className={styles.userDropdownButton}>Select User ⮟</div>
            <div className={styles.submissionArea}>
              <div className={styles.questionMark}>?</div>
              <span className={styles.toolTip}>&nbsp;Tooltip</span>
              <div className={styles.submitButton}>Submit</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NextBossPoll;
