<template>
  <n-layout-header bordered class="nav">
    <n-text tag="div" class="ui-logo" :depth="1">
      <span>SPXX Blackboard</span>
    </n-text>
  </n-layout-header>
</template>
<script setup lang="ts">
import {NLayoutHeader, NText} from 'naive-ui'
</script>
<style scoped>
.nav {
  display: grid;
  grid-template-rows: 47px;
  align-items: center;
  padding: 0 24px;
}
.ui-logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
}
</style>
