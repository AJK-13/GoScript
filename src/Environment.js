const error = require("./Error");

class Environment {
  constructor(previous = null) {
    this.previous = previous;
    this.values = {};
  }

  // getVal(line, name) {
  //   if (this.values[name] !== undefined) return this.values[name].value;
  //   if (this.previous != null) return this.previous.getVal(line, name);
  //   error(line, "Runtime Error", name + " is not defined");
  // }
  getVal(line, name) {
    if (this.values[name] !== undefined) return this.values[name].value;

    // No need for .value here because of the preceding line
    if (this.previous != null) return this.previous.getVal(line, name);
    error(line, name + " is not defined.");
  }

  checkVal(line, name) {
    if (this.values[name] !== undefined) return this.values[name].value;
    if (this.previous != null) return this.previous.getVal(line, name);
  }

  getMut(name) {
    if (this.values[name] !== undefined) return this.values[name].mut;
    if (this.previous != null) return this.previous.getMut(name);
    return "var";
  }

  define(line, name, value, mut) {
    if (this.getMut(name) == "final")
      error(line, "Runtime Error", `Final ${name} is already defined`);
    this.values[name] = { value, mut };
  }
  assign(line, name, value) {
    if (this.getMut(name) == "final") {
      error(line, "Runtime Error", "Assignment to constant " + name);
      return;
    }

    if (this.values[name] !== undefined) {
      this.values[name].value = value;
      return;
    }

    if (this.previous != null) {
      this.previous.assign(line, name, value);
      return;
    }

    error(line, "Runtime Error", name + " is not defined");
  }
}

module.exports = Environment;
