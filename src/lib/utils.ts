import { Direction } from './types'

// Very simplified Markdown conversion
export function htmlToMarkdown(html: string) {
  let markdown = html.replace(/<br\s*[\/]?>/gi, '\n')
  markdown = markdown.replace(/<a href="([^"]+)">([^<]+)<\/a>/gi, '[$2]($1)')
  markdown = markdown
    .replace(/<ul>/gi, '\n\n')
    .replace(/<\/ul>/gi, '\n\n')
    .replace(/<li>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
  markdown = markdown.replace(/<[^>]+>/g, '')
  markdown = markdown.replace(/\n\s*-\s+/g, '\n- ')
  markdown = markdown.trim().replace(/\n{3,}/g, '\n\n')
  return markdown
}

export function getAnchorPoint(node: HTMLElement, side: Direction) {
  const x = parseInt(node.style.left, 10)
  const y = parseInt(node.style.top, 10)
  const width = node.offsetWidth
  const height = node.offsetHeight

  switch (side) {
    case 'top':
      return { x: x + width / 2, y: y }
    case 'right':
      return { x: x + width, y: y + height / 2 }
    case 'bottom':
      return { x: x + width / 2, y: y + height }
    case 'left':
      return { x: x, y: y + height / 2 }
    default: // center or unspecified case
      return { x: x + width / 2, y: y + height / 2 }
  }
}
