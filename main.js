const delay = require("./src/utils/delay");
const launchAppiumServers = require("./src/utils/appiumUtils");
const buildDeviceList = require("./src/utils/deviceUtils");
const script = require("./src/scripts/script");

async function main() {
  // runs the scripts on devices
  async function runScriptOnDevices(deviceList) {
    await Promise.all(deviceList.map((device) => script(device)));
  }

  const devices = await buildDeviceList();
  console.log(devices);
  launchAppiumServers(devices);
  await delay(3500);
  runScriptOnDevices(devices);
}

main().catch((error) => console.log("Main execution failed: ", error));
