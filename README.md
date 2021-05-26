# 使用 qiankun（乾坤）搭建 微服务

## 背景

一个 WEB 端管理系统包含好几个单独的模块，相互之间没有耦合，如果放到同一个项目里，同时好几个人去维护，不利于管理，单独子模块的上线会对整个项目全量上线风险比较大，并且容易代码冲突

## 一、什么是微前端

微前端就是将不同的功能按照不同的维度拆分成多个子应用。通过主应用来加载这些子应用。微前端的核心在于**拆**，拆完后在**合**！

## 二、为什么使用微前端

1. 技术栈无关
   主框架不限制接入应用的技术栈，微应用具备完全自主权
2. 独立开发、独立部署
   微应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新
3. 增量升级
   在面对各种复杂场景时，我们通常很难对一个已经存在的系统做全量的技术栈升级或重构，而微前端是一种非常好的实施渐进式重构的手段和策略
4. 独立运行时
   每个微应用之间状态隔离，运行时状态不共享

我们可以将一个应用划分成若干个子应用，将子应用打包成一个个的 lib 。当路径切换 时加载不同的子应用。这样每个子应用都是独立的，技术栈也不用做限制了！从而解决了前端协同开发问题。

## 三、qiankun 框架

[https://qiankun.umijs.org/zh](https://qiankun.umijs.org/zh)

2018 年 Single-SPA 诞生了， single-spa 是一个用于前端微服务化的 JavaScript 前端解决方案 ( 本身没有处理样式隔离， js 执行隔离 ) 实现了路由劫持和应用加载。

2019 年 qiankun 基于 Single-SPA, 提供了更加开箱即用的 API （ single-spa + sandbox + import-html-entry ） 做到了，技术栈无关、并且接入简单（像 i frame 一样简单）。

## 四、qiankun 框架实例

**[demo 地址：https://github.com/li1164267803/qiankun-demo](https://github.com/li1164267803/qiankun-demo)**
**查看 demo 的时候三个项目都要跑起来，然后在主服务里面看效果**

**这里我们打算建立三个项目进行实操，一个 Vue 项目充当主应用，另一个 Vue 和 React 应用充当子应用**

### 1、创建三个应用

#### 1）创建基座

```js
vue create qiankun-box
```

#### 2）创建子应用 1

```js
vue create qiankun-vue
```

#### 3）创建子应用 2

```JavaScript
cnpm install -g create-react-app
create-react-app qiankun-react
```

- 三个项目

  基座：qiankun-base 子应用：qiankun-vue、qiankun-react

### 2、项目配置（主要）

#### 1）基座 qiankun-base 配置

> ​ 项目创建好后我们首先进行主应用 qiankun-base 的配置，进入 man.js 文件进行配置， 在 main.js 中加入以下代码,要注意的是，entry 这项配置是我们两个子项目的域名和端口，我们必须确保两字子项目运行在这两个端口上面，container 就是我们的容器名，就是我们子应用挂载的节点，相当于 Vue 项目里面的 app 节点，activeRule 就是我们的激活路径，根据路径来显示不同的子应用。

- 引入 qiankun 插件

```js
 npm i qiankun -S
```

- main.js 配置

```js
// 引入qiankun
import { registerMicroApps, start } from "qiankun";
registerMicroApps([
  {
    name: "vueApp", // 应用的名字
    entry: "//localhost:3001", // 默认会加载这个html 解析里面的js 动态的执行 （子应用必须支持跨域）fetch
    container: "#container", // 容器id
    activeRule: "/app/vue", // 根据路由 激活的路径
  },
  {
    name: "reactApp",
    entry: "//localhost:20000",
    container: "#container",
    activeRule: "/app/react",
  },
]);
start();
```

- 配置完之后我们去到 qiankun-base 的 app.vue 文件进行主应用的页面编写，这里我安装了 element-ui 来进行页面美化

```javascript
npm i element-ui -S
```

在 main.js 中引入 element-ui：

```js
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);
```

- 修改 app.vue 的组件代码

```html
<template>
  <div id="app">
    <el-menu :router="true" mode="horizontal">
      <el-menu-item index="/home">
        <span slot="title">Home</span>
      </el-menu-item>
      <!--引用其他子应用-->
      <el-menu-item index="/app/vue">
        <span slot="title">qiankun-vue</span>
      </el-menu-item>
      <el-menu-item index="/app/react">
        <span slot="title">qiankun-react</span>
      </el-menu-item>
    </el-menu>
    <router-view></router-view>
    <div id="container"></div>
  </div>
</template>
```

- router.js 代码

```js
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  // base: process.env.BASE_URL,
  base: "",
  routes,
});

export default router;
```

#### 2）子应用 qiankun-vue 配置

- main.js 配置

```js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// Vue.config.productionTip = false

let instance = null;
function render(props) {
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#qkApp"); // 这里是挂载到自己的html中  基座会拿到这个挂载后的html 将其插入进去
}

if (window.__POWERED_BY_QIANKUN__) {
  // 动态添加publicPath
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
if (!window.__POWERED_BY_QIANKUN__) {
  // 默认独立运行
  render();
}

// 父应用加载子应用，子应用必须暴露三个接口：bootstrap、mount、unmount
// 子组件的协议就ok了
export async function bootstrap(props) {}

export async function mount(props) {
  render(props);
}

export async function unmount(props) {
  instance.$destroy();
}
```

- router.js 配置

```js
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: "/vue",
  routes,
});

export default router;
```

- Vue.config.js 配置

在子应用的根目录下面新建一个 Vue.config.js 文件

```js
module.exports = {
  lintOnSave: false, // 关闭eslint检测
  devServer: {
    port: 3001, //这里的端口是必须和父应用配置的子应用端口一致
    headers: {
      //因为qiankun内部请求都是fetch来请求资源，所以子应用必须允许跨域
      "Access-Control-Allow-Origin": "*",
    },
  },
  configureWebpack: {
    output: {
      //资源打包路径
      library: "vueApp",
      libraryTarget: "umd",
    },
  },
};
```

#### 3）子应用 qiankun-react 配置

- src 目录下 index.js 文件

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {}
export async function mount() {
  render();
}
export async function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById("root")); // 卸载节点
}
```

- config-overrides.js 配置

先引入 react-app-rewired，在修改 package.json 启动命令

```js
npm install react-app-rewired
```

修改 package.json 启动命令

```js
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject"
  },
