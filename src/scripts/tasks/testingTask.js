async function testingTask(driver) {
  // Locate the parent container of the siblings (e.g., LinearLayout)
  const clickConnections = await driver.$('//*[@text="Connections"]');
  await clickConnections.click();
  await driver
    .$(
      `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("android:id/title").className("android.widget.TextView").text("Wi-Fi"))
        `
    )
    .click();

  const siblingElement = await driver.$(
    `android=new UiSelector().resourceId("com.android.settings:id/title").text("HPCCR-Guest").fromParent(
        new UiSelector().resourceId("com.android.settings:id/summary").text("Connected")
    )`
  );

  if (await siblingElement.isExisting()) {
    console.log("Sibling element found.");
  } else {
    console.log("Sibling element not found.");
  }
}

module.exports = testingTask;
