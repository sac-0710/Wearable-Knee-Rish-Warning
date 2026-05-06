/**
 * 路由配置文件
 * 定义应用的页面路由和导航规则
 */

// 从 vue-router 导入路由创建函数
import { createRouter, createWebHistory } from 'vue-router'

// 导入各个页面组件
import Dashboard from '@/views/Dashboard.vue'
import AlertDetail from '@/views/AlertDetail.vue'
import History from '@/views/History.vue'
import Status from '@/views/Status.vue'

/**
 * 路由配置数组
 * 每个路由对象包含：
 * - path: URL路径
 * - name: 路由名称（用于编程式导航）
 * - component: 对应的Vue组件
 * - meta: 元数据（如页面标题）
 */
const routes = [
  {
    path: '/',               // 首页路径
    name: 'Dashboard',
    component: Dashboard,    // 活动简报页组件
    meta: { title: '活动简报' }
  },
  {
    path: '/alert/:id',      // 告警详情页，:id 是动态参数
    name: 'AlertDetail',
    component: AlertDetail,
    meta: { title: '告警详情' }
  },
  {
    path: '/history',        // 历史记录页
    name: 'History',
    component: History,
    meta: { title: '历史记录' }
  },
  {
    path: '/status',         // 系统状态页
    name: 'Status',
    component: Status,
    meta: { title: '系统状态' }
  }
]

/**
 * 创建路由实例
 * createWebHistory() 使用 HTML5 History 模式，URL更美观（无#号）
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 全局路由守卫
 * 在每次路由跳转前执行，用于设置页面标题
 * @param {object} to - 目标路由对象
 * @param {object} from - 来源路由对象
 * @param {function} next - 继续导航的函数
 */
router.beforeEach((to, from, next) => {
  // 设置文档标题，格式：页面标题 - 老人监护系统
  document.title = `${to.meta.title} - 老人监护系统` || '老人监护系统'
  next()  // 必须调用 next() 才能继续导航
})

// 导出路由实例，供 main.js 使用
export default router