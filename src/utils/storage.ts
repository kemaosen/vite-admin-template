export const storage = {
  /**
   * 获取缓存
   * @param {String} key
   * @return result
   */
  get(key: string) {
    let result: string | null = null
    if (key) {
      const expires = parseInt(localStorage.getItem(`${key}__expires__`) || '') || 0
      // 过期失效
      if (expires) {
        if (Date.now() > expires) {
          this.remove(key)
          return result
        }
      }
      result = localStorage.getItem(key)
    }
    return result
  },
  /**
   * 设置缓存
   * @param {String} key
   * @param {Any} value
   * @param {Number} expires 有效期，单位秒，不传为永久缓存
   * @return null
   */
  set(key: string, value: any, expires = 0) {
    if (key) {
      localStorage.setItem(key, value)
      if (expires) {
        localStorage.setItem(`${key}__expires__`, Date.now() + expires * 1000 + '')
      }
    }
  },
  /**
   * 删除缓存
   * @param {String} key
   * @return null
   */
  remove(key: string) {
    if (key) {
      localStorage.removeItem(key)
      localStorage.removeItem(`${key}__expires__`)
    }
  },
  // 清除缓存
  clear() {
    localStorage.clear()
  },
}
/**
 * 存储用户信息
 */
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum'

export function getToken() {
  return storage.get(ACCESS_TOKEN_KEY) || ''
}

export function setToken(token) {
  return storage.set(ACCESS_TOKEN_KEY, token, 24 * 3600)
}

export function removeToken() {
  return storage.remove(ACCESS_TOKEN_KEY)
}

/**
 *
 * @param {*} name  获取存储内容的name
 */
export function getSession(name) {
  const value = sessionStorage.getItem(name)
  if (value) {
    return JSON.parse(value)
  } else {
    return null
  }
}

export function setSession(name, value) {
  sessionStorage.setItem(name, JSON.stringify(value))
}
