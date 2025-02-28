import type { Placement } from '@popperjs/core'

export interface TooltipProps {
  content?: string //tooltip的显示内容
  placement?: Placement //放置位置 ->例如bottom则是放置在触发元素的下方
  trigger?: 'hover' | 'click' //触发事件
}

export interface TooptipEmits {
  (e: 'visible-change', value: boolean): void
}
