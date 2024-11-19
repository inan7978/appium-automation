async function edgePanelsOff(driver) {
  try {
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Display"))
    `
      )
      .click();
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/switch_widget").className("android.widget.Switch"))
        `
      )
      .click();
    return true;
  } catch (error) {
    return error;
  }
}

module.exports = edgePanelsOff;
