// 队列：入队出队演示（线性 + 循环队列）
import type { QueueStep } from '../types'

export function queueSteps(circular: boolean): QueueStep[] {
  const cap = 6
  const arr: (number | null)[] = Array(cap).fill(null)
  let front = 0
  let rear = 0
  let size = 0
  const steps: QueueStep[] = []

  const record = (patch: {
    desc: string
    op?: QueueStep['op']
    value?: number | null
    done?: boolean
  }): void => {
    steps.push({
      arr: [...arr],
      front,
      rear,
      size,
      op: patch.op ?? 'init',
      value: patch.value ?? null,
      circular,
      desc: patch.desc,
      done: patch.done,
    })
  }

  const enq = (v: number): void => {
    if (size === cap - 1) {
      record({
        desc: `入队 ${v} 失败：队列已满（循环队列队满条件 (rear+1)%${cap} == front，浪费一个空位）`,
        op: 'full',
        value: v,
      })
      return
    }
    arr[rear] = v
    size++
    record({
      desc: `入队 ${v}：存入 arr[rear=${rear}]，rear 后移${circular ? '（取模）' : ''} → rear = ${(rear + 1) % cap}，当前 ${size} 个元素`,
      op: 'enqueue',
      value: v,
    })
    rear = (rear + 1) % cap
  }

  const deq = (): void => {
    if (size === 0) {
      record({ desc: '出队失败：队列为空（队空条件 front == rear）', op: 'empty' })
      return
    }
    const v = arr[front] as number
    arr[front] = null
    size--
    record({
      desc: `出队：取出队首 arr[front=${front}] = ${v}，置空该位，front 后移${circular ? '（取模）' : ''} → front = ${(front + 1) % cap}，当前 ${size} 个元素`,
      op: 'dequeue',
      value: v,
    })
    front = (front + 1) % cap
  }

  record({ desc: '空队列：front = rear = 0，size = 0。队空条件 front == rear', op: 'init' })

  if (!circular) {
    // 线性队列：演示假溢出
    enq(4)
    enq(7)
    enq(9)
    enq(12)
    deq()
    deq()
    enq(20)
    enq(30)
    record({
      desc: '线性队列中，front 不断后移，前面的空间被"浪费"——这种现象叫假溢出。用循环队列可以复用这些空间',
      done: true,
    })
  } else {
    // 循环队列：演示队满与 rear 回绕
    enq(4)
    enq(7)
    enq(9)
    enq(12)
    enq(15)
    enq(30)
    deq()
    deq()
    enq(30)
    record({
      desc: '循环队列：rear 从 5 回绕到 0，复用被出队腾出的空间。队满时浪费一个存储单元（front 与 rear 相邻）',
      done: true,
    })
  }

  return steps
}

export const queueCode = `# 循环队列（数组实现，大小为 maxsize）
# 约定：队空 front == rear；队满 (rear + 1) % maxsize == front
maxsize = 6
q = [None] * maxsize
front = rear = 0

def enqueue(x):
    global front, rear
    if (rear + 1) % maxsize == front:  # 队满
        return False
    q[rear] = x
    rear = (rear + 1) % maxsize         # 入队，rear 后移
    return True

def dequeue():
    global front, rear
    if front == rear:                   # 队空
        return None
    x = q[front]
    front = (front + 1) % maxsize       # 出队，front 后移
    return x`
