const error = require("./Error");
function resolver(trees) {
  let current = {
    func: false,
    loop: false,
    construct: false,
    clss: false,
    superClass: false,
  };

  function resolveBlock(statements) {
    for (const expr of statements) {
      switch (expr.type) {
        case "return":
          if (current.construct)
            error(expr.line, "Constructors cannot have return values");
          if (!current.func && !current.clss)
            error(
              expr.line,
              "Return statements can only be in functions and methods"
            );
          break;

        case "block":
          resolveBlock(expr.block);
          break;

        default:
          resolve(expr);
          break;
      }
    }
  }

  function resolve(expr) {
    switch (expr.type) {
      case "expr":
        resolve(expr.expr);
        break;

      case "funcdef":
        current.func = true;
        resolveBlock(expr.body);
        current.func = false;
        break;

      case "class":
        if (
          expr.superclass != null &&
          expr.name.value == expr.superclass.name
        ) {
          error(expr.line, "A class cannot inherit from itself");
        }

        for (const method of expr.methods) {
          current.clss = true;
          if (method.name.value == "construct") current.construct = true;

          resolveBlock(method.body);
          current.construct = false;
        }

        current.clss = false;
        break;

      case "whileloop":
        current.loop = true;
        resolve(expr.body);
        current.loop = false;
        break;
      case "block":
        resolveBlock(expr.block);
        break;

      case "superclass":
        if (!current.clss)
          error(expr.line, "'superClass' can only be inside methods");
        break;

      case "call":
        for (const arg of expr.args) {
          resolve(arg);
        }
        break;

      case "return":
        if (!current.func)
          error(
            expr.line,
            "Return statements can only be in functions and methods"
          );
        break;
    }
  }

  for (const tree of trees) {
    resolve(tree);
  }
}

module.exports = resolver;
