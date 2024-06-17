<template>
  <!-- height: '100%',
      width: '100%', -->
  <div
    :id="node.id"
    :style="{
      height: `${node.height * scale}px`,
      width: `${node.width * scale}px`,
      transform: `$translate(${translateX}px, ${translateY}px)`,
      left: `${node.x * scale}px`,
      top: `${node.y * scale}px`,
      fontSize: `${scale * 14}px`,
      lineHeight: `${scale * 18}px`,
      border: `${2 * scale}px solid ${
        node.color ? Colors[node.color] : '#EBEDE9'
      }`,
      backgroundColor: `${
        node.color
          ? Colors[node.color] + 20
          : node.type !== 'group'
          ? '#ffffff90'
          : '#ffffff60'
      }`,
    }"
    class="node node-link"
  >
    <div class="node-name">{{ node.label }}</div>
    <div>{{ node.text }}</div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Colors, INode } from '../types'

defineProps({
  node: {
    type: Object as PropType<INode>,
    required: true,
  },
  scale: {
    type: Number,
    required: true,
  },
  translateX: {
    type: Number,
    required: true,
  },
  translateY: {
    type: Number,
    required: true,
  },
})
</script>
