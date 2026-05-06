<script setup>
/**
 * BottomNav.vue - 底部导航栏组件
 * 提供应用的主要页面导航功能，固定在屏幕底部
 */

// 从 vue-router 导入 useRoute，获取当前路由信息
import { useRoute } from 'vue-router'

// 导入 computed 用于创建计算属性（响应式派生数据）
import { computed } from 'vue'

// 获取当前路由对象，用于判断当前激活的导航项
const route = useRoute()

/**
 * 导航项配置数组
 * 每个项包含：
 * - path: 路由路径
 * - name: 显示名称
 * - icon: 图标类型标识
 */
const navItems = [
  { path: '/', name: '首页', icon: 'home' },
  { path: '/history', name: '历史', icon: 'history' },
  { path: '/status', name: '状态', icon: 'status' }
]

/**
 * 判断导航项是否激活
 * @param {string} path - 导航项路径
 * @returns {boolean} - 是否处于激活状态
 * 首页('/')需要精确匹配，其他路径使用前缀匹配
 */
const isActive = (path) => {
  // 首页需要精确匹配（避免在其他页面时首页也显示激活）
  if (path === '/') {
    return route.path === '/'
  }
  // 其他页面使用前缀匹配
  return route.path.startsWith(path)
}
</script>

<template>
  <!-- 导航栏容器：固定定位在底部，白色背景，上边框 -->
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
    <!-- 内容容器：最大宽度限制，居中，flex布局平均分布 -->
    <div class="max-w-lg mx-auto flex justify-around items-center h-16">
      <!-- 遍历导航项，使用 router-link 实现路由跳转 -->
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center px-4 py-2"
        :class="isActive(item.path) ? 'text-primary-600' : 'text-gray-500'"
      >
        <!-- 首页图标：房屋形状 -->
        <svg v-if="item.icon === 'home'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <!-- 历史图标：时钟形状 -->
        <svg v-else-if="item.icon === 'history'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <!-- 状态图标：柱状图形状 -->
        <svg v-else-if="item.icon === 'status'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <!-- 导航项名称文字 -->
        <span class="text-xs mt-1">{{ item.name }}</span>
      </router-link>
    </div>
  </nav>
</template>