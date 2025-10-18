const net = require("net");
const iconv = require("iconv-lite");

function extractHtml(content: string) {
  const doctypeIndex = content.indexOf("<!DOCTYPE html>");
  if (doctypeIndex !== -1) {
    return content.slice(doctypeIndex);
  }
  return content; // 如果没有找到 DOCTYPE，返回原始内容
}

export default function httpRequest(
  host: string,
  port: number,
  path: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let responseDataChunk: any[] = [];

    console.log(`${host}:${port}${path}`);
    client.connect(port, host, () => {
      const getRequest = [
        `GET ${path} HTTP/1.1`,
        `Host: ${host}`,
        "Connection: close",
        "",
        "",
      ].join("\r\n");

      client.write(getRequest);
    });

    client.on("data", (data: any) => {
      responseDataChunk.push(data);
      // responseData += data.toString();
    });

    client.on("end", () => {
      const buffer = Buffer.concat(responseDataChunk);

      const responseData = iconv.decode(buffer, "gb2312");

      resolve(extractHtml(responseData));
    });

    client.on("error", (err: any) => {
      reject(err);
    });

    client.on("close", (hadError: any) => {
      if (!hadError) {
        console.log("Connection successfully closed");
      }
    });
  });
}
