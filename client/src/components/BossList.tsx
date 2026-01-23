import { useCallback, useEffect, useState } from 'react';
import styles from './BossList.module.css';
import { BASE_URL } from '../constants';

export interface Boss {
  name: string;
  note?: string;
  date?: string;
  type: string;
  kills: string;
}

function handleSelected(e: React.MouseEvent<HTMLDivElement>): void {
  const el = e.currentTarget as HTMLDivElement;

  if (el.hasAttribute('clicked')) {
    el.removeAttribute('clicked');
  } else {
    el.setAttribute('clicked', '');
  }
}

function BossList() {
  const [isShowingAll, setIsShowingAll] = useState(false);
  const [bosses, setBosses] = useState<Boss[] | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/bosslist`)
      .then((response) => response.json())
      .then(setBosses);
  }, []);

  const handleShowAll = useCallback(() => {
    const allFuture = document.querySelectorAll('.future');

    if (isShowingAll) {
      allFuture.forEach((x) => x.removeAttribute('clicked'));
    } else {
      allFuture.forEach((x) => x.setAttribute('clicked', ''));
    }

    setIsShowingAll((prev) => !prev);
  }, [isShowingAll]);

  return (
    <div>
      <div>Previous</div>
      <div className={styles.bossList}>
        <div>
          {bosses?.map((boss: Boss, index: number) => (
            <div key={index} className={styles.bossEntry}>
              {boss.type === 'current' && (
                <div className={styles.currentContainer} onClick={handleSelected}>
                  <div className={`${boss.type} ${styles[boss.type]}`}>{boss.name}</div>
                  {boss.note ? <div>({boss.note})</div> : <div />}
                  {boss.date ? <div>{boss.date}</div> : <div />}
                  {boss.kills ? <div>{boss.kills}</div> : <div />}
                </div>
              )}
              {boss.type != 'current' && (
                <>
                  <div className={`${boss.type} ${styles[boss.type]}`} onClick={handleSelected}>
                    {boss.name}
                  </div>
                  {boss.note ? <div>({boss.note})</div> : <div />}
                  {boss.date ? <div>{boss.date}</div> : <div />}
                  {boss.kills ? <div>{boss.kills}</div> : <div />}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <label className={styles.showAll}>
        <span>Show All</span>
        <input onChange={handleShowAll} type="checkbox" checked={isShowingAll} />
      </label>
    </div>
  );
}

export default BossList;
