async function openCC(
  driver,
  startPercentage = 0,
  endPercentage = 0.8,
  duration = 800
) {
  try {
    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: 500, y: 100 }, // Starting point (near the top-center of the screen)
          { type: "pointerDown" }, // Touch down
          { type: "pointerMove", duration: 1000, x: 500, y: 1000 }, // Swipe down (to the bottom-center)
          { type: "pointerUp" }, // Release
        ],
      },
    ]);
  } catch (error) {
    console.error("Error while performing swipe up:", error);
    return false;
  }
  try {
    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: 500, y: 100 }, // Starting point (near the top-center of the screen)
          { type: "pointerDown" }, // Touch down
          { type: "pointerMove", duration: 1000, x: 500, y: 1000 }, // Swipe down (to the bottom-center)
          { type: "pointerUp" }, // Release
        ],
      },
    ]);
    return true;
  } catch (error) {
    console.error("Error while performing swipe up:", error);
    return false;
  }
}

module.exports = openCC;
