const { exec } = require("child_process");

async function launchAppiumServers(devices) {
  const promises = devices.map((device) => {
    return new Promise((resolve, reject) => {
      const scriptThatRuns = `start cmd.exe /k "appium -p ${device.port}"`;
      exec(scriptThatRuns, (error, stdout, stderr) => {
        if (error) {
          console.log("Error: " + error);
          reject(error);
          return;
        }

        if (stderr) {
          console.log("std Error: " + stderr);
          reject(stderr);
          return;
        }

        resolve(stdout); // Resolve stdout as the result for this particular device
      });
    });
  });

  return Promise.all(promises); // Waits for all devices to either resolve or reject
}

module.exports = launchAppiumServers;
