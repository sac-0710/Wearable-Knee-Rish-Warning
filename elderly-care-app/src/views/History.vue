<script setup>
/**
 * History.vue - 历史记录页
 * 展示历史活动数据，支持列表视图和图表视图切换
 */

// 导入状态管理 store
import { useCareStore } from '@/stores/careStore'
// 导入 ref（响应式引用）和 computed（计算属性）
import { ref, computed } from 'vue'

// 获取 store 实例
const store = useCareStore()

// 视图模式：'list' 列表视图，'chart' 图表视图
const viewMode = ref('list')

// 当前选中的日期，用于显示详情
const selectedDate = ref(null)

/**
 * 风险等级对应的颜色配置
 */
const riskColors = {
  green: { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-300' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-300' },
  red: { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-300' }
}

/**
 * 根据选中日期获取对应的详细记录
 * computed 自动追踪 selectedDate 的变化
 */
const selectedRecord = computed(() => {
  if (!selectedDate.value) return null
  return store.getHistoryByDate(selectedDate.value)
})

/**
 * 选择日期，显示该日期的活动详情
 * @param {string} date - 日期字符串
 */
const selectDate = (date) => {
  selectedDate.value = date
}

/**
 * 关闭详情面板
 */
const closeDetail = () => {
  selectedDate.value = null
}

/**
 * 图表高度配置
 */
const chartHeight = 100

/**
 * 根据评分计算柱状图高度
 * @param {number} score - 安全评分
 * @returns {number} - 高度像素值
 */
const getBarHeight = (score) => {
  return (score / 100) * chartHeight
}
</script>

<template>
  <div class="space-y-4">
    <!-- 主卡片：包含视图切换和历史列表/图表 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <!-- 标题和视图切换按钮 -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800">历史记录</h2>
        <!-- 视图切换按钮组 -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          <!-- 列表视图按钮 -->
          <button 
            @click="viewMode = 'list'"
            class="px-3 py-1 text-sm rounded-md transition-colors"
            :class="viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'"
          >
            列表
          </button>
          <!-- 图表视图按钮 -->
          <button 
            @click="viewMode = 'chart'"
            class="px-3 py-1 text-sm rounded-md transition-colors"
            :class="viewMode === 'chart' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'"
          >
            图表
          </button>
        </div>
      </div>

      <!-- 列表视图：每日记录列表 -->
      <div v-if="viewMode === 'list'" class="space-y-3">
        <!-- 遍历历史记录，点击可查看详情 -->
        <div 
          v-for="record in store.historyRecords" 
          :key="record.date"
          @click="selectDate(record.date)"
          class="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div>
              <!-- 日期 -->
              <p class="text-base font-medium text-gray-800">{{ record.date }}</p>
              <!-- 活动次数 -->
              <p class="text-sm text-gray-500">上下楼 {{ record.totalActivities }} 次</p>
            </div>
            <div class="flex items-center space-x-3">
              <!-- 评分 -->
              <span class="text-lg font-bold" :class="riskColors[record.riskLevel].text">
                {{ record.score }}分
              </span>
              <!-- 风险指示圆点 -->
              <div class="w-3 h-3 rounded-full" :class="riskColors[record.riskLevel].bg"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表视图：评分趋势柱状图 -->
      <div v-else class="space-y-4">
        <h3 class="text-sm font-medium text-gray-600">风险评分趋势</h3>
        <!-- 柱状图容器 -->
        <div class="flex items-end justify-between h-28 px-2 border-b border-gray-200">
          <!-- 遍历历史记录生成柱状图 -->
          <div 
            v-for="record in store.historyRecords" 
            :key="record.date"
            class="flex flex-col items-center cursor-pointer"
            @click="selectDate(record.date)"
          >
            <!-- 评分数值标签 -->
            <span class="text-xs text-gray-500 mb-1">{{ record.score }}</span>
            <!-- 柱状图：根据风险等级设置颜色 -->
            <div 
              class="w-6 rounded-t transition-all duration-300 hover:opacity-80"
              :class="riskColors[record.riskLevel].bg"
              :style="{ height: getBarHeight(record.score) + 'px' }"
            ></div>
          </div>
        </div>
        <!-- 日期标签 -->
        <div class="flex justify-between px-2">
          <span 
            v-for="record in store.historyRecords" 
            :key="record.date"
            class="text-xs text-gray-500 w-12 text-center truncate"
          >
            {{ record.date.slice(5) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 详情面板：显示选中日期的活动详情 -->
    <div v-if="selectedRecord" class="bg-white rounded-xl shadow-sm p-4">
      <div class="flex items-center justify-between mb-4">
        <!-- 详情标题 -->
        <h3 class="text-base font-semibold text-gray-800">{{ selectedRecord.date }} 活动详情</h3>
        <!-- 关闭按钮 -->
        <button @click="closeDetail" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- 数据统计卡片：三列网格 -->
      <div class="grid grid-cols-3 gap-3 mb-4">
        <!-- 活动次数 -->
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <p class="text-2xl font-bold text-primary-600">{{ selectedRecord.totalActivities }}</p>
        </div>
        <!-- 安全评分 -->
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <p class="text-2xl font-bold" :class="riskColors[selectedRecord.riskLevel].text">
            {{ selectedRecord.score }}
          </p>
        </div>
        <!-- 风险等级图标 -->
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="flex justify-center">
            <div 
              class="w-6 h-6 rounded-full"
              :class="riskColors[selectedRecord.riskLevel].bg"
            ></div>
          </div>
        </div>
      </div>

      <!-- 单次活动记录列表 -->
      <h4 class="text-sm font-medium text-gray-600 mb-3">活动记录</h4>
      <div class="space-y-2">
        <div 
          v-for="(activity, index) in selectedRecord.activities" 
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <!-- 上楼/下楼图标 -->
            <svg 
              class="w-5 h-5"
              :class="activity.type === '上楼' ? 'text-green-500' : 'text-blue-500'"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <!-- 上楼图标：向上箭头 -->
              <path v-if="activity.type === '上楼'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
              <!-- 下楼图标：向下箭头 -->
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
            <!-- 活动时间 -->
            <span class="text-gray-700">{{ activity.time }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <!-- 活动类型 -->
            <span class="text-sm text-gray-500">{{ activity.type }}</span>
            <!-- 风险指示圆点 -->
            <div 
              class="w-2 h-2 rounded-full"
              :class="riskColors[activity.risk].bg"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全部告警列表卡片 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <h3 class="text-base font-semibold text-gray-800 mb-3">全部告警</h3>
      <div class="space-y-2">
        <!-- 遍历所有告警，点击跳转到详情页 -->
        <router-link 
          v-for="alert in store.alerts" 
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