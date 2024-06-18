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
    <div v-html="markedText" class="node-text-content"></div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue'
import { marked } from 'marked'
import { Colors, INode } from '../types'

const props = defineProps({
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

// Set options
marked.use({
  async: false,
  pedantic: false,
  gfm: true,
})

const markedText = computed(() => {
  return marked.parse(props.node.text ?? '')
})
</script>
