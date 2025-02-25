import '../src/styles/index.css'
import { library } from '@fortawesome/fontawesome-svg-core' // Font Awesome 的核心库，用于管理图标集合
import { fas } from '@fortawesome/free-solid-svg-icons' // 从 @fortawesome/free-solid-svg-icons 中导入的所有 ​Solid 风格图标
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' //Vue 组件，用于在模板中渲染图标

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

library.add(fas) //将图标添加到库中
// 将 FontAwesomeIcon 组件全局注册为 font-awesome-icon，以便在项目的任何地方使用
// createApp(App)
// .component('font-awesome-icon', FontAwesomeIcon)
// .mount('#app')
