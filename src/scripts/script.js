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
const testingTask = require("./tasks/testingTask");
const goToApp = require("./goToApp");
const interceptX = require("./tasks/interceptX");
const adjustQC = require("./tasks/adjustQC");
const googleSetup = require("./tasks/googleSetup");
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
    waitForTimeout: 5000,
  };

  // below gets current date and from there makes the file name when scripts complete
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  let results = { device: device.udid, results: {} };

  const driver = await remote(wdOpts);

  await googleSetup(driver);

  // results.results.quickActions = await adjustQC(driver);

  // Your existing function logic goes here

  // await goToApp(driver, "Control");
  // if (
  //   await driver
  //     .$(
  //       `android=new UiSelector().resourceId("com.sophos.mobilecontrol.client.android:id/requirement_header").text("Battery optimization")`
  //     )
  //     .isExisting()
  // ) {
  //   await driver
  //     .$(
  //       `android=new UiSelector().resourceId("com.sophos.mobilecontrol.client.android:id/wizard_start").className(android.widget.Button).text("STAY PROTECTED")`
  //     )
  //     .click();
  // } else {
  //   console.log("Battery optimization likely already set.");
  // }

  // try {
  //   await driver
  //     .$(`android=new UiSelector().text("Use without an account")`)
  //     .click();
  // } catch {
  //   console.log("Houston... problem");
  // }

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
