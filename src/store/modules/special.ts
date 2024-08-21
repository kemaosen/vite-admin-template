import { defineStore } from 'pinia'
import { store } from '@/store'
export const useSpecialStore = defineStore({
  id: 'special',
  state: () => ({
    scale: {
      heightScale: 0,
      widthScale: 0,
    },
    fullScreen: import.meta.env.VITE_FULL_SCREEN, // show:市局演示， watch:小屏演示（开发默认）， fullOfSupport:完全自适应拉伸（生产默认）
  }),
  getters: {
    pageScale(state) {
      return state.scale
    },
    // 返回屏幕当前状态 是否为全屏
    fullScreenState(state) {
      return state.fullScreen
    },
  },
  actions: {
    // 存储缩放比
    SET_SCALE(value) {
      this.scale = value
    },
    // 设置当前屏幕状态 全屏or非全屏
    SET_FULL_SCREEN(value) {
      this.fullScreen = value
    },
  },
})

// 在组件 setup 函数外使用
export function useSpecialStoreStoreWithOut() {
  return useSpecialStore(store)
}
