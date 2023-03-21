import {
  createWebHistory,
  createRouter as _createRouter,
  createMemoryHistory,
} from "vue-router";

const routes = [
  {
    path: "/",
    alias: "/Home",
    component: () => import("../pages/Home/index.vue"),
  },
  {
    path: "/Example",
    alias: "/Example",
    component: () => import("../pages/Example/index.vue"),
  },
];

export function createRouter() {
  return _createRouter({
    // history: import.meta.env.SSR ? createMemoryHistory("/ssr") : createWebHistory("/ssr"),
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });
}
