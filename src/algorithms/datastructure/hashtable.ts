// 哈希表：拉链法 / 线性探测 冲突处理
import type { HashStep } from '../types'

export type HashStrategy = 'chaining' | 'probing'

export function hashSteps(strategy: HashStrategy): HashStep[] {
  const size = 5
  const keys = [27, 42, 15, 88, 63]
  const hash = (k: number): number => k % size

  const buckets: number[][] = Array.from({ length: size }, () => [])
  const probeArr: (number | null)[] = Array(size).fill(null)
  const steps: HashStep[] = []

  const record = (patch: {
    desc: string
    key?: number | null
    index?: number | null
    probe?: number[] | null
    op?: HashStep['op']
    done?: boolean
  }): void => {
    steps.push({
      buckets: buckets.map((b) => [...b]),
      key: patch.key ?? null,
      index: patch.index ?? null,
      probe: patch.probe ? [...patch.probe] : null,
      op: patch.op ?? 'init',
      found: false,
      desc: patch.desc,
      done: patch.done,
    })
  }

  record({ desc: `哈希表：表长 ${size}，哈希函数 h(key) = key % ${size}`, op: 'init' })

  for (const k of keys) {
    const h = hash(k)
    if (strategy === 'chaining') {
      record({ desc: `插入键 ${k}：h(${k}) = ${k} % ${size} = ${h}，放入 0 号桶`, key: k, index: h, op: 'insert' })
      buckets[h].push(k)
      record({
        desc: `${k} 放入桶 ${h}（桶 ${h} 现有：${buckets[h].join(', ') || '空'}）。若桶内有多个元素即"拉链"处理冲突`,
        key: k,
        index: h,
        op: 'insert',
      })
    } else {
      // 线性探测
      let idx = h
      const probe: number[] = []
      while (probeArr[idx] !== null) {
        probe.push(idx)
        idx = (idx + 1) % size
      }
      if (probe.length > 0) {
        record({
          desc: `插入键 ${k}：h(${k}) = ${h} 但桶 ${h} 已被占用，线性探测向后找空位`,
          key: k,
          index: h,
          probe,
          op: 'insert',
        })
      }
      probe.push(idx)
      probeArr[idx] = k
      record({
        desc: `插入键 ${k}：h(${k}) = ${h}，最终放入下标 ${idx}${probe.length > 1 ? `（经过探测序列 ${probe.join('→')}）` : ''}`,
        key: k,
        index: h,
        probe,
        op: 'insert',
      })
    }
  }

  if (strategy === 'chaining') {
    record({
      desc: `完成！拉链法：每个桶是一个链表。查找键时先算 h(key) 定位桶，再在桶内顺序查找。平均查找 O(1)，冲突多时退化为 O(n)`,
      op: 'search',
      done: true,
    })
  } else {
    record({
      desc: `完成！线性探测：冲突时顺次往后找空位。缺点：容易产生"堆积"。删除时不能直接清空，需标记删除`,
      op: 'search',
      done: true,
    })
  }

  return steps
}

export const hashCode = `# 哈希表（字典 dict 的底层思想）
# 用"哈希函数"把键映射到存储位置

# 拉链法：每个桶存一个链表
buckets = [[] for _ in range(5)]

def insert_chaining(key):
    h = key % 5          # 1 哈希函数定位桶
    buckets[h].append(key)  # 2 插入对应桶（链上）

def search_chaining(key):
    h = key % 5
    return key in buckets[h]  # 3 桶内查找

# 线性探测法：冲突向后找空位
table = [None] * 5

def insert_probing(key):
    h = key % 5
    while table[h] is not None:  # 4 该位已占用
        h = (h + 1) % 5          # 5 向后探测
    table[h] = key

# 平均时间复杂度 O(1)，最坏 O(n)`
