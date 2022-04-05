import { css } from 'system-css';

export const Link = ({ sx = {}, ...props }) => {
  const className = css({ color: 'teal' });

  return <a {...props} className={className + ' ' + props.className} />;
};
