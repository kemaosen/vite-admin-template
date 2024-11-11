import { bbb } from '@/apis/common'
import { Button } from 'ant-design-vue'
import { defineComponent, onMounted } from 'vue'
export const MainView = defineComponent({
  name: 'MainView',
  setup() {
    onMounted(() => {
      bbb().then((res) => {
        console.log(res)
      })
    })
    return () => (
      <div>
        首页-默认页面 <Button type='primary'>按钮</Button>
      </div>
    )
  },
})
export default MainView
