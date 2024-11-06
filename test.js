const { remote } = require("webdriverio");
const process = require("process");

const nameFUser = process.argv[2] || "fname";
const nameLUser = process.argv[3] || "lname";
const emailUser = process.argv[4] || "userEmail";
const passUser = process.argv[5] || "userPass";

// Define the device configurations
const devices = [
  {
    udid: "R3CWA0GWK7Z", // Replace with actual UDID
    port: 4723,
    systemPort: 8200,
    deviceName: "Android Device 1",
    nameFUser: "Bill",
    nameLUser: "Freeman",
  },
  {
    udid: "R5CR71ETPYK", // Replace with actual UDID
    port: 4724,
    systemPort: 8201,
    deviceName: "Android Device 2",
    nameFUser: "Mark",
    nameLUser: "Lanier",
  },
  // Add more devices here
];

async function runTest(device) {
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

  const driver = await remote(wdOpts);

  // Your existing function logic goes here
  async function returnToMain() {
    while (true) {
      await driver.back();
      const temp = await driver
        .$(
          `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Samsung account"))`
        )
        .isExisting();

      if (temp) {
        console.log("Back to main settings page.");
        return "At main";
      }
    }
  }

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
  // Rest of your test logic for Wi-Fi, motion smoothness, screen timeout, etc.

  await driver.deleteSession();
}

// Run tests in parallel
(async () => {
  await Promise.all(devices.map((device) => runTest(device)));
})();
