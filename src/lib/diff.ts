/**
 * Word-level diff utility using Myers algorithm
 * Zero dependencies — used client-side for redline rendering
 */

export interface DiffSegment {
  type: 'equal' | 'insert' | 'delete'
  value: string
}

/**
 * Split text into words while preserving whitespace and punctuation
 */
function tokenize(text: string): string[] {
  return text.match(/\S+|\s+/g) || []
}

/**
 * Strip HTML tags and decode entities for plain text comparison
 */
export function stripHtml(html: string): string {
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }
  // SSR fallback — basic tag stripping
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}

/**
 * Compute word-level diff between two strings
 * Returns array of segments marking equal, inserted, or deleted words
 */
export function computeWordDiff(oldText: string, newText: string): DiffSegment[] {
  const oldWords = tokenize(oldText)
  const newWords = tokenize(newText)

  const n = oldWords.length
  const m = newWords.length
  const max = n + m

  if (max === 0) return []
  if (n === 0) return [{ type: 'insert', value: newText }]
  if (m === 0) return [{ type: 'delete', value: oldText }]

  // Myers diff — find shortest edit script
  const v: Record<number, number> = { 1: 0 }
  const trace: Record<number, number>[] = []

  outer:
  for (let d = 0; d <= max; d++) {
    const vCopy: Record<number, number> = {}
    for (const key in v) vCopy[Number(key)] = v[Number(key)]
    trace.push(vCopy)

    for (let k = -d; k <= d; k += 2) {
      let x: number
      if (k === -d || (k !== d && (v[k - 1] ?? 0) < (v[k + 1] ?? 0))) {
        x = v[k + 1] ?? 0
      } else {
        x = (v[k - 1] ?? 0) + 1
      }
      let y = x - k

      while (x < n && y < m && oldWords[x] === newWords[y]) {
        x++
        y++
      }

      v[k] = x

      if (x >= n && y >= m) break outer
    }
  }

  // Backtrack to build the diff
  const segments: DiffSegment[] = []
  let x = n
  let y = m

  const edits: Array<{ type: 'equal' | 'insert' | 'delete'; oldIdx?: number; newIdx?: number }> = []

  for (let d = trace.length - 1; d >= 0; d--) {
    const vd = trace[d]
    const k = x - y

    let prevK: number
    if (k === -d || (k !== d && (vd[k - 1] ?? 0) < (vd[k + 1] ?? 0))) {
      prevK = k + 1
    } else {
      prevK = k - 1
    }

    const prevX = vd[prevK] ?? 0
    const prevY = prevX - prevK

    // Add diagonal (equal) moves
    while (x > prevX && y > prevY) {
      x--
      y--
      edits.unshift({ type: 'equal', oldIdx: x, newIdx: y })
    }

    if (d > 0) {
      if (x === prevX) {
        // Insertion
        y--
        edits.unshift({ type: 'insert', newIdx: y })
      } else {
        // Deletion
        x--
        edits.unshift({ type: 'delete', oldIdx: x })
      }
    }
  }

  // Merge consecutive same-type edits into segments
  let currentType: 'equal' | 'insert' | 'delete' | null = null
  let currentValue = ''

  for (const edit of edits) {
    const word = edit.type === 'delete' ? oldWords[edit.oldIdx!] : newWords[edit.newIdx!]

    if (edit.type === currentType) {
      currentValue += word
    } else {
      if (currentType !== null && currentValue) {
        segments.push({ type: currentType, value: currentValue })
      }
      currentType = edit.type
      currentValue = word
    }
  }

  if (currentType !== null && currentValue) {
    segments.push({ type: currentType, value: currentValue })
  }

  return segments
}
