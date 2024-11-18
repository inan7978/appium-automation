const { exec, spawn } = require("child_process");

// this runs adb devices in CMD and gets attached devices
async function getDevices() {
  // helper function for buildDeviceList()
  return new Promise((resolve, reject) => {
    // exec does not return a promise like fetch() so you gotta wrap it in a promise like the old days
    exec("adb devices", (error, stdout, stderr) => {
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

      resolve(stdout); // Resolve the stdout as the result of the promise
    });
  });
}

// this builds a dynamic device object list
async function buildDeviceList() {
  let devicesFull = [];
  try {
    const devices = await getDevices();
    const arr = devices.split(/\r?\n/);
    const arrCleaned = arr.filter((item) => item != "");

    // below builds the list of devices (objects)
    let port = 4072;
    let systemPort = 8199;
    for (i = 1; i < arrCleaned.length; i++) {
      const curr = arrCleaned[i].split("\t");
      devicesFull.push({
        udid: curr[0],
        port: port + i,
        systemPort: systemPort + i,
        deviceName: `Android Device ${i}`,
      });
    }
  } catch (error) {
    console.log("Failed to get devices: " + error);
  }
  return devicesFull;
}

module.exports = buildDeviceList;
