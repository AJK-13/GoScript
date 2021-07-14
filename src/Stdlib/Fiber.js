const { ClassCallable } = require("../Classes");
const { NativeCallable } = require("../Functions");
const Environment = require("../Environment");
let nativeclss = new ClassCallable(
  "Fiber",
  {
    init: new NativeCallable(
      0,
      [],
      new Environment(),
      (_, environment) => {
        environment.getVal(0, "this").fields.nativerl = new String();
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
    set: new NativeCallable(
      1,
      ["value"],
      new Environment(),
      (args, environment) => {
        environment.getVal(0, "this").fields.nativerl = String(args[0]);
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
module.exports = { lib, name: "Fiber" };
