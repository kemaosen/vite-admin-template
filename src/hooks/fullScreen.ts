import { useSpecialStore } from '@/store/modules/special'
import { computed, onBeforeUnmount, ref } from 'vue'

/**
 * 用于解决屏幕切换全屏，非全屏状态，重新加载VScaleScreen组件
 */
export function useFullScreen() {
  const specialStore = useSpecialStore()
  const fullScreen = computed(() => {
    return specialStore.fullScreenState
  })
  const screenKey = ref(0)
  const changeFullScreen = (e) => {
    // 切换模式 自适配演示(市局大屏) & 小屏演示介绍（笔记本）
    if (e.ctrlKey && !e.shiftKey && e.key === 'F11') {
      specialStore.SET_FULL_SCREEN(fullScreen.value === 'show' ? 'watch' : 'show')
      screenKey.value = new Date().getTime()
    }
    // 撑满整个屏幕 完全自适配 会有拉伸
    if (e.ctrlKey && e.shiftKey && e.key === 'F11') {
      specialStore.SET_FULL_SCREEN('fullOfSupport')
      screenKey.value = new Date().getTime()
    }
  }
  document.addEventListener('keydown', changeFullScreen)
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', changeFullScreen)
  })
  return {
    fullScreen,
    screenKey,
  }
}
