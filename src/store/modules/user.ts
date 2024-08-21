import { defineStore } from 'pinia'
import { store } from '@/store'
import { getToken, setToken } from '@/utils'
export const useUserStore = defineStore({
  id: 'special',
  state: () => ({
    token: getToken(),
    nickname: '',
    userType: '', // gov, admin, ent
    functions: [], // 路由&操作权限list
    userInfo: {}, // 用户信息
    menus: [], // 后端返回的路由
  }),
  getters: {
    getToken(): string {
      return this.token
    },
    getUserType(): string {
      return this.userType
    },
    getFunctions(): string[] {
      return this.functions
    },
  },
  actions: {
    // 登录成功保存 token
    setToken(token: string) {
      this.token = token ?? ''
      setToken(this.token)
    },
  },
})

// 在组件 setup 函数外使用
export function useUserStoreStoreWithOut() {
  return useUserStore(store)
}
