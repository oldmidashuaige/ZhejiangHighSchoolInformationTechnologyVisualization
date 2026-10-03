import { useMemo } from 'react'
import AlgorithmPage, { type CompletionInfo } from './AlgorithmPage'
import SqlView from '../components/visualizers/SqlView'
import { sqlSteps, sqlCode } from '../algorithms/others/sql'
import { getAlgorithm } from '../algorithms/registry'
import type { SqlStep } from '../algorithms/types'

const COMPLETION: CompletionInfo = {
  complexity: 'SELECT 结果与表大小相关；WHERE 一般需遍历（O(n)），有索引可加速',
  keyPoints: [
    'SQL 执行顺序：FROM → WHERE → SELECT → ORDER BY（写法的顺序 ≠ 执行顺序）',
    'SELECT 决定输出哪些列，WHERE 决定保留哪些行',
    'ORDER BY DESC 降序、ASC 升序',
    '浙江选考常与 pandas 结合考查数据筛选与排序',
  ],
  pitfalls: [
    '字符串比较大小用 >、<、=，字符串用单引号',
    'WHERE 不能使用 SELECT 中定义的别名',
    'ORDER BY 放在 WHERE 之后',
    '比较分数注意数据类型（数值 vs 字符串）',
  ],
}

export default function SqlPage() {
  const meta = getAlgorithm('sql')!
  const steps = useMemo(() => sqlSteps(), [])

  return (
    <AlgorithmPage
      meta={meta}
      code={sqlCode}
      steps={steps}
      completion={COMPLETION}
      renderVisualizer={(step) => <SqlView step={step as SqlStep | null} />}
    />
  )
}
