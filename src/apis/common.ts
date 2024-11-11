import { request } from '@/utils/request'

export const user = () => {
  return request({
    url: `/api/user`,
    method: 'get',
  })
}
export const bbb = () => {
  return request(
    {
      url: `/bbb`,
      method: 'get',
    },
    { isMock: true },
  )
}
