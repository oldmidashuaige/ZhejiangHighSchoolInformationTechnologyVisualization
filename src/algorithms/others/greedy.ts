// 贪心算法：找零问题（含反例演示）
import type { GreedyStep } from '../types'

export interface GreedyRun {
  used: { coin: number; count: number }[]
  remaining: number
  success: boolean
}

/** 暴力枚举求最少硬币数（用于反例对比） */
function optimalRun(coins: number[], amount: number): { coin: number; count: number }[] | null {
  // 递归/DP 求最少硬币
  const dp: (number | null)[] = Array(amount + 1).fill(null)
  dp[0] = 0
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (a >= c && dp[a - c] !== null) {
        const cand = (dp[a - c] as number) + 1
        if (dp[a] === null || cand < (dp[a] as number)) dp[a] = cand
      }
    }
  }
  if (dp[amount] === null) return null
  // 回溯面额组合
  const res: { coin: number; count: number }[] = []
  let a = amount
  for (const c of [...coins].reverse()) {
    while (a >= c && dp[a] !== null && dp[a - c] !== null && (dp[a] as number) === (dp[a - c] as number) + 1) {
      res.push({ coin: c, count: 0 })
      a -= c
    }
  }
  // 合并计数
  const merged: { coin: number; count: number }[] = []
  const counter = new Map<number, number>()
  for (const { coin } of res) counter.set(coin, (counter.get(coin) ?? 0) + 1)
  for (const [coin, count] of counter) merged.push({ coin, count })
  merged.sort((x, y) => y.coin - x.coin)
  return merged
}

export function greedySteps(coinsInput: number[], amountInput: number, counterExample: boolean): GreedyStep[] {
  const coins = [...new Set(coinsInput.filter((n) => n > 0))].sort((a, b) => b - a)
  const amount = Math.max(Math.floor(amountInput), 0)
  const steps: GreedyStep[] = []
  let used: { coin: number; count: number }[] = []
  let remaining = amount

  const record = (patch: {    desc: string
    remaining?: number
    used?: { coin: number; count: number }[]
    trying?: number | null
    optimal?: { coin: number; count: number }[] | null
    counterExample?: boolean
    done?: boolean
  }): void => {
    steps.push({
      coins,
      remaining: patch.remaining ?? remaining,
      used: patch.used ? [...patch.used] : used.map((u) => ({ ...u })),
      trying: patch.trying ?? null,
      optimal: patch.optimal ? patch.optimal.map((o) => ({ ...o })) : null,
      counterExample: patch.counterExample ?? counterExample,
      desc: patch.desc,
      done: patch.done,
    })
  }

  record({
    desc: `贪心找零：要找 ${amount} 元，可用面额 ${coins.join('、')}。贪心策略：每次优先用最大面额`,
    remaining,
    counterExample,
  })

  for (const coin of coins) {
    const count = Math.floor(remaining / coin)
    if (count > 0) {
      used = [...used, { coin, count }]
      remaining -= count * coin
      record({
        desc: `优先用面额 ${coin}：可以拿 ${count} 个，剩余 ${remaining} 元`,
        remaining,
        used,
        trying: coin,
      })
    } else {
      record({ desc: `面额 ${coin} 已大于剩余 ${remaining} 元，跳过`, remaining, used, trying: coin })
    }
  }

  if (remaining > 0) {
    record({
      desc: `剩余 ${remaining} 元无法用这些面额凑出，贪心失败（面额设计问题）`,
      remaining,
      used,
      done: true,
    })
    return steps
  }

  const total = used.reduce((s, u) => s + u.count, 0)
  const baseDesc = `贪心结果：${used.map((u) => `${u.count} 个 ${u.coin} 元`).join(' + ')}，共 ${total} 枚硬币`

  if (!counterExample) {
    record({ desc: baseDesc, remaining, used, counterExample: false, done: true })
    return steps
  }

  // 反例演示
  const greedyCoinCount = total
  const optimal = optimalRun(coins, amount)
  const optTotal = optimal ? optimal.reduce((s, o) => s + o.count, 0) : null
  record({
    desc: `${baseDesc}。但这是最优的吗？让我们看看`,
    remaining,
    used,
    counterExample: true,
  })
  if (optimal !== null && optTotal !== null && optTotal < greedyCoinCount) {
    record({
      desc: `反例！最优解是 ${optimal.map((o) => `${o.count} 个 ${o.coin} 元`).join(' + ')}，只需 ${optTotal} 枚硬币。贪心（${greedyCoinCount} 枚）不是最优 → 局部最优 ≠ 全局最优`,
      remaining: 0,
      used,
      optimal,
      counterExample: true,
      done: true,
    })
  } else {
    record({
      desc: `本例贪心恰好是最优（${greedyCoinCount} 枚），但换一组面额贪心可能失败 —— 反例见"反例演示"开关`,
      remaining: 0,
      used,
      optimal,
      counterExample: true,
      done: true,
    })
  }

  return steps
}

export const greedyCode = `# 贪心找零：每次取最大面额
def greedy(coins, amount):
    coins.sort(reverse=True)   # 1 面额降序
    result = {}
    for c in coins:            # 2 依次尝试每种面额
        count = amount // c    # 3 尽量多取
        if count > 0:
            result[c] = count
            amount -= count * c  # 4 更新剩余金额
    return result, amount

# 注意：贪心并不总是最优！
# 反例：面额 [1, 4, 6]，找 8 元
#   贪心：6 + 1 + 1 = 3 枚
#   最优：4 + 4 = 2 枚
# 贪心只保证"局部最优"，不保证"全局最优"`

export const DEFAULT_GREEDY = { coins: [1, 4, 6], amount: 8 }
