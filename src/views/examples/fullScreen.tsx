import { defineComponent } from 'vue'
import styles from './index.module.scss'
import VScaleScreen from '@/components/v-scale-screen'
import { useFullScreen } from '@/hooks/fullScreen'
export const TestView = defineComponent({
  name: 'TestView',
  setup() {
    const { fullScreen, screenKey } = useFullScreen()
    return () => (
      <VScaleScreen width={2560} height={1440} fullScreen={fullScreen.value} key={screenKey.value}>
        <div class={styles.container}>我是tsx页面</div>
      </VScaleScreen>
    )
  },
})
export default TestView
