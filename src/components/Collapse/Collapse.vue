<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="xy-collapse">
    <slot />
  </div>
</template>
<script setup lang="ts">
import { provide, ref } from 'vue'
import type { NameType } from './types'
import { collapseContextKey } from './types'
defineOptions({
  name: 'XYCollapse',
})

const activeNames = ref<NameType[]>([])
const handleItemClick = (item: NameType) => {
  // 记得要.value，因为是ref对象
  const index = activeNames.value.indexOf(item)
  //展开对象activeNames里没有index对应的，因此插入对应的name
  if (index === -1) {
    activeNames.value.push(item)
    // 存在，则删除
  } else {
    activeNames.value.splice(index, 1)
  }
}

provide(collapseContextKey, { activeNames, handleItemClick })
</script>
<style scoped></style>
