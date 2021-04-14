import { createRouter, createWebHashHistory } from 'vue-router';
import Editor from '../views/Editor.vue';
import Start from '../views/Start.vue';

const routes = [
  {
    path: '/',
    name: 'Start',
    component: Start,
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
