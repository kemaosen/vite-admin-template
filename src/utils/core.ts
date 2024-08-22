import { isNullOrDef, isObject } from './is'
export type Fn = (value: void) => void | PromiseLike<void>

export function sleep(s: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, s * 1000)
  })
}

// 深拷贝
export function deepClone<T extends Record<string, any> | null | undefined>(obj: T): T {
  if (isNullOrDef(obj)) return obj
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item)) as unknown as T
  if (isObject(obj)) {
    const to = {} as Record<string, any>
    Object.keys(obj).forEach((key) => {
      to[key] = deepClone(obj[key])
    })
    return to as T
  }
  return obj
}

export default function restArguments(func: Fn, startIndex: number) {
  startIndex = startIndex === null ? func.length - 1 : +startIndex
  return function (this: any) {
    const length = Math.max(arguments.length - startIndex, 0)
    const rest: any = Array(length)
    let index = 0
    for (; index < length; index++) {
      // eslint-disable-next-line prefer-rest-params
      rest[index] = arguments[index + startIndex]
    }
    func.call(this, rest)
    const args: any = Array(startIndex + 1)
    for (index = 0; index < startIndex; index++) {
      // eslint-disable-next-line prefer-rest-params
      args[index] = arguments[index]
    }
    args[startIndex] = rest
    return func.apply(this, args)
  }
}

// 去抖函数
export function debounce(func: any, wait = 300, immediate = false) {
  let timeout: NodeJS.Timeout | null = null
  let previous = 0
  let args: any
  let result: void | PromiseLike<void>
  let context: any

  const later = function () {
    const passed = new Date().getTime() - previous
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed)
    } else {
      timeout = null
      if (!immediate) result = func.apply(context, args)
      // This check is needed because `func` can recursively invoke `debounced`.
      if (!timeout) args = context = null
    }
  }

  const debounced: any = restArguments(function (this: any, _args: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this
    args = _args
    previous = new Date().getTime()
    if (!timeout) {
      timeout = setTimeout(later, wait)
      if (immediate) result = func.apply(context, args)
    }
    return result
  }, 0)

  debounced.cancel = function () {
    timeout && clearTimeout(timeout)
    timeout = args = context = null
  }

  return debounced
}

// 节流函数
export function throttle(func: any, wait = 300, options?: Record<string, any>) {
  let timeout: NodeJS.Timeout | null = null
  let previous = 0
  let args: any
  let result: void | PromiseLike<void>
  let context: any
  options = options || {}

  const later = function () {
    previous = options?.leading === false ? 0 : +new Date()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }

  const throttled = function (this: any) {
    const _now = +new Date()
    if (!previous && options?.leading === false) previous = _now
    const remaining = wait - (_now - previous)
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this
    // eslint-disable-next-line prefer-rest-params
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = _now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options?.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }

  throttled.cancel = function () {
    timeout && clearTimeout(timeout)
    previous = 0
    timeout = context = args = null
  }

  return throttled
}
