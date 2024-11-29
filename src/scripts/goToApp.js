async function goToApp(driver, appName) {
  // this function will take the app name and navigate to that app
  console.log(`Navigate to ${appName} called on driver ${driver}.`);
  await driver.pressKeyCode(3); // simulates pressing the home key
  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: 300, y: 500 }, // Start point
        { type: "pointerDown", button: 0 }, // Finger down
        { type: "pointerMove", duration: 500, x: 0, y: -500 }, // Move finger
        { type: "pointerUp", button: 0 }, // Lift finger
      ],
    },
  ]);

  let counter = 0;
  while (
    !(await driver
      .$(
        `android= new UiSelector().className("android.widget.TextView").text("${appName}")`
      )
      .isExisting()) &&
    counter < 5
  ) {
    counter++;
    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: 300, y: 500 }, // Start point
          { type: "pointerDown", button: 0 }, // Finger down
          { type: "pointerMove", duration: 500, x: -500, y: 0 }, // Move finger
          { type: "pointerUp", button: 0 }, // Lift finger
        ],
      },
    ]);
  }

  try {
    await driver
      .$(
        `android= new UiSelector().className("android.widget.TextView").text("${appName}")`
      )
      .click();

    await driver
      .$(
        `android= new UiSelector().className("android:id/button1").text("Allow")`
      )
      .click();
  } catch (error) {
    return "Error: ", error;
  }
  return "Successfully navigated to: ", appName;
}

module.exports = goToApp;
