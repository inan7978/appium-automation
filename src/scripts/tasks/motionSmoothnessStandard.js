// motion smoothness setup
async function motionSmoothnessStandard(driver) {
  try {
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Display"))
      `
      )
      .click();
    await driver
      .$('android=new UiSelector().text("Motion smoothness")')
      .click();

    const standardSet = await driver
      .$(
        `android=new UiSelector().resourceId("android:id/checkbox").instance(1)`
      )
      .getAttribute("checked");

    console.log("Testing here: ", standardSet);

    if (standardSet == "false") {
      console.log("Motion is not set to standard");
      // add script items to change the motion smoothness here
      await driver
        .$(
          `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Standard"))
      `
        )
        .click();

      await driver
        .$(
          `android=new UiSelector().resourceId("com.android.settings:id/button").className("android.widget.Button").text("Apply")`
        )
        .click();
      return true;
    }
    console.log("Motion is set to standard");
    return true;
  } catch (error) {
    return error;
  }
}

module.exports = motionSmoothnessStandard;