```

再进行 dev 以及打包的配置，根目录下创建 config-overrides.js

```js
module.exports = {
  webpack: (config) => {
    config.output.library = "reactApp";
    config.output.libraryTarget = "umd";
    config.output.publicPath = "http://localhost:20000/"; // 此应用自己的端口号
    return config;
  },
  devServer: (configFunction) => {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      return config;
    };
  },
};
```

### 3、注意点

#### 1）如何在主应用的某个路由页面加载微应用

**`react` + `react-router` 技术栈的主应用：只需要让子应用的 `activeRule` 包含主应用的这个路由即可。**

**`vue` + `vue-router` 技术栈的主应用:**

> 例如：主应用需要在 login 页面登录，登录成功后跳转到 main 后台管理界面，在 main 管理界面下可以显示子应用。

修改主应用 router.js：

```js
// 如果这个路由有其他子路由，需要另外注册一个路由，任然使用这个组件即可。
// 本案例就是有子路由，所以需要才后面重新定义main页面的路由
const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/main",
    name: "Main",
    component: Main,
    children: [
      {
        path: "/home",
        name: "Home",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/Home"),
      },
    ],
  },
  {
    path: "/app/*", // 所有的子应用要走的路径
    name: "Main",
    component: Main,
  },
];
```

修改主应用 main.js 的文件：

````js
// 子应用的 activeRule 需要包含主应用的这个路由 path
import { registerMicroApps, start} from "qiankun";
registerMicroApps([
  {
    name: "vueApp", // 应用的名字
    entry: "//localhost:3001", // 默认会加载这个html 解析里面的js 动态的执行 （子应用必须支持跨域）fetch
    container: "#container", // 容器id
    activeRule: "/app/vue" // 根据路由 激活的路径
  },
  {
    name: "reactApp",
    entry: "//localhost:20000",
    container: "#container",
    activeRule: "/app/react"
  },
]);

start();

修改主应用 main.vue 页面代码：

```javascript
// 在 Main.vue 这个组件的 mounted 周期调用 start 函数，注意不要重复调用。
<template>
  <div class="main-content">
    <el-menu :router="true" mode="horizontal">
     <el-menu-item index="/home">
        <span slot="title">Home</span>
      </el-menu-item>
       <!--引用其他子应用-->
      <el-menu-item index="/app/vue">
        <span slot="title">qiankun-vue</span>
      </el-menu-item>
      <el-menu-item index="/app/react">
        <span slot="title">qiankun-react</span>
      </el-menu-item>
    </el-menu>
    <router-view></router-view>
    <div id="container"></div>
  </div>
</template>

<script>
import { start } from "qiankun";

export default {
  name: "Main",
  mounted() {
    if (!window.qiankunStarted) {
      window.qiankunStarted = true;
      start();
    }
  },
};
</script>
````

### 4、解决在 vue 子应用中无法使用 vue-devtools 调试功能

微应用的 main.js 中一定要加上测试环境开启 devTools 的代码
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210526114710404.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDMwOTM3NA==,size_16,color_FFFFFF,t_70)
写入到 render 函数中

```js
// vue-devtools 调试
if (window.__POWERED_BY_QIANKUN__ && process.env.NODE_ENV === "development") {
  // vue-devtools  加入此处代码即可
  // After you create app
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = instance.constructor;
  let instanceDiv = document.createElement("div");
  instanceDiv.__vue__ = instance;
  document.body.appendChild(instanceDiv);
}
```

在 vue.config.js 中配置

```js
devServer: {
    hot: true,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      "Access-Control-Allow-Origin": "*" // 子应用必须支持跨域
    },
}
```
