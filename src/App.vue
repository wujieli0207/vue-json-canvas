<template>
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CanvasNode from './components/CanvasNode.vue'
import { ICanvasContent } from './types'
import { mockData } from './mock-data'
import { getAnchorPoint } from './utils'
import { MAX_SCALE, MIN_SCALE, ZOOM_SPEED } from './config'

let scale = 1
let panOffsetX = 0
let panOffsetY = 0
let selectedElement: HTMLElement | null = null

let isDragging = false
let isSpacePressed = false
let isPanning = false

let startX = 0
let startY = 0
let panStartX = 0
let panStartY = 0

const canvasContent = ref<ICanvasContent>(mockData)

const isShowOutput = ref(false)

onMounted(() => {
  adjustCanvasToViewport()
  drawEdges()

  // Zoom
  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.deltaY > 0) {
          scale = Math.max(scale - ZOOM_SPEED, MIN_SCALE)
        } else {
          scale = Math.min(scale + ZOOM_SPEED, MAX_SCALE)
        }

        document.body.style.setProperty('--scale', scale.toString())
        e.preventDefault()
      }
    },
    { passive: false }
  )

  // ===== Drag nodes ======
  document.querySelectorAll('.node .node-name').forEach((nodeName) => {
    nodeName.addEventListener('mousedown', function (e) {
      if (isSpacePressed) return

      const event = e as MouseEvent

      isDragging = true
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
    if (!isDragging || !selectedElement) return

    const dx = (e.clientX - startX) / scale
    const dy = (e.clientY - startY) / scale

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
    if (isDragging && selectedElement) {
      selectedElement.classList.remove('is-dragging')
      isDragging = false
      selectedElement = null
      drawEdges()
    }
  })

  // ===== Drag nodes ======

  // ===== Panning ======
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
      e.preventDefault()
      isSpacePressed = true
      document.body.classList.add('will-pan')
    }
  })

  window.addEventListener('keyup', function (e) {
    if (e.code === 'Space') {
      isSpacePressed = false
      document.body.classList.remove('will-pan')
    }
  })

  window.addEventListener('mousedown', function (e) {
    if (isSpacePressed && !isDragging) {
      isPanning = true
      document.body.style.cursor = 'grabbing'
      panStartX = e.clientX - panOffsetX
      panStartY = e.clientY - panOffsetY
    }
  })

  window.addEventListener('mousemove', function (e) {
    if (isPanning) {
      panOffsetX = e.clientX - panStartX
      panOffsetY = e.clientY - panStartY

      document.body.style.setProperty('--pan-x', `${panOffsetX}px`)
      document.body.style.setProperty('--pan-y', `${panOffsetY}px`)
    }
  })

  window.addEventListener('mouseup', function () {
    if (isPanning) {
      isPanning = false
      document.body.style.cursor = ''
    }
  })

  // ===== Panning ======
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
  scale = Math.min(scaleX, scaleY, 1) // Ensure the scale is not more than 1

  panOffsetX = (viewportWidth - boundingBoxWidth * scale) / 2 - minX * scale
  panOffsetY = (viewportHeight - boundingBoxHeight * scale) / 2 - minY * scale

  // Apply the calculated scale and pan offsets
  applyPanAndZoom()
}

function applyPanAndZoom() {
  document.body.style.setProperty('--scale', scale.toString())
  document.body.style.setProperty('--pan-x', `${panOffsetX}px`)
  document.body.style.setProperty('--pan-y', `${panOffsetY}px`)
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
  scale = Math.min(scale + ZOOM_SPEED, MAX_SCALE)
  document.body.style.setProperty('--scale', scale.toString())
}

function handleZoomOut() {
  scale = Math.max(scale - ZOOM_SPEED, MIN_SCALE)
  document.body.style.setProperty('--scale', scale.toString())
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
