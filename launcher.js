const { exec } = require("child_process");
const fs = require("fs");
const { remote } = require("webdriverio");
const process = require("process");

async function main() {
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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

  // this is the contents of the script itself
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

    let results = [{ device: device.udid }];

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
        results.push({ "Setting WiFi (HPCCR)": "Success" });
        await returnToMain();
      } else {
        results.push({ "Setting WiFi (HPCCR)": "True" });
        await returnToMain();
      }
    } catch (err) {
      console.log("Error setting wifi");
      results.push({ "Setting WiFi (HPCCR)": err });
      await returnToMain();
    }
    // Rest of your test logic for Wi-Fi, motion smoothness, screen timeout, etc.
    // motion smoothness setup
    // await driver
    //   .$(
    //     `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Display"))
    // `
    //   )
    //   .click();

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

    // // screen timeout settings
    // try {
    //   await driver
    //     .$(
    //       `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Screen timeout"))
    // `
    //     )
    //     .click();

    //   await driver
    //     .$(
    //       `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("com.android.settings:id/timeout_title").className("android.widget.CheckedTextView").text("2 minutes"))
    // `
    //     )
    //     .click();
    //   await driver.back();
    // } catch {
    //   console.log("Screen timeout setting not found.");
    // }

    // edge panels disable
    //     try {
    //       await driver
    //         .$(
    //           `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/switch_widget").className("android.widget.Switch"))
    //     `
    //         )
    //         .click();
    //       await returnToMain();
    //     } catch {
    //       console.log("Unable to toggle the edge panels switch");
    //       await returnToMain();
    //     }

    //     // wallpaper text
    //     await driver
    //       .$(
    //         `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Wallpaper and style"))
    // `
    //       )
    //       .click();

    //     try {
    //       await driver
    //         .$(
    //           `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("com.samsung.android.app.dressroom:id/lock_screenshot").className("android.widget.ImageView"))
    // `
    //         )
    //         .click();

    //       const infoSetAlready = await driver
    //         .$(
    //           `android=new UiSelector().className("android.widget.TextView").text("testing 7048876441")
    // `
    //         )
    //         .isExisting();

    //       console.log("Info already set?: ", infoSetAlready);
    //       if (!infoSetAlready) {
    //         await driver
    //           .$(
    //             `android=new UiSelector().className("android.widget.TextView").text("Contact information")
    // `
    //           )
    //           .click();

    //         const enterName = await driver.$(
    //           '//android.widget.EditText[@resource-id="com.samsung.android.app.dressroom:id/owner_info_edit_text_popup"]'
    //         );
    //         await enterName.waitForDisplayed({ timeout: 3000 });
    //         // await enterName.setValue(`${nameFUser} ${nameLUser} 7048876441`);
    //         await enterName.setValue(`testing 7048876441`);
    //         await driver.pause(1500);

    //         await driver
    //           .$('//android.widget.Button[@resource-id="android:id/button1"]')
    //           .click();
    //         // continue the setting here. not all androids have this
    //         await driver
    //           .$(
    //             '//android.widget.Button[@resource-id="com.samsung.android.app.dressroom:id/confirm_button"]'
    //           )
    //           .click();
    //         await returnToMain();
    //       } else {
    //         console.log("User information was already set on lock screen.");
    //         await driver
    //           .$(
    //             '//android.widget.Button[@resource-id="com.samsung.android.app.dressroom:id/confirm_button"]'
    //           )
    //           .click();
    //         await returnToMain();
    //       }
    //     } catch {
    //       console.log("An error occured while setting lock screen message");
    //       await returnToMain();
    //     }

    console.log(`Results for ${device.udid}:\n`, results);
    await driver.deleteSession();
  }

  // launches appium servers
  async function launchAppiumServers(devices) {
    // exec does not return a promise
    devices.forEach((device) => {
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
        // this throws error when closing the CMD window where appium is run for the device in question. Need to look into it
        resolve(stdout); // Resolve the stdout as the result of the promise
      });
    });
  }

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

main();
