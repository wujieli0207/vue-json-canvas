import { ICanvasContent } from '../lib/types'

export const mockCanvasContent: ICanvasContent = {
  nodes: [
    {
      id: '8132d4d894c80022',
      type: 'file',
      text: `# Markdown Format
# Heading Level1
## Heading Level2
### Heading Level3
#### Heading Level4
##### Heading Level5
###### Heading Level6

Ordered list:
1. test
2. test
3. test

Bullet list:
- test
- test
- test

Code block:
\`\`\`js
const a = 1
console.log(a)
\`\`\`

Link: 
[vue-json-canvas](https://github.com/wujieli0207/vue-json-canvas)

Quote: 
> The real failure is the one who doesn't dare to stand up after a stumber

Table:
| Tables        | Are           | Cool  |
| ---------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
`,
      label: 'Markdown Format',
      x: -280,
      y: -200,
      width: 570,
      height: 1000,
    },
    {
      id: '59e896bc8da20699',
      type: 'text',
      label: 'desc',
      text: 'Learn more:\n\n- More infomation about JSON Canvas, visit [jsoncanvas](https://github.com/obsidianmd/jsoncanvas)\n- [Github](https://github.com/wujieli0207/vue-json-canvas)\n- [About me](https://wujieli.com)',
      x: -280,
      y: -440,
      width: 400,
      height: 180,
      color: '1',
    },
    {
      id: '0ba565e7f30e0652',
      type: 'text',
      text: '# relation',
      label: 'relation',
      x: 560,
      y: -200,
      width: 400,
      height: 400,
      color: '4',
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
