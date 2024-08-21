import axios, { AxiosRequestConfig } from 'axios'
import qs from 'qs'
import { message } from 'ant-design-vue'
import { deepClone, sleep, debounce } from '@/utils/core'
import { useUserStore } from '@/store/modules/user'
// import { resetRouter } from '@/router'
import app from '@/main'

// 扩展配置类型
interface AxiosRequestConfigExtend extends AxiosRequestConfig {
  headers: any
  loading?: boolean
}

export type Response<T = any> = {
  code: number
  message: string
  data: T
}

export type BaseResponse<T = any> = Promise<Response<T>>

export interface RequestOptions {
  // 是否直接获取data
  isGetData?: boolean
  // 是否mock数据请求
  isMock?: boolean
}

export const baseUrl = process.env.VUE_BASE_URL || ''
// 真实请求的路径前缀
const baseApiUrl = process.env.VUE_BASE_API || ''
// mock 请求路径前缀
const baseMockUrl = process.env.VUE_MOCK_API || ''
// 公共前缀
export const prefix = '/p4/api/v1/dv'
// 过滤请求中值为 undefined、null 的参数
function clearDeep(data: Record<string, unknown>) {
  if (!data || data instanceof FormData) return data
  const transformData = deepClone(data)
  if (typeof transformData === 'object' && transformData !== null) {
    for (const [k, v] of Object.entries(transformData)) {
      if (([null, undefined] as any).includes(v)) {
        delete transformData[k]
      }
    }
  }
  return transformData
}

export function buildErrMsg(errors) {
  if (!errors || errors.length === 0) return '网络开了小差，请稍后再试～'
  let msg = ''
  errors.forEach((e) => {
    msg += e.message
  })
  return msg
}

export const isError = (errors, err) => {
  if (!errors || !errors.length || !err) return false
  for (let i = 0; i < errors.length; i++) {
    const e = errors[i]
    if (e.code === err) return true
  }
  return false
}

// secret 无效
const isSecretInvalid = (errors) => {
  return isError(errors, 'validation.user.bad_login_secret')
}

// token 无效
const isTokenInvalid = (errors) => {
  return isError(errors, 'auth.authentication_invalid_token')
}

// 没有权限
const isAccessDenied = (errors) => {
  return isError(errors, 'auth.access_denied')
}

const instance = axios.create({
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 10 * 1000, // request timeout
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  },
})

instance.interceptors.request.use(
  (config: AxiosRequestConfigExtend) => {
    // 请求头携带 token
    if (useUserStore().token) {
      config.headers['Authorization'] = 'Bearer ' + useUserStore().token
    }
    config.headers['appClient'] = 'trace_dv'
    config.params = clearDeep(config.params)
    config.data = clearDeep(config.data)
    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response: any) => {
    return response
  },
  debounce(async (error: any) => {
    if (!error.response) {
      message.error('系统超时或异常')
      return Promise.reject(error)
    }
    if (error.response.data.errorMsg) {
      error.response.data.errors = [{ code: '', message: error.response.data.errorMsg }]
    }
    const statusCode = error.response.status
    const errors = error.response.data.errors
    if ([401, 403, 500].includes(statusCode)) {
      let msg = '网络开了小差，请稍后再试～'
      if (isTokenInvalid(errors) || isSecretInvalid(errors)) {
        message.error('令牌已过期，请重新登录')
        await sleep(1)
        // useUserStore().resetToken()
        // resetRouter()
        return location.reload()
      } else if (isAccessDenied(errors)) {
        msg = '无权限访问'
        // await sleep(1)
        // useUserStore().resetToken()
        // resetRouter()
        // location.reload()
      } else {
        msg = buildErrMsg(errors) || msg
      }
      message.error(msg)
      return Promise.reject(new Error(msg))
    }
    message.error(buildErrMsg(errors))
    return Promise.reject(error)
  }, 50),
)

export const request = async <T = any>(config: AxiosRequestConfigExtend, options: RequestOptions = {}): Promise<T> => {
  const { loading = true } = config
  try {
    const { isGetData = true, isMock = false } = options
    const fullUrl = `${(isMock ? baseMockUrl : baseApiUrl) + config.url}`
    config.url = fullUrl.replace(/(?!:)\/{2,}/g, '/')
    loading && app.config.globalProperties.$loading?.show()
    const res = await instance.request(config)
    loading && app.config.globalProperties.$loading?.hide()
    return isGetData ? res?.data : res
  } catch (error: any) {
    loading && app.config.globalProperties.$loading?.hide()
    return Promise.reject(error)
  }
}
