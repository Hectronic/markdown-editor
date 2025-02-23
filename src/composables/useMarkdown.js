// src/composables/useMarkdown.js
import { marked } from 'marked'

export default function useMarkdown(markdownText) {
  return marked.parse(markdownText)
}
