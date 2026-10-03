import { useEffect, useRef, useState } from 'react'
import type { QueueStep } from '../../algorithms/types'
import styles from './QueueView.module.css'

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

interface QueueViewProps {
  step: QueueStep | null
}

export default function QueueView({ step }: QueueViewProps) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>()
  const circular = step?.circular ?? false
  const arr = step?.arr ?? []
  const front = step?.front ?? 0
  const rear = step?.rear ?? 0
  const op = step?.op
  const lastValue = step?.value ?? null
  const n = arr.length

  // 圆形布局
  const R = Math.max(Math.min(width / 2 - 60, height / 2 - 40), 60)
  const cx = width / 2
  const cy = height / 2 + 6
  const angle = (i: number) => (Math.PI / 2) * 3 + (i * 2 * Math.PI) / n

  return (
    <div className={styles.wrap} ref={ref}>
      <div className={styles.statusBar}>
        <span>队首 front = {front}</span>
        <span>队尾 rear = {rear}</span>
        <span>元素个数 size = {step?.size ?? 0}</span>
        {op === 'full' && <span className={styles.warn}>队满</span>}
        {op === 'empty' && <span className={styles.warn}>队空</span>}
      </div>

      {!circular ? (
        <div className={styles.linear}>
          {arr.map((v, i) => (
            <div key={i} className={styles.linearCol} style={{ width: `${100 / n}%` }}>
              <div
                className={`${styles.linearCell} ${
                  v !== null ? styles.cellFilled : ''
                } ${front === i ? styles.cellFront : ''} ${rear === i ? styles.cellRear : ''}`}
              >
                {v ?? ''}
              </div>
              <div className={styles.linearMarker}>{front === i ? 'front↑' : rear === i ? 'rear↑' : ''}</div>
              <div className={styles.linearIndex}>{i}</div>
            </div>
          ))}
        </div>
      ) : (
        <svg width={width} height={height} className={styles.ring}>
          {arr.map((v, i) => {
            const a = angle(i)
            const x = cx + R * Math.cos(a)
            const y = cy + R * Math.sin(a)
            const isFront = front === i
            const isRear = rear === i
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={26}
                  fill={v !== null ? 'var(--bg-elevated)' : 'transparent'}
                  stroke={isFront ? 'var(--accent)' : isRear ? 'var(--accent-strong)' : 'var(--border-strong)'}
                  strokeWidth={isFront || isRear ? 3 : 1.5}
                />
                <text x={x} y={y + 5} textAnchor="middle" fontSize={14} fontWeight={v !== null ? 700 : 400} fill={v !== null ? 'var(--text)' : 'var(--text-faint)'}>
                  {v ?? ''}
                </text>
                <text x={x} y={y - 34} textAnchor="middle" fontSize={11} fill={isFront ? 'var(--accent)' : isRear ? 'var(--accent-strong)' : 'transparent'}>
                  {isFront ? 'front' : isRear ? 'rear' : ''}
                </text>
              </g>
            )
          })}
          <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} fill="var(--text-muted)">
            {n} 个槽位
          </text>
        </svg>
      )}

      <div className={styles.opNote}>
        {op === 'enqueue' && `刚刚入队：${lastValue}（存入 rear 位置，rear 后移）`}
        {op === 'dequeue' && `刚刚出队：${lastValue}（取出 front 位置，front 后移）`}
        {op === 'full' && `入队 ${lastValue} 失败：队满`}
        {op === 'empty' && `出队失败：队空`}
        {op === 'init' && '空队列'}
      </div>
    </div>
  )
}
