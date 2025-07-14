const fs = require("fs");
const path = require("path");

function logMiddleware(req, res, next) {
  console.log(`Request URL : ${req.url}`);
  console.log(`Request Method : ${req.method}`);

  const log = `TimeStamp = ${new Date().toLocaleString()} , URL : ${
    req.url
  }, Method : ${req.method}\n`;
  fs.appendFileSync(path.join(__dirname, "logs.txt"), log);

  next();
}

module.exports = logMiddleware;
