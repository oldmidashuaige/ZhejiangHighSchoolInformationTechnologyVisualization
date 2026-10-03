// 凯撒密码：字符平移加密/解密
import type { CaesarStep } from '../types'

export function caesarSteps(plain: string, shift: number): CaesarStep[] {
  const s = plain
  const sh = ((shift % 26) + 26) % 26
  const steps: CaesarStep[] = []
  let cipher = ''
  const n = s.length

  const record = (desc: string, index: number, done = false) => {
    steps.push({ desc, plain: s, shift: sh, index, cipher, done })
  }

  record(`凯撒密码：每个字母向后平移 ${sh} 位（取模 26）。明文：${s}`, 0)

  for (let i = 0; i < n; i++) {
    const ch = s[i]
    const isLetter = /[a-zA-Z]/.test(ch)
    if (!isLetter) {
      cipher += ch
      record(`字符 '${ch}' 不是字母，原样保留`, i, false)
      continue
    }
    const code = ch.charCodeAt(0)
    const base = ch >= 'a' && ch <= 'z' ? 97 : 65
    const pos = code - base
    const newPos = (pos + sh) % 26
    const newCh = String.fromCharCode(base + newPos)
    cipher += newCh
    record(`'${ch}' 的字母位置是 ${pos}，平移 ${sh} 位 → ${newPos}，密文字符 '${newCh}'`, i, false)
  }

  record(`加密完成：明文 "${s}" → 密文 "${cipher}"（平移 ${sh} 位）`, n - 1, true)

  return steps
}

export const caesarCode = `# 凯撒密码加密
def caesar_encrypt(s, shift):
    res = ""
    for ch in s:
        if 'a' <= ch <= 'z':            # 1 小写字母
            res += chr((ord(ch) - 97 + shift) % 26 + 97)
        elif 'A' <= ch <= 'Z':          # 2 大写字母
            res += chr((ord(ch) - 65 + shift) % 26 + 65)
        else:                           # 3 其他字符不变
            res += ch
    return res

# 解密：shift 取负值（取模 26）
def caesar_decrypt(s, shift):
    return caesar_encrypt(s, -shift % 26)

print(caesar_encrypt("Hello World", 3))  # Khoor Zruog
# ord() 取字符编码，chr() 由编码得字符`
