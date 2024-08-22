import { onMounted, onUnmounted } from 'vue'
// 按下esc键触发函数调用
export function useEscapeKey(onEscape, domRef?) {
  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      onEscape()
    }
  }
  onMounted(async () => {
    // 当页面打开多个弹框,需要通过dom聚焦判断关闭哪个弹框
    if (domRef) {
      domRef.value?.focus()
      domRef.value?.addEventListener('keydown', handleEscape)
    } else {
      document.addEventListener('keydown', handleEscape)
    }
  })
  onUnmounted(() => {
    if (domRef) {
      domRef.value?.removeEventListener('keydown', handleEscape)
    } else {
      document.removeEventListener('keydown', handleEscape)
    }
  })
}
