import Box from '../components/Box';
import { Link } from '../components/link';

const AboutUsLink = (props) => {
  return (
    <Link href="/about" sx={{ color: props.color }}>
      About me
    </Link>
  );
};

export const containerStyles = {
  color: 'tomato',
  fontFamily: 'sans-serif'
};

function Home() {
  return (
    <Box as="main" sx={containerStyles}>
      <h1>Hello!</h1>
      <AboutUsLink color="salmon" />
      <br />
      <Link href="https://primer.style">Primer</Link>
    </Box>
  );
}

export default Home;
