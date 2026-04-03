const path = require("path");
const CopyPlugin = require("../src");

module.exports = {
  mode: "production",
  target: "node",
  entry: path.resolve(__dirname,"./src/index.js"),

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src\\**\\*.txt",
          context: path.resolve(__dirname),// Windows-style test
          to: "dist",
        },
      ],
    }),
  ],
};
