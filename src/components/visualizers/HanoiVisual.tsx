import { useEffect, useRef, useState } from 'react'
import type { HanoiStep, TreeNode } from '../../algorithms/types'
import TreeView from './TreeView'
import styles from './HanoiVisual.module.css'

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

interface HanoiVisualProps {
  step: HanoiStep | null
  disks: number
  tree: { nodes: TreeNode[] }
}

const POLE_NAMES = ['A', 'B', 'C']
const POLE_W = 5
const DISK_H = 20
const DISK_GAP = 3
const BASE_H = 8
const TOP_PAD = 40
const BOTTOM_PAD = 26

export default function HanoiVisual({ step, disks, tree }: HanoiVisualProps) {
  const [ref, { width }] = useMeasure<HTMLDivElement>()

  const poles = step?.poles ?? [
    Array.from({ length: Math.max(disks, 0) }, (_, i) => Math.max(disks, 0) - i),
    [],
    [],
  ]
  const moving = step?.moving ?? null
  const maxDisk = Math.max(disks, 1)

  const boardH = 200
  const poleX = (p: number): number => (width * (p + 1)) / 4
  const baseY = TOP_PAD + boardH
  const diskW = (d: number): number => 14 + (d / maxDisk) * Math.min(width / 4 - 14, 80)

  return (
    <div className={styles.wrap} ref={ref}>
      <div className={styles.labels}>
        {POLE_NAMES.map((n, i) => (
          <span key={n} className={styles.poleLabel} style={{ left: poleX(i) }}>
            {n}
          </span>
        ))}
      </div>
      {width > 0 && (
        <svg width={width} height={boardH + TOP_PAD + BOTTOM_PAD}>
          {/* 底座 */}
          <rect x={8} y={baseY} width={width - 16} height={BASE_H} rx={3} fill="var(--bar-fill)" />
          {/* 柱子 */}
          {POLE_NAMES.map((_, p) => (
            <rect key={p} x={poleX(p) - POLE_W / 2} y={TOP_PAD} width={POLE_W} height={boardH} rx={2} fill="var(--bar-fill-sorted)" />
          ))}
          {/* 圆盘 */}
          {poles.map((stack, p) =>
            stack.map((disk, pos) => {
              const isMoving = moving?.disk === disk && moving.from === p
              const y = baseY - (pos + 1) * (DISK_H + DISK_GAP) - (isMoving ? 18 : 0)
              return (
                <rect
                  key={`${p}-${disk}`}
                  x={poleX(p) - diskW(disk) / 2}
                  y={y}
                  width={diskW(disk)}
                  height={DISK_H}
                  rx={DISK_H / 2}
                  fill={isMoving ? 'var(--accent)' : 'var(--bg-elevated)'}
                  stroke={isMoving ? 'var(--accent-strong)' : 'var(--border-strong)'}
                  strokeWidth={1.5}
                  style={{ transition: 'y 0.3s ease, fill 0.2s ease, x 0.3s ease' }}
                />
              )
            }),
          )}
        </svg>
      )}
      <div className={styles.tree}>
        <TreeView nodes={tree.nodes} />
      </div>
    </div>
  )
}
