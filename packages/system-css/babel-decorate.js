const fs = require('fs');
const nodePath = require('path');
const { types } = require('@babel/core');
const { declare } = require('@babel/helper-plugin-utils');

const log = (message = '') => {
  fs.appendFileSync(nodePath.join(process.cwd(), 'debug.log'), JSON.stringify(message, null, 2) + '\n', 'utf8');
};

module.exports = declare((api) => {
  api.assertVersion(7);

  const visitor = {
    Program: {
      enter(path, state) {
        state.file.set('warnings', []);
      },
      exit(path, state) {
        const warnings = state.file.get('warnings');

        warnings.forEach((warning) => {
          path.node.body.push(types.throwStatement(types.stringLiteral(warning)));
        });
      }
    },
    JSXAttribute(path, state) {
      if (path.node.name.name !== 'sx') return;

      // we only deep with expressions, example: sx={}
      if (!types.isJSXExpressionContainer(path.node.value)) return;

      const jsxExpression = path.node.value.expression;

      // add variable name to className with secret key syntax
      if (types.isArrayExpression(jsxExpression)) {
        const elements = jsxExpression.elements;

        path.node.value.expression.elements = elements.map((element) => {
          let debugKey;

          // sx={[ commonStyles ]}
          if (types.isIdentifier(element)) debugKey = types.stringLiteral(element.name);

          // sx={[ size[props.size ]}
          if (types.isMemberExpression(element)) debugKey = types.stringLiteral(element.object.name);

          if (types.isCallExpression(element) && element.callee.name === 'vx') {
            const [variantsObj, variantKey] = element.arguments;

            // assuming types.isIdentifier(variantsObj)
            const staticBit = variantsObj.name + '-';

            // assuming variantKey is a string on runtime
            // it's okay if this is an identifier or memberExpression
            const dynamicBit = variantKey;
            debugKey = types.binaryExpression('+', types.stringLiteral(staticBit), dynamicBit);
          }

          if (!debugKey) return element;

          return types.objectExpression([
            types.objectProperty(types.stringLiteral('debugKey'), debugKey),
            types.objectProperty(types.stringLiteral('styles'), element)
          ]);
        });
      }
    }
  };

  return {
    name: 'babel-plugin-system-css',
    visitor
  };
});
