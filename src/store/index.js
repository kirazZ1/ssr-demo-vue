/*
 * @Author: KiraZz1 1634149028@qq.com
 * @Date: 2023-03-21 10:15:18
 * @LastEditors: KiraZz1 1634149028@qq.com
 * @LastEditTime: 2023-03-21 10:15:28
 * @FilePath: /ssr-demo-vue/src/store/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia";
import axios from "axios";
const rootUrl = typeof window !== "undefined" ? "" : "http://localhost:3000";

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useMainStore = defineStore("main", {
  // 其他配置...
  state: () => ({
    data: "default Data",
  }),

  actions: {
    async fetchData(data) {
      const res = await axios.post(rootUrl + "/api/getData", {
        data: data
      });

      
      this.data = res.data.data
    },
  },
});
