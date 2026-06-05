<template>
  <div
    :style="{
      '--scale': scale,
      '--pan-x': `${panOffsetX}px`,
      '--pan-y': `${panOffsetY}px`,
      cursor: `${isPanning ? 'grabbing' : ''}`,
    }"
    :class="`wrapper ${isSpacePressed ? 'will-pan' : ''}`"
  >
    <div id="container">
      <div id="canvas-container">
        <svg id="canvas-edges">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="8"
              refX="5"
              refY="4"
              orient="auto"
            >
              <polygon points="0 0, 10 4, 0 8" />
            </marker>
          </defs>
          <g id="edge-paths"></g>
        </svg>

        <div id="canvas-nodes">
          <template v-for="node in canvasContent.nodes" :key="node.id">
            <CanvasNode
              :node="node"
              :scale="1"
              :translate-x="1"
              :translate-y="1"
            />
          </template>
        </div>

        <div id="output" :class="`theme-dark ${isShowOutput ? '' : 'hidden'}`">
          <div class="code-header">
            <span class="language">JSON&nbsp;Canvas</span>
            <span class="close-output" @click="handleCloseOutput">×</span>
          </div>
          <div id="output-code">
            <pre><code class="language-json" id="positionsOutput"></code></pre>
          </div>
          <div class="code-footer">
            <button class="button-copy">Copy code</button>
            <button class="button-download">Download file</button>
          </div>
        </div>

        <div id="controls">
          <button @click="handleToggleOutput">Toggle output</button>
          <button @click="handleZoomOut">Zoom out</button>
          <button @click="handleZoomIn">Zoom in</button>
          <button @click="handleZoomReset">Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, onMounted, ref } from 'vue'
import CanvasNode from '../CanvasNode/index.vue'
import { ICanvasContent } from '../../lib/types'
import { getAnchorPoint } from '../../lib/utils'
import { MAX_SCALE, MIN_SCALE, ZOOM_SPEED } from '../../lib/config'

const props = defineProps({
  canvasContent: {
    type: Object as PropType<ICanvasContent>,
    default: () => {},
  },
})

let selectedElement: HTMLElement | null = null

let startX = 0
let startY = 0
let panStartX = 0
let panStartY = 0
let initialDistance = null;
let lastTouchX = 0;
let lastTouchY = 0;
let touchStartPanX = 0;
let touchStartPanY = 0;

const scale = ref(1)
const panOffsetX = ref(0)
const panOffsetY = ref(0)

const canvasContent = ref<ICanvasContent>(props.canvasContent)

const isShowOutput = ref(false)
const isSpacePressed = ref(false)
const isPanning = ref(false)
const isDragging = ref(false)

