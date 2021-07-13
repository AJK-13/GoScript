# Welcome to GoScript
## A Dynamically Typed High-Level Language That Emphasizes Readability, Speed, and Functionality
#
## Take a look at the docs below to learn about this language
# 
## Run the file: 
```javascript
node src/index.js GoScript [LOCAL_FILE_PATH]
```
## or:
### Add this to your .zshrc or .bashrc file:
```javascript
alias GoScript="node src/index.js $1"
```
### Then run 
```javascript
GoScript [LOCAL_FILE_PATH]
```
# Variables:
## Declare and assign:
```javascript
void Hiya := "Sup";
```
## Declare and assign a variable that cannot be changed:
```javascript
final Sup := "Sup";
```
### Variable maps:
```javascript
void Data := { "Year": "2021", "Day": "3/23/2021" }; 
!! The map 'Data' has { Year: 2021, Day: 3/23/2021 } as its values
```
## Declare variable without setting it:
```javascript
void Hello;
```
## Change the value of a variable:
```javascript
Hiya := "Sup";
!! The variable 'Hiya' must be defined previously
```
# Function declaration:
```javascript
fn Hi(Param) := {
    !! Your code here
}
```
## Calling a function:
```javascript
Hi("Param");
```
## Lambda:
```javascript
void add := lambda (a, b): a + b;
Println(add(1, 2)); !! => 3
```
# Class declaration:
```javascript
class Main := {
 init(val) {
     this.val := val;
     Println(this.val);
 }
 !! Adding Methods To A Class
 Greet(name) {
     Println("Hello, " + name);
 }
}
```
### Class Instances: 
```javascript
void myInstance := Main("Hello");
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
Main("World");
```
### Calling a class Method:
```javascript
myInstance.Greet("Ayush");
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
void World := "World";
Println("Hello " + World + "!");
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
   Println("Hello World"); !! => Hello World
   ```
## Without Newline:
```javascript
    Print("Hello World"); !! => Hello World
    !! No new line
```
# Logging to the console with colors:
```javascript
  Println("\e[93mColor\e[0m vs No Color");
```
 # Ask:
 ```javascript
 void Greeting := Ask("What is your name"); !! The answer to Ask is stored in the variable "Greeting" 
```
 # Loops:

 ## For Loop:
 ```javascript 
for(void i := 0; i < 10; i++) {
    Println(i);
}
```
## While Loop:
```javascript
while(true) {
  Println("hi");
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
void n := 2;
void output := n == 1 | n == 2 ? 1 : 2;
Println(output);
```
 # Return Statement:
```javascript
rtn 
!! Returns a value 
```
# Stdlib:
## Hash: 
```javascript
#Include("Hash"); !! Including Hash Module
void Hi := Hash.get("Hi"); !! Using Hash Module
Println(Hi); !! => 2337
```
## Fiber:
```javascript
#Include("Fiber"); !! Including the Fiber Module
void Hi := Fiber(); !! Creating a new Fiber and setting the value to "":
Hi.new("Hi", ""); !! Changing the value to "Hello World!":
Hi.new("Hi", "Hello World!");
Println(Hi.getAll("Hi")); !! => Hello World!
Println(Hi.get("Hi", 0)); !! => H
Println(Hi.length("Hi")); !! => 12
```
## List:
```javascript
#Include("List"); !! Including the List Module
void Hi := List();
Hi.new("Hi"); !! Creating a new List and setting the name to "Hi"
!! Inserting new elements at a certain index:
Hi.insert("Hi", 0, "Hello");
Hi.insert("Hi", 0, "Hello");
Hi.insert("Hi", 1, "Hi");
Hi.insert("Hi", 2, "Ello");
Hi.insert("Hi", 3, "Hiya"); 
Println(Hi.getAll("Hi")); !! => "Hello,Hi,Ello,Hiya"
!! To remove a value you can do either: 
Hi.remove("Hi", "Hi");
!! Or:
Hi.remove("Hi", 1);
!! They both remove "Hi";
Println(Hi.getAll("Hi")); !! => "Hello,Ello,Hiya"
Println(Hi.get("Hi", 2)); !! => "Hiya"
Println(Hi.length("Hi")); !! => 2
```

# Projects:
## Fibonacci Sequence:
```javascript
fn fib(n) := {
  if (n <= 1) rtn 1;
  rtn fib(n - 1) + fib(n - 2);
}
void n := Ask("How many numbers?");
for(void i := 0; i < n; i++) {
    Println(fib(i));
}
```