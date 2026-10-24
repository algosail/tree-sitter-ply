// Token grammar for editor highlighting. The Ply compiler accepts or rejects
// programs; this file only names the tokens an editor colors.

const KEYWORDS = [
  "module",
  "import",
  "language",
  "data",
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

  extras: ($) => [/\s/],

  rules: {
    source_file: ($) => repeat($._token),

    _token: ($) =>
      choice(
        $.comment,
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
        $.punctuation,
      ),

    comment: ($) => token(seq(";", /[^\n]*/)),

    string: ($) => token(seq('"', repeat(choice(/[^"\\]/, /\\./)), '"')),

    // Longer than an integer: 1.5, 1e10, -1.5e-2. A trailing dot (1.) stays an integer.
    number: ($) => token(/-?(?:\d+\.\d+(?:[eE][+-]?\d+)?|\d+[eE][+-]?\d+)/),

    integer: ($) => token(/-?\d+/),

    stack_tail: ($) => token(/\.\.[a-z_][A-Za-z0-9_]*/),

    field: ($) => token(/#[A-Za-z_][A-Za-z0-9_]*/),

    boolean: ($) => token(prec(1, choice("true", "false"))),

    keyword: ($) => token(prec(1, choice(...KEYWORDS))),

    type_identifier: ($) => token(/[A-Z][A-Za-z0-9_]*/),

    identifier: ($) => token(/[a-z_][A-Za-z0-9_]*/),

    operator: ($) => choice("--", "->", "=>", ".."),

    punctuation: ($) =>
      choice("(", ")", "[", "]", "{", "}", ":", "=", "|", "!", ",", "."),
  },
});
