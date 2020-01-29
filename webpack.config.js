const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MinifyPlugin = require("babel-minify-webpack-plugin");
const path = require("path");
const isProd = process.env.NODE_ENV == "production";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: "./src/index.js"
  },
  output: {
    filename: isProd ? "[name]-bundle-[contenthash].js" : "[name]-bundle.js",
    chunkFilename: isProd ? "[name]-chunk-[contenthash].js" : "[name]-chunk.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/"
  },
  resolve: {
    modules: [path.resolve("./"), path.resolve("./node_modules")]
  },
  //no clue why this is failing to build in production mode
  mode: isProd && false ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["@babel/preset-react"],
          plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-object-rest-spread", "@babel/plugin-syntax-dynamic-import"]
        }
      },
      {
        test: /\.graphql$/,
        exclude: /node_modules/,
        use: {
          loader: "generic-persistgraphql/loader",
          options: {
            path: path.resolve(__dirname, "extracted_queries.json")
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|woff|woff2|ttf)$/,
        use: [
          {
            loader: "file-loader"
          }
        ]
      }
    ]
  },
  optimization: {
    //minimize: false
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "index.html" }),
    new MiniCssExtractPlugin({ filename: isProd ? "[name]-[contenthash].css" : "[name].css" }),
    //new BundleAnalyzerPlugin({ analyzerMode: "static" }),
    isProd ? new MinifyPlugin() : null
  ].filter(p => p)
};
