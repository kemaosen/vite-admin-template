import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  // 获取配置环境参数
  const env = loadEnv(mode, process.cwd())
  console.log(env)
  return defineConfig({
    plugins: [
      vue(),
      // viteCompression({
      //   verbose: true,
      //   disable: false,
      //   threshold: 10240,
      //   algorithm: 'gzip',
      //   ext: '.gz',
      // }),
      visualizer({ open: false }),
      vueJsx(),
    ],
    resolve: {
      alias: {
        '@': resolve('./src'), // 设置别名
      },
    },
    css: {
      modules: {
        // 是对css模块化的默认行为进行覆盖
        localsConvention: 'camelCase', // 修改生成的配置对象的key的展示形式(驼峰还是中划线形式)
        scopeBehaviour: 'local', // 配置当前的模块化行为是模块化还是全局化 (有hash就是开启了模块化的一个标志, 因为他可以保证产生不同的hash值来控制我们的样式类名不被覆盖)
        generateScopedName: '[local]_[hash:5]', // [name]_[local]_[hash:5]
        // generateScopedName: (name, filename, css) => {
        // name -> 代表的是你此刻css文件中的类名
        // filename -> 是你当前css文件的绝对路径
        // css -> 给的就是你当前样式
        //     console.log('name', name, 'filename', filename, 'css', css) // 这一行会输出在哪？？？ 输出在node
        // 配置成函数以后, 返回值就决定了他最终显示的类型
        //     return `${name}_${Math.random().toString(36).substr(3, 8)}`
        // },
        // hashPrefix: "hello", // 生成hash会根据类名 + 一些其他的字符串(文件名 + 他内部随机生成一个字符串)去进行生成, 如果想要生成hash更加的独特一点, 可以配置hashPrefix, 配置的这个字符串会参与到最终的hash生成, （hash: 只要字符串有一个字不一样, 那么生成的hash就完全不一样, 但是只要字符串完全一样, 生成的hash就会一样）
        // globalModulePaths: ['./componentB.module.css'], // 代表不想参与到css模块化的路径
      },
      /* CSS 预处理器 */
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/variables.scss";',
        },
      },
      // 可以查看 CSS 的源码
      devSourcemap: true,
    },
    server: {
      port: 2157,
      proxy: {
        '/api': {
          target: '', //设置请求地址
          changeOrigin: true, //是否跨域
          rewrite: (path) => path.replace(/^\/api/, ''), //重写地址
        },
      },
    },
    build: {
      outDir: resolve(__dirname, 'dist'), // 指定输出路径
      chunkSizeWarningLimit: 1500,
      sourcemap: false, // 是否生成 source map
      emptyOutDir: true, //Vite 会在构建时清空该目录
      // 打包时清楚console和debugger
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          compact: true, //压缩代码，删除换行符等
          assetFileNames: '[ext]/[name]-[hash].[ext]', //静态文件输出的文件夹名称
          chunkFileNames: 'js/[name]-[hash].js', //chunk包输出的文件夹名称
          entryFileNames: 'js/[name]-[hash].js', //入口文件输出的文件夹名称
        },
      },
    },
  })
}
