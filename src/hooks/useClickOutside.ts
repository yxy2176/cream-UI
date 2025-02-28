import { onMounted, onUnmounted, type Ref } from 'vue'

const useClickOutside = (
  elementRef: Ref<undefined | HTMLElement>,
  callback: (e: MouseEvent) => void,
) => {
  const handler = (e: MouseEvent) => {
    // e.currentTarget 指向绑定事件监听器的元素，
    // 而 e.target 指向实际触发事件的元素
    if (elementRef.value && e.target) {
      if (!elementRef.value.contains(e.target as HTMLElement)) {
        callback(e)
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
}

export default useClickOutside
