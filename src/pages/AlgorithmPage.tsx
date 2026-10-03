import { useState, type ReactNode } from 'react'
import type { AlgoStep } from '../algorithms/types'
import type { AlgoMeta } from '../algorithms/registry'
import { INTROS } from '../content/intros'
import { usePlayer } from '../hooks/usePlayer'
import PlayerBar from '../components/PlayerBar'
import CodePanel from '../components/CodePanel'
import ExplainPanel from '../components/ExplainPanel'
import AlgoIntro from '../components/AlgoIntro'
import styles from './AlgorithmPage.module.css'

export interface CompletionInfo {
  complexity: string
  keyPoints: string[]
  pitfalls: string[]
}

interface AlgorithmPageProps {
  meta: AlgoMeta
  code: string
  steps: AlgoStep[]
  completion: CompletionInfo
  /** 数据自定义等附加控件（显示在画布上方） */
  extraControls?: ReactNode
  /** 渲染可视化画布 */
  renderVisualizer: (step: AlgoStep | null) => ReactNode
}

type Tab = 'code' | 'explain'

export default function AlgorithmPage({ meta, code, steps, completion, extraControls, renderVisualizer }: AlgorithmPageProps) {
  const player = usePlayer(steps)
  const [tab, setTab] = useState<Tab>('explain')
  const step = player.step
  const activeLine = step?.line

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{meta.title}</h1>
          <p className={styles.subtitle}>{meta.desc}</p>
        </div>
      </div>

      <AlgoIntro intro={INTROS[meta.id] ?? []} />

      {extraControls && <div className={styles.controls}>{extraControls}</div>}

      <div className={styles.body}>
        <div className={styles.canvas}>{renderVisualizer(step)}</div>
        <div className={styles.side}>
          <div className={styles.tabs} role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'explain'}
              className={`${styles.tab} ${tab === 'explain' ? styles.tabActive : ''}`}
              onClick={() => setTab('explain')}
            >
              讲解
            </button>
            <button
              role="tab"
              aria-selected={tab === 'code'}
              className={`${styles.tab} ${tab === 'code' ? styles.tabActive : ''}`}
              onClick={() => setTab('code')}
            >
              代码
            </button>
          </div>
          <div className={styles.panel}>
            {tab === 'explain' ? (
              <ExplainPanel desc={step?.desc ?? `点击"播放"或"下一步"开始学习 ${meta.title}。`} done={!!step?.done} completion={completion} />
            ) : (
              <CodePanel code={code} activeLine={activeLine} />
            )}
          </div>
        </div>
      </div>

      <div className={styles.player}>
        <PlayerBar player={player} />
      </div>
    </div>
  )
}
