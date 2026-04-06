import React from 'react';
import styles from './PollResults.module.css';
import buttonStyles from './NextBossPoll.module.css';

interface PollResultsProps {
  showResults: boolean;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
}

const rankings = [
  ['Sunday', '8PM', 4],
  ['Monday', '6PM', 3],
  ['Monday', '5PM', 2],
  ['Saturday', '2PM', 1],
  ['Saturday', '1PM', 1],
]; // Top 5 rankings.

function PollResults({ showResults, setShowResults }: PollResultsProps) {
  return (
    <>
      {showResults && (
        <>
          <div className={styles.rankingsContainer}>
            <div className={styles.rankingsGrid}>
              <div className={styles.rankingsRow}>
                <div className={styles.rankingsLeftHeader}>Time</div>
                <div className={styles.rankingsRightHeader}>Day of Week</div>
                <div className={styles.rankingsLoneHeader}>Votes</div>
              </div>
              {rankings.map((rank: (string | number)[], index: number) => (
                <div className={styles.rankingsRow} key={index}>
                  <div className={styles.rankingsEntryLeft}>{rank[1]}</div>
                  <div className={styles.rankingsEntryRight}>{rank[0]}</div>
                  <div className={styles.rankingsEntryLone}>{rank[2]}</div>
                </div>
              ))}
            </div>
            <div className={styles.buttonContainer}>
              <button
                className={buttonStyles.submitButton}
                onClick={() => {
                  setShowResults(false);
                }}
              >
                Return to Poll
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default PollResults;
