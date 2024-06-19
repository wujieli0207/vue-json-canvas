import { marked } from 'marked'

// Set options
marked.use({
  async: false,
  pedantic: false,
  gfm: true,
})

export function renderedMarkdown(text: string) {
  // Create a new instance of the marked renderer
  const renderer = new marked.Renderer()

  // Override the link rendering function
  renderer.link = function ({ href, text }) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
  }

  // Use marked to parse the markdown with the custom renderer
  return marked(text, { renderer })
}
