/**
 * 状态管理文件 - 使用 Pinia 管理全局状态
 * 包含：每日活动数据、告警记录、历史数据、设备状态等
 */

// 导入 Pinia 的 defineStore 函数，用于定义状态仓库
import { defineStore } from 'pinia'
// 导入 Vue 的 ref（响应式引用）和 computed（计算属性）
import { ref, computed } from 'vue'

/**
 * 定义名为 'care' 的状态仓库
 * 使用组合式 API 风格（setup 函数式）
 */
export const useCareStore = defineStore('care', () => {
  /**
   * 每日活动汇总数据
   * ref() 创建响应式数据，当数据变化时视图自动更新
   */
  const dailySummary = ref({
    date: new Date().toISOString().split('T')[0], // 当前日期
    totalActivities: 8,   // 今日上下楼总次数
    riskLevel: 'yellow',  // 风险等级：green/yellow/red
    score: 85             // 安全评分（0-100）
  })

  /**
   * 告警记录列表
   * 存储所有历史告警信息，包括时间、类型、描述、建议等
   */
  const alerts = ref([
    {
      id: 1,
      timestamp: '2023-10-27 14:30:15',
      type: 'impact_overload',     // 告警类型：冲击过载
      description: '下楼冲击过载',
      suggestion: '建议减速，紧握扶手',
      severity: 'red'              // 严重程度：红色表示高风险
    },
    {
      id: 2,
      timestamp: '2023-10-27 10:15:22',
      type: 'angle_risk',          // 告警类型：角度异常
      description: '膝关节角度异常',
      suggestion: '建议休息，避免长时间上下楼',
      severity: 'yellow'           // 黄色表示中等风险
    },
    {
      id: 3,
      timestamp: '2023-10-26 18:45:33',
      type: 'frequency_high',      // 告警类型：频率过高
      description: '上下楼频率过高',
      suggestion: '建议减少上下楼次数，适当休息',
      severity: 'yellow'
    },
    {
      id: 4,
      timestamp: '2023-10-26 09:20:11',
      type: 'impact_overload',
      description: '下楼冲击过载',
      suggestion: '建议减速，紧握扶手',
      severity: 'red'
    }
  ])

  /**
   * 历史活动记录
   * 每日活动的详细数据，用于历史页面展示
   */
  const historyRecords = ref([
    {
      date: '2023-10-27',
      totalActivities: 8,
      riskLevel: 'yellow',
      score: 85,
      activities: [
        { time: '14:30', type: '下楼', risk: 'red' },
        { time: '12:15', type: '上楼', risk: 'green' },
        { time: '10:15', type: '下楼', risk: 'yellow' },
        { time: '09:30', type: '上楼', risk: 'green' }
      ]
    },
    {
      date: '2023-10-26',
      totalActivities: 12,
      riskLevel: 'red',
      score: 72,
      activities: [
        { time: '18:45', type: '下楼', risk: 'yellow' },
        { time: '16:20', type: '上楼', risk: 'green' },
        { time: '14:10', type: '下楼', risk: 'green' },
        { time: '09:20', type: '下楼', risk: 'red' }
      ]
    },
    {
      date: '2023-10-25',
      totalActivities: 5,
      riskLevel: 'green',
      score: 95,
      activities: [
        { time: '15:30', type: '上楼', risk: 'green' },
        { time: '10:00', type: '下楼', risk: 'green' }
      ]
    },
    {
      date: '2023-10-24',
      totalActivities: 6,
      riskLevel: 'green',
      score: 92,
      activities: [
        { time: '17:45', type: '下楼', risk: 'green' },
        { time: '14:20', type: '上楼', risk: 'green' },
        { time: '09:15', type: '下楼', risk: 'green' }
      ]
    },
    {
      date: '2023-10-23',
      totalActivities: 10,
      riskLevel: 'yellow',
      score: 78,
      activities: [
        { time: '19:30', type: '上楼', risk: 'yellow' },
        { time: '16:15', type: '下楼', risk: 'green' },
        { time: '11:45', type: '上楼', risk: 'green' },
        { time: '08:30', type: '下楼', risk: 'yellow' }
      ]
    }
  ])

  /**
   * 设备状态信息
   * 包括电量、网络连接、同步时间等
   */
  const deviceStatus = ref({
    battery: 78,           // 设备电量百分比
    isOnline: true,        // 是否在线
    lastSync: '2023-10-27 15:30:00',  // 最后同步时间
    signalStrength: 'good',           // 信号强度
    firmwareVersion: 'v2.1.3'         // 固件版本
  })

  /**
   * 本周评分数据
   * 用于首页的趋势图表展示
   */
  const weeklyScores = ref([
    { day: '周一', score: 92 },
    { day: '周二', score: 78 },
    { day: '周三', score: 95 },
    { day: '周四', score: 85 },
    { day: '周五', score: 72 },
    { day: '周六', score: 88 },
    { day: '周日', score: 85 }
  ])

  /**
   * 计算属性：最近3条告警
   * computed() 创建派生数据，自动追踪依赖并缓存结果
   */
  const recentAlerts = computed(() => alerts.value.slice(0, 3))

  /**
   * 根据ID获取告警详情
   * @param {number|string} id - 告警ID
   * @returns {object|undefined} - 找到的告警对象或undefined
   */
  function getAlertById(id) {
    return alerts.value.find(a => a.id === parseInt(id))
  }

  /**
   * 根据日期获取历史记录
   * @param {string} date - 日期字符串，格式如 '2023-10-27'
   * @returns {object|undefined} - 找到的历史记录或undefined
   */
  function getHistoryByDate(date) {
    return historyRecords.value.find(h => h.date === date)
  }

  /**
   * 更新设备状态
   * @param {object} status - 新的状态数据，部分更新
   */
  function updateDeviceStatus(status) {
    deviceStatus.value = { ...deviceStatus.value, ...status }
  }

  // 返回所有状态和方法，供组件使用
  return {
    dailySummary,
    alerts,
    historyRecords,
    deviceStatus,
    weeklyScores,
    recentAlerts,
    getAlertById,
    getHistoryByDate,
    updateDeviceStatus
  }
})