import { type MockMethod } from 'vite-plugin-mock'

const mocks: MockMethod[] = [
  {
    url: '/mock-api/bbb',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: 'OK',
        data: {
          username: 'Trump',
          age: 88,
        },
      }
    },
  },
]

export default mocks
