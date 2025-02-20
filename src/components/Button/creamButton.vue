<template>
  <button
    ref="_ref"
    class="xy-button"
    :class="{
      [`xy-button--${type}`]: type,
      [`xy-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
    }"
    :disabled="disabled"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <span>
      <slot />
    </span>
  </button>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps } from './types'
// import { buttonProps } from './types';
defineOptions({
  name: 'xyButton',
})
withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button',
})
// defineProps(buttonProps)

const _ref = ref<HTMLButtonElement>()

defineExpose({
  ref: _ref,
})
</script>

<style scoped></style>
