import hash from '@emotion/hash';
import { string as toString } from 'to-style';

let styleSheet;
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.id = 'system-css';
  document.head.appendChild(styleEl);
  styleSheet = styleEl.sheet;
}

const cssMap = new Map();

export const css = (...styleArr) => {
  const classNames = styleArr
    .map((styles) => {
      if (!styles || !Object.keys(styles)) return null;

      const stringStyles = toString(styles);
      const className = 'sc-' + hash(stringStyles);

      if (styleSheet && !cssMap.get(className)) {
        styleSheet.insertRule(`.${className} { ${stringStyles} }`, styleSheet.cssRules.length);
        cssMap.set(className, stringStyles);
      }

      return className;
    })
    .filter(Boolean)
    .join(' ');

  return classNames;
};

export const collect = () => {
  const stylesheet = ``;
  for (const [className, styles] of cssMap) {
    stylesheet += `${className} { ${styles} }`;
  }
};

const sx2css = (sx, accumulator = []) => {
  const { overrides, ...rest } = sx;
  accumulator.push(rest);

  if (overrides) sx2css(overrides, accumulator);

  return accumulator;
};

export const cssx = (sx) => {
  const stylesArr = sx2css(sx);
  return css(...stylesArr);
};
