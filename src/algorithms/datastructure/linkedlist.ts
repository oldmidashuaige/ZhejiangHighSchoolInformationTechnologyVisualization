// 单向链表：遍历、插入、删除演示
import type { ListStep } from '../types'

export interface ListNode {
  id: number
  val: number
  next: number | null
}

export function listSteps(): ListStep[] {
  const nodes: ListNode[] = [5, 12, 7, 20].map((v, i) => ({ id: i, val: v, next: i < 3 ? i + 1 : null }))
  const head = 0
  const steps: ListStep[] = []
  let removedVal: number | null = null
  let nextId = 100

  const find = (id: number) => nodes.find((n) => n.id === id)!
  const record = (patch: {
    desc: string
    pointer?: number | null
    highlight?: { type: 'insert' | 'delete' | 'visit'; target: number } | null
    removedVal?: number | null
    done?: boolean
  }): void => {
    steps.push({
      nodes: nodes.map((n) => ({ ...n })),
      head,
      pointer: patch.pointer ?? null,
      highlight: patch.highlight ?? null,
      removedVal: patch.removedVal ?? removedVal,
      desc: patch.desc,
      done: patch.done,
    })
  }

  record({ desc: '初始链表：5 → 12 → 7 → 20 → NULL，头指针 head 指向第一个节点', pointer: head })

  // 1) 遍历
  let p: number | null = head
  let guard = 0
  while (p !== null && guard++ < 20) {
    record({
      desc: `指针 p 指向节点：读取 val = ${find(p).val}`,
      pointer: p,
      highlight: { type: 'visit', target: p },
    })
    p = find(p).next
  }
  record({ desc: '遍历结束：p 走到 NULL，链表遍历完', pointer: null })

  // 2) 插入：在值为 12 的节点（id=1）之后插入 9
  const insertAfterId = 1
  record({
    desc: '演示插入：把新节点 9 插入到值为 12 的节点之后',
    pointer: insertAfterId,
    highlight: { type: 'insert', target: insertAfterId },
  })
  const newId = nextId++
  const oldNext = find(insertAfterId).next
  nodes.push({ id: newId, val: 9, next: oldNext })
  record({
    desc: '第一步：让新节点 9 的 next 指向 12 原来的后继（7）',
    pointer: insertAfterId,
    highlight: { type: 'insert', target: newId },
  })
  find(insertAfterId).next = newId
  record({
    desc: '第二步：让 12 的 next 指向新节点 9，插入完成 → 5 → 12 → 9 → 7 → 20 → NULL',
    pointer: insertAfterId,
    highlight: { type: 'insert', target: newId },
  })

  // 3) 删除：删除值为 7 的节点（id=2）
  const delId = 2
  record({
    desc: `演示删除：删除值为 7 的节点（先找到它的前驱节点）`,
    pointer: head,
    highlight: { type: 'delete', target: head },
  })
  // 找前驱：从头走到值为7的前一个
  let q: number | null = head
  guard = 0
  while (q !== null && find(q).next !== delId && guard++ < 20) {
    record({
      desc: `继续沿 next 找前驱，当前在节点 ${find(q).val}`,
      pointer: q,
      highlight: { type: 'delete', target: q },
    })
    q = find(q).next
  }
  if (q !== null) {
    record({
      desc: `找到前驱：值为 ${find(q).val} 的节点，它的 next 指向被删节点 7`,
      pointer: q,
      highlight: { type: 'delete', target: q },
    })
    const delVal = find(delId).val
    find(q).next = find(delId).next
    const idx = nodes.findIndex((n) => n.id === delId)
    nodes.splice(idx, 1)
    removedVal = delVal
    record({
      desc: `让前驱的 next 直接指向被删节点 7 的后继（20），跳过 7 → 删除完成 → 5 → 12 → 9 → 20 → NULL`,
      pointer: q,
      highlight: { type: 'delete', target: q },
      removedVal: delVal,
    })
  }

  record({
    desc: '小结：链表删除只需修改一个指针（前驱的 next），不需要移动其他元素 —— 这正是链表插入/删除快、但随机访问慢的原因',
    pointer: null,
    done: true,
  })

  return steps
}

export const listCode = `# 单向链表节点
class Node:
    def __init__(self, data):
        self.data = data    # 数据域
        self.next = None    # 指针域

# 在 p 节点之后插入新节点 s
def insert_after(p, s):
    s.next = p.next     # 1 新节点指向 p 的后继
    p.next = s          # 2 p 指向新节点

# 删除 p 节点的后继
def delete_next(p):
    if p.next is not None:
        p.next = p.next.next  # 3 跳过被删节点

# 遍历链表
def traverse(head):
    p = head
    while p is not None:
        print(p.data)   # 访问当前节点
        p = p.next      # 指针后移`
