export type Direction = 'left' | 'right' | 'top' | 'bottom' // 节点连接方向

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
  fromSide?: Direction
  toNode: string
  toSide?: Direction
  label?: string
}

export interface ICanvasContent {
  nodes: INode[]
  edges: IEdge[]
}
