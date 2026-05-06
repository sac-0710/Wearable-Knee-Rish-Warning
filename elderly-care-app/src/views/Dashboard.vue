<script setup>
/**
 * Dashboard.vue - 活动简报页（首页）
 * 展示今日活动数据、风险等级、本周趋势图表和最近告警
 */

// 导入状态管理 store，获取全局数据
import { useCareStore } from '@/stores/careStore'
// 导入 computed 用于创建计算属性
import { computed } from 'vue'

// 获取 store 实例
const store = useCareStore()

/**
 * 风险等级对应的背景颜色（圆点指示器）
 * green: 安全 - 绿色
 * yellow: 注意 - 黄色
 * red: 危险 - 红色
 */
const riskColors = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500'
}

/**
 * 风险等级对应的文字标签
 */
const riskLabels = {
  green: '安全',
  yellow: '注意',
  red: '危险'
}

/**
 * 风险等级对应的卡片背景和边框颜色
 */
const riskBgColors = {
  green: 'bg-green-50 border-green-200',
  yellow: 'bg-yellow-50 border-yellow-200',
  red: 'bg-red-50 border-red-200'
}

/**
 * 风险等级对应的文字颜色
 */
const riskTextColors = {
  green: 'text-green-700',
  yellow: 'text-yellow-700',
  red: 'text-red-700'
}

/**
 * 图表高度配置（像素）
 */
const chartHeight = 120

/**
 * 根据评分计算柱状图的高度
 * @param {number} score - 安全评分（0-100）
 * @returns {number} - 柱状图高度（像素）
 */
const getBarHeight = (score) => {
  // 将评分转换为百分比高度
  return (score / 100) * chartHeight
}

/**
 * 计算数据点的X坐标
 * @param {number} index - 数据索引
 * @param {number} total - 总数据量
 * @returns {number} - X坐标
 */
const getXPosition = (index, total = store.weeklyScores.length) => {
  // 将索引映射到SVG坐标系，左侧留出Y轴空间
  return (index / (total - 1)) * 250 + 40
}

/**
 * 计算数据点的Y坐标
 * @param {number} score - 安全评分
 * @returns {number} - Y坐标
 */
const getYPosition = (score) => {
  // 将评分映射到SVG坐标系（分数越高，Y坐标越小，位置越高）
  return 100 - (score / 100) * 80 + 10
}

/**
 * 生成折线路径的d属性
 * @param {Array} data - 每周评分数据
 * @returns {string} - SVG路径字符串
 */
const getLinePath = (data) => {
  if (!data || data.length === 0) return ''
  
  // 生成路径命令
  const commands = data.map((item, index) => {
    const x = getXPosition(index)
    const y = getYPosition(item.score)
    return index === 0 ? `M ${x},${y}` : `L ${x},${y}`
  })
  
  return commands.join(' ')
}
</script>

