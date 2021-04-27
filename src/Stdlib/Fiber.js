const { ClassCallable } = require("../Classes");
const { NativeCallable } = require("../Functions");
const Environment = require("../Environment");
var environment = new Environment();
let nativeclss = new ClassCallable(
  "Fiber",
  {
    new: new NativeCallable(
      2,
      ["any"],
      new Environment(),
      (args) => {
        return environment.define(0, args[0], String(args[1]), "void");
      },
      false
    ),

    length: new NativeCallable(
      1,
      ["any"],
      new Environment(),
      (args) => {
        let val = environment.getVal(0, args[0]);
        return val.length;
      },
      false
    ),
    get: new NativeCallable(
      2,
      ["any"],
      new Environment(),
      (args) => {
        let val = environment.getVal(0, args[0]);
        return val[args[1]];
      },
      false
    ),
    getAll: new NativeCallable(
      1,
      ["any"],
      new Environment(),
      (args) => {
        let val = environment.getVal(0, args[0]);
        return val;
      },
      false
    ),
  },
  null,
  null
);
module.exports = { lib: nativeclss, name: "Fiber" };
