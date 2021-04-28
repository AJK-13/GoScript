# Welcome to GoScript
## A Dynamically Typed High-Level Language That Emphasizes Readability, Speed, and Functionality
#
## Take a look at the docs below to learn about this language
# 
## Run the file: 
```javascript
node src/index.js GoScript [FILE_NAME]
```
## or:
### Add this to your .zshrc or .bashrc file:
```javascript
alias GoScript="node src/index.js $1"
```
### Then run 
```javascript
GoScript [FILE_NAME]
```
# Variables:
## Declare and assign:
```javascript
void Hiya:= "Sup";
```
## Declare and assign a variable that cannot be changed:
```javascript
final Sup:= "Sup";
```
### Variable maps:
```javascript
void Data:= { "Year": "2021", "Day": "3/23/2021" };
!! The map 'Data' has { Year: 2021, Day: 3/23/2021 } as its values
```
## Declare variable without setting it:
```javascript
void Hello;
```
# Function declaration:
```javascript
fn Hi:= (Param) {
    !! Your code here
}
```
## Calling a function:
```javascript
!Hi("Param");
```
## Lambda:
```javascript
void add:= lambda (a, b): a + b;
println(add(1, 2));
!! Prints 3
```
# Class declaration:
```javascript
class Main:= {
 init(val) {
     this.val:= val;
     println(this.val);
 }
 !! Adding Methods To A Class
 Greet(name) {
     println("Hello, " + name);
 }
}
```
### Class Instances: 
```javascript
void myInstance:= Main("Hello");
```
### Class Implements: 
```javascript
class OtherMain:= implements Main {
  init(name, age) {
    super.init(name, age);
  }
}
```
### Calling a class:
```javascript
!Main("World");
```
### Calling a class Method:
```javascript
!myInstance.Greet("Ayush");
```
# Create a comment:
```javascript
!! Single Line 
```
## or:
```javascript
!*Multiline*!
```
# Arithmetic operators Follows PEDMAS:

## Addition:
```javascript
 1+1
 !! Returns 2
 ```
 ## Multiplication:
 ```javascript
 5*6
 !! Returns 30
 ```
 ## Remainder:
 ```javascript
 4 % 2 
 !! Returns 0
 ```
 ## Exponents:
 ```javascript
 2^3
!! Returns 8
```
 ## Parenthesis:
 ```javascript
 (5+4) % 4
 !! Returns 1
 ```
 ## Math symbols:
 ```javascript
 += | -= | *= | /= | ^= | %= |

 !* Sup := "1" | !Sup += 5 Returns 6 | !Sup -= 5 Returns -4 | !Sup *= 5 Returns 5 | !Sup /= 5 Returns 1/5 | !Sup %= 5 Returns 1 | !Sup ^= 5 Returns 1 *!
```
 # String Concactation:
 ```javascript
void World:= "World";
println("Hello " + World + "!");
```
 ## Escape frontslashes:
 To escape a character use 
 ```javascript
 \
 ```
  To make a literal frontslash use 
  ```javascript
  \\
  ```
 # Logging to console:
 ## With Newline:
 ```javascript
   println("Hello World");
   !! Logs Hello World to console
   ```
## Without Newline:
```javascript
    print("Hello World");
    !! Logs Hello World to console without adding a new line
```
# Logging to the console with colors:
```javascript
  println("\e[93mColor\e[0m vs No Color");
```
 # Ask:
 ```javascript
 void Greeting:= ask("What is your name");
  !! The answer to ask is stored in the variable "Greeting" 
```
 # Loops:

 ## Repeat Loop:
 ```javascript 
 repeat(i:0:20:1) {
println("This is true!");
 }
!! Concept is like this: 
    repeat([VARIABLE_NAME]:[STARTING_NUM]:[ENDING_NUM]:[INCREMENT]) {
        !! Your code here
    }
```
## While Loop:
```javascript
while(true) {
  println("hi");
}
```
 # if / el if / el:
```javascript
 if(somevalue == true) {

 } el if (somevalue == false) {

 } el {

 }
 ```
 # Ternary:
```javascript
void n:= 2;
void output:= n == 1 | n == 2 ? 1 : 2;
println(output);
```
 # Return Statement:
```javascript
rtn 
!! Returns a value 
```
# Stdlib:
## Hash: 
```javascript
#include("Hash");
!! Including Hash Module
void Hi:= Hash.get("Hi");
!! Using Hash Module
println(Hi);
!! Expected output: 2337
```
## Fiber:
```javascript
!! Including the Fiber module:
#include("Fiber");
void Hi:= Fiber();
!! Creating a new Fiber and setting the value to "":
!Hi.new("Hi", "");
!! Changing the value to "Hello World!":
!Hi.new("Hi", "Hello World!");
!! Prints "Hello World!":
println(Hi.getAll("Hi"));
!! Prints "H":
println(Hi.get("Hi", 0));
!! Prints 12:
println(Hi.length("Hi"));
```
## List:
```javascript
#include("List");
!! Including the List Module
void Hi:= List();
!Hi.new("Hi");
!! Creating a new List and setting the name to "Hi"
!Hi.insert("Hi", 0, "Hello");
!Hi.insert("Hi", 0, "Hello");
!Hi.insert("Hi", 1, "Hi");
!Hi.insert("Hi", 2, "Ello");
!Hi.insert("Hi", 3, "Hiya");
!! Inserting new elements at a certain index
println(Hi.getAll("Hi"));
!! Prints "Hello,Hi,Ello,Hiya"
!! To remove a value you can do either: 
!Hi.remove("Hi", "Hi");
!! Or:
!Hi.remove("Hi", 1);
!! They both remove "Hi";
println(Hi.getAll("Hi"));
!! Prints "Hello,Ello,Hiya"
println(Hi.get("Hi", 2));
!! Prints "Hiya"
println(Hi.length("Hi"));
!! Prints 2
```

# Projects:
## Fibonacci Sequence:
```javascript
fn fib := (n) {
  if (n <= 1) rtn 1;
  rtn fib(n - 1) + fib(n - 2);
}
void n:= ask("How many numbers?");
repeat(i:0:n:1) {
  println(fib(i));
}
```