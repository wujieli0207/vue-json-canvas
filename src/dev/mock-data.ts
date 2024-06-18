import { ICanvasContent } from '../lib/types'

export const mockCanvasContent: ICanvasContent = {
  nodes: [
    {
      id: '8132d4d894c80022',
      type: 'file',
      text: '## readme.md  \n 1. test \n 2. test \n 3. test',
      label: 'readme.md',
      x: -280,
      y: -200,
      width: 570,
      height: 560,
      color: '1',
    },
    {
      id: '59e896bc8da20699',
      type: 'text',
      label: 'desc',
      text: 'Learn more:\n\n- [Apps](/docs/apps.md)\n- [Spec](spec/1.0.md)\n- [Github](https://github.com/obsidianmd/jsoncanvas)',
      x: -280,
      y: -440,
      width: 217,
      height: 180,
    },
    {
      id: '0ba565e7f30e0652',
      type: 'file',
      text: '## spec/1.0.md',
      label: 'spec/1.0.md',
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
      toEnd: 'arrow',
    },
    {
      id: 'edge-readme-spec',
      fromNode: '8132d4d894c80022',
      fromSide: 'right',
      fromEnd: 'none',
      toNode: '0ba565e7f30e0652',
      toSide: 'left',
      toEnd: 'arrow',
    },
  ],
}
