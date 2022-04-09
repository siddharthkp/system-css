import { css, cssx } from 'system-css';

const Box = ({ as: As = 'div', sx, ...props }) => {
  let className;

  if (Array.isArray(sx)) className = css(...sx);
  else className = cssx(sx);

  return <As {...props} className={className + (props.className ? ' ' + props.className : '')} />;
};

export default Box;
