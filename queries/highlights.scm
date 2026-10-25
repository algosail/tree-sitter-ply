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
  "("
  ")"
  "["
  "]"
  "{"
  "}"
  ":"
  "="
  "|"
  ","
  "."
] @punctuation
