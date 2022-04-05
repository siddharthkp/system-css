import hash from '@emotion/hash';
import { string as toString } from 'to-style';

let styleSheet;
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.id = 'system-css';
  document.head.appendChild(styleEl);
  styleSheet = styleEl.sheet;
}

export const css = (styles) => {
  const stringStyles = toString(styles);
  const className = 'sc-' + hash(stringStyles);

  if (styleSheet) styleSheet.insertRule(`.${className} { ${stringStyles} }`, styleSheet.cssRules.length);

  return className;
};
