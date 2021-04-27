const { ClassCallable } = require("../Classes");
const { NativeCallable } = require("../Functions");
const Environment = require("../Environment");
var environment = new Environment();
let nativeclss = new ClassCallable(
  "List",
  {
    new: new NativeCallable(
      1,
      ["any"],
      new Environment(),
      (args) => {
        return environment.define(0, args[0], new Array(0), "void");
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
    insert: new NativeCallable(
      3,
      ["any"],
      new Environment(),
      (args) => {
        let inname = environment.getVal(0, args[0]);
        inname[args[1]] = args[2];
        return inname;
      },
      false
    ),
    remove: new NativeCallable(
      2,
      ["any"],
      new Environment(),
      (args) => {
        let rename = environment.getVal(0, args[0]);
        let index = rename.indexOf(args[1]);
        if (index == -1) {
          index = args[1];
        }
        reval = rename.splice(index, 1);
        return rename;
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
module.exports = { lib: nativeclss, name: "List" };
