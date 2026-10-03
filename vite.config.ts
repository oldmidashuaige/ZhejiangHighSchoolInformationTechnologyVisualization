import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// 单文件内联 + 相对路径 => 构建产物 index.html 双击即可离线运行（file:// 无 CORS 问题）
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
