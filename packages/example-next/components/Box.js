import { cssx } from 'system-css';

const Box = ({ as: As = 'div', sx, ...props }) => {
  const className = cssx(sx);

  return <As {...props} className={className + (props.className ? ' ' + props.className : '')} />;
};

export default Box;
