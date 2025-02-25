<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="xy-collapse">
    <slot />
  </div>
</template>
<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import type { CollapseEmits, CollapseProps, NameType } from './types'
import { collapseContextKey } from './types'
defineOptions({
  name: 'XYCollapse',
})
const props = defineProps<CollapseProps>()
const emits = defineEmits<CollapseEmits>()
const activeNames = ref<NameType[]>(props.modalValue)

watch(
  // 使用函数形式返回具体的属性，确保Vue能正确监听属性的变化
  () => props.modalValue,
  () => {
    activeNames.value = props.modalValue
  },
)
if (props.accordion && activeNames.value.length > 1) {
  console.warn('accordion mode should only have one active item')
}

const handleItemClick = (item: NameType) => {
  // 手风琴模式
  if (props.accordion) {
    // 记得要.value，因为是ref对象
    activeNames.value = [activeNames.value[0] === item ? '' : item]
    // console.log('activeNames.value:', Object.prototype.toString.call(activeNames.value))    //[Object Array]
  } else {
    // 获取 item在activeNames里的index
    const index = activeNames.value.indexOf(item)
    //展开对象activeNames里没有index对应的，因此插入对应的name
    if (index === -1) {
      activeNames.value.push(item)
      // 存在，则删除
    } else {
      activeNames.value.splice(index, 1)
    }
  }
  emits('update:modalValue', activeNames.value)
  emits('change', activeNames.value)
}

provide(collapseContextKey, { activeNames, handleItemClick })
</script>
<style scoped></style>
