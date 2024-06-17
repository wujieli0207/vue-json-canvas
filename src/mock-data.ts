import { ICanvasContent } from './types'

export const mockData: ICanvasContent = {
  nodes: [
    {
      id: '754a8ef995f366bc',
      type: 'group',
      text: 'JSON Canvas',
      x: -300,
      y: -460,
      width: 610,
      height: 200,
    },
    {
      id: '8132d4d894c80022',
      type: 'file',
      text: 'readme.md',
      x: -280,
      y: -200,
      width: 570,
      height: 560,
      color: '6',
    },
    {
      id: '7efdbbe0c4742315',
      type: 'file',
      text: '_site/logo.svg',
      x: -280,
      y: -440,
      width: 217,
      height: 80,
    },
    {
      id: '59e896bc8da20699',
      type: 'text',
      text: 'Learn more:\n\n- [Apps](/docs/apps.md)\n- [Spec](spec/1.0.md)\n- [Github](https://github.com/obsidianmd/jsoncanvas)',
      x: 40,
      y: -440,
      width: 250,
      height: 160,
    },
    {
      id: '0ba565e7f30e0652',
      type: 'file',
      text: 'spec/1.0.md',
      x: 360,
      y: -400,
      width: 400,
      height: 400,
    },
  ],
  edges: [
    {
      id: '6fa11ab87f90b8af',
      fromNode: '7efdbbe0c4742315',
      fromSide: 'right',
      toNode: '59e896bc8da20699',
      toSide: 'left',
    },
  ],
}
