const goToApp = require("../goToApp");

async function googleSetup(driver) {
  await goToApp(driver, "Chrome");
  await driver
    .$(
      `android= new UiSelector().resourceId("com.android.chrome:id/signin_fre_dismiss_button")`
    )
    .click();

  await driver
    .$(
      `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("com.android.chrome:id/ack_button").text("Got it"))`
    )
    .click();
}

module.exports = googleSetup;
