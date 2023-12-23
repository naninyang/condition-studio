import Anchor from './Anchor';
import styles from '@/styles/Home.module.sass';

export default function Footer() {
  return (
    <footer>
      <div className={styles.footer}>
        <p>
          Copyright &copy; Condition Studio, <span>all rights reserved.</span>
        </p>
        <ul>
          <li>
            <Anchor href="https://github.com/naninyang/condition-studio">Github repository</Anchor>
          </li>
          <li>
            <Anchor href="https://dev1stud.io">DEV1L.studio</Anchor>
          </li>
        </ul>
        <dl>
          <div>
            <dt>UX Designer</dt>
            <dd>Chloe Ariko</dd>
          </div>
          <div>
            <dt>Frontend Developer</dt>
            <dd>Chloe Ariko</dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
