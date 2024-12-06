const openCC = require("../openCC");
const returnToMain = require("../returnToMain");

async function adjustCC(driver) {
  // opens quick actions
  try {
    await openCC(driver);

    // sequence below removes airplane mode from the small QC and large QC list and mobile data from the large QC list
    await driver
      .$(
        `android= new UiSelector().resourceId("com.android.systemui:id/edit_button_container")`
      )
      .click();

    await driver
      .$(
        `android= new UiSelector().resourceId("com.android.systemui:id/qs_setting_top_edit_text")`
      )
      .click();

    try {
      await driver
        .$(
          `//android.widget.FrameLayout[@content-desc="Airplane
mode, Remove, Button"]/android.widget.ImageView`
        )
        .click();
    } catch (error) {
      console.log("Airplane mode seems to already be rmoved from top list.");
    }

    // let darkModeXY;
    // try {
    //   darkModeXY = await driver
    //     .$(
    //       `//android.widget.Button[@content-desc="Not in quick settings panel. Dark mode, Double tap and hold to long press. Double tap and drag to move."]/android.widget.FrameLayout/android.widget.ImageView`
    //     )
    //     .getLocation();

    //   console.log(`Dark mode coordinates: x:${darkModeXY.x} y:${darkModeXY.y}`);
    // } catch (error) {
    //   console.log("Coordinate for dark mode could not be grabbed.");
    // }

    await driver
      .$(
        `//android.widget.Button[@content-desc="Not in quick settings panel. Dark mode, Double tap and hold to long press. Double tap and drag to move."]/android.widget.FrameLayout/android.widget.ImageView`
      )
      .click();

    // try {
    //   await driver.performActions([
    //     {
    //       type: "pointer",
    //       id: "finger2",
    //       parameters: { pointerType: "touch" },
    //       actions: [
    //         {
    //           type: "pointerMove",
    //           duration: 400,
    //           x: darkModeXY.x + 5, // adding 5 so it doesnt just grab it by the corner. Gives me peace of mind
    //           y: darkModeXY.y + 5,
    //         }, // Starting point (near the top-center of the screen)
    //         { type: "pointerDown" }, // Touch down
    //         { type: "pointerMove", duration: 3000, x: 500, y: 100 }, // move icon up
    //         { type: "pointerUp" }, // Release
    //       ],
    //     },
    //   ]);
    // } catch (error) {
    //   console.error("Error while moving darkmode to top:", error);
    //   return false;
    // }
    await driver
      .$(
        `android= new UiSelector().className("android.widget.TextView").text("Done")`
      )
      .click();

    await driver
      .$(
        `android= new UiSelector().resourceId("com.android.systemui:id/qs_setting_full_edit_text")`
      )
      .click();

    await driver
      .$(
        `//android.widget.FrameLayout[@content-desc="Airplane
mode, Remove, Button"]/android.widget.ImageView`
      )
      .click();

    await driver
      .$(
        `//android.widget.FrameLayout[@content-desc="Mobile
data, Remove, Button"]/android.widget.ImageView`
      )
      .click();

    await driver
      .$(
        `android= new UiSelector().className("android.widget.TextView").text("Done")`
      )
      .click();

    await returnToMain(driver);
    return true;
  } catch (error) {
    return error;
  }
}

module.exports = adjustCC;
