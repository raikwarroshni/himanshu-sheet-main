const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "[name].js",
    clean: true,
  },
  mode: "development",
  target: "node",
  externals: ["express"],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
};
