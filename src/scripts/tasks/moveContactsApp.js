const swipeUp = require("../swipeUp");

async function moveContactsApp(driver) {
  try {
    swipeUp(driver);
    // Locate the app icon
    const appIcon = await driver.$(appIconSelector);
    await appIcon.waitForDisplayed({ timeout: 3000 });

    // Get the app icon's location and size
    const appIconRect = await appIcon.getRect();

    // Calculate starting position
    const startX = appIconRect.x + appIconRect.width / 2;
    const startY = appIconRect.y + appIconRect.height / 2;

    // Define the target location for the home screen
    // This could be dynamically determined or hard-coded based on your layout
    const homeTarget = homeScreenTarget || { x: 200, y: 400 };

    // Perform the touch-and-hold and move action
    await driver.touchPerform([
      { action: "press", options: { x: startX, y: startY } },
      { action: "wait", options: { ms: 1000 } }, // Simulate long press
      { action: "moveTo", options: { x: homeTarget.x, y: homeTarget.y } },
      { action: "release" },
    ]);

    console.log("App successfully moved to the home screen.");
    return true;
  } catch (error) {
    console.error("Error while moving app to home screen:", error);
    return false;
  }
}

module.exports = moveContactsApp;
