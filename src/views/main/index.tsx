import { Button } from 'ant-design-vue'
import { defineComponent } from 'vue'
export const MainView = defineComponent({
  name: 'MainView',
  setup() {
    return () => (
      <div>
        首页-默认页面 <Button type='primary'>按钮</Button>
      </div>
    )
  },
})
export default MainView
