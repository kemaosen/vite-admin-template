const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/main'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test'),
  },
]

export default routes
