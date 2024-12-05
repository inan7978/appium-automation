const adjustCC = require("../openCC");

async function adjustCC(driver) {
  await openCC(driver);
}

module.exports = adjustCC;