<template>
  <!-- 页面容器：使用 space-y-4 实现子元素间距 -->
  <div class="space-y-4">
    <!-- 标题卡片：显示页面名称和当前日期 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <h2 class="text-lg font-semibold text-gray-800 mb-1">今日活动简报</h2>
      <p class="text-sm text-gray-500">{{ store.dailySummary.date }}</p>
    </div>

    <!-- 数据卡片：两列网格布局 -->
    <div class="grid grid-cols-2 gap-4">
      <!-- 上下楼次数卡片 -->
      <div class="bg-white rounded-xl shadow-sm p-4 text-center">
        <p class="text-sm text-gray-500 mb-2">上下楼次数</p>
        <!-- 大数字显示，使用主题色 -->
        <p class="text-4xl font-bold text-primary-600">{{ store.dailySummary.totalActivities }}</p>
        <p class="text-xs text-gray-400 mt-1">次</p>
      </div>

      <!-- 安全评分卡片 -->
      <div class="bg-white rounded-xl shadow-sm p-4 text-center">
        <p class="text-sm text-gray-500 mb-2">安全评分</p>
        <!-- 根据评分动态设置颜色：>=80绿色，>=60黄色，<60红色 -->
        <p class="text-4xl font-bold" :class="store.dailySummary.score >= 80 ? 'text-green-600' : store.dailySummary.score >= 60 ? 'text-yellow-600' : 'text-red-600'">
          {{ store.dailySummary.score }}
        </p>
        <p class="text-xs text-gray-400 mt-1">分</p>
      </div>
    </div>

    <!-- 风险等级指示卡片：根据风险等级动态设置背景和边框颜色 -->
    <div 
      class="rounded-xl shadow-sm p-4 border-2"
      :class="riskBgColors[store.dailySummary.riskLevel]"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <!-- 风险指示圆点 -->
          <div 
            class="w-4 h-4 rounded-full"
            :class="riskColors[store.dailySummary.riskLevel]"
          ></div>
          <div>
            <p class="text-sm text-gray-600">当前风险等级</p>
            <!-- 风险等级文字标签 -->
            <p 
              class="text-xl font-bold"
              :class="riskTextColors[store.dailySummary.riskLevel]"
            >
              {{ riskLabels[store.dailySummary.riskLevel] }}
            </p>
          </div>
        </div>
        <!-- 根据风险等级显示不同图标 -->
        <svg class="w-8 h-8" :class="riskTextColors[store.dailySummary.riskLevel]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <!-- 安全图标：勾号圆圈 -->
          <path v-if="store.dailySummary.riskLevel === 'green'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          <!-- 注意图标：警告三角 -->
          <path v-else-if="store.dailySummary.riskLevel === 'yellow'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          <!-- 危险图标：感叹号圆圈 -->
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
    </div>

    <!-- 本周趋势图表卡片 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <h3 class="text-base font-semibold text-gray-800 mb-4">本周趋势</h3>
       <!-- 折线图容器：相对定位，用于画线和点 -->
       <div class="relative h-32 px-2">
       <!-- SVG画布容器 -->
       <svg class="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
  <!-- Y轴 -->
  <line x1="40" y1="10" x2="40" y2="90" stroke="#d1d5db" stroke-width="1.5" />
  
  <!-- Y轴刻度和标签 -->
  <g v-for="i in [100, 75, 50, 25, 0]" :key="`y-${i}`">
    <line 
      :x1="36" 
      :y1="getYPosition(i)" 
      :x2="40" 
      :y2="getYPosition(i)" 
      stroke="#d1d5db" 
      stroke-width="1.5" 
    />
    <text 
      :x="32" 
      :y="getYPosition(i) + 3" 
      text-anchor="end" 
      font-size="9" 
      fill="#9ca3af"
    >{{ i }}</text>
  </g>
  
  <!-- 水平网格线 -->
  <path 
    v-for="i in [0, 25, 50, 75, 100]" 
    :key="i"
    :d="`M 40,${getYPosition(i)} H 290`" 
    stroke="#e5e7eb" 
    stroke-width="1" 
    stroke-dasharray="2,2"
  />
  <!-- 垂直网格线（可选） -->
  <path 
    v-for="(item, index) in store.weeklyScores" 
    :key="`v-${index}`"
    :d="`M ${getXPosition(index)},10 V 90`" 
    stroke="#f3f4f6" 
    stroke-width="1"
  />
  
  <!-- 渐变定义 -->
  <defs>
    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>

  <!-- 折线路径 -->
  <path 
    :d="getLinePath(store.weeklyScores)" 
    fill="none" 
    stroke="url(#lineGradient)" 
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  
  <!-- 数据点 -->
  <circle 
    v-for="(item, index) in store.weeklyScores" 
    :key="item.day"
    :cx="getXPosition(index)" 
    :cy="getYPosition(item.score)"
    r="4" 
    fill="#3b82f6" 
    stroke="white" 
    stroke-width="2"
    class="hover:r-5 transition-all"
  >
    <!-- 注意：<title> 必须放在 <circle> 内部 -->
    <title>安全评分: {{ item.score }}</title>
  </circle>
</svg>
  
       <!-- 底部标签 -->
  <div class="flex justify-between" style="padding-left: 12%; padding-right: 2%;">
    <p 
      v-for="item in store.weeklyScores" 
      :key="item.day"
      class="text-xs text-gray-500 w-8 text-center"
    >
      {{ item.day }}
    </p>
      </div>
     </div>
    </div>

    <!-- 最近告警列表卡片 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-base font-semibold text-gray-800">最近告警</h3>
        <!-- 查看全部链接 -->
        <router-link to="/history" class="text-sm text-primary-600">查看全部</router-link>
      </div>
      <!-- 告警列表 -->
      <div class="space-y-3">
        <!-- 遍历最近告警，点击可跳转到详情页 -->
        <router-link 
          v-for="alert in store.recentAlerts" 
          :key="alert.id"
          :to="`/alert/${alert.id}`"
          class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <!-- 告警严重程度指示圆点 -->
          <div 
            class="w-3 h-3 rounded-full mr-3"
            :class="alert.severity === 'red' ? 'bg-red-500' : alert.severity === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'"
          ></div>
          <div class="flex-1">
            <!-- 告警描述 -->
            <p class="text-sm font-medium text-gray-800">{{ alert.description }}</p>
            <!-- 告警时间 -->
            <p class="text-xs text-gray-500">{{ alert.timestamp }}</p>
          </div>
          <!-- 右箭头图标 -->
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>