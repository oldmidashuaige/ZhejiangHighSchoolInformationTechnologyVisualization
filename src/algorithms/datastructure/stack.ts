// 栈：数值压栈/弹栈 + 括号匹配应用
import type { StackStep } from '../types'

export function stackSteps(): StackStep[] {
  const arr: number[] = []
  const steps: StackStep[] = []
  let top = -1

  const record = (patch: {
    desc: string
    op?: StackStep['op']
    value?: number | null
    done?: boolean
  }): void => {
    steps.push({
      arr: [...arr],
      top,
      op: patch.op ?? 'init',
      value: patch.value ?? null,
      desc: patch.desc,
      done: patch.done,
    })
  }

  const push = (v: number): void => {
    arr.push(v)
    top = arr.length - 1
    record({ desc: `push ${v}：压入栈顶，栈变为 [${arr.join(', ')}]`, op: 'push', value: v })
  }

  const pop = (): void => {
    const v = arr.pop()!
    top = arr.length - 1
    record({ desc: `pop：弹出栈顶 ${v}，栈变为 [${arr.join(', ')}]`, op: 'pop', value: v })
  }

  record({ desc: '空栈：top = -1。栈是后进先出（LIFO）的线性结构', op: 'init' })
  push(5)
  push(8)
  push(3)
  pop()
  push(9)
  pop()
  pop()
  record({ desc: '演示结束：每一次 push/pop 都只操作栈顶元素', done: true })
  return steps
}

/** 括号匹配：用栈判断括号是否配对 */
export function bracketSteps(s: string): StackStep[] {
  const clean = s.replace(/[^()\[\]{}]/g, '')
  const openers = new Map<string, string>([
    [')', '('],
    [']', '['],
    ['}', '{'],
  ])
  const arr: string[] = []
  const steps: StackStep[] = []
  let top = -1

  const record = (patch: { desc: string; op?: StackStep['op']; value?: string | null; done?: boolean }): void => {
    steps.push({
      arr: [...arr],
      top,
      op: patch.op ?? 'init',
      value: patch.value ?? null,
      desc: patch.desc,
      done: patch.done,
    })
  }

  record({ desc: `用栈检查括号是否配对。表达式（只取括号）：${clean}`, op: 'init' })

  for (const ch of clean) {
    if ('([{'.includes(ch)) {
      arr.push(ch)
      top = arr.length - 1
      record({ desc: `遇到左括号 '${ch}'，压入栈 → 栈：[${arr.join(' ')}]`, op: 'push', value: ch })
    } else {
      const expected = openers.get(ch)
      if (top >= 0 && arr[top] === expected) {
        arr.pop()
        top = arr.length - 1
        record({ desc: `遇到右括号 '${ch}'，与栈顶 '${expected}' 配对，弹出 → 栈：[${arr.join(' ')}]`, op: 'pop', value: ch })
      } else {
        record({
          desc: `遇到右括号 '${ch}'，但栈顶不是对应的左括号${top >= 0 ? ` '${arr[top]}'` : '（栈空）'}，括号不匹配！`,
          op: 'pop',
          value: ch,
        })
      }
    }
  }

  const ok = top === -1
  record({
    desc: ok ? '扫描结束，栈为空，所有括号正确配对（匹配）' : `扫描结束，栈中还有 ${top + 1} 个未配对的左括号，不匹配`,
    op: 'peek',
    done: true,
  })
  return steps
}

export const stackCode = `# 栈的数组实现（Python 用列表模拟）
stack = []

def push(x):
    stack.append(x)     # 1 压栈：入栈顶

def pop():
    return stack.pop()  # 2 弹栈：出栈顶

def peek():
    return stack[-1]    # 3 查看栈顶

# 括号匹配示例
# def is_valid(s):
#     st = []
#     for ch in s:
#         if ch in "([{":
#             st.append(ch)
#         else:
#             if not st or not match(st.pop(), ch):
#                 return False
#     return len(st) == 0`
