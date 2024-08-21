const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/main'),
  },
  {
    path: '/fullScreen',
    name: 'fullScreen',
    component: () => import('@/views/examples/fullScreen'),
  },
]

export default routes
