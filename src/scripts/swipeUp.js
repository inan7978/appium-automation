async function swipeUp(
  driver,
  startPercentage = 0.8,
  endPercentage = 0.2,
  duration = 800
) {
  try {
    // Get screen dimensions
    const { width, height } = await driver.getWindowRect();

    // Calculate swipe start and end points
    const startX = width / 2;
    const startY = height * startPercentage; // Starting point near the bottom
    const endY = height * endPercentage; // Ending point near the top

    // Perform the swipe-up gesture
    await driver.touchPerform([
      { action: "press", options: { x: startX, y: startY } },
      { action: "wait", options: { ms: duration } },
      { action: "moveTo", options: { x: startX, y: endY } },
      { action: "release" },
    ]);

    console.log("Swipe up gesture performed successfully.");
    return true;
  } catch (error) {
    console.error("Error while performing swipe up:", error);
    return false;
  }
}

module.exports = swipeUp;
