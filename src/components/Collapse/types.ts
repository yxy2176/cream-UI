import type { InjectionKey, Ref } from 'vue'

export type NameType = string | number

export interface CollapseProps {
  modalValue: NameType[]
  // 是否开启手风琴模式
  accordion?: boolean
}

export interface CollapseItemProps {
  name: NameType
  title?: string
  disabled?: boolean
}

export interface CollapseContext {
  activeNames: Ref<NameType[]>
  handleItemClick: (name: NameType) => void
}

export interface CollapseEmits {
  (e: 'update:modalValue', values: NameType[]): void
  (e: 'change', values: NameType[]): void
}

export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('collapseContextKey')
