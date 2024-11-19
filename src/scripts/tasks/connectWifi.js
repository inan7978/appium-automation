async function connectWiFi(driver, ssid, passkey) {
  try {
    const clickConnections = await driver.$('//*[@text="Connections"]');
    await clickConnections.click();
    let checkWifi = false;
    try {
      checkWifi = await driver
        .$(
          `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/summary").className("android.widget.TextView").text("${ssid}"))
        `
        )
        .waitForDisplayed({
          timeout: 2000,
        });
    } catch {
      console.log(`Device is not connected to ${ssid} wifi.`);
    }

    if (!checkWifi) {
      await driver
        .$(
          `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Wi-Fi"))
        `
        )
        .click();

      const selectHPCCRWifi = await driver.$(`//*[@text="${ssid}"]`);
      await selectHPCCRWifi.click();

      const wifiPassField = await driver.$(
        '//*[@resource-id="com.android.settings:id/edittext"]'
      );
      wifiPassField.waitForDisplayed({ timeout: 10000 });

      const wifiPassFieldTyped = await wifiPassField.setValue(`${passkey}`);
      console.log("wifi password enter result: ", wifiPassFieldTyped);

      // Locate the "Connect" button (use the appropriate XPath/ID here)
      const connectWifiBtn = await driver.$(
        '//*[@resource-id="com.android.settings:id/shared_password_container"]'
      );
      const connectWifiBtnResult = await connectWifiBtn.click();
      console.log("connect to wifi button result: ", connectWifiBtnResult);
      return true;
    } else {
      return true;
    }
  } catch (error) {
    console.log("Error setting wifi: ", error);
    return error;
  }
}

module.exports = connectWiFi;
