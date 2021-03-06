jest.autoMockOff();

const minify = require("../src/index");

const sampleInput = `
function foo() {
  const bar = x(1);
  const baz = y(2);
  return z(bar, baz);
}
`;

describe("babel-minify Node API", () => {
  it("simple usage", () => {
    expect(minify(sampleInput).code).toMatchSnapshot();
  });

  it("throw on invalid options", () => {
    expect(() => minify(sampleInput, { foo: false, bar: true }).code).toThrow();
  });

  it("override default minify options", () => {
    const minifyOpts = { mangle: false };
    expect(minify(sampleInput, minifyOpts).code).toMatchSnapshot();
  });

  it("override nested minify options", () => {
    const minifyOpts = { mangle: { keepFnName: false } };
    expect(minify(sampleInput, minifyOpts).code).toMatchSnapshot();
  });

  it("preserve default comments", () => {
    const code = `
      /* @license MIT */
      (function() {
        /*! mylib.js */
        function a() {}
        a();
      })();
    `;

    expect(minify(code, {}).code).toMatchSnapshot();
  });

  it("remove comments ", () => {
    const code = `
      /* foo */
      var a = 10;

      !function(){}() // blah
    `;

    expect(minify(code, {}).code).toMatchSnapshot();
  });
});
