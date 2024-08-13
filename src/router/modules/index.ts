const routes = [
  {
    path: '/test',
    name: 'home',
    component: () => import('@/views/test'), //路由懒加载
  },
]

export default routes
