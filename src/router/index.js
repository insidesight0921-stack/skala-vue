import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
    { path: '/dashboard', name: 'dashboard', component: () => import('../views/WeatherHomeView.vue') },
    { path: '/map', name: 'map', component: () => import('../views/MapView.vue') },
    { path: '/commute', name: 'commute', component: () => import('../views/CommuteView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/WeatherAboutView.vue') },
    {
      path: '/weather/:cityId',
      name: 'detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
