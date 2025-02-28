<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 分开outerEvents和events的目的是：防止鼠标移动到popperNode上时，tooltip消失（仅有鼠标在triggerNode上hover才生效×） -->
  <div class="xy-tooltip" ref="popperContainerNode" v-on="outerEvents">
    <div class="xy-tooltip__trigger" ref="triggerNode" v-on="events">
      <slot />
    </div>
    <div v-if="isOpen" class="xy-tooltip__content" ref="popperNode">
      <slot name="content">
        {{ content }}
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { TooltipProps, TooptipEmits } from './type'
import { createPopper } from '@popperjs/core'
import type { Instance } from '@popperjs/core'
import useClickOutside from '@/hooks/useClickOutside'

const emits = defineEmits<TooptipEmits>()
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover',
})
const triggerNode = ref<HTMLElement>()
const popperNode = ref<HTMLElement>()
let popperInstance: Instance | null = null
const popperContainerNode = ref<HTMLElement>()

const isOpen = ref(false)
// 第二个参数maybe是个函数，写any好了，因为不确定返回值
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let events: Record<string, any> = reactive({})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let outerEvents: Record<string, any> = reactive({})

const open = () => {
  isOpen.value = true
  emits('visible-change', true)
}

const close = () => {
  isOpen.value = false
  emits('visible-change', false)
}

const togglePopper = () => {
  isOpen.value = !isOpen.value
  emits('visible-change', isOpen.value)
}

const attachEvents = () => {
  if (props.trigger === 'hover') {
    events['mouseenter'] = open
    outerEvents['mouseleave'] = close
  } else if (props.trigger === 'click') {
    events['click'] = togglePopper
  }
}
// 调用事件
attachEvents()

watch(
  () => props.trigger,
  (newTrigger, oldTrigger) => {
    if (newTrigger != oldTrigger) {
      events = {}
      outerEvents = {}
      // 清空完后再次调用   （为了根据新的 props.trigger 值重新绑定正确的事件处理函数）
      attachEvents()
    }
  },
)
watch(
  () => isOpen,
  (newValue) => {
    if (newValue) {
      if (popperNode.value && triggerNode.value) {
        popperInstance = createPopper(triggerNode.value, popperNode.value, {
          placement: props.placement,
        })
      } else {
        popperInstance?.destroy()
      }
    }
  },
)

useClickOutside(popperContainerNode, () => {
  if (props.trigger == 'click' && isOpen.value) {
    close()
  }
})
</script>
