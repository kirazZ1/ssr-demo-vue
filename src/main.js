/*
 * @Author: KiraZz1 1634149028@qq.com
 * @Date: 2023-03-21 08:32:40
 * @LastEditors: KiraZz1 1634149028@qq.com
 * @LastEditTime: 2023-03-21 10:49:37
 * @FilePath: /ssr-demo-vue/src/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { createSSRApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createPinia } from 'pinia'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  const router = createRouter()
  app.use(router)
  return { app, router, pinia }
}