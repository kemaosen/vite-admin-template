import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
export const AppView = defineComponent({
  name: 'AppView',
  setup() {
    return () => <RouterView></RouterView>
  },
})
export default AppView
