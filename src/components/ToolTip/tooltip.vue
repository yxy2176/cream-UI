<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 分开outerEvents和events的目的是：防止鼠标移动到popperNode上时，tooltip消失（仅有鼠标在triggerNode上hover才生效×） -->
  <div class="xy-tooltip" ref="popperContainerNode" v-on="outerEvents">
    <div class="xy-tooltip__trigger" ref="triggerNode" v-on="events">
      <slot />
    </div>
    <Transition :name="transition">
      <div v-if="isOpen" class="xy-tooltip__content" ref="popperNode">
        <slot name="content">
          {{ content }}
        </slot>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import type { TooltipInstance, TooltipProps, TooptipEmits } from './type'
import { createPopper } from '@popperjs/core'
// import { placements } from '@popperjs/core'
import type { Instance } from '@popperjs/core'
import useClickOutside from '@/hooks/useClickOutside'

const emits = defineEmits<TooptipEmits>()
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover',
  transition: 'fade',
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
const popperOptions = computed(() => {
  return {
    placements: props.placement,
    ...props.popperOptions,
  }
})

const attachEvents = () => {
  if (props.trigger === 'hover') {
    events['mouseenter'] = open
    outerEvents['mouseleave'] = close
  } else if (props.trigger === 'click') {
    events['click'] = togglePopper
  }
}
// 调用事件
// attachEvents()
if (!props.manual) {
  attachEvents()
} else {
  watch(
    () => props.manual,
    (isManual) => {
      // 手动控制的模式，在这种模式下，组件不再依赖自动的事件触发机制，因此需要移除之前绑定的事件处理函数
      if (isManual) {
        events = {}
        outerEvents = {}
      } else {
        attachEvents()
      }
    },
  )
}

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
        // popperInstance = createPopper(triggerNode.value, popperNode.value, {
        //   placement: props.placement,
        // })
        popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
      } else {
        popperInstance?.destroy()
      }
    }
  },
  // flush 选项：用于控制回调函数的执行时机
  // 有三个可选值：'pre'、'post' 和 'sync'，默认值是 'pre'
  // 当设置为 { flush: 'post' } 时，意味着 watch 的回调函数会在 DOM 更新之后执行
  { flush: 'post' },
)

useClickOutside(popperContainerNode, () => {
  if (props.trigger == 'click' && isOpen.value && !props.manual) {
    close()
  }
})

onUnmounted(() => {
  popperInstance?.destroy()
})

defineExpose<TooltipInstance>({
  show: open,
  hide: close,
})
</script>
