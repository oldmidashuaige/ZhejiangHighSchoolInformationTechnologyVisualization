import { useEffect, useRef, useState } from 'react'
import type { SortStep } from '../../algorithms/types'
import styles from './BarChart.module.css'

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

interface BarChartProps {
  /** 当前要绘制的数据（重置/初始时无高亮） */
  data: readonly number[]
  /** 当前步骤（含高亮与柱子 id 信息），可为空 */
  step?: SortStep | null
}

const TOP_PAD = 28
const BOTTOM_PAD = 24
const SWAP_MS = 280

export default function BarChart({ data, step }: BarChartProps) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>()

  // 有步骤时渲染步骤快照（arr/keys），否则渲染初始 data（重置/初始态）
  const arr = step ? step.arr : data
  const n = arr.length
  const max = Math.max(...arr.filter((v): v is number => v !== null), 1)

  const slotW = n > 0 ? width / n : 0
  const barW = Math.min(Math.max(slotW * 0.55, 6), 64)
  const chartH = Math.max(height - TOP_PAD - BOTTOM_PAD, 10)
  const baseY = height - BOTTOM_PAD

  // 柱子稳定身份：有步骤时用步骤里的 keys（随值移动），否则用自然顺序
  const keys = step ? step.keys : arr.map((_, i) => i)

  const sorted = step?.sorted ?? []
  const compare = step?.compare ?? null
  const swap = step?.swap ?? null
  const active = step?.active ?? null
  const range = step?.range ?? null

  const fillFor = (i: number): string => {
    if (swap && (swap[0] === i || swap[1] === i)) return 'var(--accent-strong)'
    if (compare && (compare[0] === i || compare[1] === i)) return 'var(--accent)'
    if (sorted.includes(i)) return 'var(--bar-fill-sorted)'
    return 'var(--bar-fill)'
  }

  const isHighlighted = (i: number): boolean =>
    (compare !== null && (compare[0] === i || compare[1] === i)) ||
    (swap !== null && (swap[0] === i || swap[1] === i)) ||
    sorted.includes(i)

  const rangeX = range ? Math.max(range[0], 0) * slotW : 0
  const rangeW = range ? Math.max(range[1] - range[0] + 1, 0) * slotW : 0

  return (
    <div className={styles.wrap} ref={ref}>
      {width > 0 && n > 0 && (
        <svg width={width} height={height} role="img" aria-label="算法可视化柱状图">
          {/* 当前扫描区间底色 */}
          {range && <rect x={rangeX} y={0} width={rangeW} height={chartH} fill="var(--chart-grid)" />}

          {/* 基线 */}
          <line x1={0} y1={baseY} x2={width} y2={baseY} stroke="var(--border-strong)" strokeWidth={1.5} />

          {/* 插入排序：被提取出来浮起的 key 元素 */}
          {step?.key !== undefined && step.key !== null && (
            <g transform={`translate(${width / 2}, 4)`}>
              <rect x={-34} y={-2} width={68} height={22} rx={6} fill="var(--accent)" />
              <text y={13} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">
                key = {step.key}
              </text>
            </g>
          )}

          {/* 柱子：按稳定 id 渲染，id 随值移动；位置用 transform，交换时整根柱子滑动到新槽位 */}
          {arr.map((v, i) => {
            if (v === null) {
              const centerX = i * slotW + slotW / 2
              // 空槽位：显示淡淡的占位框
              return (
                <g key={`hole-${i}`} style={{ transform: `translateX(${centerX}px)` }}>
                  <rect x={-barW / 2} y={baseY - 6} width={barW} height={6} rx={2} fill="var(--border)" strokeDasharray="3 2" stroke="var(--border-strong)" />
                </g>
              )
            }
            const h = Math.max((v / max) * chartH, 2)
            const y = baseY - h
            const centerX = i * slotW + slotW / 2
            const involved = (compare && (compare[0] === i || compare[1] === i)) ||
              (swap && (swap[0] === i || swap[1] === i))
            return (
              <g
                key={keys[i]}
                style={{
                  transform: `translateX(${centerX}px)`,
                  transition: `transform ${SWAP_MS}ms ease`,
                }}
              >
                {/* 柱子 */}
                <rect
                  x={-barW / 2}
                  y={y}
                  width={barW}
                  height={h}
                  rx={3}
                  fill={fillFor(i)}
                  stroke={isHighlighted(i) ? 'var(--accent-strong)' : 'var(--bar-stroke)'}
                  strokeWidth={active === i ? 2.5 : 1}
                  strokeDasharray={active === i ? '4 2' : undefined}
                  style={{ transition: 'y 0.2s ease, height 0.2s ease, fill 0.2s ease' }}
                />
                {/* 柱顶数值（随柱子一起移动） */}
                <text
                  x={0}
                  y={y - 7}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={involved ? 700 : 500}
                  fill={involved ? 'var(--accent-strong)' : 'var(--text-muted)'}
                >
                  {v}
                </text>
                {/* 比较/交换标记箭头（随柱子移动） */}
                {involved && <polygon points={`0,${y - 15} -4,${y - 21} 4,${y - 21}`} fill="var(--accent)" />}
              </g>
            )
          })}

          {/* 下标（位置固定） */}
          {arr.map((_, i) => {
            const centerX = i * slotW + slotW / 2
            return (
              <text key={`idx-${i}`} x={centerX} y={height - 8} textAnchor="middle" fontSize={11} fill="var(--text-faint)">
                {i}
              </text>
            )
          })}
        </svg>
      )}
    </div>
  )
}
