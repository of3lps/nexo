import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target']
  })
}

export function sanitizeText(text: string): string {
  return text.replace(/[<>]/g, '').trim()
}