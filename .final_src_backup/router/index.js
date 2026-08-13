import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      // 동적 경로: :cityId 자리에 city_01 같은 값이 들어옴
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
    },
    {
      path: '/commute',
      name: 'commute',
      component: () => import('../views/CommuteView.vue'),
    },
    {
      // catch-all: 위에 안 걸린 모든 주소 → 404
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
