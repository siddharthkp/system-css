import { css } from 'system-css';
import { Link } from '../components/link';
import { containerClassName } from './index';

function About() {
  return (
    <main className={containerClassName}>
      <Link href="/" className={css({ textDecoration: 'none' })}>
        ← Home
      </Link>

      <h1>About</h1>
      <p>no thanks, i&apos;m shy</p>
    </main>
  );
}

export default About;
