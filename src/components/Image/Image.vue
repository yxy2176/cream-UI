<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="image-container">
    <!-- 加载状态 -->
    <div v-show="isLoading" class="loading-placeholder">
      <slot name="loading">
        <div class="spinner"></div>
        <p class="loading-text">加载中...</p>
      </slot>
    </div>

    <!-- 错误状态 -->
    <div v-show="isError" class="error-placeholder">
      <slot name="error">
        <span class="error-text">⚠️ 图片加载失败</span>
        <button class="retry-btn" @click="retryLoad">重试</button>
      </slot>
    </div>

    <!-- 图片元素 -->
    <img
      v-show="isLoaded"
      ref="imgRef"
      :src="actualSrc"
      :alt="alt"
      @load="handleLoad"
      @error="handleError"
      class="image-content"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  src: string
  alt?: string
  lazy?: boolean
  placeholder?: string
  errorPlaceholder?: string
  maxRetries?: number
  retryInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'image',
  lazy: false,
  placeholder:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  errorPlaceholder: '',
  maxRetries: 3,
  retryInterval: 2000,
})

interface Emits {
  (e: 'load', event: Event): void
  (e: 'error', error: Event): void
}

const emit = defineEmits<Emits>()

const imgRef = ref<HTMLImageElement | null>(null)
const isLoading = ref(true)
const isError = ref(false)
const isLoaded = ref(false)
const actualSrc = ref(props.lazy ? props.placeholder : props.src)
const observer = ref<IntersectionObserver | null>(null)
const retryTimes = ref(0)
let retryTimer: number | null = null

// 核心方法
const handleLoad = (event: Event) => {
  const img = event.target as HTMLImageElement

  // 过滤占位图加载事件
  if (img.src === props.placeholder) return

  isLoading.value = false
  isError.value = false
  isLoaded.value = true
  emit('load', event)
  // requestAnimationFrame用于在浏览器的下一帧渲染之前执行回调函数
  // 它会根据浏览器的刷新率（通常是 60Hz，即每秒 60 帧）来安排回调函数的执行
  // 相比于使用 setTimeout 或 setInterval 来实现动画，
  // requestAnimationFrame 更加高效，因为它会与浏览器的渲染周期同步，避免不必要的重绘和性能浪费。
  requestAnimationFrame(() => {
    if (imgRef.value) {
      imgRef.value.style.opacity = '1'
    }
  })
}

const handleError = (error: Event) => {
  isLoading.value = false
  isError.value = true
  isLoaded.value = false
  emit('error', error)

  if (retryTimes.value < props.maxRetries) {
    retryTimer = setTimeout(() => {
      retryTimes.value++
      actualSrc.value = props.src
    }, props.retryInterval)
  } else {
    actualSrc.value = props.errorPlaceholder || props.placeholder
  }
}

const retryLoad = () => {
  clearTimeout(retryTimer!)
  retryTimes.value = 0
  resetState()
  actualSrc.value = props.src
}

const resetState = () => {
  isLoading.value = true
  isError.value = false
  isLoaded.value = false
}

// 懒加载逻辑
const initLazyLoad = () => {
  if (props.lazy && imgRef.value) {
    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            actualSrc.value = props.src
            observer.value?.disconnect()
          }
        })
      },
      {
        rootMargin: '0px 0px 200px 0px',
      },
    )
    observer.value.observe(imgRef.value)
  }
}

// 生命周期
onMounted(() => {
  if (!props.lazy) initLazyLoad()
  else {
    // 非懒加载直接加载实际图片
    actualSrc.value = props.src
  }
})

onUnmounted(() => {
  observer.value?.disconnect()
  clearTimeout(retryTimer!)
})

// 监听src变化
watch(
  () => props.src,
  (newVal) => {
    resetState()
    actualSrc.value = newVal
  },
)
// 新增：处理占位图加载完成
watch(
  () => actualSrc.value,
  (newVal, oldVal) => {
    if (newVal === props.src && oldVal === props.placeholder) {
      resetState()
    }
  },
)
</script>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100px;
}

.loading-placeholder,
.error-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
}

.image-content {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #666;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

.loading-text {
  color: #666;
  font-size: 0.9em;
}

.error-text {
  color: #ff4d4f;
  margin-bottom: 8px;
}

.retry-btn {
  padding: 6px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #40a9ff;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
