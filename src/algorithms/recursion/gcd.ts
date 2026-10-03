// 最大公约数：欧几里得辗转相除法
import type { GcdStep } from '../types'

export function gcdSteps(a: number, b: number): GcdStep[] {
  let x = Math.abs(Math.floor(a))
  let y = Math.abs(Math.floor(b))
  if (x === 0 && y === 0) y = 1
  const steps: GcdStep[] = []
  const rows: { a: number; b: number; r: number }[] = []

  const record = (desc: string, line: number, done = false) => {
    steps.push({
      desc,
      line,
      a: x,
      b: y,
      r: rows.length ? rows[rows.length - 1].r : -1,
      rows: rows.map((r) => ({ ...r })),
      currentRow: rows.length - 1,
      done,
    })
  }

  record(`求 gcd(${x}, ${y})：用较大的数除以较小的数取余数`, 1)

  while (y !== 0) {
    const r = x % y
    rows.push({ a: x, b: y, r })
    record(`gcd(${x}, ${y})：${x} ÷ ${y} = ${Math.floor(x / y)} 余 ${r}，gcd(${x}, ${y}) = gcd(${y}, ${r})`, 3)
    if (r === 0) break
    x = y
    y = r
    record(`余数不为 0，把原除数作为新被除数、余数作为新除数：继续求 gcd(${x}, ${y})`, 4)
  }

  record(`余数为 0，此时的除数 ${y} 就是最大公约数。gcd(${rows[0]?.a ?? x}, ${rows[0]?.b ?? y}) = ${y}`, 5, true)

  return steps
}

export function defaultGcdPair(): [number, number] {
  return [48, 36]
}

export const gcdCode = `# 辗转相除法（欧几里得算法）求最大公约数
def gcd(a, b):
    while b != 0:        # 1 余数不为 0 就继续
        r = a % b        # 2 取余
        a, b = b, r      # 3 除数变被除数，余数变除数
    return a             # 4 余数为 0 时，返回除数

print(gcd(48, 36))       # 结果为 12

# 递归写法：
# def gcd(a, b):
#     return gcd(b, a % b) if b != 0 else a`
