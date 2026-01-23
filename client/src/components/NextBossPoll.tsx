import styles from './NextBossPoll.module.css';

interface Props {
  bossName: string;
  visibility: boolean;
}

function NextBossPoll({ bossName, visibility }: Props) {
  return <>{visibility && <div className={styles.pollArea}>{bossName} Poll</div>}</>;
}

export default NextBossPoll;
