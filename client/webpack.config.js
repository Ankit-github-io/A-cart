// const path = require("path");
// const htmlPlugin = require("html-webpack-plugin");
// module.exports = {
//   resolve: {
//     extensions: [".*", ".js", ".jsx", ".css", ".scss"],
//     alias: {
//       component: path.resolve(__dirname, "../src/components"),
//       assets: path.resolve(__dirname, "../src/assets"),
//       reducers: path.resolve(__dirname, "../src/reducers"),
//       //routes: path.resolve(__dirname, '../src/routes'),
//       //lib: path.resolve(__dirname, '../src/lib'),
//       //mainstyles: path.resolve(__dirname, './../src/styles/mainStyles.css'),
//     },
//   },

//   mode: "production",
//   entry: "./src/index.js",
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: "bundle.js",
//     //publicPath:'/'
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//         },
//       },

//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//         },
//       },
//       {
//         test: /\.css$/,

//         use: ["style-loader", "css-loader"],
//       },
//       {
//         test: /\.(png|svg|jpg|jpeg|ico|gif)$/,
//         use: {
//           loader: "file-loader",
//           options: {
//             name: "[name].[hash].[ext]",
//             outputPath: "assets/images",
//           },
//         },
//       },
//     ],
//   },
//   plugins: [
//     new htmlPlugin({
//       template: "./public/index.html",
//     }),
//   ],
//   performance: {
//     hints: false,
//     maxEntrypointSize: 512000,
//     maxAssetSize: 512000,
//   },

//   //line of sequence matters
//   devServer: {
//     historyApiFallback: true,
//     open: true,
//   },
// };

// old

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
  devServer: {
    historyApiFallback: true,
    open: true,
  },
};
