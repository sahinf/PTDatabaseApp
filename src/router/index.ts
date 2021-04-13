import { createRouter, createWebHashHistory } from 'vue-router';
import Editor from '../views/Editor.vue';
import About from '../views/About.vue';

const routes = [
  {
    path: '/',
    name: 'About',
    component: About,
  },
  {
    path: '/editor',
    name: 'Editor',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/Editor.vue'),
    component: Editor,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
