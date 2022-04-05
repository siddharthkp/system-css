import { css } from 'system-css';

const LearnMore = (props) => {
  return (
    <a className={css({ color: props.color })} href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
      Learn React
    </a>
  );
};

const FONT_FAMILY = 'sans-serif';

function Home() {
  const className = css({
    color: 'tomato',
    fontFamily: FONT_FAMILY
  });

  return (
    <div className={className}>
      <header>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <LearnMore color="teal" />
      </header>
    </div>
  );
}

export default Home;
