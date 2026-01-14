import styles from './Links.module.css';

function Links() {
  return (
    <div className={styles.linkArea}>
      <div className={styles.linkBox}>
        <div className={styles.imgContainer}>
          <img src="calamitylogo.webp"></img>
        </div>
        <a className={styles.calamity} href="https://calamitymod.wiki.gg/">
          Calamity Mod Wiki
        </a>
      </div>
      <div className={styles.linkBox}>
        <div className={styles.imgContainer}>
          <img src="terrarialogo.webp"></img>
        </div>
        <a className={styles.terraria} href="https://terraria.wiki.gg/">
          Official Terraria Wiki
        </a>
      </div>
      <div className={styles.linkBox}>
        <div className={styles.imgContainer}>
          <img src="fargoslogo.png"></img>
        </div>
        <a className={styles.fargos} href="https://fargosmods.wiki.gg/">
          Fargo's Mods Wiki
        </a>
      </div>
    </div>
  );
}

export default Links;
