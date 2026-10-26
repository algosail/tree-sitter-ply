; Scan order when reading Ply. Loud marks are rare boundaries.
; Quotation brackets [] are the code/value boundary.
; -- -> => and | shape a scheme, an equation, a constraint, or a row.
; ~ ; - & # say which kind of declaration the line is.
; The name after : is the word being defined. Parentheses, braces,
; array angles, colons, and commas stay quiet so those marks can show.

(comment) @comment
(string) @string
(number) @number
(integer) @number
(boolean) @boolean
(keyword) @keyword
(type_identifier) @type
(stack_tail) @variable.special
(field) @property
(operator) @operator
(identifier) @variable
(definition name: (identifier) @variable @function)
(method name: (identifier) @variable @function)
(binding name: (identifier) @variable @function)

[
  "["
  "]"
] @punctuation.special

[
  "~"
  ";"
  "&"
  "#"
  "-"
] @keyword

"|" @operator

[
  "("
  ")"
  "{"
  "}"
  "<"
  ">"
  ":"
  "="
  ","
  "."
] @punctuation
