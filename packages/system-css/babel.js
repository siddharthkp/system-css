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
      enter(path, state) {
        let outFilePath;
        if (state.opts.outDir) {
          const outDir = state.opts.outDir;
          outFilePath = nodePath.join(state.cwd, outDir, 'out.css');
        } else {
          outFilePath = nodePath.join(__dirname, 'out.css');
        }
        state.file.set('outFilePath', outFilePath);
        if (state.opts.addImport) state.file.set('moduleSpecifier', outFilePath);

        // reset outfile
        if (!ensuredOutFileExists) {
          fs.writeFileSync(outFilePath, '');
          ensuredOutFileExists = true;
        }
      }
    },
    CallExpression(path, state) {
      const { callee, arguments: args } = path.node;

      if (callee.name === 'css') {
        const [arg] = args;

        // if a className string passed, replace expression with className
        if (arg.type === 'Identifier') path.replaceWith(arg);

        if (arg.type !== 'ObjectExpression') return;

        const styles = {};

        arg.properties.forEach((property) => {
          if (['NumericLiteral', 'StringLiteral'].includes(property.value.type)) {
            styles[property.key.name] = property.value.value;
          } else if (types.isExpression(property.value) || types.isIdentifier(property.value)) {
            const rawCode = state.file.code.slice(property.value.start, property.value.end);

            // we wan't an unique custom variable that is
            const uniq = hash(state.filename + rawCode);
            const cssVarName = '--' + rawCode.replace(/\./g, '-').toLowerCase() + '-' + uniq; // example: props-color-ioan3s

            styles[property.key.name] = `var(${cssVarName})`;

            if (path.container.type === 'JSXExpressionContainer') {
              setCSSVarInStyle(path, cssVarName, property);
            } else {
              injectRuntimeExpressionToSetCSSVar(path, cssVarName, property);
            }
          }
        });

        const stringifiedStyles = toString(styles);

        const className = 'sc-' + hash(stringifiedStyles);

        const outFilePath = state.file.get('outFilePath');
        appendCSS({ outFilePath, className, stringifiedStyles });

        path.replaceWith(types.stringLiteral(className));
      }
    },
    JSXAttribute(path, state) {
      if (path.node.name.name !== 'sx') return;

      // don't know what to do with this
      if (path.node.value.type !== 'JSXExpressionContainer') return;

      const arg = path.node.value.expression;

      // copied from above

      if (arg.type !== 'ObjectExpression') return;

      const styles = {};

      arg.properties.forEach((property) => {
        if (['NumericLiteral', 'StringLiteral'].includes(property.value.type)) {
          styles[property.key.name] = property.value.value;
        } else if (types.isExpression(property.value) || types.isIdentifier(property.value)) {
          const rawCode = state.file.code.slice(property.value.start, property.value.end);

          // we wan't an unique custom variable that is
          const uniq = hash(state.filename + rawCode);
          const cssVarName = '--' + rawCode.replace(/\./g, '-').toLowerCase() + '-' + uniq; // example: props-color-ioan3s

          styles[property.key.name] = `var(${cssVarName})`;

          if (path.container.type === 'JSXExpressionContainer') {
            setCSSVarInStyle(path, cssVarName, property);
          } else {
            injectRuntimeExpressionToSetCSSVar(path, cssVarName, property);
          }
        } else {
          // unknown type, we don't know what to do with it
        }
      });

      const stringifiedStyles = toString(styles);

      const className = 'sc-' + hash(stringifiedStyles);

      const outFilePath = state.file.get('outFilePath');
      appendCSS({ outFilePath, className, stringifiedStyles });

      // different from above, replace object with className
      path.node.value.expression = types.stringLiteral(`${className}`);
    },
    ImportDeclaration(path, state) {
      if (path.node.source.value === 'system-css') {
        const moduleSpecifier = state.file.get('moduleSpecifier');
        if (moduleSpecifier) {
          path.insertAfter(types.importDeclaration([], types.stringLiteral(moduleSpecifier)));
        }
        path.remove();
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
