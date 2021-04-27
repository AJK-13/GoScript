const fs = require("fs");
const lexer = require("./Lexer");
const parser = require("./Parser");
const interpreter = require("./Interpreter");
function GoScript_Init() {
  let VERSION = "3.9.7";
  let code;
  let file;
  if (process.argv[3]) {
    file = process.argv[3];
  } else {
    file = process.argv[2];
    if (file == "-v") {
      console.log("\x1b[34m%s\x1b[0m", "\nGoScript:", `v${VERSION}`);
    } else if (file == "-t") {
      file = "src/Test/Test.gs";
    }
    if (file != "-v") {
      fs.readFile(file, "utf-8", function (error) {
        if (error) {
          if (error.code == "ENOENT") {
            console.log(
              `\x1b[91m\x1b[0m\x1b[91m Error: \x1b[0m\x1b[1mCouldn't find file directory: '${file}'\x1b[0m`
            );
          }
        } else {
          code = fs.readFileSync(file, "utf-8");
          let tokens = lexer(code);
          // console.log("Tokens:", tokens);
          let trees = parser(tokens);
          // console.log(
          // "Abstract Syntax Tree: " + JSON.stringify(trees, null, 2)
          // );
          console.log(
            "\x1b[34m%s\x1b[0m",
            "\nRunning GoScript,",
            `Version: ${VERSION}\n_____________________________\n`
          );
          let output = interpreter(trees);
          console.log("");
        }
      });
    }
  }
}
GoScript_Init();
