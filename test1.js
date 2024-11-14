const { remote } = require("webdriverio");
const process = require("process");

const nameFUser = process.argv[2] || "fname";
const nameLUser = process.argv[3] || "lname";
const emailUser = process.argv[4] || "userEmail";
const passUser = process.argv[5] || "userPass";

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

  // wifi setup
  try {
    const clickConnections = await driver.$('//*[@text="Connections"]');
    await clickConnections.click();
    let checkWifi = false;
    try {
      checkWifi = await driver
        .$(
          `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/summary").className("android.widget.TextView").text("HPCCR-Guest"))
  `
        )
        .waitForDisplayed({
          timeout: 2000,
        });
    } catch {
      console.log("Device is not connected to HPCCR-Guest wifi.");
    }

    console.log(
      "-------------------------check wifi--------------------------------\n",
      await checkWifi,
      "\n",
      "-------------------------------------------------------------------\n"
    );

    if (!checkWifi) {
      await driver
        .$(
          `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Wi-Fi"))
  `
        )
        .click();

      const selectHPCCRWifi = await driver.$('//*[@text="HPCCR-Guest"]');
      await selectHPCCRWifi.click();

      const wifiPassField = await driver.$(
        '//*[@resource-id="com.android.settings:id/edittext"]'
      );
      wifiPassField.waitForDisplayed({ timeout: 10000 });

      const wifiPassFieldTyped = await wifiPassField.setValue(
        "caringforfamily"
      );
      console.log("wifi password enter result: ", wifiPassFieldTyped);

      // Locate the "Connect" button (use the appropriate XPath/ID here)
      const connectWifiBtn = await driver.$(
        '//*[@resource-id="com.android.settings:id/shared_password_container"]'
      );
      const connectWifiBtnResult = await connectWifiBtn.click();
      console.log("connect to wifi button result: ", connectWifiBtnResult);

      await returnToMain();
    } else {
      await returnToMain();
    }
  } catch {
    console.log("Error setting wifi");
    await returnToMain();
  }

  // motion smoothness setup
  await driver
    .$(
      `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Display"))
    `
    )
    .click();

  try {
    const checkMotionSmoothness = await driver
      .$('android=new UiSelector().text("Motion smoothness")')
      .isExisting();
    const checkMotionSmoothnessValue = await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/summary").className("android.widget.TextView").text("Standard"))`
      )
      .waitForDisplayed({
        timeout: 2000,
        message: "Standard smoothness does not appear to be set.",
      });

    console.log(
      "motion smoothness standard?: " + checkMotionSmoothness &&
        checkMotionSmoothnessValue
    );
    if (!checkMotionSmoothnessValue && checkMotionSmoothness) {
      console.log("Motion is not set to standard");
      // add script items to change the motion smoothness here
      await driver
        .$(
          `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Motion smoothness"))
      `
        )
        .click();
      await driver
        .$(
          `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Standard"))
      `
        )
        .click();

      await driver
        .$(
          `android=new UiSelector().resourceId("com.android.settings:id/button").className("android.widget.Button").text("Apply")`
        )
        .click();

      await returnToMain();
    } else {
      // back out of it here
      console.log("Motion is set to standard");
    }
  } catch {
    console.log("Motion smoothness setting not found.");
  }

  // screen timeout settings
  try {
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Screen timeout"))
    `
      )
      .click();

    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("com.android.settings:id/timeout_title").className("android.widget.CheckedTextView").text("2 minutes"))
    `
      )
      .click();
    await driver.back();
  } catch {
    console.log("Screen timeout setting not found.");
  }

  // edge panels disable
  try {
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/switch_widget").className("android.widget.Switch"))
    `
      )
      .click();
    await returnToMain();
  } catch {
    console.log("Unable to toggle the edge panels switch");
    await returnToMain();
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
        `android=new UiSelector().className("android.widget.TextView").text("${nameFUser} ${nameLUser} 7048876441")
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
      await enterName.setValue(`${nameFUser} ${nameLUser} 7048876441`);
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
      await returnToMain();
    } else {
      console.log("User information was already set on lock screen.");
      await driver
        .$(
          '//android.widget.Button[@resource-id="com.samsung.android.app.dressroom:id/confirm_button"]'
        )
        .click();
      await returnToMain();
    }
  } catch {
    console.log("An error occured while setting lock screen message");
    await returnToMain();
  }
}

runTest();
