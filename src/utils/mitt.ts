import type { Emitter } from 'mitt'
import mitt from 'mitt'

// 这里定义事件类型，事件名称：要传的参数
type Events = {
  scale?: {
    heightScale: number
    widthScale: number
  }
  // 事件名，关于弹框
  modal?: {
    // 事件类型
    type?: 'modal'
    // 要关闭的弹框类型
    closeType?: string
    value?: any
  }
}

export const emitter: Emitter<Events> = mitt<Events>()
