// SQL 数据查询：SELECT / WHERE / ORDER BY 可视化
import type { SqlStep } from '../types'

const COLUMNS = ['学号', '姓名', '班级', '语文', '数学', '英语', '总分']

const ROWS: (string | number)[][] = [
  ['101', '张三', '高一(1)', 92, 88, 95, 275],
  ['102', '李四', '高一(2)', 78, 96, 82, 256],
  ['103', '王五', '高一(1)', 85, 91, 88, 264],
  ['104', '赵六', '高一(1)', 66, 72, 70, 208],
  ['105', '孙七', '高一(2)', 90, 98, 93, 281],
  ['106', '周八', '高一(2)', 73, 60, 77, 210],
]

// SELECT 姓名, 数学 FROM 成绩表 WHERE 班级='高一(1)' AND 数学>=90 ORDER BY 数学 DESC
const SELECTED = [1, 4]
const WHERE = (row: (string | number)[]) => row[2] === '高一(1)' && Number(row[4]) >= 90

export function sqlSteps(): SqlStep[] {
  const steps: SqlStep[] = []
  const filtered: number[] = []

  const record = (patch: {
    desc: string
    checking?: number | null
    filtered?: number[]
    order?: number[]
    result?: (string | number)[][]
    done?: boolean
  }): void => {
    steps.push({
      columns: COLUMNS,
      rows: ROWS.map((r) => [...r]),
      selectedCols: SELECTED,
      filtered: patch.filtered ? [...patch.filtered] : [...filtered],
      checking: patch.checking ?? null,
      order: patch.order ? [...patch.order] : null,
      result: patch.result ? patch.result.map((r) => [...r]) : null,
      desc: patch.desc,
      done: patch.done,
    })
  }

  record({
    desc: '成绩表（共 6 行记录）。执行查询：SELECT 姓名, 数学 FROM 成绩表 WHERE 班级=\'高一(1)\' AND 数学>=90 ORDER BY 数学 DESC',
  })

  // 1) SELECT 列
  record({ desc: `第一步 SELECT：只显示"姓名"和"数学"两列（高亮列）` })

  // 2) WHERE 逐行判断
  for (let i = 0; i < ROWS.length; i++) {
    const row = ROWS[i]
    const match = WHERE(row)
    if (match) filtered.push(i)
    record({
      desc: `第二步 WHERE：逐行判断第 ${i + 1} 行（${row[1]}，班级 ${row[2]}，数学 ${row[4]}）—— 班级='高一(1)' 且 数学>=90：${match ? '满足，加入结果' : '不满足，排除'}`,
      checking: i,
      filtered,
    })
  }

  // 3) ORDER BY
  const order = [...filtered].sort((a, b) => Number(ROWS[b][4]) - Number(ROWS[a][4]))
  record({
    desc: `第三步 ORDER BY：对结果按数学降序排序 → ${order.map((i) => ROWS[i][1]).join('、')}`,
    order,
  })

  // 4) 结果
  const result = order.map((i) => [ROWS[i][1], ROWS[i][4]])
  record({
    desc: `查询完成，结果 ${result.length} 行：${result.map((r) => `${r[0]}(${r[1]}分)`).join('、')}`,
    result,
    done: true,
  })

  return steps
}

export const sqlCode = `-- 查询：高一(1)班 数学 90 分以上学生，按数学降序
SELECT 姓名, 数学          -- 1 选择列
FROM 成绩表                -- 2 数据来源
WHERE 班级 = '高一(1)'
  AND 数学 >= 90           -- 3 条件筛选
ORDER BY 数学 DESC;        -- 4 排序（DESC 降序）

-- 常用：
-- 去重 DISTINCT
-- 分组 GROUP BY ... HAVING ...
-- 聚合 COUNT / SUM / AVG / MAX / MIN
-- 多表连接 JOIN ... ON ...`
