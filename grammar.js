// Highlight grammar. The Ply compiler accepts or rejects programs.
// A word's name is the identifier after `:`. A class method's name is the
// identifier before `(`. A colon inside `()` `[]` `{}` `<>` is a label,
// not a definition. `[]` is an array, `{}` is a record, `<>` is a quotation.
// `<=` is the superclass arrow, not an open quotation. A field is `/name`
// or `=name`. Outside `()`, `.` comments to the end of the line. Inside
// `()`, `.` and `..` stay scheme and import syntax.

const KEYWORDS = [
  "import",
  "language",
  "data",
  "type",
  "newtype",
  "def",
  "foreign",
  "private",
  "where",
  "class",
  "instance",
  "match",
];

module.exports = grammar({
  name: "ply",

  extras: ($) => [/[ \t\r]/],

  rules: {
    source_file: ($) => seq(optional($._line), repeat(seq("\n", optional($._line)))),

    _line: ($) => choice($.definition, $.method, $.binding, $._rest),

    // `foreign : name`, `private def : name`, and `: name`.
    definition: ($) =>
      prec(
        2,
        seq(
          optional(seq($.keyword, optional($.keyword))),
          ":",
          field("name", $.identifier),
          optional($._rest),
        ),
      ),

    // `eq ( a a -- Bool )`. The name is only a method when `(` follows it.
    method: ($) => prec(2, seq(field("name", $.identifier), $.group, optional($._rest))),

    // `eq = eqInt`.
    binding: ($) => prec(2, seq(field("name", $.identifier), "=", $.identifier)),

    _rest: ($) => seq($._atom, repeat($._atom)),

    _atom: ($) => choice($.comment, $._code),

    // Round parentheses are schemes and import lists. A dot there is not a comment.
    group: ($) => seq("(", repeat($._paren), ")"),

    array: ($) => seq("[", repeat($._nest), "]"),

    record: ($) => seq("{", repeat($._nest), "}"),

    // `<` not followed by `=` opens a quotation. `>` closes it. `<>` is not a bracket pair.
    quotation: ($) => seq("<", repeat($._nest), ">"),

    _paren: ($) => choice($._code, "\n", "."),

    // `[]`, `{}`, and `<>` do not raise the parenthesis depth, so `.` comments there.
    _nest: ($) => choice($._atom, ":", "\n"),

    _code: ($) =>
      choice(
        $.string,
        $.number,
        $.integer,
        $.stack_tail,
        $.field,
        $.boolean,
        $.keyword,
        $.type_identifier,
        $.operator,
        $.identifier,
        $.group,
        $.array,
        $.record,
        $.quotation,
        "=",
        "|",
        ",",
      ),

    // Longer than `.`, `..`, and `..name` when those are also valid.
    comment: ($) => token(prec(2, seq(".", /[^\n]*/))),

    string: ($) => token(seq('"', repeat(choice(/[^"\\]/, /\\./)), '"')),

    // `1.5`, `1e10`, `-1.5e-2`, and a bare `1`. `1n` is an integer.
    // A trailing dot (`1.`) stays the number `1` plus a comment.
    number: ($) => token(/-?(?:\d+\.\d+(?:[eE][+-]?\d+)?|\d+[eE][+-]?\d+|\d+)/),

    integer: ($) => token(/-?\d+n/),

    stack_tail: ($) => token(/\.\.[a-z_][A-Za-z0-9_]*/),

    // `/name` reads a field. `=name` replaces one. `=>` and `<=` stay operators.
    field: ($) =>
      token(choice(/\/[A-Za-z_][A-Za-z0-9_]*/, /=[A-Za-z_][A-Za-z0-9_]*/)),

    boolean: ($) => token(prec(1, choice("true", "false"))),

    keyword: ($) => token(prec(1, choice(...KEYWORDS))),

    type_identifier: ($) => token(/[A-Z][A-Za-z0-9_]*/),

    identifier: ($) => token(/[a-z_][A-Za-z0-9_]*/),

    operator: ($) => choice("--", "->", "=>", "<=", ".."),
  },
});
