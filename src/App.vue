<template>
  <header>
    <!-- <img src="./assets/logo.svg" alt="Vue logo" class="logo" width="125" height="125" /> -->
    <!-- <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
      ref="triggerNode"
    />
    <div ref="overlayNode"><h1>Hello Tooltip</h1></div> -->
    <!-- <Tooltip placement="right" :trigger="trigger"> -->
    <!-- <Tooltip placement="right" :trigger="trigger" ref="tooltipRef" :popper-options="options"> -->
    <Tooltip placement="right" :trigger="trigger" manual ref="tooltipRef" :popper-options="options">
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
      <template #content>
        <h1>Hello Tooltip</h1>
      </template>
    </Tooltip>
  </header>
  <!-- <font-awesome-icon icon="fa-solid fa-user-secret" /> -->
  <Icon icon="fa-solid fa-user-secret" />
  <Icon icon="arrow-up" size="2xl" type="danger" color="yellow" />
  <main>
    <div class="buttonPart">
      <Button ref="buttonRef" @click="open">Test Button</Button>
      <Button plain @click="close">Plain Button</Button>
      <Button round>Round Button</Button>
      <Button circle>YXY</Button>
      <Button disabled>Disabled Button</Button><br /><br />
      <Button type="primary">Primary</Button>
      <Button type="success">Success</Button>
      <Button type="info">Info</Button>
      <Button type="warning">Warning</Button>
      <Button type="danger">Danger</Button><br /><br />
      <Button type="primary" plain>Primary</Button>
      <Button type="success" plain>Success</Button>
      <Button type="info" plain>Info</Button>
      <Button type="warning" plain>Warning</Button>
      <Button type="danger" plain>Danger</Button><br /><br />
      <Button size="large">Large</Button>
      <!-- 加上icon以后 -->
      <Button size="small">Small</Button><br /><br />
      <Button size="large" loading>Loading</Button>
      <Button size="large" icon="arrow-up">Icon</Button>
    </div>

    <div class="collapsePart">
      <Collapse v-model:modal-value="openedValue" :accordion="false">
        <CollapseItem name="a">
          <template #title>
            <h1>nice title</h1>
          </template>
          <h1>headlint title</h1>
          <div>this is content a aaa</div>
        </CollapseItem>
        <CollapseItem name="b" title="nice title b item b">
          <div>this is bbbbb test</div>
        </CollapseItem>
        <CollapseItem name="c" title="nice cccc" disabled>
          <div>this is cccc test</div>
        </CollapseItem>
      </Collapse>
      <span>openedValue:{{ openedValue }}</span>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref } from 'vue'
// import { onMounted } from 'vue'
import Button from './components/Button/Button.vue'
import type { ButtonInstance } from './components/Button/types'
import Collapse from './components/Collapse/Collapse.vue'
import CollapseItem from './components/Collapse/CollapseItem.vue'
import Icon from './components/Icon/Icon.vue'
// import { createPopper } from '@popperjs/core'
// import type { Instance } from '@popperjs/core'
import Tooltip from './components/ToolTip/Tooltip.vue'
import type { TooltipInstance } from './components/ToolTip/type'
import type { Options } from '@popperjs/core'
import type { NameType } from './components/Collapse/types'
// button部分
const buttonRef = ref<ButtonInstance | null>(null)

// Collapse部分
const openedValue = ref<NameType[]>(['a'])

// Tooltip部分
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const trigger = ref<any>('click')
const tooltipRef = ref<TooltipInstance>()
const open = () => {
  tooltipRef?.value?.show()
}
const close = () => {
  tooltipRef?.value?.hide()
}

const options: Partial<Options> = { placement: 'right-end', strategy: 'fixed' }
</script>
<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
