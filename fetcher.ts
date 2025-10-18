import { Builder, parseStringPromise } from "xml2js";
import * as schedule from "node-schedule";
import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import { appendJsonToCsvFile } from "./add2csv";
import log4j from "log4js";
import request from "./request";
import dayjs from "dayjs";
// 读取配置文件
let config: any = {
  logLevel: "info",
};

export const getConfig = () => {
  const jsonDataStr = fs.readFileSync(
    path.resolve(__dirname, "./config.json"),
    "utf-8"
  );
  config = JSON.parse(jsonDataStr);
  return config;
};

export const updateConfig = (conf: any) => {
  const jsonDataStr = fs.readFileSync(
    path.resolve(__dirname, "./config.json"),
    "utf-8"
  );
  config = JSON.parse(jsonDataStr);
  fs.writeFileSync(
    path.resolve(__dirname, "./config.json"),
    JSON.stringify(conf, null, 2)
  );

  reStartSchedule();
};

log4j.configure({
  appenders: {
    fileInfo: {
      type: "dateFile",
      filename: "logs/app.log",
      pattern: "yyyy-MM-dd",
      keepFileExt: true,
      alwaysIncludePattern: true,
      daysToKeep: 30,
      compress: true,
    },
    fileError: {
      type: "dateFile",
      filename: "logs/error.log",
      pattern: "yyyy-MM-dd",
      keepFileExt: true,
      alwaysIncludePattern: true,
      daysToKeep: 30,
      compress: true,
    },
    console: { type: "console" },
  },
  categories: {
    default: { appenders: ["fileInfo", "console"], level: config.logLevel },
    error: { appenders: ["fileError", "console"], level: "all" },
  },
});

const logger = log4j.getLogger();
const loggerError = log4j.getLogger("error");

logger.info("获取配置：", JSON.stringify(config, null, 4));

export const runOnce = () =>
  config?.divices?.forEach((device: any, devId: number) => {
    fetchDataList(device)
      .then((data: any[]) => {
        data.forEach((saveData) => {
          if (saveData?.recordnumber) {
            saveAsXml(
              {
                result: { DevId: devId + 1, ...saveData },
              },
              saveData.recordnumber
            );
            appendJsonToCsvFile(
              saveData,
              `${config.savePath}/data.csv`,
              data.length
            );
          }
        });
      })
      .catch((err) => {
        logger.trace("运行出错了\n", err.message, "\n", err);
        loggerError.trace("运行出错了\n", err.message, "\n", err);
      });
  });
let job: any;
export const startSchedule = () => {
  getConfig();
  // 主函数，负责定时抓取数据
  job = schedule.scheduleJob(`*/${config.second} * * * * *`, () => {
    logger.info(`运行中-${config.second}秒 查询一次`);
    runOnce();
  });

  // if (new Date().getTime() > new Date("2024-1-28").getTime()) {
  //   job.cancel();
  //   loggerError.error("程序未授权");
  // }
};

export const reStartSchedule = () => {
  const res = job?.cancel?.();
  console.log("%c Line:89 🥤 job?.cancel", "color:#4fff4B", job?.cancel, res);
  // 主函数，负责定时抓取数据
  // job = schedule.scheduleJob(`*/${config.second} * * * * *`, () => {
  //   logger.info(`运行中-${config.second}秒 查询一次`);
  //   runOnce();
  // });

  // if (new Date().getTime() > new Date("2024-1-28").getTime()) {
  //   job.cancel();
  //   loggerError.error("程序未授权");
  // }
};

function fetchDataList(device: {
  ip: string;
  port: number;
  devId: number;
}): Promise<any> {
  return request(device.ip, device.port, `/state`)
    .then((text) => parseHtml(text))
    .catch((error) => {
      loggerError.error("设备不在线");
      return [];
    });
}

function parseHtml(html: string): any {
  logger.debug("state 获取到的结果", html);
  const $ = cheerio.load(html);
  return parseStringPromise($("body").html() || "").then(({ data }) => {
    logger.debug("state xml 解析到的结果", data);
    return data?.channel
      ?.map((channelItem: any) => {
        const row: any = {};
        Object.entries(channelItem).forEach(([k, v]) => {
          if (k === "incubationendtime") {
            row[k] = (v as any)?.[0]?.slice?.(0, 16);
          } else {
            row[k] = ((v as any)?.[0] as string)?.trim();
          }
        });
        logger.debug("state channel 转换的结果", row);
        return row;
      })
      .filter((c: any) => ["-", "+"].includes(c.state));
  });
}

function findFileInDirectories(
  fileName: string,
  directory1: string,
  directory2: string
) {
  const file1Path = path.join(directory1, fileName);
  const file2Path = path.join(directory2, fileName);

  return fs.existsSync(file1Path) || fs.existsSync(file2Path);
}

function saveAsXml(data: any, name: string): void {
  const builder = new Builder({
    xmldec: { version: "1.0", encoding: "UTF-8" },
  });
  const xml = builder.buildObject(data);
  const filename = `${name}.xml`;
  const savePath = `${config.savePath}/${dayjs().format("YYYYMMDD")}`;

  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true });
  }

  if (
    findFileInDirectories(
      filename,
      `${config.savePath}/${dayjs().subtract(1, "day").format("YYYYMMDD")}`,
      savePath
    )
  ) {
    return;
  }

  const filepath = path.join(savePath, filename);
  fs.writeFileSync(filepath, xml);
}
