import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import RecursionVisual from '../components/visualizers/RecursionVisual'
import { fibonacciSteps, fibonacciCode } from '../algorithms/recursion/fibonacci'
import { getAlgorithm } from '../algorithms/registry'
import type { RecursionStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'
import fibStyles from './FibonacciPage.module.css'

const COMPLETION: CompletionInfo = {
  complexity: '递归版时间复杂度 O(2ⁿ)，空间 O(n)；迭代版 O(n)、O(1)',
  keyPoints: [
    'fib(x) 表示斐波那契数列的第 x 项：0, 1, 1, 2, 3, 5, 8, 13, …',
    '基准情形 fib(0)=0、fib(1)=1；递归式 fib(n)=fib(n-1)+fib(n-2)',
    '大量子问题被重复计算（可观察树中同标签节点数量），可用迭代/记忆化优化',
  ],
  pitfalls: [
    'fib(n-1) + fib(n-2) 是相加不是相乘',
    '基准情形是 n<=1 返回 n，不是返回 1',
    'n 稍大（>30）递归就非常慢，这是递归性能问题的经典例子',
  ],
}

export default function FibonacciPage() {
  const meta = getAlgorithm('fibonacci')!
  const [n, setN] = useState(6)
  const steps = useMemo(() => fibonacciSteps(n), [n])
  const initialTree = useMemo(
    () => ({ nodes: [{ id: `fib-root`, label: `fib(${n})`, parentId: null as string | null, sub: '?' }] }),
    [n],
  )

  return (
    <AlgorithmPage
      meta={meta}
      code={fibonacciCode}
      steps={steps}
      completion={COMPLETION}
      extraControls={
        <div className={styles.controls}>
          <label className={styles.label}>计算第 n 项</label>
          <input
            className={`${styles.input} ${styles.narrow}`}
            type="number"
            min={1}
            max={8}
            value={n}
            onChange={(e) => setN(Math.min(8, Math.max(1, Number(e.target.value) || 1)))}
          />
          <span className={styles.hint}>n 取 1 ~ 8（递归树节点数会指数增长）</span>
        </div>
      }
      renderVisualizer={(step) => (
        <div className={fibStyles.visual}>
          <div className={fibStyles.def}>
            <div className={fibStyles.defTitle}>fib(x) 是什么？</div>
            <div className={fibStyles.defGrid}>
              <div className={fibStyles.defItem}>
                <code>fib(0) = 0</code>
                <span>基准情形</span>
              </div>
              <div className={fibStyles.defItem}>
                <code>fib(1) = 1</code>
                <span>基准情形</span>
              </div>
              <div className={fibStyles.defItem}>
                <code>fib(n) = fib(n-1) + fib(n-2)</code>
                <span>递归式（n ≥ 2）</span>
              </div>
            </div>
            <div className={fibStyles.defNote}>
              fib(x) 表示斐波那契数列的第 x 项：<strong>0, 1, 1, 2, 3, 5, 8, 13, 21, …</strong>
            </div>
          </div>
          <div className={fibStyles.body}>
            <RecursionVisual step={step as RecursionStep | null} tree={initialTree} />
          </div>
        </div>
      )}
    />
  )
}
