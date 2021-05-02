const error = require("./Error");
function parser(tokens) {
  let index = 0;
  function peek() {
    return tokens[index] || {};
  }
  function consume(name, expect) {
    if (tokens[index].name != name) error(tokens[index].line, expect);
    index++;
    return tokens[index];
  }
  function match(...types) {
    for (const type of types) {
      if (check(type)) {
        index++;
        return true;
      }
    }
    return false;
  }
  function check(type) {
    if (isEOF()) return false;
    return peek().name == type;
  }
  function isEOF() {
    return peek().name == "EOF";
  }
  function peek() {
    return tokens[index];
  }
  function peek2() {
    return tokens[index + 2];
  }
  function previous() {
    return tokens[index - 1];
  }
  function previous6() {
    return tokens[index - 6];
  }
  function primary() {
    if (match("FALSE"))
      return { type: "literal", value: false, line: previous().line };
    if (match("TRUE"))
      return { type: "literal", value: true, line: previous().line };
    if (match("NIL"))
      return { type: "literal", value: null, line: previous().line };
    if (match("NUMBER")) {
      return {
        type: "literal",
        value: previous().value,
        line: previous().line,
      };
    } else if (match("STRING")) {
      return {
        type: "literal",
        value: previous().value,
        line: previous().line,
      };
    }
    if (match("IDENTIFIER")) {
      return {
        type: "variable",
        name: previous().value,
        line: previous().line,
      };
    }
    if (match("ASK")) {
      return {
        type: "variable",
        name: previous().value,
        line: previous().line,
      };
    }
    if (match("HASHTAG")) {
      if (match("INCLUDE")) {
        return {
          type: "variable",
          name: previous().value,
          line: previous().line,
        };
      }
    }
    if (match("PRINTLN")) {
      // println("Hi");
      return {
        type: "identifier",
        name: previous().value,
        line: previous().line,
      };
    }
    if (match("PRINT")) {
      // print("Hi");
      return {
        type: "identifier",
        name: previous().value,
        line: previous().line,
      };
    }
    if (match("BANG")) {
      // !Hello("Hiii");
      return call();
    }
    if (match("THIS")) return { type: "this", line: previous().line };
    if (match("SUPERCLASS")) {
      let keyword = previous();
      consume("DOT", "Expect '.' after 'superclass'");
      let method = peek();
      consume("IDENTIFIER", "Expect superclass method name");
      return { type: "superclass", keyword, method, line: method.line };
    }
    error(peek().line, "Unexpected token '" + peek().value + "'");
  }
  let statements = [];
  while (!isEOF()) {
    statements.push(stmt());
  }
  function stmt() {
    if (match("VOID")) return voidDec();
    if (match("FINAL")) return finalDec();
    if (match("CLASS")) return classDeclaration();
    if (match("FN")) return fnDeclaration();
    if (match("IDENTIFIER")) return idenDec();
    return statement();
  }
  function fnDeclaration(kind) {
    // fn Hi() := {}
    let name = peek();
    consume("IDENTIFIER", "Expected " + kind + " name");
    let line = name.line;

    consume("LEFT_PAREN", "Expected '(' after " + kind + " name");

    let params = [];
    if (!check("RIGHT_PAREN")) {
      do {
        params.push(peek());
        consume("IDENTIFIER", "Expected parameter name");
      } while (match("COMMA"));
    }
    consume("RIGHT_PAREN", "Expected ')' after parameters");
    consume("COL_EQ", "Expected assignment operator");
    consume("LEFT_BRACE", "Expected '{' before " + kind + " body");
    let body = block();

    return { type: "funcdef", line, name, params, body };
  }
  function funcDeclaration(kind) {
    // fn Hi := () {}
    let name = peek();
    consume("IDENTIFIER", "Expected " + kind + " name");
    let line = name.line;
    consume("LEFT_PAREN", "Expected '(' after " + kind + " name");

    let params = [];
    if (!check("RIGHT_PAREN")) {
      do {
        params.push(peek());
        consume("IDENTIFIER", "Expected parameter name");
      } while (match("COMMA"));
    }
    consume("RIGHT_PAREN", "Expected ')' after parameters");
    consume("LEFT_BRACE", "Expected '{' before " + kind + " body");
    let body = block();

    return { type: "funcdef", line, name, params, body };
  }
  function classDeclaration() {
    let name = peek();
    consume("IDENTIFIER", "Expected class name");
    consume("COL_EQ", "Expected assignment operator");
    let superclass = null;
    if (match("IMPLEMENTS")) {
      consume("IDENTIFIER", "Expected superclass name");
      superclass = {
        type: "variable",
        line: previous().line,
        name: previous().value,
      };
    }
    consume("LEFT_BRACE", "Expected '{' before class body");
    let methods = [];
    while (!check("RIGHT_BRACE") && !isEOF()) {
      methods.push(funcDeclaration("method"));
    }
    consume("RIGHT_BRACE", "Expected '}' after class body");
    return { type: "class", line: name.line, name, superclass, methods };
  }
  function voidDec() {
    let type = previous().value;
    let line = peek().line;
    let name = peek().value;
    consume("IDENTIFIER", "Expected variable name");
    let value = null;
    if (match("COL_EQ")) {
      value = expression();
    }
    consume("SEMI", "Expected ';' after variable declaration");
    return { type: "var", line, mut: type, name, value };
  }
  function finalDec() {
    let type = previous().value;
    let line = peek().line;
    let name = peek().value;
    consume("IDENTIFIER", "Expected variable name");
    let value = null;
    if (match("COL_EQ")) {
      value = expression();
    }
    consume("SEMI", "Expected ';' after variable declaration");
    return { type: "var", line, mut: type, name, value };
  }
  function idenDec() {
    let type = "void";
    let line = peek().line;
    let name = previous().value;
    let value = null;
    if (match("COL_EQ")) {
      value = expression();
    }
    consume("SEMI", "Expected ';' after variable declaration");
    return { type: "idenvar", line, mut: type, name, value };
  }
  function block() {
    let statements = [];

    while (!check("RIGHT_BRACE") && !isEOF()) {
      statements.push(stmt());
    }

    consume("RIGHT_BRACE", "Expected '}' after block");
    return statements;
  }
  function statement() {
    if (match("IF")) return ifStatement();
    if (match("RTN")) return returnStatement();
    if (match("WHILE")) return whileStatement();
    if (match("FOR")) return forStatement();
    if (match("BREAK")) return breakStatement();
    if (match("CONTINUE")) return continueStatement();
    if (match("DOLLAR")) return type_change();
    if (match("LEFT_BRACE"))
      return { type: "block", line: previous().line, block: block() };

    return expressionStatement();
  }
  function breakStatement() {
    consume("SEMI", "Expected ';' after break statement");
    return { type: "breakloop", line: previous().line };
  }
  function continueStatement() {
    consume("SEMI", "Expected ';' after continue statement");
    return { type: "continueloop", line: previous().line };
  }
  function forStatement() {
    consume("LEFT_PAREN", "Expect '(' after 'for'.");
    let line = previous().line;

    let initializer;
    if (match("SEMI")) {
      initializer = null;
    } else if (match("VOID")) {
      initializer = voidDec();
    } else if (match("FINAL")) {
      initializer = finalDec();
    } else {
      initializer = expressionStatement();
    }

    let condition = null;
    if (!check("SEMI")) {
      condition = expression();
    }
    consume("SEMI", "Expect ',' after loop condition.");

    let increment = null;
    if (!check("RIGHT_PAREN")) {
      increment = expression();
    }
    consume("RIGHT_PAREN", "Expect ')' after for clauses.");

    let body = statement();

    if (increment != null) {
      body = {
        type: "block",
        line,
        block: [body, { type: "expr", line, expr: increment }],
      };
    }

    if (condition == null) condition = { type: "literal", value: true, line };
    body = { type: "whileloop", line, condition, body };

    if (initializer != null) {
      body = { type: "block", line, block: [initializer, body] };
    }

    return body;
  }
  function whileStatement() {
    consume("LEFT_PAREN", "Expected '(' after 'while'");
    let condition = expression();
    consume("RIGHT_PAREN", "Expected ')' after condition");
    let body = statement();
    return { type: "whileloop", line: condition.line, condition, body };
  }
  function returnStatement() {
    let keyword = previous();
    let line = peek().line;
    let value = null;
    if (!check("SEMI")) {
      value = expression();
    }
    consume("SEMI", "Expected ';' after return value");
    return { type: "return", line, keyword, value };
  }
  function ifStatement() {
    consume("LEFT_PAREN", "Expected '(' after if statement");
    let line = previous().line;
    let condition = expression();
    consume("RIGHT_PAREN", "Expected ')' after if statement");
    let ifTrue = statement();
    let ifFalse = null;
    if (match("EL")) {
      ifFalse = statement();
    }

    return { type: "ifstatement", line, condition, ifTrue, ifFalse };
  }
  function expressionStatement() {
    let line = peek().line;
    let expr = expression();
    consume("SEMI", "Expected ';' after expression");
    return { line, type: "expr", expr };
  }

  function expression() {
    if (match("LAMBDA")) {
      consume("LEFT_PAREN", "Expect '(' after lambda statement.");

      let line = previous().line;
      let params = [];
      if (!check("RIGHT_PAREN")) {
        do {
          params.push(peek());
          consume("IDENTIFIER", "Expect parameter name.");
        } while (match("COMMA"));
      }
      consume("RIGHT_PAREN", "Expect ')' after lambda parameters.");
      consume("COL", "Expect ':' after right parentheses.");

      let rtnVal = expression();

      return { type: "lambda", line, params, rtnVal };
    }
    if (match("LEFT_BRACK")) {
      let line = peek().line;
      let val = [];
      let name = previous6().value;
      do {
        val.push(peek().value);
        consume("STRING", "Expected a string");
      } while (match("COMMA"));
      consume("RIGHT_BRACK", "Expected a ']' after array");
      return { type: "array", line, val, name };
    }
    if (match("LEFT_BRACE")) {
      let line = peek().line;
      let val = [];
      let name = previous6().value;
      do {
        val.push(peek().value + ": " + peek2().value);
        consume("STRING", "Expected a string");
        consume("COL", "Expected a ':'");
        consume("STRING", "Expected a string");
      } while (match("COMMA"));
      consume("RIGHT_BRACE", "Expected a '}' after a map");
      return { type: "map", line, val, name };
    }
    return ternary();
  }

  function ternary() {
    let expr = postfix();
    let line = expr.line;

    if (match("QUE")) {
      let ifTrue = postfix();

      consume("COL", "Expect ':' after ternary statement.");

      let ifFalse = ternary();

      expr = {
        type: "ternarystatement",
        line,
        condition: expr,
        ifTrue,
        ifFalse,
      };
    }

    return expr;
  }

  function postfix() {
    let expr = assignment();
    let line = expr.line;

    if (match("PLUS_PLUS", "MINUS_MINUS")) {
      let operator = previous().name;

      expr = { type: "postfix", line, name: expr.name, operator };
    }

    return expr;
  }

  function assignment() {
    let expr = or();

    if (
      match(
        "COL_EQ",
        "PLUS_EQ",
        "MINUS_EQ",
        "DIVIDE_EQ",
        "TIMES_EQ",
        "POWER_EQ",
        "MODULO_EQ"
      )
    ) {
      let equals = previous();
      let value = assignment();

      if (expr.type == "variable") {
        let name = expr.name;
        return {
          line: equals.line,
          type: "assign",
          name,
          operator: equals.name,
          value,
        };
      } else if (expr.type == "identifier") {
        let name = expr.name;
        return {
          line: equals.line,
          type: "assign",
          name,
          operator: equals.name,
          value,
        };
      } else if (expr.type == "accessor") {
        let accessor = expr;
        return {
          type: "accessorset",
          line: equals.line,
          obj: accessor.obj,
          name: accessor.name,
          value,
        };
      }

      error(equals.line, "Invalid assignment target");
    }

    return expr;
  }

  function or() {
    let expr = and();
    let line = expr.line;

    while (match("OR")) {
      let operator = previous();
      let right = and();

      expr = {
        type: "logical",
        line,
        left: expr,
        operator: operator.name,
        right,
      };
    }

    return expr;
  }

  function and() {
    let expr = equality();
    let line = expr.line;

    while (match("AND")) {
      let operator = previous();
      let right = equality();
      expr = { type: "logical", line, left: expr, operator, right };
    }

    return expr;
  }

  function equality() {
    let expr = comparison();

    while (match("BANG_EQ", "EQ_EQ")) {
      let line = previous().line;
      let operator = previous().value;
      let right = comparison();
      expr = { line, type: "binary", left: expr, operator, right };
    }

    return expr;
  }

  function comparison() {
    let expr = addition();

    while (match("GREATER", "GREATER_EQ", "LESS", "LESS_EQ")) {
      let line = previous().line;
      let operator = previous().value;
      let right = addition();
      expr = { line, type: "binary", left: expr, operator, right };
    }

    return expr;
  }

  function addition() {
    let expr = multiplication();

    while (match("MINUS", "PLUS")) {
      let line = previous().line;
      let operator = previous().value;
      let right = multiplication();
      expr = { line, type: "binary", left: expr, operator, right };
    }

    return expr;
  }

  function multiplication() {
    let expr = power();

    while (match("DIVIDE", "TIMES", "MODULO")) {
      let line = previous().line;
      let operator = previous().value;
      let right = power();
      expr = { line, type: "binary", left: expr, operator, right };
    }

    return expr;
  }

  function power() {
    let expr = type_change();

    while (match("POWER")) {
      let line = previous().line;
      let operator = previous().value;
      let right = type_change();
      expr = { line, type: "binary", left: expr, operator, right };
    }

    return expr;
  }

  function type_change() {
    return unary();
  }

  function unary() {
    if (match("BANG", "MINUS")) {
      let line = previous().line;
      let operator = previous().value;
      let right = unary();
      return { line, type: "unary", operator, right };
    }

    return call();
  }

  function call() {
    let expr = primary();
    while (true) {
      if (match("LEFT_PAREN")) {
        expr = finishCall(expr);
      } else if (match("DOT")) {
        let name = peek();
        consume("IDENTIFIER", "Expected property name after '.'");
        expr = { type: "accessor", obj: expr, name, line: name.line };
      } else {
        break;
      }
    }

    return expr;
  }

  function finishCall(callee) {
    let args = [];
    if (!check("RIGHT_PAREN")) {
      do {
        args.push(expression());
      } while (match("COMMA"));
    }

    let paren = peek();
    consume("RIGHT_PAREN", "Expected ')' after arguments");

    return { type: "call", line: paren.line, call: callee, args };
  }
  return statements;
}

module.exports = parser;
