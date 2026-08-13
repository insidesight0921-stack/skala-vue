import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Element Plus (한국어 로케일 + 다크 테마 변수)
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import ko from 'element-plus/es/locale/lang/ko'
import * as ElIcons from '@element-plus/icons-vue'

import './assets/main.css'
import './assets/element-theme.css' // Element Plus 토큰을 우리 액센트로 (EP css 이후에 로드)

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 아이콘 전역 등록
for (const [name, comp] of Object.entries(ElIcons)) {
  app.component(name, comp)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: ko })
app.mount('#app')
