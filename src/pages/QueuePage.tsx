import { useMemo, useState } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import QueueView from '../components/visualizers/QueueView'
import { queueSteps, queueCode } from '../algorithms/datastructure/queue'
import { getAlgorithm } from '../algorithms/registry'
import type { QueueStep } from '../algorithms/types'
import styles from './BubbleSortPage.module.css'

const COMPLETION: CompletionInfo = {
  complexity: '入队/出队时间复杂度 O(1)；空间 O(容量)',
  keyPoints: [
    '队列是先进先出（FIFO）的结构，队首出、队尾入',
    '队空条件：front == rear；循环队列队满条件：(rear+1) % maxsize == front',
    '循环队列用取模实现 rear/front 回绕，避免"假溢出"',
  ],
  pitfalls: [
    '循环队列会浪费一个存储单元（用来区分队空与队满）',
    '队满时入队失败，要判断 (rear+1) % maxsize == front',
    '线性队列 front 后移导致空间浪费（假溢出），应使用循环队列',
  ],
}

export default function QueuePage() {
  const meta = getAlgorithm('queue')!
  const [circular, setCircular] = useState(false)
  const steps = useMemo(() => queueSteps(circular), [circular])

  return (
    <AlgorithmPage
      meta={meta}
      code={queueCode}
      steps={steps}
      completion={COMPLETION}
      extraControls={
        <div className={styles.controls}>
          <span className={styles.label}>演示模式</span>
          <button className={`${styles.btn} ${!circular ? styles.btnActive : ''}`} onClick={() => setCircular(false)}>
            线性队列
          </button>
          <button className={`${styles.btn} ${circular ? styles.btnActive : ''}`} onClick={() => setCircular(true)}>
            循环队列
          </button>
        </div>
      }
      renderVisualizer={(step) => <QueueView step={step as QueueStep | null} />}
    />
  )
}
