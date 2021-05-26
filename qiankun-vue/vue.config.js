const { name } = require("./package");

const devServer = {
  port: 3001,
  // 微应用的 devTools 中开启开启 hot、disableHostCheck
  hot: true,
  disableHostCheck: true,
  overlay: {
    warnings: false,
    errors: true
  },
  headers: {
    //因为qiankun内部请求都是fetch来请求资源，所以子应用必须允许跨域
    "Access-Control-Allow-Origin": "*"
  }
};
// vue.config.js
const vueConfig = {
  lintOnSave: false,
  publicPath:
    process.env.NODE_ENV === "production"
      ? "https://fe-sta.aixuexi.com/tol/axxol-omo-web/"
      : "/",

  assetsDir: "assets",
  configureWebpack: {
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_${name}`
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          "primary-color": "#15D494",
          "link-color": "#15D494"
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer
};

module.exports = vueConfig;
