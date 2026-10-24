// Highlight grammar. The Ply compiler accepts or rejects programs.
// A word's name is a `definition` so the editor can color it. A colon
// inside `()` `[]` `{}` is a field label, not a definition name.

const KEYWORDS = [
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

  extras: ($) => [/[ \t\r]/],

  rules: {
    source_file: ($) => seq(optional($._line), repeat(seq("\n", optional($._line)))),

    _line: ($) => choice($.definition, $._rest),

    // `def` before the name is still accepted. `private` and `foreign` may precede it.
    // Precedence wins over reading those two keywords as ordinary words: the
    // colon is what makes the line a definition, and a keyword pair that is
    // not `private def` / `foreign def` does not occur.
    definition: ($) =>
      prec(
        2,
        seq(
          optional(seq($.keyword, optional($.keyword))),
          field("name", $.identifier),
          ":",
          optional($._rest),
        ),
      ),

    _rest: ($) => seq($._atom, repeat($._atom)),

    _atom: ($) =>
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
        $.group,
        "=",
        "|",
        "!",
        ",",
        ".",
      ),

    group: ($) =>
      choice(
        seq("(", repeat($._inner), ")"),
        seq("[", repeat($._inner), "]"),
        seq("{", repeat($._inner), "}"),
      ),

    _inner: ($) => choice($._atom, ":", "\n"),

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
  },
});
