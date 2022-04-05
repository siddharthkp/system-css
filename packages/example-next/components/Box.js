import { css } from 'system-css';

const Box = ({ as: As = 'div', sx = {}, ...props }) => {
  const className = css(sx);
  return <As {...props} className={className + (props.className ? ' ' + props.className : '')} />;
};

export default Box;
