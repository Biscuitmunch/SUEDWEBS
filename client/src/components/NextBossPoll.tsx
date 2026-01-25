import { useState } from 'react';
import styles from './NextBossPoll.module.css';

interface Props {
  bossName: string;
  visibility: boolean;
}

function NextBossPoll({ bossName, visibility }: Props) {
  // const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  // const [selectedTimes, setSelectedTimes] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [prevTargetField, setPrevTargetField] = useState<HTMLDivElement>();

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const timeField = e.target as HTMLDivElement;
    if (!timeField.hasAttribute('selected')) {
      timeField.setAttribute('selected', '');
    } else {
      timeField.removeAttribute('selected');
    }
    setPrevTargetField(timeField);
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const timeField = e.target as HTMLDivElement;
    if (timeField != prevTargetField) {
      setPrevTargetField(timeField);
      if (isMouseDown && !timeField?.hasAttribute('selected')) {
        timeField?.setAttribute('selected', '');
      } else if (isMouseDown && timeField.hasAttribute('selected')) {
        timeField.removeAttribute('selected');
        if (prevTargetField?.hasAttribute('selected')) prevTargetField.removeAttribute('selected');
      }
    }
  };

  const handleUserDropdownClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLDivElement;
    if (!button.hasAttribute('clicked')) {
      button.setAttribute('clicked', '');
    } else {
      button.removeAttribute('clicked');
    }
  };

  const handleUserSelect = (e: React.MouseEvent<HTMLSpanElement>) => {
    const span = e.target as HTMLSpanElement;
    const button = span?.parentElement?.previousElementSibling;

    setSelectedUser(span.textContent);
    if (button) button.textContent = selectedUser;
    button?.removeAttribute('clicked');
  };

  // This should stay pretty much the same through backend updates.
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = [12, ...[...Array(11).keys()].slice(1)];

  // Needs to be queried.
  const today = 'Sunday'; // Should be able to use dayjs here.
  const available = ['Monday', 'Saturday', 'Sunday'];
  const users = ['User', 'User', 'User', 'User', 'User', 'User', 'User'];

  // function toggleDropdown() {
  //   setDropdownVisibility(!dropdownVisibility);
  // }

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
          <div className={styles.dayTimeSelectionGrid} onMouseLeave={handleMouseUp}>
            {days.map((day: string, index: number) => (
              <div key={index}>
                {available.includes(day) && day != today && (
                  <div className={styles.availableHeader} onMouseEnter={handleMouseUp}>
                    &thinsp;{day[0]}
                  </div>
                )}
                {!available.includes(day) && day != today && (
                  <div className={styles.unavailableHeader} onMouseEnter={handleMouseUp}>
                    &thinsp;{day[0]}
                  </div>
                )}
                {available.includes(day) && day === today && (
                  <div className={styles.availableHeader} onMouseEnter={handleMouseUp}>
                    &thinsp;{day[0]}
                    <div className={styles.availableTodayHeader} onMouseEnter={handleMouseUp} />
                  </div>
                )}
                {!available.includes(day) && day === today && (
                  <div className={styles.todayHeader} onMouseEnter={handleMouseUp}>
                    &thinsp;{day[0]}
                  </div>
                )}
                <div className={styles.dayGridItem}>
                  {times.map((time: number, index: number) => (
                    <div
                      key={index}
                      onMouseUp={handleMouseUp}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                    >
                      {available.includes(day) &&
                        weekdays.includes(day) &&
                        time > 5 &&
                        time != 12 && <div className={styles.timeGridItemSelectable}>{time}</div>}
                      {available.includes(day) &&
                        weekdays.includes(day) &&
                        (time <= 5 || time == 12) && (
                          <div className={styles.timeGridItemDisabled}>{time}</div>
                        )}
                      {available.includes(day) && !weekdays.includes(day) && (
                        <div className={styles.timeGridItemSelectable}>{time}</div>
                      )}
                      {!available.includes(day) && (
                        <div className={styles.timeGridItemDisabled}>{time}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.buttonBar}>
            <div className={styles.userDropdown}>
              <button className={styles.userDropdownButton} onClick={handleUserDropdownClick}>
                Select User ⮟
              </button>
              <div className={styles.userDropdownContent}>
                {users.map((user: string, index: number) => (
                  <span key={index} onClick={handleUserSelect}>
                    {user}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.submissionArea}>
              <div className={styles.questionMark}>?</div>
              <div className={styles.toolTip}>
                If you don't see your name here, please speak to the server owners.
              </div>
              <button className={styles.submitButton}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NextBossPoll;
