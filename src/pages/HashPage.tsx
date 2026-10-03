import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import HashView from '../components/visualizers/HashView'
import { hashSteps, hashCode, type HashStrategy } from '../algorithms/datastructure/hashtable'
import { getAlgorithm } from '../algorithms/registry'
import type { HashStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'

const COMPLETION: CompletionInfo = {
  complexity: '平均时间复杂度 O(1)（查找/插入），最坏 O(n)（冲突严重时）；空间 O(n)',
  keyPoints: [
    '哈希函数 h(key) = key % 表长，把键直接映射到存储位置',
    '冲突不可避免，两种常见处理：拉链法（桶内链表）、线性探测（向后找空位）',
    'Python 的 dict / set 底层就是哈希表',
  ],
  pitfalls: [
    '负载因子过高会严重退化，需要扩容/再散列',
    '线性探测删除元素不能直接置空，否则会破坏探测链（需标记删除）',
    '哈希函数设计差会导致大量冲突，退化成顺序查找',
  ],
}

export default function HashPage() {
  const meta = getAlgorithm('hashtable')!
  const [strategy, setStrategy] = useState<HashStrategy>('chaining')
  const steps = useMemo(() => hashSteps(strategy), [strategy])

  return (
    <AlgorithmPage
      meta={meta}
      code={hashCode}
      steps={steps}
      completion={COMPLETION}
      extraControls={
        <div className={styles.controls}>
          <span className={styles.label}>冲突处理</span>
          <button className={`${styles.btn} ${strategy === 'chaining' ? styles.btnActive : ''}`} onClick={() => setStrategy('chaining')}>
            拉链法
          </button>
          <button className={`${styles.btn} ${strategy === 'probing' ? styles.btnActive : ''}`} onClick={() => setStrategy('probing')}>
            线性探测
          </button>
        </div>
      }
      renderVisualizer={(step) => <HashView step={step as HashStep | null} />}
    />
  )
}
