const { ClassCallable } = require("../Classes");
const { NativeCallable } = require("../Functions");
const Environment = require("../Environment");
String.prototype.hashCode = function () {
  var hash = 0;
  if (this.length == 0) {
    return hash;
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
};
let nativeclss = new ClassCallable(
  "Hash",
  {
    construct: new NativeCallable(0, [], new Environment(), () => {}, true),

    get: new NativeCallable(
      1,
      ["ang"],
      new Environment(),
      (args) => {
        return args[0].hashCode();
      },
      false
    ),
  },
  null,
  null
);
let lib = nativeclss.call([]);
module.exports = { lib, name: "Hash" };
