const path = require("path");
const Service = require("node-windows").Service;

// 获取命令行参数
const args = process.argv.slice(2);
const isUninstall = args.includes('uninstall');

// 创建服务对象
const svc = new Service({
  name: "VK-Reader",
  description: "四川卫康科技有限公司",
  script: path.resolve("./index.js"),
  execPath: path.resolve("node-v14.9.0-win-x86/node.exe"),
  logOnEvent: true, // Enable event logging
  logToFile: true, // Enable file logging
  eventLogOnly: true, // Only log error events
  env: {
    name: "NODE_SKIP_PLATFORM_CHECK",
    value: 1,
  },
});

if (isUninstall) {
  // 卸载服务
  console.log("正在停止并卸载 VK-Reader 服务...");

  svc.on('uninstall', function() {
    console.log("VK-Reader 服务已成功卸载！");
  });

  svc.on('error', function(err) {
    console.error("卸载服务时出错:", err);
  });

  // 先停止服务，然后卸载
  svc.on('stop', function() {
    console.log("服务已停止，正在卸载...");
    svc.uninstall();
  });

  // 尝试停止服务
  svc.stop(function(err) {
    if (err) {
      console.log("服务可能未运行，直接进行卸载...");
      svc.uninstall();
    }
  });

} else {
  // 安装服务
  console.log("正在安装 VK-Reader 服务...");

  // Listen for the "install" event, which indicates the
  // process is available as a service.
  svc.on("install", function () {
    console.log("VK-Reader 服务安装成功！");
    console.log("3秒后将启动服务...");
    setTimeout(()=>{
      svc.start();
      console.log("VK-Reader 服务已启动！");
    }, 3000);
  });

  svc.on("start", function() {
    console.log("VK-Reader 服务运行中...");
  });

  svc.on("error", function(err) {
    console.error("安装服务时出错:", err);
  });

  console.log("开始安装服务...");
  svc.install();
}
