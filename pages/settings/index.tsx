import SettingsMenu from '@/components/Settings';
import Seo from '@/components/Seo';
import styles from '@/styles/Settings.module.sass';

export default function Settings() {
  return (
    <main className={styles.settings}>
      <Seo pageTitle="환경설정" />
      <div className={styles.nav}>
        <SettingsMenu />
      </div>
    </main>
  );
}
