// const { defineConfig } = require("@vue/cli-service");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const nodeExternals = require("webpack-node-externals");
const { merge } = require("lodash");
const WebpackBar = require("webpackbar");
// const path = require("path");

// const resolve = (file) => path.resolve(__dirname, file);
const target = process.env.WEBPACK_TARGET || "client";
const isServer = target === "server";
const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  lintOnSave: false,
  css: {
    extract: !isDev,
  },
  configureWebpack: {
    entry: `./src/entry-${target}.js`,
    output: { libraryTarget: isServer ? "commonjs2" : undefined },
    target: isServer ? "node" : "web",
    devtool: "source-map",
    externals: isServer
      ? nodeExternals({
          allowlist: [/\.css$/],
        })
      : undefined,
    plugins: [isServer ? new VueSSRServerPlugin() : new VueSSRClientPlugin()], // 此插件在输出目录中生成 `vue-ssr-client-manifest.json`。

    optimization: { splitChunks: isServer ? false : undefined },
  },
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => merge(options, { optimizeSSR: isServer }));

    config
      .plugin("loader")
      .use(WebpackBar, [
        { name: target, color: isServer ? "orange" : "green" },
      ]);

    // if (!isDev) {
    //   // copy index.ssr.html for server render
    //   config.plugin("copy").tap((args) => {
    //     console.log("args", args);
    //     args[0].push({
    //       from: resolve("public/index.ssr.html"),
    //       to: resolve("dist/index.ssr.html"),
    //       toType: "file",
    //     });
    //     return args;
    //   });
    // }
    if (isServer) {
      config.plugins.delete("hmr"); // vue.config.js 默认会配置hot modules reload, 此配置在服务端是不需要的，因此我们删掉
      if (!isDev) {
        // css-loader mini-css-extract-plugin(extract-css-loader)，will generate browser sentence such as document.getElementsByTagName xxxxx。
        // this will result in error (document not defined), running on server side。
        // so delete mini-css-extract-plugin and replace with css-context-loader。
        // const langs = ["css", "less"];
        // const types = ["vue-modules", "vue", "normal-modules", "normal"];
        // langs.forEach((lang) => {
        //   types.forEach((type) => {
        //     const rule = config.module.rule(lang).oneOf(type);
        //     rule.uses.delete("extract-css-loader");
        //     rule
        //       .use("css-context-loader")
        //       .loader(CssContextLoader)
        //       .before("css-loader");
        //   });
        // });
      }
    }
  },
  devServer: { port: isDev && !isServer ? process.env.STATIC_PORT : undefined },
};
