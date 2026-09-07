import { getCompiler } from "./helpers";

// the flag which makes the warning fire once lives in the module, so each case
// needs its own copy of it
const loadPlugin = () => {
  let CopyPlugin;

  jest.isolateModules(() => {
    CopyPlugin = require("../src").default || require("../src");
  });

  return CopyPlugin;
};

// only `Compilation` and `CopyPlugin` are read from it, and building it by
// hand keeps webpack's own deprecated getters out of the output
const namespace = (extra) => ({
  Compilation: require("webpack").Compilation,
  ...extra,
});

const applyTo = (webpackNamespace) => {
  const CopyPlugin = loadPlugin();
  const compiler = getCompiler();

  compiler.webpack = webpackNamespace;

  new CopyPlugin({ patterns: ["directory"] }).apply(compiler);

  return compiler;
};

describe("deprecation", () => {
  let emitWarning;

  beforeEach(() => {
    emitWarning = jest.spyOn(process, "emitWarning").mockImplementation();
  });

  afterEach(() => {
    emitWarning.mockRestore();
  });

  it("should warn when webpack copies files itself", () => {
    applyTo(namespace({ CopyPlugin: class {} }));

    expect(emitWarning).toHaveBeenCalledTimes(1);

    const [[message, type, code]] = emitWarning.mock.calls;

    expect(message).toMatch("copy-webpack-plugin is deprecated");
    expect(message).toMatch("5.111.0");
    expect(message).toMatch("output.copy");
    expect(type).toBe("DeprecationWarning");
    expect(code).toBe("DEP_COPY_WEBPACK_PLUGIN");
  });

  it("should warn once for several compilers", () => {
    const CopyPlugin = loadPlugin();
    const webpackNamespace = namespace({ CopyPlugin: class {} });

    for (const _ of [0, 1, 2]) {
      const compiler = getCompiler();

      compiler.webpack = webpackNamespace;
      new CopyPlugin({ patterns: ["directory"] }).apply(compiler);
    }

    expect(emitWarning).toHaveBeenCalledTimes(1);
  });

  it("should not warn when webpack cannot copy files itself", () => {
    applyTo(namespace());

    expect(emitWarning).not.toHaveBeenCalled();
  });

  it("should not warn when the compiler has no webpack namespace", () => {
    applyTo(undefined);

    expect(emitWarning).not.toHaveBeenCalled();
  });
});
