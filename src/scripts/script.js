// this is the contents of the script itself
const returnToMain = require("./returnToMain");
const fs = require("fs");
const { remote } = require("webdriverio");
const connectWiFi = require("./tasks/connectWifi");
const motionSmoothnessStandard = require("./tasks/motionSmoothnessStandard");
const screenTimeout = require("./tasks/screenTimeout");
const edgePanelsOff = require("./tasks/edgePanelsOff");
const notificationCategories = require("./tasks/notificationCategories");
const wallpaperText = require("./tasks/wallpaperText");
const moveContactsApp = require("./tasks/moveContactsApp");

async function script(device) {
  const capabilities = {
    platformName: "Android",
    "appium:automationName": "UiAutomator2",
    "appium:deviceName": device.deviceName,
    "appium:udid": device.udid,
    "appium:systemPort": device.systemPort,
    "appium:appPackage": "com.android.settings",
    "appium:appActivity": ".Settings",
  };

  const wdOpts = {
    hostname: "localhost",
    port: device.port,
    logLevel: "info",
    capabilities,
  };

  // below gets current date and from there makes the file name when scripts complete
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  let results = { device: device.udid, results: {} };

  const driver = await remote(wdOpts);

  // Your existing function logic goes here

  // results.results.wifiSet = await connectWiFi(
  //   driver,
  //   "HPCCR-Guest",
  //   "caringforfamily"
  // );
  // await returnToMain(driver);

  // // motion smoothness setup
  // results.results.standardSmoothness = await motionSmoothnessStandard(driver);
  // await returnToMain(driver);

  // // screen timeout settings
  // results.results.screenTimeout = await screenTimeout(driver, "2 minutes");
  // await returnToMain(driver);

  // // edge panels disable
  // results.results.edgePanelsOff = await edgePanelsOff(driver);
  // await returnToMain(driver);

  // // notification categories

  // results.results.notificationCategories = await notificationCategories(driver);
  // await returnToMain(driver);

  // wallpaper text
  // results.results.wallpaperText = await wallpaperText(
  //   driver,
  //   "testing 704 887 6441"
  // );

  // await driver.closeApp();
  // await moveContactsApp(driver);

  // creates the file using date at initialization and writes to it in the output-files category
  const jsonResult = JSON.stringify(results, null, 2);
  fs.writeFileSync(
    `./output-files/${device.udid}-${formattedDate}.json`,
    jsonResult
  );

  await driver.deleteSession();
}

module.exports = script;
