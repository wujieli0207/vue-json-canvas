<template>
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
import { Colors, INode } from '../../lib/types'
import { renderedMarkdown } from '../../lib/markdown'

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

const markedText = computed(() => {
  return renderedMarkdown(props.node.text ?? '')
})
</script>

<style scoped>
/* General node styling */
.node {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  position: absolute;
  display: block;
}
.node.is-active {
  box-shadow: 0 0 0 2px var(--color-ui-3);
}
.node.is-dragging {
  cursor: grabbing;
  box-shadow: 0 0 0 2px var(--color-ui-3), 0 5px 15px rgba(0, 0, 0, 0.2);
}
.node.is-dragging iframe {
  pointer-events: none;
}
.node:hover .node-name {
  opacity: 1;
  color: var(--color-tx-1);
  border-radius: 8px 8px 0 0;
}
.node-name {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  cursor: grab;
  opacity: 1;
  position: absolute;
  height: 2.25em;
  padding: 0.25em 0.5em;
  width: 100%;
  top: -2.25em;
  left: 0;
  color: var(--color-ui-2);
  font-size: calc(var(--font-smaller) * 1 / var(--scale));
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
.node.is-dragging .node-name {
  cursor: grabbing;
}
.node-link,
.node-text {
  background-color: var(--color-bg-1);
  border-radius: 8px;
  box-shadow: 0 0 0 2px var(--color-ui-1);
}
.node-file img {
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
.node-text-content {
  padding: 12px 24px;
}
</style>
