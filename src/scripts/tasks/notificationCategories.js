async function notificationCategories(driver) {
  try {
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Notifications"))
          `
      )
      .click();

    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Advanced settings"))
          `
      )
      .click();

    const categoriesEnabled = await driver
      .$(
        `android=new UiSelector().resourceId("android:id/widget_frame").instance(5)`
      )
      .getAttribute("checked");
    console.log("Categories enabled: ", categoriesEnabled);
    if (categoriesEnabled == "false") {
      await driver
        .$(
          `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Manage notification categories for each app"))
          `
        )
        .click();
    }

    return true;
  } catch (error) {
    console.log("Error with setting notifications.");
    return error;
  }
}

module.exports = notificationCategories;
