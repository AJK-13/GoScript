const Environment = require("./Environment");

const include = require("./Include");

const {
  FuncCallable,
  UserCallable,
  Return,
  Break,
  Continue,
  LambdaFunc,
} = require("./Functions");
const { ClassCallable, ClassInstance } = require("./Classes");

const error = require("./Error");

const resolver = require("./Resolver");

function interpreter(trees, penvironment = null) {
  var environment = new Environment();
  environment.define(
    0,
    "Println",
    new FuncCallable(
      1,
      (args) => {
        console.log(stringify(args[0]));
      },
      () => "<Native Function>"
    ),
    "final"
  );
  environment.define(
    0,
    "Print",
    new FuncCallable(
      1,
      (args) => {
        process.stdout.write(stringify(args[0]));
      },
      () => "<Native Function>"
    ),
    "final"
  );
  environment.define(
    0,
    "Include",
    new FuncCallable(
      1,
      (args) => {
        environment = include(stringify(args[0]), environment, interpretBlock);
      },
      () => "<Native Function>"
    ),
    "final"
  );
  environment.define(
    0,
    "Ask",
    new FuncCallable(
      1,
      (args) => {
        const prompt = require("prompt-sync")();
        let askit = prompt(`> ${args[0]} `);
        if (
          askit[0] == "-" ||
          askit[0] == "0" ||
          askit[0] == "1" ||
          askit[0] == "2" ||
          askit[0] == "3" ||
          askit[0] == "4" ||
          askit[0] == "5" ||
          askit[0] == "6" ||
          askit[0] == "7" ||
          askit[0] == "8" ||
          askit[0] == "9"
        ) {
          return Number(askit);
        } else {
          return askit;
        }
      },
      () => "<Native Function>"
    ),
    "final"
  );
  function checkType(line, err, value, ...types) {
    if (types.includes(typeof value)) return;

    error(line, "Runtime Error", err);
  }

  function isTruthy(object) {
    if (object == null) return false;
    if (typeof object == "boolean") return object;
    return true;
  }

  function interpretBlock(statements, environ) {
    let prevEnviron = environment;
    try {
      environment = environ;
      for (const stmt of statements) {
        interpret(stmt);
      }
    } finally {
      environment = prevEnviron;
    }
  }

  function interpretStmt(statement, environ) {
    let prevEnviron = environment,
      output;
    try {
      environment = environ;
      output = interpret(statement);
    } finally {
      environment = prevEnviron;
    }

    return output;
  }

  function isEqual(a, b) {
    if (a == null && b == null) return true;
    if (a == null) return false;

    return a == b;
  }

  function interpret(expr) {
    if (!expr) return;
    switch (expr.type) {
      // Functions
      case "call": {
        let call = interpret(expr.call);

        let args = [];
        for (const arg of expr.args) {
          args.push(interpret(arg));
        }

        if (!(call instanceof FuncCallable)) {
          error(
            expr.line,
            "Runtime Error",
            "Can only call functions and classes"
          );
        }

        let func = call;
        if (args.length != func.arity) {
          error(
            expr.line,
            "Runtime Error",
            `Expected ${func.arity} arguments but got ${args.length}`
          );
        }

        return func.call(args);
      }

      case "accessor": {
        let obj = interpret(expr.obj);
        if (obj instanceof ClassInstance) {
          return obj.getVal(expr.line, expr.name.value);
        }

        error(
          expr.line,
          "Runtime Error",
          "Only implementations have properties"
        );
      }

      case "accessorset": {
        let obj = interpret(expr.obj);

        if (!(obj instanceof ClassInstance)) {
          error(expr.line, "Runtime Error", "Only implementations have fields");
        }

        let value = interpret(expr.value);
        obj.setVal(expr.name, value);

        return value;
      }

      case "funcdef": {
        let func = new UserCallable(expr, environment, interpretBlock);
        environment.define(expr.line, expr.name.value, func, "var");
        return func;
      }

      case "lambda": {
        let func = new LambdaFunc(expr, environment, interpretStmt);
        return func;
      }

      case "class":
        {
          let superclass = null;
          if (expr.superclass != null) {
            superclass = interpret(expr.superclass);
            if (!(superclass instanceof ClassCallable)) {
              error(expr.line, "Runtime Error", "Super must be a class");
            }
          }

          environment.define(expr.line, expr.name.value, null, "var");

          if (expr.superclass != null) {
            environment = new Environment(environment);
            environment.define(expr.line, "super", superclass, "var");
          }

          let methods = {};
          for (const method of expr.methods) {
            let func = new UserCallable(
              method,
              environment,
              interpretBlock,
              method.name.value == "init"
            );
            methods[method.name.value] = func;
          }

          let newClass = new ClassCallable(
            expr.name.value,
            methods,
            superclass,
            interpretBlock
          );

          if (superclass != null) {
            environment = environment.previous;
          }

          environment.assign(expr.line, expr.name.value, newClass);
        }
        break;

      case "superclass": {
        let superclass = environment.getVal(expr.line, "super");
        let obj = environment.getVal(expr.line, "this");

        let method = superclass.findMethod(expr.method.value);

        if (method == null) {
          error(
            expr.line,
            "Runtime Error",
            "Undefined property '" + expr.method.value + "'"
          );
        }

        return method.bind(obj);
      }

      case "this": {
        return environment.getVal(expr.line, "this");
      }

      case "return": {
        let value = null;
        if (expr.value != null) value = interpret(expr.value);

        throw new Return(value);
      }

      // Loops
      case "whileloop":
        {
          try {
            while (isTruthy(interpret(expr.condition))) {
              interpret(expr.body);
            }
          } catch {}
        }
        break;

      case "repeat":
        {
          try {
            switch (expr.params.length) {
              case 1:
                {
                  let max = interpret(expr.params[0]);
                  checkType(
                    expr.line,
                    "Expected repetition count as number",
                    max,
                    "number"
                  );

                  var i = 0;
                  while (i < max) {
                    i++;
                    interpret(expr.body);
                  }
                }
                break;

              case 3:
                {
                  var variableName = expr.params[0].name;
                  let endValue = interpret(expr.params[1]);
                  let incrementer = interpret(expr.params[2]);

                  checkType(
                    expr.line,
                    "Expected end value as number",
                    endValue,
                    "number"
                  );
                  checkType(
                    expr.line,
                    "Expected incrementer value as number",
                    incrementer,
                    "number"
                  );

                  environment = new Environment(environment);
                  environment.define(expr.line, variableName, null, "var");

                  for (let i = 0; i < endValue; i += incrementer) {
                    environment.assign(expr.line, variableName, i);
                    interpret(expr.body);
                  }

                  environment = environment.previous;
                }
                break;

              case 4:
                {
                  let variableName = expr.params[0].name;
                  let startValue = interpret(expr.params[1]);
                  let endValue = interpret(expr.params[2]);
                  let incrementer = interpret(expr.params[3]);

                  checkType(
                    expr.line,
                    "Expected start value as number",
                    startValue,
                    "number"
                  );
                  checkType(
                    expr.line,
                    "Expected end value as number",
                    endValue,
                    "number"
                  );
                  checkType(
                    expr.line,
                    "Expected incrementer value as number",
                    incrementer,
                    "number"
                  );

                  environment = new Environment(environment);
                  environment.define(expr.line, variableName, null, "var");

                  for (let i = startValue; i < endValue; i += incrementer) {
                    environment.assign(expr.line, variableName, i);
                    interpret(expr.body);
                  }

                  environment = environment.previous;
                }
                break;
            }
          } catch {}
        }
        break;

      case "breakloop": {
        throw new Break();
      }
      case "continueloop": {
        throw new Continue();
      }

      // Logic
      case "ifstatement":
        {
          if (isTruthy(interpret(expr.condition))) {
            interpret(expr.ifTrue);
          } else if (expr.ifFalse != null) {
            interpret(expr.ifFalse);
          }
        }
        break;

      case "ternarystatement": {
        if (isTruthy(interpret(expr.condition))) {
          return interpret(expr.ifTrue);
        } else {
          return interpret(expr.ifFalse);
        }
      }

      case "logical":
        {
          let left = interpret(expr.left);

          if (expr.operator == "OR") {
            if (isTruthy(left)) return left;
          } else {
            if (!isTruthy(left)) return left;
          }

          return interpret(expr.right);
        }
        break;
      // Variables
      case "map":
        {
          let value = null;
          if (expr.val != null) {
            value = expr.val;
            return value;
          }
        }
        break;
      case "variable":
        return environment.getVal(expr.line, expr.name);
      case "var":
        {
          let value = null;
          if (expr.value != null) {
            value = interpret(expr.value);
          }
          environment.define(expr.line, expr.name, value, expr.mut);
        }
        break;
      case "idenvar":
        {
          let value = null;
          if (expr.value != null) {
            value = interpret(expr.value);
          }
          environment.getVal(expr.line, expr.name);
          environment.define(expr.line, expr.name, value, expr.mut);
        }
        break;
      case "identifier":
        return environment.getVal(expr.line, expr.name);

      case "postfix": {
        let varVal = environment.getVal(expr.line, expr.name);

        checkType(expr.line, "Only variables of type number", varVal, "number");

        switch (expr.operator) {
          case "PLUS_PLUS":
            varVal++;
            break;

          case "MINUS_MINUS":
            varVal--;
            break;
        }

        environment.assign(expr.line, expr.name, varVal);
        return varVal;
      }

      case "assign": {
        let assign = interpret(expr.value);
        let varVal = environment.getVal(expr.line, expr.name);
        switch (expr.operator) {
          case "PLUS_EQ":
            checkType(
              expr.line,
              "Only variables of type number or string",
              varVal,
              "number",
              "string"
            );
            checkType(
              expr.line,
              "Only values of type number or string",
              varVal,
              "number",
              "string"
            );
            varVal += assign;
            break;
          case "MINUS_EQ":
            checkType(
              expr.line,
              "Only variables of type number",
              varVal,
              "number"
            );
            checkType(
              expr.line,
              "Only values of type number",
              varVal,
              "number"
            );
            varVal -= assign;
            break;

          case "TIMES_EQ":
            checkType(
              expr.line,
              "Only variables of type number",
              varVal,
              "number"
            );
            checkType(
              expr.line,
              "Only values of type number",
              varVal,
              "number"
            );
            varVal *= assign;
            break;
          case "DIVIDE_EQ":
            checkType(
              expr.line,
              "Only variables of type number",
              varVal,
              "number"
            );
            checkType(
              expr.line,
              "Only values of type number",
              varVal,
              "number"
            );
            varVal /= assign;
            break;
          case "POWER_EQ":
            checkType(
              expr.line,
              "Only variables of type number",
              varVal,
              "number"
            );
            checkType(
              expr.line,
              "Only values of type number",
              varVal,
              "number"
            );
            varVal **= assign;
            break;
          case "MODULO_EQ":
            checkType(
              expr.line,
              "Only variables of type number",
              varVal,
              "number"
            );
            checkType(
              expr.line,
              "Only values of type number",
              varVal,
              "number"
            );
            varVal %= assign;
            break;

          case "COL_EQ":
            varVal = assign;
            break;
        }

        environment.assign(expr.line, expr.name, varVal);
        return varVal;
      }

      // Expressions
      case "expr":
        return interpret(expr.expr);

      case "block":
        {
          interpretBlock(expr.block, new Environment(environment));
        }
        break;

      // Grouping
      case "grouping":
        return interpret(expr.expr);

      case "absolute":
        {
          let value = interpret(expr.expr);

          checkType(
            expr.line,
            "Absolute value expression must return a number",
            value,
            "number"
          );

          return Math.abs(value);
        }
        break;

      case "literal":
        return expr.value;

      // Operations
      case "unary": {
        let right = interpret(expr.right);
        switch (expr.operator) {
          case "MINUS":
            checkType(expr.line, "Only values of type number", right, "number");
            return -right;

          case "BANG":
            return !isTruthy(right);
        }
      }

      case "typechange": {
        if (expr.expr.type == "identifier" && expr.newtype.value == "nil") {
          if (environment.values[expr.expr.name] !== undefined)
            return interpret(expr.expr);
          else return null;
        }

        let value = interpret(expr.expr);

        switch (expr.newtype.value) {
          case "string":
            return stringify(value);

          case "boolean":
            return isTruthy(value);

          case "number":
            if (isNaN(value))
              error(
                expr.line,
                "Runtime Error",
                "Type cannot be converted to number"
              );
            return Number(value);

          case "nil":
            return value;
        }
      }

      case "binary": {
        let left = interpret(expr.left);
        let right = interpret(expr.right);

        switch (expr.operator) {
          case "GREATER":
            checkType(expr.line, "Only values of type number", left, "number");
            checkType(expr.line, "Only values of type number", right, "number");
            return left > right;
          case "GREATER_EQ":
            checkType(expr.line, "Only values of type number", left, "number");
            checkType(expr.line, "Only values of type number", right, "number");
            return left >= right;
          case "LESS":
            checkType(expr.line, "Only values of type number", left, "number");
            checkType(expr.line, "Only values of type number", right, "number");
            return left < right;
          case "LESS_EQ":
            checkType(expr.line, "Only values of type number", left, "number");
            checkType(expr.line, "Only values of type number", right, "number");
            return left <= right;

          case "BANG_EQ":
            return !isEqual(left, right);
          case "EQ_EQ":
            return isEqual(left, right);

          case "PLUS":
            checkType(
              expr.line,
              "Only values of type number or string",
              left,
              "number",
              "string"
            );
            checkType(
              expr.line,
              "Only values of type number or string",
              right,
              "number",
              "string"
            );
            return left + right;
          case "MINUS":
            checkType(expr.line, "Only values of type number", left, "number");
            checkType(expr.line, "Only values of type number", right, "number");
            return left - right;
          case "DIVIDE":
            checkType(expr.line, "Only values of type number", left, "number");
            checkType(expr.line, "Only values of type number", right, "number");
            return left / right;
          case "TIMES":
            checkType(expr.line, "Only values of type number", left, "number");
            checkType(expr.line, "Only values of type number", right, "number");
            return left * right;
          case "MODULO":
            checkType(expr.line, "Only values of type number", left, "number");
            checkType(expr.line, "Only values of type number", right, "number");
            return left % right;
          case "POWER":
            checkType(expr.line, "Only values of type number", left, "number");
            checkType(expr.line, "Only values of type number", right, "number");
            return left ** right;
        }
      }
    }
  }
  let output = null;

  resolver(trees);

  for (const tree of trees) {
    try {
      output = interpret(tree);
    } catch (e) {
      console.log(e);
      output = e.message;
    }
  }

  function stringify(val) {
    if (val == null) return "nil";

    return val.toString();
  }

  return stringify(output);
}

module.exports = interpreter;
