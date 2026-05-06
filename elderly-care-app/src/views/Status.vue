<script setup>
/**
 * Status.vue - 系统状态页
 * 展示设备电量、网络连接状态、同步时间等信息
 */

// 导入状态管理 store
import { useCareStore } from '@/stores/careStore'

// 获取 store 实例
const store = useCareStore()

/**
 * 根据电量百分比返回对应的文字颜色
 * @returns {string} - Tailwind 文字颜色类名
 */
const batteryColor = () => {
  const level = store.deviceStatus.battery
  if (level >= 60) return 'text-green-500'   // 高电量：绿色
  if (level >= 30) return 'text-yellow-500'  // 中电量：黄色
  return 'text-red-500'                       // 低电量：红色
}

/**
 * 根据电量百分比返回对应的背景颜色
 * @returns {string} - Tailwind 背景颜色类名
 */
const batteryBgColor = () => {
  const level = store.deviceStatus.battery
  if (level >= 60) return 'bg-green-500'
  if (level >= 30) return 'bg-yellow-500'
  return 'bg-red-500'
}

/**
 * 信号强度对应的文字标签
 */
const signalLabels = {
  good: '信号良好',
  medium: '信号中等',
  weak: '信号较弱'
}

/**
 * 信号强度对应的颜色
 */
const signalColors = {
  good: 'text-green-500',
  medium: 'text-yellow-500',
  weak: 'text-red-500'
}
</script>

<template>
  <div class="space-y-4">
    <!-- 页面标题卡片 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">系统状态</h2>
    </div>

    <!-- 网络连接状态卡片 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <!-- 网络图标背景：根据在线状态设置颜色 -->
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="store.deviceStatus.isOnline ? 'bg-green-100' : 'bg-red-100'"
          >
            <!-- WiFi 图标 -->
            <svg class="w-6 h-6" :class="store.deviceStatus.isOnline ? 'text-green-500' : 'text-red-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
            </svg>
          </div>
          <div>
            <!-- 网络标题 -->
            <p class="text-base font-medium text-gray-800">网络连接</p>
            <!-- 连接状态文字 -->
            <p class="text-sm text-gray-500">
              {{ store.deviceStatus.isOnline ? '已连接' : '未连接' }}
            </p>
          </div>
        </div>
        <!-- 在线/离线状态标签 -->
        <span 
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="store.deviceStatus.isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
        >
          {{ store.deviceStatus.isOnline ? '在线' : '离线' }}
        </span>
      </div>

      <!-- 信号强度 -->
      <div class="mt-4 pt-4 border-t border-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span class="text-sm text-gray-500">信号强度</span>
          </div>
          <!-- 信号强度标签 -->
          <span class="text-sm font-medium" :class="signalColors[store.deviceStatus.signalStrength]">
            {{ signalLabels[store.deviceStatus.signalStrength] }}
          </span>
        </div>
      </div>
    </div>

    <!-- 设备电量卡片 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <!-- 电量图标背景 -->
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <!-- 电池图标 -->
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
            </svg>
          </div>
          <div>
            <!-- 电量标题 -->
            <p class="text-base font-medium text-gray-800">设备电量</p>
            <!-- 电量百分比 -->
            <p class="text-sm text-gray-500">剩余 {{ store.deviceStatus.battery }}%</p>
          </div>
        </div>
      </div>

      <!-- 电量进度条 -->
      <div class="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        <!-- 电量填充条：动态宽度和颜色 -->
        <div 
          class="h-full rounded-full transition-all duration-500"
          :class="batteryBgColor()"
          :style="{ width: store.deviceStatus.battery + '%' }"
        ></div>
        <!-- 电量百分比文字（居中显示） -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-sm font-medium text-gray-800">{{ store.deviceStatus.battery }}%</span>
        </div>
      </div>

      <!-- 低电量警告提示 -->
      <p v-if="store.deviceStatus.battery < 30" class="mt-3 text-sm text-red-500 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        电量较低，请及时充电
      </p>
    </div>

    <!-- 同步状态卡片 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <div class="flex items-center space-x-3 mb-3">
        <!-- 同步图标 -->
        <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <!-- 同步标题 -->
          <p class="text-base font-medium text-gray-800">同步状态</p>
          <!-- 同步说明 -->
          <p class="text-sm text-gray-500">最后同步时间</p>
        </div>
      </div>
      <!-- 最后同步时间 -->
      <p class="text-lg text-primary-600 font-medium">{{ store.deviceStatus.lastSync }}</p>
    </div>

    <!-- 设备信息卡片 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <h3 class="text-base font-semibold text-gray-800 mb-4">设备信息</h3>
      <div class="space-y-3">
        <!-- 设备型号 -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span class="text-sm text-gray-500">设备型号</span>
          <span class="text-sm text-gray-800">KneeGuard Pro</span>
        </div>
        <!-- 固件版本 -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span class="text-sm text-gray-500">固件版本</span>
          <span class="text-sm text-gray-800">{{ store.deviceStatus.firmwareVersion }}</span>
        </div>
        <!-- 监护人绑定状态 -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span class="text-sm text-gray-500">监护人绑定</span>
          <span class="text-sm text-green-600">已绑定</span>
        </div>
      </div>
    </div>

    <!-- 快捷操作卡片 -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <h3 class="text-base font-semibold text-gray-800 mb-4">快捷操作</h3>
      <!-- 两列网格按钮 -->
      <div class="grid grid-cols-2 gap-3">
        <!-- 同步数据按钮 -->
        <button class="flex items-center justify-center space-x-2 p-3 bg-primary-50 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span class="text-sm font-medium">同步数据</span>
        </button>
        <!-- 设备设置按钮 -->
        <button class="flex items-center justify-center space-x-2 p-3 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.74 3.392.058 3.536 1.712.13 1.613-.942 2.988-2.573 3.066a1.724 1.724 0 00-1.066 2.573c.74 1.543-.058 3.392-1.712 3.536-1.613.13-2.988-.942-3.066-2.573a1.724 1.724 0 00-2.573-1.066c-1.543.74-3.392-.058-3.536-1.712-.13-1.613.942-2.988 2.573-3.066a1.724 1.724 0 001.066-2.573c-.74-1.543.058-3.392 1.712-3.536z"/>
          </svg>
          <span class="text-sm font-medium">设备设置</span>
        </button>
      </div>
    </div>
  </div>
</template>