import { css } from 'system-css';
import { Link } from '../components/link';

const AboutUsLink = (props) => {
  return (
    <Link href="/about" className={css({ fontSize: props.size })}>
      About me
    </Link>
  );
};

export const containerClassName = css({
  color: 'tomato',
  fontFamily: 'sans-serif'
});

function Home() {
  return (
    <main className={containerClassName}>
      <h1 className={css({ fontStyle: 'italic' })}>Hello!</h1>
      <AboutUsLink size="20px" />
    </main>
  );
}

export default Home;
