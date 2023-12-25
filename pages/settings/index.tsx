import SettingsMenu from '@/components/Settings';
import styles from '@/styles/Settings.module.sass';

export default function Settings() {
  return (
    <main className={styles.settings}>
      <div className={styles.nav}>
        <SettingsMenu />
      </div>
    </main>
  );
}
