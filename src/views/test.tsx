import { defineComponent } from 'vue'
import styles from './index.module.scss'
export const TestView = defineComponent({
  name: 'TestView',
  setup() {
    return () => <div class={styles.container}>我是tsx页面</div>
  },
})
export default TestView
