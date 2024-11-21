async function connectWiFi(driver, ssid, passkey) {
  try {
    await driver.$('//*[@text="Connections"]').click();

    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Wi-Fi"))
        `
      )
      .click();

    // this works by checking to see if "HPCCR-Guest" element can be found from the parent of the "Connected" Summary element
    // essentially works as a sibling checker, that verifies both value exist at the same time.
    // Can see issue occur if there are multiple elements with identical attributes or signatures in the same context.
    // This happens because UiSelector, by default, will match the first occurrence that satisfies the selector, unless explicitly constrained.
    const checkConnected = await driver
      .$(
        `android=new UiSelector().resourceId("com.android.settings:id/title").text("HPCCR-Guest").fromParent(
            new UiSelector().resourceId("com.android.settings:id/summary").text("Connected")
        )`
      )
      .isExisting();

    if (!checkConnected) {
      await driver.$(`//*[@text="${ssid}"]`).click();

      const wifiPassField = await driver.$(
        '//*[@resource-id="com.android.settings:id/edittext"]'
      );
      wifiPassField.waitForDisplayed({ timeout: 10000 });

      await wifiPassField.setValue(`${passkey}`);

      await driver
        .$(
          '//*[@resource-id="com.android.settings:id/shared_password_container"]'
        )
        .click();
    } else {
      return true;
    }

    await driver.pause(2000);
    const verify = await driver
      .$(
        `android=new UiSelector().resourceId("com.android.settings:id/title").text("HPCCR-Guest").fromParent(
            new UiSelector().resourceId("com.android.settings:id/summary").text("Connected")
        )`
      )
      .isExisting();

    if (verify) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error setting wifi: ", error);
    return error;
  }
}

module.exports = connectWiFi;
