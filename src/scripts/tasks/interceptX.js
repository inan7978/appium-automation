async function interceptX(driver, returnToMain) {
  try {
    // sets the accessability settings here
    // await driver
    //   .$(
    //     `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Accessibility"))
    //     `
    //   )
    //   .click();
    // await driver
    //   .$(
    //     `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Installed apps"))
    //     `
    //   )
    //   .click();
    // await driver
    //   .$(
    //     `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Sophos Accessibility Service"))
    //     `
    //   )
    //   .click();

    // const checkedAccessibility = await driver
    //   .$(
    //     `android=new UiSelector().resourceId("com.android.settings:id/switch_widget")`
    //   )
    //   .getAttribute("checked");

    // if (checkedAccessibility == "false") {
    //   await driver
    //     .$(
    //       `android=new UiSelector().resourceId("com.android.settings:id/switch_widget")`
    //     )
    //     .click();

    //   await driver
    //     .$(`//android.widget.Button[@resource-id="android:id/button1"]`)
    //     .click();
    // }
    // await returnToMain(driver);

    // appear on top
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Apps"))
        `
      )
      .click();

    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Intercept X"))
        `
      )
      .click();
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Appear on top"))
        `
      )
      .click();

    const checkedAppearOnTop = await driver
      .$(`android=new UiSelector().resourceId("android:id/switch_widget")`)
      .getAttribute("checked");

    if (checkedAppearOnTop == "false") {
      await driver
        .$(
          `android=new UiSelector().resourceId("android:id/title").text("Allow permission")`
        )
        .click();
    }
    await driver.back();
    // notification adjustments
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Notifications"))
        `
      )
      .click();

    await driver
      .$(
        `android=new UiSelector().resourceId("com.android.settings:id/notification_radio_title").text("Silent")`
      )
      .click();
    await driver
      .$(
        `android=new UiSelector().resourceId("com.android.settings:id/noti_type").text("Lock screen")`
      )
      .click();
    await driver
      .$(
        `android=new UiSelector().resourceId("com.android.settings:id/noti_type").text("Badge")`
      )
      .click();
    await driver
      .$(
        `android=new UiSelector().resourceId("android:id/title").text("Notification categories")`
      )
      .click();

    const protectionStatusToggle = await driver
      .$(
        `android=new UiSelector().resourceId("com.android.settings:id/switchWidget").description("Protection status")`
      )
      .getAttribute("checked");

    if (protectionStatusToggle == "true") {
      await driver
        .$(
          `android=new UiSelector().resourceId("com.android.settings:id/switchWidget").description("Protection status")`
        )
        .click();
    }
    const cleanAppsToggle = await driver
      .$(
        `android=new UiSelector().resourceId("com.android.settings:id/switchWidget").description("Clean apps")`
      )
      .getAttribute("checked");

    if (cleanAppsToggle == "true") {
      await driver
        .$(
          `android=new UiSelector().resourceId("com.android.settings:id/switchWidget").description("Clean apps")`
        )
        .click();
    }
    const generalToggle = await driver
      .$(
        `android=new UiSelector().resourceId("com.android.settings:id/switchWidget").description("General")`
      )
      .getAttribute("checked");

    if (generalToggle == "true") {
      await driver
        .$(
          `android=new UiSelector().resourceId("com.android.settings:id/switchWidget").description("General")`
        )
        .click();
    }
    const threatAppsToggle = await driver
      .$(
        `android=new UiSelector().resourceId("com.android.settings:id/switchWidget").description("Threat apps")`
      )
      .getAttribute("checked");

    if (threatAppsToggle == "false") {
      await driver
        .$(
          `android=new UiSelector().resourceId("com.android.settings:id/switchWidget").description("Threat apps")`
        )
        .click();
    }
    await driver.back(); // should probably make a function to go back until certain element is found...
    await driver.back();
    await driver.back();

    // special access setup
    await driver
      .$(
        `android=new UiSelector().className("android.widget.ImageView").description("More options")`
      )
      .click();

    await driver
      .$(
        `android=new UiSelector().className("android.widget.TextView").text("Special access")`
      )
      .click();

    await driver
      .$(
        `android=new UiSelector().className("android.widget.TextView").text("All files access")`
      )
      .click();

    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Intercept X"))
        `
      )
      .click();
    await driver.back();

    // usage data access
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Usage data access"))
          `
      )
      .click();

    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Intercept X"))
        `
      )
      .click();

    await driver.back();
    await driver.back();

    // allow authenticator notifications

    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Authenticator"))
      `
      )
      .click();
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Notifications"))
      `
      )
      .click();

    // check to see if switch is already toggled to on
    const notificationsAuthenticator = await driver
      .$(
        `android=new UiSelector().resourceId("com.android.settings:id/switch_widget")`
      )
      .getAttribute("checked");

    if (notificationsAuthenticator == "false") {
      await driver
        .$(
          `android=new UiSelector().resourceId("com.android.settings:id/switch_widget")`
        )
        .click();
    }

    return true;
  } catch (error) {
    return error;
  }
}
module.exports = interceptX;
