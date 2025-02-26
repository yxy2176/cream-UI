// import type { PropType } from 'vue'
export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ButtonSize = 'small' | 'large'
export type NativeType = 'button' | 'submit' | 'reset'

export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  plain?: boolean
  round?: boolean
  circle?: boolean
  disabled?: boolean
  nativeType?: NativeType
  autofocus?: boolean
  icon?: string
  loading?: boolean
}

// 两种写法
// export const buttonProps = {
//   type: { type: String as PropType<ButtonType> },
//   size: { type: String as PropType<ButtonSize> },
//   plain: { type: Boolean },
//   round: { type: Boolean },
//   circle: { type: Boolean },
//   disabled: { type: Boolean },
//   nativeType: { type: String as PropType<NativeType> },
//   autofocus: { type: Boolean },
// }
