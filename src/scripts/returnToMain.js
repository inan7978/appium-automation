async function returnToMain(driver) {
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

module.exports = returnToMain;
