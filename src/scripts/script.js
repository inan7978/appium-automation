// this is the contents of the script itself
const returnToMain = require("./returnToMain");
const fs = require("fs");
const { remote } = require("webdriverio");
const connectWiFi = require("./tasks/connectWifi");
const motionSmoothnessStandard = require("./tasks/motionSmoothnessStandard");
const screenTimeout = require("./tasks/screenTimeout");
const edgePanelsOff = require("./tasks/edgePanelsOff");

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

  let results = { device: device.udid, results: {} };

  const driver = await remote(wdOpts);

  // Your existing function logic goes here

  results.results.wifiSet = await connectWiFi(
    driver,
    "HPCCR-Guest",
    "caringforfamily"
  );
  await returnToMain(driver);

  // motion smoothness setup
  results.results.standardSmoothness = await motionSmoothnessStandard(driver);
  await returnToMain(driver);

  // screen timeout settings
  results.results.screenTimeout = await screenTimeout(driver, "2 minutes");
  await returnToMain(driver);

  // edge panels disable
  results.results.edgePanelsOff = await edgePanelsOff(driver);
  await returnToMain(driver);

  // notification categories

  try {
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Notifications"))
      `
      )
      .click();

    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Advanced settings"))
      `
      )
      .click();

    const categoriesEnabled = await driver
      .$(
        `android=new UiSelector().resourceId("android:id/widget_frame").instance(5)`
      )
      .getAttribute("checked");
    console.log("Categories enabled: ", categoriesEnabled);
    if (categoriesEnabled == "false") {
      await driver
        .$(
          `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Manage notification categories for each app"))
      `
        )
        .click();
    }

    results.results.notificationCategories = true;
    await returnToMain(driver);
  } catch (error) {
    console.log("Error with setting notifications.");
    results.results.notificationCategories = false;
  }

  // wallpaper text
  await driver
    .$(
      `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Wallpaper and style"))
    `
    )
    .click();

  try {
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("com.samsung.android.app.dressroom:id/lock_screenshot").className("android.widget.ImageView"))
    `
      )
      .click();

    const infoSetAlready = await driver
      .$(
        `android=new UiSelector().className("android.widget.TextView").text("testing 7048876441")
    `
      )
      .isExisting();

    console.log("Info already set?: ", infoSetAlready);
    if (!infoSetAlready) {
      await driver
        .$(
          `android=new UiSelector().className("android.widget.TextView").text("Contact information")
    `
        )
        .click();

      const enterName = await driver.$(
        '//android.widget.EditText[@resource-id="com.samsung.android.app.dressroom:id/owner_info_edit_text_popup"]'
      );
      await enterName.waitForDisplayed({ timeout: 3000 });
      // await enterName.setValue(`${nameFUser} ${nameLUser} 7048876441`);
      await enterName.setValue(`testing 7048876441`);
      await driver.pause(1500);

      await driver
        .$('//android.widget.Button[@resource-id="android:id/button1"]')
        .click();
      // continue the setting here. not all androids have this
      await driver
        .$(
          '//android.widget.Button[@resource-id="com.samsung.android.app.dressroom:id/confirm_button"]'
        )
        .click();
      await returnToMain(driver);
    } else {
      console.log("User information was already set on lock screen.");
      await driver
        .$(
          '//android.widget.Button[@resource-id="com.samsung.android.app.dressroom:id/confirm_button"]'
        )
        .click();
      results.results.LockScreenMessageSet = true;
      await returnToMain(driver);
    }
  } catch {
    results.results.LockScreenMessageSet = false;
    console.log("An error occured while setting lock screen message");
    await returnToMain(driver);
  }

  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  // Example Output: "2024-11-14"
  console.log(`Results for ${device.udid}:\n`, results);
  const jsonResult = JSON.stringify(results, null, 2);
  fs.writeFileSync(
    `./output-files/${device.udid}-${formattedDate}.txt`,
    jsonResult
  );

  await driver.deleteSession();
}

module.exports = script;
