const error = require("./error");
const fs = require("fs");
const { exit } = require("process");
function include(libname, globals, interpretBlock, interpreter) {
  var libs = fs.readdirSync(__dirname + "/Stdlib");
  if (libs.includes(libname + ".js")) {
    const { lib, name } = require("./Stdlib/" + libname);
    globals.define(0, name, lib, "final");
  } else {
    console.log(
      `\x1b[91m\x1b[0m\x1b[91mError: \x1b[0m\x1b[1m'${libname}' is not a Stdlib Module\x1b[0m`
    );
    exit(0);
  }
  return globals;
}

module.exports = include;
