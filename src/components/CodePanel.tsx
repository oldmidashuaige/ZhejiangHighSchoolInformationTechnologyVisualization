import type { ReactNode } from 'react'
import styles from './CodePanel.module.css'

// 轻量 Python 语法高亮：注释 / 字符串 / 关键字 / 数字 / 内置函数
const TOKEN_RE =
  /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b(?:def|return|for|while|if|elif|else|in|and|or|not|break|continue|True|False|None)\b)|(\b(?:range|print|len|input|int|str|float|abs|min|max|sorted|append|pop|extend|insert|remove|ord|chr)\b)|(\b\d+(?:\.\d+)?\b)/gm

function highlight(line: string, key: number): ReactNode {
  const nodes: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  TOKEN_RE.lastIndex = 0
  let i = 0
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m.index > last) nodes.push(line.slice(last, m.index))
    const token = m[0]
    const cls = m[1] ? 'comment' : m[2] ? 'string' : m[3] ? 'keyword' : m[4] ? 'builtin' : 'number'
    nodes.push(
      <span key={key + '-' + i} className={styles[cls]}>
        {token}
      </span>,
    )
    i++
    last = m.index + token.length
  }
  if (last < line.length) nodes.push(line.slice(last))
  return nodes
}

interface CodePanelProps {
  code: string
  /** 当前高亮的行号（1 起） */
  activeLine?: number
}

export default function CodePanel({ code, activeLine }: CodePanelProps) {
  const lines = code.split('\n')

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Python 代码</span>
        {activeLine !== undefined && activeLine > 0 && (
          <span className={styles.lineTag}>第 {activeLine} 行</span>
        )}
      </div>
      <div className={styles.code}>
        {lines.map((line, idx) => {
          const lineNo = idx + 1
          const active = activeLine === lineNo
          return (
            <div key={lineNo} className={`${styles.row} ${active ? styles.rowActive : ''}`}>
              <span className={styles.gutter}>{lineNo}</span>
              <code className={styles.line}>{highlight(line, lineNo)}</code>
            </div>
          )
        })}
      </div>
    </div>
  )
}
