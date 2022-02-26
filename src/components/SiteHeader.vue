<template>
  <n-layout-header bordered class="nav">
    <n-text tag="div" class="ui-logo" :depth="1">
      <span>SPXX Blackboard α ()</span>
    </n-text>
    <div class="nav-end">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button text @click="newRoom" class="button-icon">
            <n-icon>
              <plus-filled />
            </n-icon>
          </n-button>
        </template>
        新建一个房间
      </n-tooltip>
    </div>
  </n-layout-header>
</template>
<script lang="ts" setup>
import {NLayoutHeader, NText, NTooltip, NIcon, NButton} from 'naive-ui'
import {PlusFilled} from '@vicons/material'

function newRoom() {
  window.location.href = '/'
}
</script>
<style scoped>
.nav {
  display: grid;
  grid-template-rows: 47px;
  align-items: center;
  padding: 0 24px;
  grid-template-columns: 240px 1fr auto;
}
.ui-logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
}
.button-icon {
  font-size: 24px;
}
.nav-end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
