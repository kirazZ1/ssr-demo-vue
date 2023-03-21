/*
 * @Author: KiraZz1 1634149028@qq.com
 * @Date: 2023-03-21 08:55:15
 * @LastEditors: KiraZz1 1634149028@qq.com
 * @LastEditTime: 2023-03-21 11:34:15
 * @FilePath: /ssr-demo-vue/src/server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer as createViteServer } from "vite";

import bodyParser from "body-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const resolve = (p) => path.resolve(__dirname, p);

async function createServer(_, isProd = process.env.NODE_ENV === "production") {
  const app = express();

  const indexProd = isProd
    ? fs.readFileSync(resolve("dist/client/index.html"), "utf-8")
    : "";

  let vite;
  if (!isProd) {
    // 以中间件模式创建 Vite 应用，这将禁用 Vite 自身的 HTML 服务逻辑
    // 并让上级服务器接管控制
    vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100,
        },
      },
      appType: "custom",
    });
    // 使用 vite 的 Connect 实例作为中间件
    // 如果你使用了自己的 express 路由（express.Router()），你应该使用 router.use
    app.use(vite.middlewares);
  } else {
    app.use((await import("compression")).default());
    app.use(await import("serve-static")).default(resolve("dist/client"), {
      index: false,
    });
  }

  // 请求body解析
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post("/api/getData", (req, res) => {
    res.send({
      ...req.body,
      code: 0,
    });
  });

  app.use("*", async (req, res) => {
    const url = req.originalUrl;
    try {
      let template, render;
      if (!isProd) {
        // 1. 读取 index.html
        template = fs.readFileSync(resolve("../index.html"), "utf-8");
        // 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
        //    同时也会从 Vite 插件应用 HTML 转换。
        //    例如：@vitejs/plugin-react 中的 global preambles
        template = await vite.transformIndexHtml(url, template);
        // 3. 加载服务器入口。vite.ssrLoadModule 将自动转换
        //    你的 ESM 源码使之可以在 Node.js 中运行！无需打包
        //    并提供类似 HMR 的根据情况随时失效。
        render = (await vite.ssrLoadModule("/src/server/entry-server.js"))
          .render;
      } else {
        template = indexProd;
        render = (await import("./dist/server/entry-server.js")).render;
      }

      // 4. 渲染应用的 HTML。这假设 entry-server.js 导出的 `render`
      //    函数调用了适当的 SSR 框架 API。
      //    例如 ReactDOMServer.renderToString()
      const [appHtml, state] = await render(url);

      console.log(JSON.stringify(state))

      // 5. 注入渲染后的应用程序 HTML 到模板中。
      const html = template.replace(`<!--app-html-->`, appHtml).replace(
        `<!--pinia-state-->`,
        `
      <script>
      window.context = {
        pinia_state: ${JSON.stringify(state)}
      }
    </script>
      `
      );

      // 6. 返回渲染后的 HTML。
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      // 如果捕获到了一个错误，让 Vite 来修复该堆栈，这样它就可以映射回
      // 你的实际源码中。
      isProd || vite.ssrFixStacktrace(e);
      console.error(`[error]`, e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app };
}

createServer().then(({ app }) => {
  app.listen(3000, () => {
    console.log("[server] http://localhost:3000");
  });
});
