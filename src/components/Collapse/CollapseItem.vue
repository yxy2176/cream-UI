<template>
  <div class="xy-collapse-item" :class="{ 'is-disabled': disabled }">
    <div class="xy-collapse-item__header" :id="`item-header-${name}`" @click="handleClick">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="xy-collapse-item__content" :id="`item-content-${name}`" v-show="isActive">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { collapseContextKey } from './types'
import type { CollapseItemProps } from './types'
defineOptions({
  name: 'XYCollapseItem',
})

const props = defineProps<CollapseItemProps>()
const collapseContext = inject(collapseContextKey)
const isActive = computed(() => collapseContext?.activeNames.value.includes(props.name))
const handleClick = () => {
  if (props.disabled) {
    return
  }
  collapseContext?.handleItemClick(props.name)
}
</script>
<style scoped>
.xy-collapse-item__header {
  font-size: 30px;
}
</style>
