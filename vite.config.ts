import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  // 获取配置环境参数
  const env = loadEnv(mode, process.cwd())
  console.log(env)
  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve('./src'), // 设置别名
      },
    },
  })
}
