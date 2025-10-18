const path = require("path");
var Service = require("node-windows").Service;
// Create a new service object
var svc = new Service({
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

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function () {
  setTimeout(()=>{
    svc.start();
  },3000)
});

svc.install();
