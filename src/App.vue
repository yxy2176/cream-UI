<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    <!-- <img src="./assets/logo.svg" alt="Vue logo" class="logo" width="125" height="125" /> -->
    <!-- <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
      ref="triggerNode"
    />
    <div ref="overlayNode"><h1>Hello Tooltip</h1></div> -->
    <!-- <Tooltip placement="right" :trigger="trigger"> -->
    <!-- <Tooltip placement="right" :trigger="trigger" ref="tooltipRef" :popper-options="options"> -->
    <!-- <Tooltip placement="right" :trigger="trigger" manual ref="tooltipRef" :popper-options="options"> -->
    <Tooltip
      placement="right"
      :trigger="trigger"
      ref="tooltipRef"
      :open-delay="1000"
      :close-delay="1000"
    >
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
      <template #content>
        <h1>Hello Tooltip</h1>
      </template>
    </Tooltip>
  </header>
  <!-- <font-awesome-icon icon="fa-solid fa-user-secret" /> -->
  <Icon icon="fa-solid fa-user-secret" />
  <Icon icon="arrow-up" size="2xl" type="danger" color="yellow" />
  <main>
    <div class="buttonPart">
      <Button ref="buttonRef" @click="open">Test Button</Button>
      <Button plain @click="close">Plain Button</Button>
      <Button round>Round Button</Button>
      <Button circle>YXY</Button>
      <Button disabled>Disabled Button</Button><br /><br />
      <Button type="primary">Primary</Button>
      <Button type="success">Success</Button>
      <Button type="info">Info</Button>
      <Button type="warning">Warning</Button>
      <Button type="danger">Danger</Button><br /><br />
      <Button type="primary" plain>Primary</Button>
      <Button type="success" plain>Success</Button>
      <Button type="info" plain>Info</Button>
      <Button type="warning" plain>Warning</Button>
      <Button type="danger" plain>Danger</Button><br /><br />
      <Button size="large">Large</Button>
      <!-- 加上icon以后 -->
      <Button size="small">Small</Button><br /><br />
      <Button size="large" loading>Loading</Button>
      <Button size="large" icon="arrow-up">Icon</Button>
    </div>

    <div class="collapsePart">
      <Collapse v-model:modal-value="openedValue" :accordion="false">
        <CollapseItem name="a">
          <template #title>
            <h1>nice title</h1>
          </template>
          <h1>headlint title</h1>
          <div>this is content a aaa</div>
        </CollapseItem>
        <CollapseItem name="b" title="nice title b item b">
          <div>this is bbbbb test</div>
        </CollapseItem>
        <CollapseItem name="c" title="nice cccc" disabled>
          <div>this is cccc test</div>
        </CollapseItem>
      </Collapse>
      <span>openedValue:{{ openedValue }}</span>
    </div>

    <!-- Image部分 -->
    <div class="demo-container">
      <h2>图片加载演示</h2>

      <div class="image-wrapper">
        <Image
          :src="currentImage"
          :alt="imageAlt"
          :lazy="true"
          :max-retries="3"
          @load="handleImageLoad"
          @error="handleImageError"
        />
      </div>

      <div class="control-panel">
        <button @click="loadRandomImage" class="reload-btn">
          {{ hasError ? '重试加载' : '更换图片' }}
        </button>
        <button @click="triggerError" class="error-btn">测试错误</button>
      </div>

      <div class="status-info">
        <p>当前状态: {{ statusText }}</p>
        <p>重试次数: {{ retryCount }}</p>
      </div>
    </div>
    <div class="table">
      <!-- table组件部分 -->
      <div class="parent-container">
        <!-- <Table
          :columns="columns"
          :data="tableData"
          @update:data="handleDataUpdate"
          @update:columns="handleColumnsUpdate"
        /> -->
        <Table v-model:data="tableData" v-model:columns="columns" />
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref } from 'vue'
// import { onMounted } from 'vue'
import Button from './components/Button/Button.vue'
import type { ButtonInstance } from './components/Button/types'
import Collapse from './components/Collapse/Collapse.vue'
import CollapseItem from './components/Collapse/CollapseItem.vue'
import Icon from './components/Icon/Icon.vue'
// import { createPopper } from '@popperjs/core'
// import type { Instance } from '@popperjs/core'
import Tooltip from './components/ToolTip/Tooltip.vue'
import type { TooltipInstance } from './components/ToolTip/type'
// import type { Options } from '@popperjs/core'
import type { NameType } from './components/Collapse/types'
import Image from './components/Image/Image.vue'
import Table from './components/Table/Table2.vue'
// button部分
const buttonRef = ref<ButtonInstance | null>(null)

