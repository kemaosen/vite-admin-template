import { defineStore } from 'pinia'

export const useTestStore = defineStore('test', {
  state: () => {
    return {
      list: [1, 2, 3],
    }
  },
  getters: {
    index: (state) => state.list.map((v) => v + 'name'),
  },
  actions: {
    // 增加list
    addList(num: number) {
      this.list.push(num)
    },
  },
})
