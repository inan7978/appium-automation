async function screenTimeout(driver, setting) {
  try {
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Display"))
    `
      )
      .click();
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Screen timeout"))
    `
      )
      .click();

    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("com.android.settings:id/timeout_title").className("android.widget.CheckedTextView").text("${setting}"))
    `
      )
      .click();
    return true;
  } catch (error) {
    return error;
  }
}

module.exports = screenTimeout;