onMounted(() => {
  adjustCanvasToViewport()
  drawEdges()

  // Zoom
  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.deltaY > 0) {
          scale.value = Math.max(scale.value - ZOOM_SPEED, MIN_SCALE)
        } else {
          scale.value = Math.min(scale.value + ZOOM_SPEED, MAX_SCALE)
        }

        e.preventDefault()
      }
    },
    { passive: false }
  )

  // ===== Drag nodes ======
  document.querySelectorAll('.node .node-name').forEach((nodeName) => {
    nodeName.addEventListener('mousedown', function (e) {
      if (isSpacePressed.value) return

      const event = e as MouseEvent

      isDragging.value = true
      startX = event.clientX
      startY = event.clientY
      // @ts-ignore
      selectedElement = this.parentElement
      if (selectedElement) {
        selectedElement.classList.add('is-dragging')
      }
    })
  })

  window.addEventListener('mousemove', function (e) {
    if (!isDragging.value || !selectedElement) return

    const dx = (e.clientX - startX) / scale.value
    const dy = (e.clientY - startY) / scale.value

    selectedElement.style.left = `${
      parseInt(selectedElement.style.left, 10) + dx
    }px`
    selectedElement.style.top = `${
      parseInt(selectedElement.style.top, 10) + dy
    }px`

    startX = e.clientX
    startY = e.clientY

    drawEdges()
  })

  window.addEventListener('mouseup', function () {
    if (isDragging.value && selectedElement) {
      selectedElement.classList.remove('is-dragging')
      isDragging.value = false
      selectedElement = null
      drawEdges()
    }
  })

  // ===== Drag nodes ======

  // ===== Panning ======
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
      e.preventDefault()
      isSpacePressed.value = true
    }
  })

  window.addEventListener('keyup', function (e) {
    if (e.code === 'Space') {
      isSpacePressed.value = false
    }
  })

  window.addEventListener('mousedown', function (e) {
    if (isSpacePressed.value && !isDragging.value) {
      isPanning.value = true
      panStartX = e.clientX - panOffsetX.value
      panStartY = e.clientY - panOffsetY.value
    }
  })

  window.addEventListener('mousemove', function (e) {
    if (isPanning.value) {
      panOffsetX.value = e.clientX - panStartX
      panOffsetY.value = e.clientY - panStartY
    }
  })

  window.addEventListener('mouseup', function () {
    if (isPanning.value) {
      isPanning.value = false
    }
  })

  // ===== Panning ======
  // Touch-based devices 
  
  document.addEventListener('gesturestart', function(e){ e.preventDefault(); });
  
  document.getElementById('canvas-container').addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) { // Single touch for panning
      isPanning.value = true;
      const touch = e.touches[0];
      touchStartPanX = touch.pageX - panOffsetX.value;
      touchStartPanY = touch.pageY - panOffsetY.value;
      lastTouchX = touch.pageX;
      lastTouchY = touch.pageY;
    } else if (e.touches.length === 2) { // Two-finger touch for zooming
      e.preventDefault(); // Prevent page zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance = Math.sqrt((touch2.pageX - touch1.pageX) ** 2 + (touch2.pageY - touch1.pageY) ** 2);
    }
  }, { passive: false });
  
  // Touch move for panning and zooming
  document.getElementById('canvas-container').addEventListener('touchmove', function(e) {
    if (e.touches.length === 1 && isPanning.value) {
      const touch = e.touches[0];
      const dx = touch.pageX - lastTouchX;
      const dy = touch.pageY - lastTouchY;
      panOffsetX.value += dx;
      panOffsetY.value += dy;
      lastTouchX = touch.pageX;
      lastTouchY = touch.pageY;
      drawEdges();
    } else if (e.touches.length === 2) { // Adjust for zooming
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt((touch2.pageX - touch1.pageX) ** 2 + (touch2.pageY - touch1.pageY) ** 2);
      const scaleChange = distance / initialDistance;
      scale.value = Math.min(Math.max(MIN_SCALE, scale.value * scaleChange), MAX_SCALE); // Apply and limit scale
      initialDistance = distance;
    }
  }, { passive: false });
  
  document.getElementById('canvas-container').addEventListener('touchend', function(e) {
    if (isPanning.value) {
      isPanning.value = false;
    }
    if (e.touches.length < 2) {
      initialDistance = null; // Reset zoom tracking on lifting one finger
    }
  });

  // Activate node on touch
  document.querySelectorAll('.node .node-name').forEach(nodeName => {
    nodeName.addEventListener('touchstart', function(e) {
      // Prevent activating multiple nodes simultaneously
      deactivateAllNodes();
      const node = this.parentElement;
      node.classList.add('is-active');
      // Prepare for potential drag
      isDragging.value = false;
      const touch = e.touches[0];
      startX = touch.pageX;
      startY = touch.pageY;
      selectedElement = node;
      e.stopPropagation();
    }, {passive: true});
  });

  // Deactivate nodes when tapping outside
  document.addEventListener('touchstart', function(e) {
    if (!e.target.closest('.node')) {
      deactivateAllNodes();
    }
  });

  function deactivateAllNodes() {
    document.querySelectorAll('.node').forEach(node => {
      node.classList.remove('is-active');
    });
  }

  // Handling dragging for an activated node
  document.addEventListener('touchmove', function(e) {
    if (isDragging.value && selectedElement && selectedElement.classList.contains('is-active')) {
    console.log('dragging');
      const touch = e.touches[0];
      const dx = (touch.pageX - startX) / scale.value;
      const dy = (touch.pageY - startY) / scale.value;
      selectedElement.style.left = `${parseInt(selectedElement.style.left, 10) + dx}px`;
      selectedElement.style.top = `${parseInt(selectedElement.style.top, 10) + dy}px`;

      // Update startX and startY for the next move event
      startX = touch.pageX;
      startY = touch.pageY;

      // Call drawEdges to update edge positions based on the new node positions
      drawEdges();

      e.preventDefault(); // Prevent default to avoid scrolling and other touch actions
    }
  }, { passive: false });

  // Determine if dragging should start
  document.addEventListener('touchmove', function(e) {
    if (selectedElement && !isDragging.value) {
      const touch = e.touches[0];
      if (Math.abs(touch.pageX - startX) > 10 || Math.abs(touch.pageY - startY) > 10) {
        isDragging.value = true; // Start dragging if moved beyond threshold
      }
    }
  }, {passive: true});

  // End dragging
  document.addEventListener('touchend', function() {
    if (isDragging.value && selectedElement) {
      selectedElement.classList.remove('is-dragging');
      isDragging.value = false;
      selectedElement = null;
    }
  });
})

