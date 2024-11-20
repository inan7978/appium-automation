async function wallpaperText(driver, message) {
  try {
    // click the wallpapers setting
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Wallpaper and style"))
      `
      )
      .click();

    // click the image on the wallpaper
    await driver
      .$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("com.samsung.android.app.dressroom:id/lock_screenshot").className("android.widget.ImageView"))
    `
      )
      .click();

    // this checks to see if the value is already set
    const infoSetAlready = await driver
      .$(
        `android=new UiSelector().className("android.widget.TextView").text("${message}")
    `
      )
      .isExisting();

    if (!infoSetAlready) {
      // if not set, do the procedure
      await driver
        .$(
          `android=new UiSelector().className("android.widget.TextView").text("Contact information")
    `
        )
        .click();

      const enterName = await driver.$(
        '//android.widget.EditText[@resource-id="com.samsung.android.app.dressroom:id/owner_info_edit_text_popup"]'
      );
      await enterName.waitForDisplayed({ timeout: 3000 });
      await enterName.setValue(`${message}`);
      await driver.pause(1500);

      await driver
        .$('//android.widget.Button[@resource-id="android:id/button1"]')
        .click();
      // continue the setting here. not all androids have this
      await driver
        .$(
          '//android.widget.Button[@resource-id="com.samsung.android.app.dressroom:id/confirm_button"]'
        )
        .click();
    } else {
      // if set already
      console.log("User information was already set on lock screen.");
      await driver
        .$(
          '//android.widget.Button[@resource-id="com.samsung.android.app.dressroom:id/confirm_button"]'
        )
        .click();
    }
    return true;
  } catch (error) {
    // if error occurs
    return false;
  }
}

module.exports = wallpaperText;
