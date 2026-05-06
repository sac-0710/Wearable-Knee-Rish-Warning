<script setup>
/**
 * AlertDetail.vue - 告警详情页
 * 展示单个告警的详细信息，包括时间、类型、建议等
 * 通过路由参数获取告警ID
 */

// 导入路由相关函数，获取路由参数和导航功能
import { useRoute, useRouter } from 'vue-router'
// 导入状态管理 store
import { useCareStore } from '@/stores/careStore'
// 导入 computed 创建计算属性
import { computed } from 'vue'

// 获取当前路由对象，用于读取路由参数
const route = useRoute()
// 获取路由器对象，用于编程式导航
const router = useRouter()
// 获取 store 实例
const store = useCareStore()

/**
 * 根据路由参数获取当前告警详情
 * computed 自动追踪 route.params.id 的变化
 */
const alert = computed(() => store.getAlertById(route.params.id))

/**
 * 告警严重程度对应的颜色配置
 * 每个级别包含背景色、文字色、边框色
 */
const severityColors = {
  green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' }
}

/**
 * 告警严重程度对应的文字标签
 */
const severityLabels = {
  green: '安全',
  yellow: '注意',
  red: '危险'
}

/**
 * 告警类型对应的中文标签
 */
const typeLabels = {
  impact_overload: '冲击过载',
  angle_risk: '角度异常',
  frequency_high: '频率过高'
}

/**
 * 返回上一页
 * 使用路由器的 back 方法实现浏览器历史导航
 */
const goBack = () => {
  router.back()
}
</script>

<template>
  <!-- 只有找到告警时才显示内容 -->
  <div v-if="alert" class="space-y-4">
    <!-- 返回按钮 -->
    <button @click="goBack" class="flex items-center text-primary-600 mb-4">
      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      返回
    </button>

    <!-- 告警头部卡片：显示严重程度、时间和描述 -->
    <div 
      class="rounded-xl shadow-sm p-4 border-2"
      :class="[severityColors[alert.severity].bg, severityColors[alert.severity].border]"
    >
      <div class="flex items-center justify-between mb-3">
        <!-- 严重程度标签 -->
        <span 
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="[severityColors[alert.severity].bg, severityColors[alert.severity].text]"
        >
          {{ severityLabels[alert.severity] }}
        </span>
        <!-- 告警时间 -->
        <span class="text-sm text-gray-500">{{ alert.timestamp }}</span>
      </div>
      <!-- 告警描述标题 -->
      <h2 class="text-xl font-bold text-gray-800">{{ alert.description }}</h2>
    </div>

    <!-- 告警类型卡片 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <h3 class="text-base font-semibold text-gray-800 mb-3">告警类型</h3>
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <!-- 显示告警类型的中文标签，如果未定义则显示原始值 -->
        <span class="text-gray-700">{{ typeLabels[alert.type] || alert.type }}</span>
      </div>
    </div>

    <!-- 系统建议卡片 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <h3 class="text-base font-semibold text-gray-800 mb-3">系统建议</h3>
      <!-- 建议内容：蓝色背景提示框 -->
      <div class="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
        <!-- 灯泡图标 -->
        <svg class="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        <!-- 建议文字 -->
        <p class="text-blue-800 text-base leading-relaxed">{{ alert.suggestion }}</p>
      </div>
    </div>

    <!-- 健康提示卡片：通用建议列表 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <h3 class="text-base font-semibold text-gray-800 mb-3">健康提示</h3>
      <ul class="space-y-3">
        <li class="flex items-start space-x-2">
          <!-- 勾号图标 -->
          <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-gray-700 text-sm">保持稳定的行走速度，避免快速下楼</span>
        </li>
        <li class="flex items-start space-x-2">
          <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-gray-700 text-sm">始终握紧楼梯扶手</span>
        </li>
        <li class="flex items-start space-x-2">
          <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-gray-700 text-sm">如有不适请及时休息或联系家人</span>
        </li>
      </ul>
    </div>

    <!-- 返回首页按钮 -->
    <button 
      @click="goBack"
      class="w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
    >
      返回首页
    </button>
  </div>

  <!-- 未找到告警时的提示 -->
  <div v-else class="text-center py-12">
    <!-- 警告图标 -->
    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
    </svg>
    <p class="text-gray-500">未找到该告警记录</p>
    <button @click="goBack" class="mt-4 text-primary-600">返回</button>
  </div>
</template>