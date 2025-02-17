import auth from "./auth";
import { createRouter, createWebHashHistory } from "vue-router";

import Home from "./views/home-page";
import Profile from "./views/profile-page";
import Camisa from "./views/cadastra_camisa.vue";
import camisa_cor from "./views/cor_camisa.vue";
import tamanho_camisa from "./views/tamanho_camisa.vue"
import caneca from "./views/caneca_estoque.vue"
import cliente_devedor from "./views/cliente_devedor.vue"
import defaultLayout from "./layouts/side-nav-outer-toolbar";

const router = new createRouter({
  routes: [
    {
      path: "/home",
      name: "home",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Home
    },
    {
      path: "/profile",
      name: "profile",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Profile
    },
    {
      path: "/camisa",
      name: "camisa",
      meta: {
        requiresAuth: false,
        layout: defaultLayout
      },
      component: Camisa
    },
    {
      path: "/camisa_cor",
      name: "camisa_cor",
      meta: {
        requiresAuth: false,
        layout: defaultLayout
      },
      component: camisa_cor
    },
    {
      path: "/tamanho_camisa",
      name: "tamanho_camisa",
      meta: {
        requiresAuth: false,
        layout: defaultLayout
      },
      component: tamanho_camisa
    },
    {
      path: "/caneca",
      name: "caneca",
      meta: {
        requiresAuth: false,
        layout: defaultLayout
      },
      component: caneca
    },
    {
      path: "/cliente_devedor",
      name: "cliente_devedor",
      meta: {
        requiresAuth: false,
        layout: defaultLayout
      },
      component: cliente_devedor
    },
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/recovery",
      redirect: "/home"
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/home"
    }
  ],
  history: createWebHashHistory()
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.loggedIn()) {
      next({
        name: "login-form",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
