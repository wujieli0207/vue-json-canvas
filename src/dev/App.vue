<template>
  <Canvas :canvasContent="mockCanvasContent" />
</template>

<script lang="ts" setup>
import Canvas from '../components/Canvas/index.vue'
import { mockCanvasContent } from './mock-data'
</script>
