import { useMemo } from 'react'
import type { TreeNode } from '../../algorithms/types'
import styles from './TreeView.module.css'

export interface TreePos {
  x: number
  y: number
}

interface TreeViewProps {
  nodes: TreeNode[]
  /** 当前处理的节点 id */
  activeIds?: readonly string[]
  /** 已完成节点 id */
  doneIds?: readonly string[]
  /** 给节点标访问序号（如二叉树遍历顺序） */
  orderLabel?: Map<string, number>
  /** 节点点击/信息回调（预留） */
  height?: number
}

const NODE_R = 24
const H_SPACE = 60
const V_SPACE = 56
const PAD = 40

export default function TreeView({ nodes, activeIds, doneIds, orderLabel, height }: TreeViewProps) {
  const { pos, width, maxDepth } = useMemo(() => {
    const childrenOf = (id: string): string[] => nodes.filter((n) => n.parentId === id).map((n) => n.id)
    const byId = new Map(nodes.map((n) => [n.id, n]))
    const posMap = new Map<string, TreePos>()
    let leafX = 0
    let maxDepth = 0
    const layout = (id: string, depth: number): number => {
      const kids = childrenOf(id)
      let x: number
      if (kids.length === 0) {
        x = leafX
        leafX++
      } else {
        const xs = kids.map((k) => layout(k, depth + 1))
        x = (Math.min(...xs) + Math.max(...xs)) / 2
      }
      if (depth > maxDepth) maxDepth = depth
      posMap.set(id, { x: x * H_SPACE + PAD, y: depth * V_SPACE + PAD })
      return x
    }
    const roots = nodes.filter((n) => !n.parentId || !byId.has(n.parentId!))
    roots.forEach((r) => layout(r.id, 0))
    const leafCount = nodes.filter((n) => !childrenOf(n.id).length).length
    return { pos: posMap, width: Math.max(leafCount, 1) * H_SPACE + PAD * 2, maxDepth }
  }, [nodes])

  const activeSet = new Set(activeIds ?? [])
  const doneSet = new Set(doneIds ?? [])
  const svgHeight = height ?? maxDepth * V_SPACE + PAD * 2 + NODE_R
  const totalH = Math.max(svgHeight, 200)

  return (
    <div className={styles.scroll}>
      <svg width={Math.max(width, 300)} height={totalH} viewBox={`0 0 ${Math.max(width, 300)} ${totalH}`}>
        {/* 边 */}
        {nodes.map((n) => {
          if (!n.parentId) return null
          const p = pos.get(n.parentId)
          const c = pos.get(n.id)
          if (!p || !c) return null
          return (
            <line
              key={`e-${n.parentId}-${n.id}`}
              x1={p.x}
              y1={p.y + NODE_R}
              x2={c.x}
              y2={c.y - NODE_R}
              stroke="var(--border-strong)"
              strokeWidth={1.5}
            />
          )
        })}
        {/* 节点 */}
        {nodes.map((n) => {
          const p = pos.get(n.id)
          if (!p) return null
          const active = activeSet.has(n.id)
          const done = doneSet.has(n.id)
          const order = orderLabel?.get(n.id)
          return (
            <g key={n.id} transform={`translate(${p.x},${p.y})`}>
              <circle
                r={NODE_R}
                fill={active ? 'var(--accent)' : done ? 'var(--bar-fill-sorted)' : 'var(--bg-elevated)'}
                stroke={active ? 'var(--accent-strong)' : 'var(--border-strong)'}
                strokeWidth={active ? 2.5 : 1.5}
                style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
              />
              <text y={-1} textAnchor="middle" fontSize={12} fontWeight={active ? 700 : 500} fill={active ? '#fff' : 'var(--text)'}>
                {n.label}
              </text>
              {n.sub && (
                <text y={16} textAnchor="middle" fontSize={10} fill={active ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)'}>
                  {n.sub}
                </text>
              )}
              {order !== undefined && (
                <text x={NODE_R - 2} y={-NODE_R + 6} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--accent-strong)">
                  {order}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
