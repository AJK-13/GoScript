const { ClassCallable } = require("../Classes");
const { NativeCallable } = require("../Functions");
const Environment = require("../Environment");
let nativeclss = new ClassCallable(
  "List",
  {
    init: new NativeCallable(
      0,
      [],
      new Environment(),
      (_, environment) => {
        environment.getVal(0, "this").fields.nativerl = new Array(0);
      },
      false
    ),
    length: new NativeCallable(
      0,
      [],
      new Environment(),
      (_, environment) => {
        let val = environment.getVal(0, "this").fields.nativerl;
        return val.length;
      },
      false
    ),
    insert: new NativeCallable(
      2,
      ["position", "text"],
      new Environment(),
      (args, environment) => {
        let inname = environment.getVal(0, "this").fields.nativerl;
        inname[args[0]] = args[1];
        return inname;
      },
      false
    ),
    remove: new NativeCallable(
      1,
      ["position"],
      new Environment(),
      (args, environment) => {
        let rename = environment.getVal(0, "this").fields.nativerl;
        let index = rename.indexOf(args[0]);
        if (index == -1) {
          index = args[0];
        }
        reval = rename.splice(index, 1);
        return rename;
      },
      false
    ),
    get: new NativeCallable(
      1,
      ["position"],
      new Environment(),
      (args, environment) => {
        let val = environment.getVal(0, "this").fields.nativerl;
        return val[args[0]];
      },
      false
    ),
    getAll: new NativeCallable(
      0,
      [],
      new Environment(),
      (_, environment) => {
        let val = environment.getVal(0, "this").fields.nativerl;
        return val;
      },
      false
    ),
  },
  null,
  null
);
let lib = nativeclss;
module.exports = { lib, name: "List" };
