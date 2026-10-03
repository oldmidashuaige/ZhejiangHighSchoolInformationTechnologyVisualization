import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import GreedyView from '../components/visualizers/GreedyView'
import { greedySteps, greedyCode, DEFAULT_GREEDY } from '../algorithms/others/greedy'
import { getAlgorithm } from '../algorithms/registry'
import type { GreedyStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'

const COMPLETION: CompletionInfo = {
  complexity: '贪心一般 O(n log n)（排序面额后 O(n) 次尝试）',
  keyPoints: [
    '贪心策略：每一步都做当前看起来最优的选择（局部最优）',
    '局部最优不一定等于全局最优 —— 必须验证',
    '经典反例：面额 [1,4,6] 找 8 元，贪心得 3 枚，最优只要 2 枚（4+4）',
  ],
  pitfalls: [
    '贪心算法要证明正确性（贪心选择性质 + 最优子结构），不是所有问题都适用',
    '找零在人民币面额下贪心成立，但换一套面额就可能失败',
    '不能只记"贪心=每次都最大"，要理解它的适用条件',
  ],
}

export default function GreedyPage() {
  const meta = getAlgorithm('greedy')!
  const [coinsInput, setCoinsInput] = useState(DEFAULT_GREEDY.coins.join(','))
  const [amountInput, setAmountInput] = useState(String(DEFAULT_GREEDY.amount))
  const [counterExample, setCounterExample] = useState(true)

  const coins = useMemo(
    () =>
      coinsInput
        .split(/[,，\s]+/)
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isInteger(n) && n > 0),
    [coinsInput],
  )
  const amount = Number(amountInput) || 0
  const steps = useMemo(() => greedySteps(coins, amount, counterExample), [coins, amount, counterExample])

  return (
    <AlgorithmPage
      meta={meta}
      code={greedyCode}
      steps={steps}
      completion={COMPLETION}
      extraControls={
        <div className={styles.controls}>
          <label className={styles.label}>面额</label>
          <input className={styles.input} value={coinsInput} onChange={(e) => setCoinsInput(e.target.value)} placeholder="如 1,4,6" />
          <label className={styles.label}>金额</label>
          <input
            className={`${styles.input} ${styles.narrow}`}
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
          />
          <span className={styles.label}>反例演示</span>
          <button className={`${styles.btn} ${counterExample ? styles.btnActive : ''}`} onClick={() => setCounterExample(true)}>
            开
          </button>
          <button className={`${styles.btn} ${!counterExample ? styles.btnActive : ''}`} onClick={() => setCounterExample(false)}>
            关
          </button>
        </div>
      }
      renderVisualizer={(step) => <GreedyView step={step as GreedyStep | null} />}
    />
  )
}
