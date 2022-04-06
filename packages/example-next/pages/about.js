import Box from '../components/Box';
import { Link } from '../components/link';
import { containerStyles } from './index';

function About() {
  return (
    <Box as="main" sx={containerStyles}>
      <Link href="/" sx={{ textDecoration: 'none' }}>
        ← Home
      </Link>

      <h1>About</h1>
      <p>no thanks, i&apos;m shy</p>
    </Box>
  );
}

export default About;
