/*
 * @Author: KiraZz1 1634149028@qq.com
 * @Date: 2023-03-21 08:46:40
 * @LastEditors: KiraZz1 1634149028@qq.com
 * @LastEditTime: 2023-03-21 11:36:08
 * @FilePath: /ssr-demo-vue/src/client/entry-client.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import "../style.css";
import { createApp } from "../main";

const { app, router, pinia } = createApp();

router.isReady().then(() => {
    if (window && window.context?.pinia_state)
    pinia.state.value = window.context?.pinia_state;
    app.mount("#app");
})
