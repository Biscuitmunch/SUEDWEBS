import { useCallback, useEffect, useState } from "react";
import styles from "./BossList.module.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export interface Boss {
  name: string;
  note?: string;
  date?: string;
  type: string;
}

function handleClickSpoilerText(e: React.MouseEvent<HTMLDivElement>): void {
  const el = e.target as HTMLDivElement;

  if (el.hasAttribute("clicked")) {
    el.removeAttribute("clicked");
  } else {
    el.setAttribute("clicked", "");
  }
}

export function useFetchBossList(setBosses: (bosses: Boss[] | null) => void) {
  useEffect(() => {
    fetch(`${BASE_URL}/bosslist`)
      .then((response) => response.json())
      .then(setBosses);
  }, []);
}

function BossList() {
  const [isShowingAll, setIsShowingAll] = useState(false);
  const [bosses, setBosses] = useState<Boss[] | null>(null);

  useFetchBossList(setBosses);

  const handleShowAll = useCallback(() => {
    const allElements = document.querySelectorAll(".future");

    if (isShowingAll) {
      allElements.forEach((x) => x.removeAttribute("clicked"));
    } else {
      allElements.forEach((x) => x.setAttribute("clicked", ""));
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
              <div
                className={`${boss.type} ${styles[boss.type]}`}
                onClick={handleClickSpoilerText}
              >
                {boss.name}
              </div>
              {boss.note && <div>({boss.note})</div>}
              {boss.date && <div>{boss.date}</div>}
            </div>
          ))}
        </div>
      </div>
      <label className={styles.showAll}>
        <span>Show All</span>
        <input
          onChange={handleShowAll}
          type="checkbox"
          checked={isShowingAll}
        />
      </label>
    </div>
  );
}

export default BossList;
