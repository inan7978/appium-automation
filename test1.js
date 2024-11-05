const { remote } = require("webdriverio");
const process = require("process");

const nameFUser = process.argv[2] || null;
const nameLUser = process.argv[3] || null;
const emailUser = process.argv[4] || null;
const passUser = process.argv[5] || null;

const capabilities = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Android",
  "appium:appPackage": "com.android.settings",
  "appium:appActivity": ".Settings",
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities,
};

async function runTest() {
  const driver = await remote(wdOpts);

  async function returnToMain() {
    while (true) {
      await driver.back();
      const temp = await driver
        .$(
          `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Samsung account"))
`
        )
        .isExisting();

      if (temp) {
        console.log("Back to main settings page.");
        return "At main";
      }
    }
  }

  // // wifi setup
  // try {
  //   const clickConnections = await driver.$('//*[@text="Connections"]');
  //   await clickConnections.click();
  //   const checkWifi = false;
  //   try {
  //     checkWifi = await driver.$('//*[@text="HPCCR-Guest"]').waitForDisplayed({
  //       timeout: 3000,
  //       message: "Did not find HPCCR-Guest wifi.",
  //     });
  //   } catch {
  //     console.log("Device is not connected to HPCCR-Guest wifi.");
  //   }

  //   console.log(
  //     "-------------------------check wifi--------------------------------\n",
  //     await checkWifi,
  //     "\n",
  //     "-------------------------------------------------------------------\n"
  //   );

  //   if (!checkWifi) {
  //     const findWiFi = await driver.$('//*[@text="Wi-Fi"]');
  //     await findWiFi.click();

  //     const selectHPCCRWifi = await driver.$('//*[@text="HPCCR-Guest"]');
  //     await selectHPCCRWifi.click();

  //     const wifiPassField = await driver.$(
  //       '//*[@resource-id="com.android.settings:id/edittext"]'
  //     );
  //     wifiPassField.waitForDisplayed({ timeout: 10000 });

  //     const wifiPassFieldTyped = await wifiPassField.setValue(
  //       "caringforfamily"
  //     );
  //     console.log("wifi password enter result: ", wifiPassFieldTyped);

  //     // Locate the "Connect" button (use the appropriate XPath/ID here)
  //     const connectWifiBtn = await driver.$(
  //       '//*[@resource-id="com.android.settings:id/shared_password_container"]'
  //     );
  //     const connectWifiBtnResult = await connectWifiBtn.click();
  //     console.log("connect to wifi button result: ", connectWifiBtnResult);

  //     await returnToMain();
  //   } else {
  //     await returnToMain();
  //   }
  // } catch {
  //   console.log("Error setting wifi");
  //   await returnToMain();
  // }

  // motion smoothness setup
  //   await driver
  //     .$(
  //       `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Display"))
  // `
  //     )
  //     .click();

  // try {
  //   const checkMotionSmoothness = await driver
  //     .$(
  //       `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/summary").className("android.widget.TextView").text("Standard"))`
  //     )
  //     .waitForDisplayed({
  //       timeout: 2000,
  //       message: "Standard smoothness does not appear to be set.",
  //     });

  //   console.log("motion smoothness standard?: " + checkMotionSmoothness);
  //   if (!checkMotionSmoothness) {
  //     console.log("Motion is not set to standard");
  //     // add script items to change the motion smoothness here
  //   } else {
  //     // back out of it here
  //     console.log("Motion is set to standard");
  //   }
  // } catch {
  //   console.log("Motion smoothness setting not found.");
  // }

  // screen timeout settings
  //   try {
  //     await driver
  //       .$(
  //         `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Screen timeout"))
  // `
  //       )
  //       .click();

  //     await driver
  //       .$(
  //         `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("com.android.settings:id/timeout_title").className("android.widget.CheckedTextView").text("2 minutes"))
  // `
  //       )
  //       .click();
  //     await driver.back();
  //   } catch {
  //     console.log("Screen timeout setting not found.");
  //   }

  // edge panels disable
  //   try {
  //     await driver
  //       .$(
  //         `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/switch_widget").className("android.widget.Switch"))
  // `
  //       )
  //       .click();
  //     await returnToMain();
  //   } catch {
  //     console.log("Unable to toggle the edge panels switch");
  //     await returnToMain();
  //   }

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
    // continue the setting here. not all androids have this
    await returnToMain();
  } catch {
    console.log("An error occured while setting lock screen message");
    await returnToMain();
  }
}

runTest();
