import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export interface IconProps {
  border?: boolean // 添加一个边框样式
  fixedWidth?: boolean // 设置为 true 时，图标会有一个固定的宽度  => 多个图标排列成一列时很有用
  flip?: 'horizontal' | 'vertical' | 'both' //翻转（水平/垂直/均）
  icon: object | Array<string> | string | IconDefinition // 指定要显示的图标。可以是一个对象、字符串数组、字符串或图标定义对象
  mask?: object | Array<string> | string // 创建图标的遮罩效果，通过遮罩可以实现一些特殊的图标显示样式
  listItem?: boolean // 设置为 true 时，图标会被调整为适合在列表项中使用的样式，通常会有一些额外的内边距和对齐方式的调整。
  pull?: 'right' | 'left' // 使图标向左（'left'）或向右（'right'）浮动，常用于文本排版中使图标与文本更好地对齐。
  pulse?: boolean // 设置为 true 时，图标会以 8 帧的动画效果进行旋转，类似于脉冲的闪烁效果
  rotation?: 90 | 180 | 270 | '90' | '180' | '270' //旋转
  swapOpacity?: boolean // 交换图标的不透明度，实现一些特殊的视觉效果
  size?: // 图标的大小
  | '2xs'
    | 'xs'
    | 'sm'
    | 'lg'
    | 'xl'
    | '2xl'
    | '1x'
    | '2x'
    | '3x'
    | '4x'
    | '5x'
    | '6x'
    | '7x'
    | '8x'
    | '9x'
    | '10x'
  spin?: boolean // 如果为 true，图标会持续顺时针旋转，通常用于表示加载或活动状态
  transform?: object | string
  symbol?: boolean | string // 设置为 true 时，图标可能会以符号形式显示；如果是字符串，则可能用于指定符号的名称或样式。
  title?: string //为图标添加一个标题  => 悬浮时显示
  inverse?: boolean // 反转图标的颜色，通常用于在深色背景上显示图标时使其更清晰可见
  bounce?: boolean // 上下弹跳的动画效果
  shake?: boolean // 左右摇晃的动画效果
  beat?: boolean // 产生心跳般的缩放动画效果
  fade?: boolean // 产生淡入淡出的动画效果
  beatFade?: boolean // 结合了心跳缩放和淡入淡出的动画效果
  spinPulse?: boolean // 在旋转的同时会有脉冲式的闪烁效果
  spinReverse?: boolean // 逆时针旋转
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  color?: string
}
