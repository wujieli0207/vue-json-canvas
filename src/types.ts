export type Direction = 'left' | 'right' | 'top' | 'bottom' // 节点连接方向
export type MarkerType = 'none' | 'arrow'

enum ColorEnum {
  RED = '#ef4444',
  ORANGE = '#f97316',
  YELLOW = '#eab308',
  GREEN = '#22c55e',
  CYAN = '#06b6d4',
  PURPLE = '#a855f7',
}

export const Colors = {
  '1': ColorEnum.RED,
  '2': ColorEnum.ORANGE,
  '3': ColorEnum.YELLOW,
  '4': ColorEnum.GREEN,
  '5': ColorEnum.CYAN,
  '6': ColorEnum.PURPLE,
}

export interface INode {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  label?: string
  text?: string
  color?: keyof typeof Colors
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
