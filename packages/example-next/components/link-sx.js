import Box from './Box';

export const Link = ({ sx, ...props }) => {
  return <Box as="a" {...props} sx={{ color: 'teal', overrides: sx }} className={props.className} />;
};
