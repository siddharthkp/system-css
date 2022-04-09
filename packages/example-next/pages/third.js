import { Link } from '../components/link-sx';
import { Button } from '../components/button';
import { containerClassName } from './index';

import Box from '../components/box';

function Third() {
  return (
    <main className={containerClassName}>
      <Link href="/" sx={{ textDecoration: 'none' }}>
        ← Home
      </Link>

      <h1>Third</h1>

      <Box as="div" sx={{ display: 'flex' }}>
        <Button variant="success" size="small" sx={{ marginRight: '4px' }}>
          Save
        </Button>
        <Button size="small">Cancel</Button>
      </Box>
    </main>
  );
}

export default Third;
