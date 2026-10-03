import { useEffect, useRef, useState } from 'react'
import type { SearchStep } from '../../algorithms/types'
import styles from './SearchChart.module.css'

function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      setSize({ width: r.width, height: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

interface SearchChartProps {
  data: readonly number[]
  step?: SearchStep | null
}

export default function SearchChart({ data, step }: SearchChartProps) {
  const [ref, { width }] = useMeasure<HTMLDivElement>()

  const arr = step ? step.arr : data
  const target = step?.target ?? -1
  const n = arr.length
  const cellW = Math.min(Math.max(width / n - 6, 28), 72)
  const range = step?.range ?? null

  const current = step?.current ?? null
  const left = step?.left ?? null
  const right = step?.right ?? null
  const mid = step?.mid ?? null
  const found = step?.found ?? false

  const rangeX = range ? range[0] * (cellW + 6) : 0
  const rangeW = range ? (range[1] - range[0] + 1) * (cellW + 6) - 6 : 0

  const pointerLabel = (idx: number): { text: string; color: string } => {
    if (idx === mid) return { text: 'mid', color: 'var(--accent)' }
    if (idx === left) return { text: 'left', color: 'var(--accent-strong)' }
    if (idx === right) return { text: 'right', color: 'var(--text-muted)' }
    if (idx === current) return { text: 'i', color: 'var(--accent)' }
    return { text: '', color: '' }
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <div className={styles.targetRow}>
        <span className={styles.targetLabel}>查找目标 target =</span>
        <span className={styles.targetValue}>{target}</span>
      </div>
      {width > 0 && n > 0 && (
        <div className={styles.board}>
          <div className={styles.rangeMask} style={{ left: rangeX, width: rangeW }} />
          <div className={styles.cells}>
            {arr.map((v, i) => {
              const pl = pointerLabel(i)
              const isFound = found && mid === i
              const isRange = range && i >= range[0] && i <= range[1]
              const involved = current === i || left === i || right === i || mid === i
              return (
                <div key={i} className={styles.col} style={{ width: cellW }}>
                  <div
                    className={`${styles.cell} ${isFound ? styles.cellFound : ''} ${
                      involved ? styles.cellInvolved : ''
                    } ${isRange && !involved ? styles.cellRange : ''}`}
                  >
                    {v}
                  </div>
                  <div className={styles.pointerRow}>
                    {pl.text ? (
                      <span className={styles.pointer} style={{ color: pl.color }}>
                        {pl.text}
                      </span>
                    ) : (
                      <span />
                    )}
                  </div>
                  <div className={styles.index}>{i}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
