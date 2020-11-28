# Math Draw
Equation renderer and solver.

![image](https://user-images.githubusercontent.com/26630940/100522197-48782700-31a9-11eb-9688-38b8b66ed63f.png)
## Usage
Variable assignment expression is visual only. 

Variable definition is real, will automatically calculate the value and show it. The showing can be disabled by adding a `//x` trailing comment, it is also disabled if a literal is assigned. A variable can be marked as being in degrees using `//°` trailing comment, it will then be converted to degrees before being printed. There is also a custom operator `°`, which will convert a number from degrees to radians.  

Sometimes parentheses get ignored, to fix this prefix them with an underscore.

Any trailing comment is appended to the line as just text. Comments on separate lines are also just treated as text. 

Statements labeled `real:` will be executed and not used as text. 

All text will be pumped thru AsciiMath and then printed. The parsing is done using ESPrisma. Math rendering is done using MathJax.

For execution, there are the following functions provided:
  - format ⇒ Converts numbers to a string, rounded to 4 decimal digits
  - format_a ⇒ Converts an angle in radiants to degree string (including minutes and seconds)
  - sin, cos, tan, sqrt ⇒ Behave as normal
  - arcsin, arccos, arctan ⇒ Behave as normal, but in output they are converted, `arcsin` → `sin^-1`
  - root ⇒ Gets the n-th root of a number. Usage: `root(<root n>)(<input>)`

Following constants are provided:
  - pi ⇒ Value of Math.PI
  - TO_DEG ⇒ Multiply a number in degrees and get number in radians, in output ` * TO_DEG` is converted to `°`

## Visualizations

> Work in progress!

All visualisation functions muss be labeled `real:`, because they are code not text.

`tri90` ⇒ Render a right triangle, takes an object as argument with labels of specified parts of the triangle

![image](https://user-images.githubusercontent.com/26630940/100522740-7199b700-31ab-11eb-94eb-80764170171b.png)

