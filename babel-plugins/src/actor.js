const types = require("babel-types");
const template = require("babel-template");

const t = template(`(function() {
  const args = ARGS;
  return sm.TYPE(...args);
} ())`);

const index = {
  "Character": "createCharacter",
  "Button": "createButton",
  "Close": "createClose",
  "Label": "createLabel",
  "Panel": "createPanel",
  "Slider": "createSlider",
  "BGM": "createBGM",
  "SFX": "createSFX",
  "Textbox": "createTextbox",
}

module.exports = {
  check(path) {
    return types.isIdentifier(path.node.callee) && index[path.node.callee.name];
  },
  transform(path) {
    const { expression } = t({
      TYPE: types.identifier(index[path.node.callee.name]),
      ARGS: types.arrayExpression(path.node.arguments),
    });

    return path.replaceWith(
      path.parentPath.isYieldExpression()
        ? expression
        : types.yieldExpression(expression, false));
  },
};
