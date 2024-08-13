import { createApp } from 'vue'
import 'normalize.css'
import '@/styles/index.scss'
import router from './router'
import store from './store'
import App from './App'

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
