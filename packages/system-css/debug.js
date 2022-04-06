const fs = require('fs');
const nodePath = require('path');
const { types } = require('@babel/core');
const { declare } = require('@babel/helper-plugin-utils');
const hash = require('@emotion/hash').default;
const { string: toString } = require('to-style');

let ensuredOutFileExists = false;

const log = (message = '') => {
  fs.appendFileSync(nodePath.join(process.cwd(), 'debug.log'), JSON.stringify(message, null, 2) + '\n', 'utf8');
};

const cssMap = new Map();

const appendCSS = ({ outFilePath, className, stringifiedStyles }) => {
  // already inserted
  if (cssMap.get(className) === stringifiedStyles) return;

  cssMap.set(className, stringifiedStyles);

  let contents = ``;
  cssMap.forEach((value, key) => {
    contents += `
.${key} {
  ${value}
}`;
  });

  // flush
  fs.writeFileSync(outFilePath, contents);
};

module.exports = declare((api) => {
  api.assertVersion(7);

  const visitor = {
    Program: {
      exit(path, state) {
        path.node.body.push(
          types.callExpression(types.memberExpression(types.identifier('console'), types.identifier('log')), [
            types.stringLiteral(state.opts.secret)
          ])
        );
      }
    }
  };

  return {
    name: 'babel-plugin-system-css',
    visitor
  };
});

const setCSSVarInStyle = (path, cssVar, property) => {
  const jsxOpeningElement = path.findParent((path) => path.isJSXOpeningElement());
  const styleAttr = jsxOpeningElement.node.attributes.find((attr) => attr.name.name === 'style');

  const keyVal = types.objectProperty(types.stringLiteral(cssVar), property.value);

  if (styleAttr) {
    styleAttr.value.expression.properties.push(keyVal);
  } else {
    jsxOpeningElement.node.attributes.push(
      types.jsxAttribute(types.JSXIdentifier('style'), types.jsxExpressionContainer(types.objectExpression([keyVal])))
    );
  }
};

const injectRuntimeExpressionToSetCSSVar = (path, cssVar, property) => {
  // test: if (typeof document !== 'undefined')
  const test = types.binaryExpression(
    '!==',
    types.unaryExpression('typeof', types.identifier('document')),
    types.stringLiteral('undefined')
  );

  // consonent: document.documentElement.style.setProperty('--custom', value);
  const consonent = types.expressionStatement(
    types.callExpression(
      types.memberExpression(
        types.memberExpression(
          types.memberExpression(types.identifier('document'), types.identifier('documentElement')),
          types.identifier('style')
        ),
        types.identifier('setProperty')
      ),
      [types.stringLiteral(cssVar), property.value]
    )
  );

  path.parentPath.parentPath.insertAfter(types.ifStatement(test, consonent));
};
