import { useState, type ReactNode } from 'react'
import type { AlgorithmIntro, IntroBlock } from '../content/intros'
import styles from './AlgoIntro.module.css'

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function Block({ block }: { block: IntroBlock }): ReactNode {
  return (
    <div className={styles.block}>
      {block.heading && <h4 className={styles.heading}>{block.heading}</h4>}
      {block.text && <p className={styles.text}>{block.text}</p>}
      {block.formula && <div className={styles.formula}>{block.formula}</div>}
      {block.bullets && (
        <ul className={styles.list}>
          {block.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      {block.steps && (
        <ol className={styles.steps}>
          {block.steps.map((s, i) => (
            <li key={i}>
              <span className={styles.stepName}>{s.name}：</span>
              <span className={styles.stepDetail}>{s.detail}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

interface AlgoIntroProps {
  intro: AlgorithmIntro
}

export default function AlgoIntro({ intro }: AlgoIntroProps) {
  const [open, setOpen] = useState(false)

  if (intro.length === 0) return null

  return (
    <div className={`${styles.wrap} ${open ? styles.wrapOpen : ''}`}>
      <button className={styles.header} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className={styles.headerTitle}>算法原理详解</span>
        <span className={styles.headerHint}>{open ? '点击收起' : '点击展开'}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className={styles.body}>
          {intro.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>
      )}
    </div>
  )
}
