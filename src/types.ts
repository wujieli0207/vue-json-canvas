export type Direction = 'left' | 'right' | 'top' | 'bottom' // 节点连接方向
export type MarkerType = 'none' | 'arrow'

export interface INode {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  label?: string
  text?: string
  color?: string
}

export interface IEdge {
  id: string
  fromNode: string
  fromSide: Direction
  fromEnd?: MarkerType
  toNode: string
  toSide: Direction
  toEnd?: MarkerType
  label?: string
}

export interface ICanvasContent {
  nodes: INode[]
  edges: IEdge[]
}
