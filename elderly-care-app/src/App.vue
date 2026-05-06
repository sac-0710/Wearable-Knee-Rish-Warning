<script setup>
/**
 * App.vue - 应用根组件
 * 定义整体页面布局：顶部标题栏 + 中间内容区 + 底部导航栏
 */

// 从 vue-router 导入 RouterView，用于渲染当前路由对应的页面组件
import { RouterView } from 'vue-router'
// 导入底部导航栏组件
import BottomNav from '@/components/BottomNav.vue'
</script>

<template>
  <!-- 页面容器：最小高度为屏幕高度，灰色背景，底部预留导航栏空间(pb-20) -->
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- 顶部标题栏：白色背景，固定在顶部(sticky)，带阴影 -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <!-- 内容容器：最大宽度限制，居中对齐，内边距 -->
      <div class="max-w-lg mx-auto px-4 py-3">
        <!-- 应用标题 -->
        <h1 class="text-xl font-semibold text-gray-800">老人监护系统</h1>
      </div>
    </header>
    
    <!-- 主内容区域：最大宽度限制，居中对齐，内边距 -->
    <main class="max-w-lg mx-auto px-4 py-4">
      <!-- RouterView：根据当前URL自动渲染对应的页面组件 -->
      <RouterView />
    </main>
    
    <!-- 底部导航栏组件 -->
    <BottomNav />
  </div>
</template>