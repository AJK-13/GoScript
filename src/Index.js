const fs = require("fs");
const lexer = require("./Lexer");
const parser = require("./Parser");
const interpreter = require("./Interpreter");
const prompt = require("prompt-sync")();
function GoScript_Init() {
  let VERSION = "4.0.0";
  if (process.argv.length > 2) {
    let code;
    let file;
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
          let benchmark = {};
          code = fs.readFileSync(file, "utf-8");
          let tokens = lexer(code);
          let trees = parser(tokens);
          console.log(
            "\x1b[34m%s\x1b[0m",
            "\nRunning GoScript,",
            `Version: ${VERSION}\n________________________________\n`
          );
          let output = interpreter(trees);
        }
      });
    }
  } else {
    for (var i = 0; i < Infinity; i++) {
      let code = prompt("> ");
      let tokens = lexer(code);
      let trees = parser(tokens);
      let output = interpreter(trees);
    }
  }
}
GoScript_Init();