function adjustCanvasToViewport() {
  const nodes = document.querySelectorAll('.node')
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity

  nodes.forEach((node) => {
    const nodeElement = node as HTMLDivElement

    const x = parseInt(nodeElement.style.left, 10)
    const y = parseInt(nodeElement.style.top, 10)
    const width = nodeElement.offsetWidth
    const height = nodeElement.offsetHeight

    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x + width)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y + height)
  })

  const boundingBoxWidth = maxX - minX
  const boundingBoxHeight = maxY - minY
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const scaleX = viewportWidth / (boundingBoxWidth + 80)
  const scaleY = viewportHeight / (boundingBoxHeight + 80)

  scale.value = Math.min(scaleX, scaleY, 1) // Ensure the scale is not more than 1
  panOffsetX.value =
    (viewportWidth - boundingBoxWidth * scale.value) / 2 - minX * scale.value
  panOffsetY.value =
    (viewportHeight - boundingBoxHeight * scale.value) / 2 - minY * scale.value
}

function drawEdges() {
  const svgContainer = document.getElementById('edge-paths')!
  svgContainer.innerHTML = '' // Clear existing edges for redraw

  canvasContent.value.edges.forEach((edge) => {
    const fromNode = document.getElementById(edge.fromNode)
    const toNode = document.getElementById(edge.toNode)

    if (fromNode && toNode) {
      const fromPoint = getAnchorPoint(fromNode, edge.fromSide)
      const toPoint = getAnchorPoint(toNode, edge.toSide)

      const curveTightness = 0.75
      const controlPointX1 =
        fromPoint.x + (toPoint.x - fromPoint.x) * curveTightness
      const controlPointX2 =
        fromPoint.x + (toPoint.x - fromPoint.x) * (1 - curveTightness)
      const controlPointY1 = fromPoint.y
      const controlPointY2 = toPoint.y

      const d = `M ${fromPoint.x} ${fromPoint.y} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2}, ${toPoint.x} ${toPoint.y}`

      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      )
      path.setAttribute('d', d)
      path.setAttribute('stroke', 'black')
      path.setAttribute('fill', 'none')
      if (edge.toEnd === 'arrow') {
        path.setAttribute('marker-end', 'url(#arrowhead)')
      }

      svgContainer.appendChild(path)
    }
  })
}

function handleZoomIn() {
  scale.value = Math.min(scale.value + ZOOM_SPEED, MAX_SCALE)
}

function handleZoomOut() {
  scale.value = Math.max(scale.value - ZOOM_SPEED, MIN_SCALE)
}

function handleZoomReset() {
  adjustCanvasToViewport()
}

function handleToggleOutput() {
  isShowOutput.value = !isShowOutput.value
}

function handleCloseOutput() {
  isShowOutput.value = false
}
</script>
