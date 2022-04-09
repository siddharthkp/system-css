import React from 'react';
import Box from './Box';

const commonStyles = {
  paddingLeft: '20px',
  paddingRight: '20px',
  border: '1px solid',
  borderRadius: '2px',
  fontSize: '14px'
};

const variants = {
  default: {
    color: 'black',
    backgroundColor: 'aliceblue',
    borderColor: 'darkgray'
  },
  success: {
    color: 'black',
    backgroundColor: 'springgreen',
    borderColor: 'forestgreen'
  },
  danger: {
    color: 'white',
    backgroundColor: 'salmon',
    borderColor: 'crimson'
  }
};

const sizes = {
  small: {
    fontSize: '14px',
    height: '32px'
  },
  medium: {
    fontSize: '14px',
    height: '36px'
  },
  large: {
    fontSize: '16px',
    height: '40px'
  }
};

// lol such a bad name
const vx = (variants, variant) => {
  return variants[variant];
};

export const Button = ({ variant = 'default', size = 'medium', ...props }) => {
  return (
    <Box
      as="button"
      {...props}
      sx={[
        commonStyles,
        vx(variants, variant),
        vx(sizes, size),
        props.sx // overrides,
      ]}
    />
  );
};

/**
 * // spread element creates merged styles into a single className
 * <Box1 sx={{...commonStyles, ...variants[variant], ...props.sx}}
 *
 * // array of styles creates an array of classNames which is better for debugging
 * <Box2 sx={[ commonStyles, variants[variant], props.sx ]}
 *
 * // passing a _debug key creates readable classes, but is cumbersome to author
 * // babel-decorate can convert #2 to #3
 *
 * <Box3 sx={[
 *  { debugKey: 'common',  stylesObj: commonStyles },
 *  { debugKey: 'variant', stylesObj: variants[variant] },
 *  { debugKey: 'sizes',   stylesObj: size[size] },
 *  props.sx
 * ]}
 *
 * // event better if we can surface the resolved variant in the class
 * <Box3 sx={[
 *  { debugKey: 'common',  stylesObj: commonStyles },
 *  { debugKey: 'variant-' + variant , stylesObj: variants[variant] },
 *  { debugKey: 'sizes-' + size,   stylesObj: size[size] },
 *  props.sx
 * ]}
 *
 * // what does a variant first api look like?
 * <Box 4 sx={[
 *  commonStyles,
 *  variant(appearances, variant),
 *  variant(sizes, size),
 *  props.sx
 * ]}
 * />
 */
