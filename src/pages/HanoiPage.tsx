import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import HanoiVisual from '../components/visualizers/HanoiVisual'
import { hanoiSteps, hanoiTree, hanoiCode } from '../algorithms/recursion/hanoi'
import { getAlgorithm } from '../algorithms/registry'
import type { HanoiStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'

const COMPLETION: CompletionInfo = {
  complexity: '时间复杂度 O(2ⁿ)（恰好 2ⁿ − 1 步）；空间 O(n)（递归栈深度）',
  keyPoints: [
    '把大问题拆成三步：n-1 个借助目标柱移到辅助柱 → 移动最大盘 → n-1 个从辅助柱移到目标柱',
    '递归表达：hanoi(n, from, aux, to) = hanoi(n-1, from, to, aux) + 移动盘 + hanoi(n-1, aux, from, to)',
    '步数公式：H(n) = 2H(n-1) + 1 = 2ⁿ - 1',
  ],
  pitfalls: [
    '注意三个参数的顺序：辅助柱与目标柱在递归里会互换，容易写反',
    '大盘压小盘：移动前要保证目标柱顶端盘子更大（递归天然保证）',
    '递归层数与盘数相同，盘太多（>8）会爆栈且步数爆炸',
  ],
}

export default function HanoiPage() {
  const meta = getAlgorithm('hanoi')!
  const [disks, setDisks] = useState(3)
  const steps = useMemo(() => hanoiSteps(disks), [disks])
  const tree = useMemo(() => hanoiTree(disks), [disks])

  return (
    <AlgorithmPage
      meta={meta}
      code={hanoiCode}
      steps={steps}
      completion={COMPLETION}
      extraControls={
        <div className={styles.controls}>
          <label className={styles.label}>圆盘数</label>
          <input
            className={`${styles.input} ${styles.narrow}`}
            type="number"
            min={1}
            max={7}
            value={disks}
            onChange={(e) => setDisks(Math.min(7, Math.max(1, Number(e.target.value) || 1)))}
          />
          <span className={styles.hint}>盘数 1 ~ 7，总步数 2ⁿ − 1</span>
        </div>
      }
      renderVisualizer={(step) => <HanoiVisual step={step as HanoiStep | null} disks={disks} tree={tree} />}
    />
  )
}
