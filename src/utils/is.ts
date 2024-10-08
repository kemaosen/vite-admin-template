const ua = navigator.userAgent

export const UA = ua.toLowerCase()

const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val === 'undefined'
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

export function isNull(val: unknown): val is null {
  return val === null
}

export function isNullOrDef(val: unknown): val is null | undefined {
  return isDef(val) || isNull(val)
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

export function isUnNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && !isNull(val)
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

export function isNumberical(val: unknown): val is number | string {
  const r = Number(val)
  return !isNaN(r)
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export function isString(val: unknown): val is string {
  return is(val, 'String')
}

export function isFunction(val: unknown) {
  return typeof val === 'function'
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp')
}

export function isError(val: unknown): val is Error {
  return is(val, 'Error')
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

export function isSet<T = any>(val: unknown): val is Set<T> {
  return is(val, 'Set')
}

export function isSymbol(val: unknown): val is symbol {
  return is(val, 'Symbol')
}

export function isWindow(val: any): val is Window {
  return typeof global === 'undefined' && is(val, 'Window')
}

export function isDocument(val: unknown): val is Document {
  return is(val, 'HTMLDocument')
}

export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName
}

export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map')
}

export function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}
