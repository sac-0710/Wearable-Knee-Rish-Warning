/**
 * 应用入口文件
 * 初始化 Vue 应用并注册全局插件
 */

// 导入 Vue 的应用创建函数
import { createApp } from 'vue'
// 导入 Pinia 状态管理库
import { createPinia } from 'pinia'
// 导入根组件
import App from './App.vue'
// 导入路由配置
import router from './router'
// 导入全局样式文件
import './style.css'

// 创建 Vue 应用实例，传入根组件
const app = createApp(App)

// 注册 Pinia 状态管理插件
// Pinia 用于在组件间共享数据（如用户信息、告警记录等）
app.use(createPinia())

// 注册 Vue Router 路由插件
// Router 用于管理页面导航和URL变化
app.use(router)

// 将应用挂载到 index.html 中 id="app" 的 DOM 元素上
app.mount('#app')