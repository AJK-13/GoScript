const error = require("./Error");
let reserved = [
  // Variables
  "void",
  "final",

  // Functions
  "fn",
  "rtn",

  // Classes
  "class",
  "this",
  "implements",
  "super",

  // Values
  "nil",
  "true",
  "false",

  // If Statements
  "if",
  "el",

  // Loops
  "for",
  "while",
  "break",
  "continue",

  // Print
  "Println",
  "Print",

  // Ask
  "Ask",

  // Include
  "Include",
].reduce((prev, curr) => {
  prev[curr] = curr.toUpperCase();
  return prev;
}, {});
function lexer(code) {
  let tokens = [];
  let index = 0,
    line = 1;

  function isNumber(char) {
    return char >= "0" && char <= "9";
  }
  function isAlpha(char) {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char == "_"
    );
  }
  function isAlphaNum(char) {
    return isNumber(char) || isAlpha(char);
  }
  function match(next) {
    if (code[index + 1] != next) return false;
    index++;
    return true;
  }
  function match2(next) {
    if (code[index + 2] != next) return false;
    index++;
    return true;
  }
  function addToken(name, value = name) {
    tokens.push({ name, value, line });
  }

  for (; index < code.length; index++) {
    if (isNumber(code[index])) {
      let number = code[index];
      while (isNumber(code[index + 1]) && index < code.length) {
        index++;
        number += code[index];
      }

      if (code[index + 1] == ".") {
        index++; // the .
        number += code[index];

        while (isNumber(code[index + 1]) && index < code.length) {
          index++;
          number += code[index];
        }
      }

      addToken("NUMBER", Number(number));
    } else if (isAlpha(code[index])) {
      let text = code[index];

      while (isAlphaNum(code[index + 1]) && index < code.length) {
        index++;
        text += code[index];
      }

      if (reserved[text]) addToken(reserved[text], text);
      else addToken("IDENTIFIER", text);
    } else {
      switch (code[index]) {
        case "+":
          match("=")
            ? addToken("PLUS_EQ")
            : match("+")
            ? addToken("PLUS_PLUS")
            : addToken("PLUS");
          break;
        case "-":
          match("=")
            ? addToken("MINUS_EQ")
            : match("-")
            ? addToken("MINUS_MINUS")
            : addToken("MINUS");
          break;
        case "*":
          match("=") ? addToken("TIMES_EQ") : addToken("TIMES");
          break;
        case "/":
          match("=") ? addToken("DIVIDE_EQ") : addToken("DIVIDE");
          break;

        case "^":
          match("=") ? addToken("POWER_EQ") : addToken("POWER");
          break;
        case "%":
          if (match("=")) {
            addToken("MODULO_EQ");
          } else {
            addToken("MODULO");
          }
          break;

        case ";":
          addToken("SEMI");
          break;
        case "#":
          addToken("HASHTAG");
          break;
        case ",":
          addToken("COMMA");
          break;
        case ".":
          addToken("DOT");
          break;
        case "@":
          addToken("AT");
          break;
        case "|":
          addToken("OR");
          break;
        case "&":
          addToken("AND");
          break;
        case "$":
          addToken("DOLLAR");
          break;
        case "(":
          addToken("LEFT_PAREN");
          break;
        case ")":
          addToken("RIGHT_PAREN");
          break;
        case "[":
          addToken("LEFT_BRACK");
          break;
        case "]":
          addToken("RIGHT_BRACK");
          break;
        case "{":
          addToken("LEFT_BRACE");
          break;
        case "}":
          addToken("RIGHT_BRACE");
          break;

        case "!":
          if (match("!")) {
            while (index < code.length && code[index + 1] != "\n") index++;
          } else if (match("*")) {
            while (
              index < code.length &&
              !(code[index + 1] == "*" && code[index + 2] == "!")
            ) {
              index++;
              if (code[index] == "\n") line++;
            }

            if (code[index + 1] != "*" && code[index + 2] != "!") {
              error(line, "Parse Error", "Unterminated multi-line comment.");
            }

            index += 2;
          } else if (match("=")) {
            addToken("BANG_EQ");
          } else {
            addToken("BANG");
          }
          break;
        case "=":
          match("=") ? addToken("EQ_EQ") : addToken("EQ");
          break;

        case ">":
          match("=") ? addToken("GREATER_EQ") : addToken("GREATER");
          break;
        case "<":
          match("=") ? addToken("LESS_EQ") : addToken("LESS");
          break;

        case "?":
          addToken("QUE");
          break;
        case ":":
          match("=") ? addToken("COL_EQ") : addToken("COL");
          break;

        case " ":
        case "\r":
        case "\t":
          break;

        case "\n":
          line++;
          break;

        case '"':
        case "'":
          {
            let strtype = code[index];
            let text = "";
            while (code[index + 1] != strtype && index < code.length) {
              index++;
              if (code[index] == "\\") {
                let next = code[index + 1];
                index++;
                switch (next) {
                  case "'":
                    text += "'";
                    break;

                  case '"':
                    text += '"';
                    break;

                  case "r":
                    text += "\r";
                    break;

                  case "n":
                    text += "\n";
                    break;

                  case "m":
                    let keycode = "";
                    while (isNumber(code[index + 1]) && index < code.length) {
                      index++;
                      keycode += code[index];
                    }

                    text += String.fromCharCode(parseInt(keycode));
                    break;

                  case "u":
                    if (code[index + 1] != "{")
                      error(
                        line,
                        "Parse Error",
                        "Expect '{' after unicode escape sequence."
                      );
                    index++;

                    let hex = "";

                    while (code[index + 1] != "}") {
                      index++;
                      hex += code[index];
                    }

                    if (code[index + 1] != "}")
                      error(
                        line,
                        "Parse Error",
                        "Expect '}' after unicode escape code."
                      );
                    index++;

                    text += String.fromCharCode(parseInt(hex, 16));
                    break;

                  case "e":
                    text += "\x1b";
                    break;

                  case "0":
                    text += "\0";
                    break;

                  case "\\":
                    text += "\\";
                    break;

                  default:
                    error(
                      line,
                      "Parse Error",
                      "Invalid escape sequence '" + code[index] + "'"
                    );
                }
              } else {
                text += code[index];
                if (code[index] == "\n") line++;
              }
            }

            if (code[index + 1] != strtype) {
              error(line, "Parse Error", "Unterminated string");
            }

            index++;

            addToken("STRING", text);
          }
          break;
        default:
          error(line, "Parse Error", `Unexpected character ${code[index]}`);
          break;
      }
    }
  }

  addToken("EOF");

  return tokens;
}

module.exports = lexer;
