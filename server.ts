import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
// import sqlite3 from "sqlite3";
import * as schedule from "node-schedule";
import serve from "koa-static";
import path from "path";
import fs from "fs";
import { getConfig, startSchedule, updateConfig } from "./fetcher";

const app = new Koa();
const router = new Router();

// const db = new sqlite3.Database("./data.sqlite");

// db.serialize(() => {
//   db.run(
//     `
//   CREATE TABLE IF NOT EXISTS data (
//     id TEXT,
//     state TEXT,
//     recordnumber TEXT UNIQUE, -- Specify UNIQUE constraint for recordnumber
//     timeremaining TEXT,
//     initialvalue TEXT,
//     realvalue TEXT,
//     type TEXT,
//     number TEXT,
//     sterilizationlog TEXT,
//     batchnumber TEXT,
//     testnumber TEXT,
//     name TEXT,
//     incuproperties TEXT,
//     incubationendtime TEXT,
//     incubationtime TEXT
//   );
// `,
//     (res: any, err: any) => {
//       console.log("%c Line:35 🌶 res,err", "color:#b03734", res, err);
//     }
//   );

app.use(bodyParser());
// db.all("SELECT * FROM data", (_, res) => {
//   console.log("%c Line:43 🥚 SELECT * FROM data", "color:#e41a6a", res);
// });

// 处理查询数据的接口
// router.get("/api/getData", (ctx: any) => {
//   return new Promise((reslove, reject) => {
//     try {
//       db.all("SELECT * FROM data", (_, res) => {
//         ctx.status = 200;
//         ctx.body = res;
//         reslove(true);
//       });
//     } catch (error) {
//       ctx.status = 500;
//       ctx.body = { error: "Internal Server Error" };
//       reject();
//     }
//   });
// });

// 处理保存数据的接口
router.get("/api/getConfig", async (ctx: any) => {
  console.log("%c Line:68 🍋 ctx", "color:#42b983", ctx);
  try {
    ctx.body = getConfig();
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "配置读取错误" };
  }
});

// // 处理查询数据的接口
router.post("/api/setConfig", async (ctx: any) => {
  try {
    updateConfig(ctx.request.body);
    ctx.body = { resoult: "ok" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "配置保存错误" };
  }
});

// 使用中间件

app.use(router.routes());
app.use(router.allowedMethods());

// 配置静态资源路径
const staticPath = path.join(__dirname, "public"); // 替换为您的静态资源目录
app.use(serve(staticPath));

// 启动服务器
const port = 4000;
app.listen(port, () => {
  console.log(`web 配置地址：  http://localhost:${port}`);
});
startSchedule();
