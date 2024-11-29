async function interceptX(driver, returnToMain) {
  try {
    // sets the accessability settings here
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Accessibility"))
        `
      )
      .click();
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Installed apps"))
        `
      )
      .click();
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Sophos Accessibility Service"))
        `
      )
      .click();

    const checkedAccessibility = await driver
      .$(
        `android=new UiSelector().resourceId("com.android.settings:id/switch_widget")`
      )
      .getAttribute("checked");

    if (checkedAccessibility == "false") {
      await driver
        .$(
          `android=new UiSelector().resourceId("com.android.settings:id/switch_widget")`
        )
        .click();

      await driver
        .$(`//android.widget.Button[@resource-id="android:id/button1"]`)
        .click();
    }
    await returnToMain(driver);

    // app settings in here (appear on top, notifications, etc.)
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

    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Notifications"))
        `
      )
      .click();

    // continue for within notifications here
    return true;
  } catch (error) {
    return error;
  }
}
module.exports = interceptX;
