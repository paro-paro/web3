import { createApp } from 'vue'
import App from './App.vue'
import { initAuth } from './plugins/auth'
import './styles/main.css'

const auth = await initAuth()
const app = createApp(App)

app.config.globalProperties.$auth = auth
app.mount('#app')
