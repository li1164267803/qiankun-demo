import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main";
import Login from "../views/Login";
Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/main",
    name: "Main",
    component: Main,
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import(/* webpackChunkName: "about" */ "../views/Home")
      }
    ]
  },
  {
    path: "/app/*",
    name: "Main",
    component: Main
  }
];

const router = new VueRouter({
  mode: "history",
  // base: process.env.BASE_URL,
  base: "",
  routes
});

export default router;
