import { CSSProperties, defineComponent, h, nextTick, onMounted, onUnmounted, PropType, reactive, ref } from 'vue'
import { emitter } from '@/utils/mitt'
import { useSpecialStore } from '@/store/modules/special'
/**
 * 防抖函数
 * @param {Function} fn
 * @param {number} delay
 * @returns {() => void}
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(fn: Function, delay: number): () => void {
  let timer: NodeJS.Timeout
  return function (...args: any[]): void {
    if (timer) clearTimeout(timer)
    timer = setTimeout(
      () => {
        // eslint-disable-next-line prefer-spread
        typeof fn === 'function' && fn.apply(null, args)
        clearTimeout(timer)
      },
      delay > 0 ? delay : 100,
    )
  }
}

interface IState {
  originalWidth: string | number
  originalHeight: string | number
  width?: string | number
  height?: string | number
  // observer: null | MutationObserver,
  heightScale: number
  widthScale: number
}
type IAutoScale =
  | boolean
  | {
      x?: boolean
      y?: boolean
    }

export default defineComponent({
  name: 'VScaleScreen',
  props: {
    width: {
      type: [String, Number] as PropType<string | number>,
      default: 1920,
    },
    height: {
      type: [String, Number] as PropType<string | number>,
      default: 1080,
    },
    fullScreen: {
      type: String as PropType<string | 'show' | 'watch' | 'fullOfSupport'>,
      default: 'show',
    },
    autoScale: {
      type: [Object, Boolean] as PropType<IAutoScale>,
      default: true,
    },
    delay: {
      type: Number as PropType<number>,
      default: 500,
    },
    boxStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({}),
    },
    wrapperStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({}),
    },
    bodyOverflowHidden: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const specialStore = useSpecialStore()
    let bodyOverflowHidden: string
    const state = reactive<IState>({
      width: 0,
      height: 0,
      originalWidth: 0,
      originalHeight: 0,
      // observer: null,
      heightScale: 0,
      widthScale: 0,
    })

    const styles: Record<string, CSSProperties> = {
      box: {
        // 设置全屏状态不显示滚动条
        overflow: props.fullScreen === 'watch' ? 'inherit' : 'hidden',
        backgroundSize: `100% 100%`,
        backgroundColor: 'transparent',
        width: `100vw`,
        height: '100vh',
      },
      wrapper: {
        backgroundColor: 'transparent',
        transitionProperty: `all`,
        transitionTimingFunction: `cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDuration: `500ms`,
        position: `relative`,
        overflow: `hidden`,
        zIndex: 100,
        transformOrigin: `left top`,
      },
    }

    const el = ref<HTMLElement>()
    /**
     * 初始化大屏容器宽高
     */
    const initSize = () => {
      return new Promise<void>((resolve) => {
        nextTick(() => {
          // region 获取大屏真实尺寸
          if (props.width && props.height) {
            state.width = props.width
            state.height = props.height
          } else {
            state.width = el.value?.clientWidth
            state.height = el.value?.clientHeight
          }
          // endregion

          // region 获取画布尺寸
          if (!state.originalHeight || !state.originalWidth) {
            state.originalWidth = window.screen.width
            state.originalHeight = window.screen.height
          }
          // endregion
          resolve()
        })
      })
    }

    function initBodyStyle() {
      if (props.bodyOverflowHidden || props.fullScreen === 'show') {
        bodyOverflowHidden = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      }
      if (props.fullScreen === 'watch') {
        bodyOverflowHidden = document.body.style.overflow
        document.body.style.overflow = 'initial'
      }
    }
    /**
     * 更新大屏容器宽高
     */
    const updateSize = () => {
      if (state.width && state.height) {
        el.value!.style.width = `${state.width}px`
        el.value!.style.height = `${state.height}px`
      } else {
        el.value!.style.width = `${state.originalWidth}px`
        el.value!.style.height = `${state.originalHeight}px`
      }
    }

    const autoScale = (scale: number) => {
      if (!props.autoScale) return
      const domWidth = el.value!.clientWidth
      const domHeight = el.value!.clientHeight
      const currentWidth = document.body.clientWidth
      const currentHeight = document.body.clientHeight
      el.value!.style.transform = `scale(${scale},${scale})`
      let mx = Math.max((currentWidth - domWidth * scale) / 2, 0)
      let my = Math.max((currentHeight - domHeight * scale) / 2, 0)
      if (typeof props.autoScale === 'object') {
        !props.autoScale.x && (mx = 0)
        !props.autoScale.y && (my = 0)
      }
      // 在非全屏状态下给容器父级添加padding 使容器垂直居中
      el.value!.parentElement!.style.padding = `${my}px ${mx}px`
    }
    const updateScale = () => {
      // 获取真实视口尺寸
      const currentWidth = document.body.clientWidth
      const currentHeight = document.body.clientHeight
      // 获取大屏最终的宽高
      const realWidth = state.width || state.originalWidth
      const realHeight = state.height || state.originalHeight
      // 计算缩放比例
      const widthScale = currentWidth / +realWidth
      const heightScale = currentHeight / +realHeight
      // 小屏模式
      if (props.fullScreen === 'watch') {
        return false
      }
      // 若要铺满全屏，则按照各自比例缩放
      if (props.fullScreen === 'fullOfSupport') {
        el.value!.style.transform = `scale(${widthScale},${heightScale})`
        state.widthScale = widthScale
        state.heightScale = heightScale
        return false
      }
      el.value!.style.transform = `scale(${widthScale},${heightScale})`
      // 按照宽高最小比例进行缩放
      const scale = Math.min(widthScale, heightScale)
      state.widthScale = scale
      state.heightScale = scale
      autoScale(scale)
    }

    const onResize = debounce(async () => {
      await initSize()
      updateSize()
      updateScale()
      emitter.emit('scale', { widthScale: state.widthScale, heightScale: state.heightScale })
      specialStore.SET_SCALE({ widthScale: state.widthScale, heightScale: state.heightScale })
    }, props.delay)
    // 暂时注释，拖拉变更屏幕大小会触发此方法，导致重复调用onResize
    // 这段代码的主要目的是监测指定 HTML 元素的样式属性（style）的变化，并在变化发生时调用 onResize(),防止用户手动修改style内容后导致屏幕缩放比错误
    // const initMutationObserver = () => {
    //   const observer = (state.observer = new MutationObserver(() => {
    //     onResize()
    //   }))
    //   observer.observe(el.value!, {
    //     attributes: true,
    //     attributeFilter: ['style'],
    //     attributeOldValue: true
    //   })
    // }
    onMounted(() => {
      initBodyStyle()
      nextTick(async () => {
        await initSize()
        updateSize()
        updateScale()
        emitter.emit('scale', { widthScale: state.widthScale, heightScale: state.heightScale })
        specialStore.SET_SCALE({ widthScale: state.widthScale, heightScale: state.heightScale })
        window.addEventListener('resize', onResize)
        // initMutationObserver()
      })
    })
    onUnmounted(() => {
      window.removeEventListener('resize', onResize)
      // state.observer?.disconnect()
      if (props.bodyOverflowHidden) {
        document.body.style.overflow = bodyOverflowHidden
      }
    })

    return () => {
      return h(
        'div',
        {
          className: 'v-screen-box',
          style: { ...styles.box, ...props.boxStyle },
        },
        [
          h(
            'div',
            {
              className: 'screen-wrapper',
              style: { ...styles.wrapper, ...props.wrapperStyle },
              ref: el,
            },
            slots.default?.(),
          ),
        ],
      )
    }
  },
})
