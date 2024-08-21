import { createApp } from 'vue'
import 'normalize.css'
import '@/styles/index.scss'
import router from './router'
import { setupStore } from './store'
import App from './App'

const app = createApp(App)
setupStore(app)
app.use(router)
app.mount('#app')
