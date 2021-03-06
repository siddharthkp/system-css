import hash from '@emotion/hash';
import { string as toString } from 'to-style';

let styleSheet;
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.id = 'system-css-client';
  document.head.appendChild(styleEl);
  styleSheet = styleEl.sheet;
}

let cssMap = new Map();

export const css = (...styleArr) => {
  const classNames = styleArr
    .map((element) => {
      if (!element || !Object.keys(element)) return null;

      let className, stringStyles;

      // if debugKey is specified
      if (element.debugKey && element.styles) {
        const { debugKey, styles: stylesObj } = element;

        if (!stylesObj) return null;
        stringStyles = toString(stylesObj);
        className = 'sc-' + debugKey.replace('_', '') + '-' + hash(stringStyles);
      } else {
        const stylesObj = element;
        stringStyles = toString(stylesObj);
        className = 'sc-' + hash(stringStyles);
      }

      // already inserted
      if (cssMap.get(className)) return className;

      cssMap.set(className, stringStyles);
      if (styleSheet) {
        styleSheet.insertRule(`.${className} { ${stringStyles} }`, styleSheet.cssRules.length);
      }

      return className;
    })
    .filter(Boolean)
    .join(' ');

  return classNames;
};

const sx2css = (sx, accumulator = []) => {
  const { overrides, ...rest } = sx;
  accumulator.push(rest);

  if (overrides) sx2css(overrides, accumulator);

  return accumulator;
};

export const cssx = (sx = {}) => {
  const stylesArr = sx2css(sx);
  return css(...stylesArr);
};

export const collect = () => {
  let serverSheet = ``;
  for (const [className, styles] of cssMap) {
    serverSheet += `.${className} { ${styles} }\n`;
  }
  return serverSheet;
};
