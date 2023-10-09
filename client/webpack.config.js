module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: [{ loader: "@svgr/webpack", options: { icon: true } }],
      },
      {
        test: /\.svg$/,
        issuer: /\.css$/,
        use: ["file-loader"],
      },
    ],
  },
};
