import Box from './Box';

export const Link = (props) => {
  return <Box as="a" {...props} sx={{ color: 'teal', overrides: props.sx }} />;
};
