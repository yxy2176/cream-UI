<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <i class="xy-icon" :class="{ [`xy-icon--${type}`]: type }" :style="customStyles" v-bind="$attrs">
    <font-awesome-icon v-bind="filteredProps" />
  </i>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { IconProps } from './type'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' //Vue 组件，用于在模板中渲染图标
import { omit } from 'lodash-es'
defineOptions({
  name: 'XYIcon',
  inheritAttrs: false,
})
const props = defineProps<IconProps>()
const filteredProps = computed(() => omit(props, ['type', 'color']))
const customStyles = computed(() => {
  return props.color ? { color: props.color } : {}
})
</script>
