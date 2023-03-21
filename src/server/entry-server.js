/*
 * @Author: KiraZz1 1634149028@qq.com
 * @Date: 2023-03-21 08:49:30
 * @LastEditors: KiraZz1 1634149028@qq.com
 * @LastEditTime: 2023-03-21 11:33:01
 * @FilePath: /ssr-demo-vue/src/server/entry-server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { createApp } from "../main";
import { renderToString } from "vue/server-renderer";

export async function render(url) {
  const { app, router, pinia } = createApp();
  await router.push(url);
  await router.isReady();
  const html = await renderToString(app);
  return [html, pinia.state.value];
}
