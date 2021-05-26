import Vue from "vue";
import router from "./router";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import { registerMicroApps, start, initGlobalState } from "qiankun";
let propsData = {
  sex: "男",
  age: 18,
  userName: "小东"
};
const actions = initGlobalState(propsData);
// 主项目项目监听和修改(在项目中任何需要监听的地方进行监听)
actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log("改变前的值 ", prev);
  console.log("改变后的值 ", state);
});
// 将actions对象绑到Vue原型上，为了项目中其他地方使用方便
Vue.prototype.$actions = actions;

Vue.config.productionTip = false;
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

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
