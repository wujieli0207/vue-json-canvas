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

export function prepareForSerialization() {
  document.querySelectorAll('a').forEach((link) => {
    if (link.hasAttribute('target') && link.target === '_blank') {
      link.removeAttribute('target')
      link.removeAttribute('rel')
    }
  })
}
