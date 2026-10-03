import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import RecursionVisual from '../components/visualizers/RecursionVisual'
import { factorialSteps, factorialCode } from '../algorithms/recursion/factorial'
import { getAlgorithm } from '../algorithms/registry'
import type { RecursionStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'

const COMPLETION: CompletionInfo = {
  complexity: '时间复杂度 O(n)（n 次递归调用）；空间复杂度 O(n)（递归调用栈深度为 n）',
  keyPoints: [
    '递归三要素：基准情形（n==0 返回 1）、递归式（n! = n×(n-1)!）、递推与回归两个阶段',
    '每一层调用都会在栈上保存自己的参数 n 和返回地址',
    '递推是"往下拆"，回归是"往回收"，答案在回归阶段逐层算出来',
  ],
  pitfalls: [
    '缺少基准情形会导致无限递归、栈溢出',
    '回归阶段的返回值计算容易写错：fact(n) = n × fact(n-1)，不是 n + fact(n-1)',
    '递归深度过大会爆栈，生产环境可用循环（迭代）代替',
  ],
}

export default function FactorialPage() {
  const meta = getAlgorithm('factorial')!
  const [n, setN] = useState(5)
  const steps = useMemo(() => factorialSteps(n), [n])
  const initialTree = useMemo(
    () => ({ nodes: [{ id: `f${n}`, label: `fact(${n})`, parentId: null as string | null, sub: '?' }] }),
    [n],
  )

  return (
    <AlgorithmPage
      meta={meta}
      code={factorialCode}
      steps={steps}
      completion={COMPLETION}
      extraControls={
        <div className={styles.controls}>
          <label className={styles.label}>计算 n!</label>
          <input
            className={`${styles.input} ${styles.narrow}`}
            type="number"
            min={0}
            max={10}
            value={n}
            onChange={(e) => setN(Math.min(10, Math.max(0, Number(e.target.value) || 0)))}
          />
          <span className={styles.hint}>n 取 0 ~ 10</span>
        </div>
      }
      renderVisualizer={(step) => <RecursionVisual step={step as RecursionStep | null} tree={initialTree} />}
    />
  )
}
