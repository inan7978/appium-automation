const { remote } = require("webdriverio");
const process = require("process");

const nameFUser = process.argv[2] || null;
const nameLUser = process.argv[3] || null;
const emailUser = process.argv[4] || null;
const passUser = process.argv[5] || null;

// function mesHelp(message) {
//   let description = message == null ? "Ok" : message;
//   return;
// }

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

const pauseTime = 1500;

async function runTest() {
  const driver = await remote(wdOpts);
  // this is the wifi setup
  const clickConnections = await driver.$('//*[@text="Connections"]');
  const clickConnectionsResult = await clickConnections.click();
  console.log("click connection result: ", clickConnectionsResult);
  const checkWifi = await driver.$('//*[@text="HPCCR-Guest"]');
  console.log(
    "-------------------------check wifi--------------------------------\n",
    checkWifi,
    "\n",
    "-------------------------------------------------------------------\n"
  );
  // checks to see if already connected to wifi
  if (checkWifi.error && checkWifi.error.error == "no such element") {
    const clickWiFi = await driver.$('//*[@text="Wi-Fi"]');
    const clickWiFiResult = await clickWiFi.click();
    console.log("click wifi result: ", clickWiFiResult);

    const selectHPCCRWifi = await driver.$('//*[@text="HPCCR-Guest"]');
    await driver.pause(pauseTime);
    const selectHPCCRWifiResult = await selectHPCCRWifi.click();
    console.log("select HPCCR Wifi result: ", selectHPCCRWifiResult);

    // pause to allow ui to load
    // await driver.pause(pauseTime);

    const wifiPassField = await driver.$(
      '//*[@resource-id="com.android.settings:id/edittext"]'
    );
    await wifiPassField.waitForDisplayed({ timeout: 10000 });
    const wifiPassFieldTyped = await wifiPassField.setValue("caringforfamily");
    console.log("wifi password enter result: ", wifiPassFieldTyped);

    // Locate the "Connect" button (use the appropriate XPath/ID here)
    const connectWifiBtn = await driver.$(
      '//*[@resource-id="com.android.settings:id/shared_password_container"]'
    );
    const connectWifiBtnResult = await connectWifiBtn.click();
    console.log("connect to wifi button result: ", connectWifiBtnResult);

    await driver.pause(pauseTime);
    await driver.back();
    await driver.pause(pauseTime);
    await driver.back();
  } else {
    await driver.back();
  }

  // this is the display setup - motion smoothness
  const findDisplay = await driver.$(
    'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Display"))'
  );
  const clickDisplayResult = await findDisplay.click();
  console.log("enter into display settings result: ", clickDisplayResult);

  const checkMotion = await driver.$(
    '//android.widget.TextView[@resource-id="android:id/summary" and @text="Standard"]'
  );

  console.log(
    "-------------------------check motion -----------------------------\n",
    checkMotion,
    "\n",
    "-------------------------------------------------------------------\n"
  );

  if (checkMotion.error && checkMotion.error.error == "no such element") {
    const selectMotionSmoothness = await driver.$(
      'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Motion smoothness"))'
    );
    const enterMotionSmoothness = await selectMotionSmoothness.click();
    console.log(
      "result of entering motion smoothness settings: ",
      enterMotionSmoothness
    );

    const findStandard = await driver.$(
      '//android.widget.TextView[@resource-id="android:id/title" and @text="Standard"]'
    );
    const clickStandard = findStandard.click();
    console.log("result of selecting standard: ", clickStandard);

    const selectConfirmStandardButton = await driver.$(
      '//android.widget.Button[@resource-id="com.android.settings:id/button"]'
    );
    const clickConfirmStandardButton =
      await selectConfirmStandardButton.click();
    console.log(
      "result of clicking the confirm button when setting motion smoothness: ",
      clickConfirmStandardButton
    );
    await driver.pause(pauseTime);
  }

  // this is the display setup - screen timeout

  const enterScreenTimeoutSettings = await driver
    .$(
      'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Screen timeout"))'
    )
    .click();
  console.log("Enter screen timeout setting: ", enterScreenTimeoutSettings);
  await driver.pause(pauseTime);
  const select2Minutes = await driver
    .$('android=new UiSelector().text("2 minutes")')
    .click();

  console.log("Select 2 minutes: ", select2Minutes);
  await driver.pause(pauseTime);
  await driver.back();
  await driver.back();

  await driver
    .$(
      'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Wallpaper and style"))'
    )
    .click();

  await driver
    .$(
      '//android.widget.FrameLayout[@content-desc="Lock screen"]/android.widget.FrameLayout/android.widget.FrameLayout'
    )
    .click();

  await driver
    .$(
      '//android.widget.FrameLayout[@content-desc="Contact information"]/android.widget.LinearLayout'
    )
    .click();
  await driver.pause(pauseTime);
  await driver
    .$(
      '//android.widget.EditText[@resource-id="com.samsung.android.app.dressroom:id/owner_info_edit_text_popup"]'
    )
    .setValue(`${nameFUser} ${nameLUser} 7048876441`);

  await driver
    .$('//android.widget.Button[@resource-id="android:id/button1"]')
    .click();

  await driver.pause(pauseTime);

  await driver
    .$(
      'new UiSelector().resourceId("com.samsung.android.app.dressroom:id/confirm_button")'
    )
    .click();

  await driver.pause(pauseTime);

  driver.back();
}

//*[@resource-id="com.android.settings:id/owner_info_edit_text_popup"]

runTest().catch(console.error);