// Collapse部分
const openedValue = ref<NameType[]>(['a'])

// Tooltip部分
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const trigger = ref<any>('click')
// const trigger = ref<any>('click')

const tooltipRef = ref<TooltipInstance>()
const open = () => {
  tooltipRef?.value?.show()
}
const close = () => {
  tooltipRef?.value?.hide()
}

// const options: Partial<Options> = { placement: 'right-end', strategy: 'fixed' }

// image组件部分
const imageAlt = ref('随机图片')
const imageBase = 'https://picsum.photos/600/400?random='
const currentImage = ref(imageBase + Math.random())
const hasError = ref(false)
const retryCount = ref(0)
const statusText = ref('等待加载')

// 图片加载成功处理
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  imageAlt.value = `已加载的图片（尺寸: ${img.naturalWidth}x${img.naturalHeight}）`
  statusText.value = `加载成功 ${img.naturalWidth}x${img.naturalHeight}`
  hasError.value = false
  retryCount.value = 0
  console.log('图片加载成功:', img.src)
}

// 图片加载失败处理
const handleImageError = (error: Event) => {
  const img = error.target as HTMLImageElement
  statusText.value = `加载失败: ${img.src}`
  imageAlt.value = '图片加载失败'
  hasError.value = true
  retryCount.value++
  console.error('图片加载失败:', error)

  // 失败3次后切换备用图
  if (retryCount.value >= 3) {
    currentImage.value = '/fallback-image.jpg'
    imageAlt.value = '备用图片'
  }
}

// 加载新图片
const loadRandomImage = () => {
  statusText.value = '开始加载...'
  imageAlt.value = `随机图片 #${Math.floor(Math.random() * 1000)}`
  currentImage.value = imageBase + Math.random()
}

// 测试错误情况
const triggerError = () => {
  currentImage.value = 'https://invalid.url/test-image.jpg'
}

// table组件部分
// const columns = ref([
//   { label: '姓名', prop: 'name', sortable: true },
//   { label: '年龄', prop: 'age', sortable: true },
//   { label: '城市', prop: 'city' },
// ])

// const tableData = ref([
//   { name: '张三', age: 25, city: '北京' },
//   { name: '李四', age: 30, city: '上海' },
//   { name: '王五', age: 28, city: '广州' },
// ])
const columns = ref([
  { label: '姓名', prop: 'name', visible: true },
  { label: '年龄', prop: 'age', visible: true },
])

const tableData = ref([
  { name: '张三', age: 25, sales: 3000 }, // 会自动生成 sales 列
  { name: '李四', age: 30, sales: 4500 },
])

// // 处理数据更新
// const handleDataUpdate = (newData: any[]) => {
//   tableData.value = newData
// }

// 处理列配置更新
// const handleColumnsUpdate = (newColumns: any[]) => {
//   columns.value = newColumns
// }
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}

.demo-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  margin: 20px 0;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.control-panel {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.reload-btn,
.error-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.reload-btn {
  background: #1890ff;
  color: white;
}

.error-btn {
  background: #ff4d4f;
  color: white;
}

.reload-btn:hover,
.error-btn:hover {
  opacity: 0.8;
}

.status-info {
  margin-top: 15px;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 4px;
}

.status-info p {
  margin: 5px 0;
  color: #666;
}

.table {
  width: 600px;
  height: 300px;
  display: flex;
  align-items: center;
}
</style>
