import * as fs from "fs";
import readLastLine from "read-last-lines";

const cloumns = [
  { key: "id", title: "培养通道" },
  { key: "state", title: "培养结果" },
  { key: "recordnumber", title: "培养记录号" },
  { key: "timeremaining", title: "培养剩余时间" },
  { key: "initialvalue", title: "培养初始值" },
  { key: "realvalue", title: "培养结束值" },
  { key: "type", title: "灭菌器种类" },
  { key: "number", title: "灭菌器编号" },
  { key: "sterilizationlog", title: "灭菌记录号" },
  { key: "batchnumber", title: "灭菌批次号" },
  { key: "testnumber", title: "指示剂编号" },
  { key: "incuproperties", title: "指示剂性质" },
  { key: "incubationendtime", title: "结束时间" },
  { key: "incubationtime", title: "培养用时" },
  { key: "name", title: "操作者" },
];

const cloumnsMap: Record<string, string> = cloumns.reduce((pre, cur) => {
  return {
    ...pre,
    [cur.key]: cur.title,
  };
}, {});

// 将JSON对象转换为CSV格式的字符串
function jsonToCsvLine(jsonObj: any) {
  const csvLine = cloumns
    .map(({ key }) => {
      if (key === "recordnumber") {
        return `No.${jsonObj[key]}`;
      } else if (key === "incuproperties") {
        return jsonObj[key] === "sterilize BI" ? "对照组" : "灭菌组";
      }
      return jsonObj[key];
    })
    .join(",");
  return csvLine + "\n";
}

// 追加到CSV文件
export function appendJsonToCsvFile(
  jsonObj: any,
  filePath: string,
  lines: number
) {
  // 检查文件是否存在，如果不存在，添加标题行
  if (!fs.existsSync(filePath)) {
    const headerLine = cloumns.map(({ title }) => title).join(",") + "\n";
    fs.writeFileSync(filePath, "\uFEFF" + headerLine, { encoding: "utf-8" });
  }

  readLastLine.read(filePath, lines * 2).then((lines: any) => {
    const csvLine = jsonToCsvLine(jsonObj);
    if (!lines.includes(jsonObj.recordnumber)) {
      fs.appendFileSync(filePath, csvLine, { encoding: "utf-8" });
    }
  });
}
