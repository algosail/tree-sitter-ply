// Highlight grammar. The Ply compiler accepts or rejects programs.
// A word's name is the identifier after `:`. `def` may stand before the
// colon. `foreign` and `private` may stand between the colon and the name,
// each at most once, in either order. A class method's name is the
// identifier before `(`. A colon inside `()` `[]` `{}` `<>` is a label,
// not a definition. `[]` is a quotation, `{}` is a record, `<>` is an
// array. A field is `/name`, `=name`, or `+name`. Outside `()`, `.`
// comments to the end of the line. Inside `()`, `.` and `..` stay scheme
// and import syntax.

const KEYWORDS = ["language", "match"];

module.exports = grammar({
  name: "ply",

  extras: ($) => [/[ \t\r]/],

  rules: {
    source_file: ($) => seq(optional($._line), repeat(seq("\n", optional($._line)))),

    _line: ($) => choice($.definition, $.method, $.binding, $._rest),

    // `def : name`, `: foreign private name`, `: private foreign name`.
    definition: ($) =>
      prec(
        2,
        seq(
          optional(alias($._def, $.keyword)),
          ":",
          optional($._modifiers),
          field("name", $.identifier),
          optional($._rest),
        ),
      ),

    // Each modifier once. A repeated `foreign` or `private` is not a name.
    _modifiers: ($) =>
      choice(
        alias($._foreign, $.keyword),
        alias($._private, $.keyword),
        seq(alias($._foreign, $.keyword), alias($._private, $.keyword)),
        seq(alias($._private, $.keyword), alias($._foreign, $.keyword)),
      ),

    // `eq ( a a -- Bool )`. The name is only a method when `(` follows it.
    method: ($) => prec(2, seq(field("name", $.identifier), $.group, optional($._rest))),

    // `eq = eqInt`.
    binding: ($) => prec(2, seq(field("name", $.identifier), "=", $.identifier)),

    _rest: ($) => seq($._atom, repeat($._atom)),

    _atom: ($) => choice($.comment, $._code),

    // Round parentheses are schemes and import lists. A dot there is not a comment.
    group: ($) => seq("(", repeat($._paren), ")"),

    // `[]` is a quotation. A newline inside it is free, and `.` still comments.
    quotation: ($) => seq("[", repeat($._nest), "]"),

    record: ($) => seq("{", repeat($._nest), "}"),

    // `<>` is an array. Index 0 is the left element. `<=` is not a token.
    array: ($) => seq("<", repeat($._nest), ">"),

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
        alias($._def, $.keyword),
        alias($._foreign, $.keyword),
        alias($._private, $.keyword),
        $.type_identifier,
        $.operator,
        $.identifier,
        $.group,
        $.quotation,
        $.record,
        $.array,
        "=",
        "|",
        ",",
        "~",
        ";",
        "&",
        "#",
        "-",
      ),

    // Longer than `.`, `..`, and `..name` when those are also valid.
    comment: ($) => token(prec(2, seq(".", /[^\n]*/))),

    string: ($) => token(seq('"', repeat(choice(/[^"\\]/, /\\./)), '"')),

    // `1.5`, `1e10`, `-1.5e-2`, and a bare `1`. `1n` is an integer.
    // A trailing dot (`1.`) stays the number `1` plus a comment.
    number: ($) => token(/-?(?:\d+\.\d+(?:[eE][+-]?\d+)?|\d+[eE][+-]?\d+|\d+)/),

    integer: ($) => token(/-?\d+n/),

    stack_tail: ($) => token(/\.\.[a-z_][A-Za-z0-9_]*/),

    // `/name` reads a field. `=name` replaces one. `+name` inserts one.
    // `=>`, `==`, `+1`, and a spaced `+` stay out of this token.
    field: ($) =>
      token(
        choice(
          /\/[A-Za-z_][A-Za-z0-9_]*/,
          /=[A-Za-z_][A-Za-z0-9_]*/,
          /\+[A-Za-z_][A-Za-z0-9_]*/,
        ),
      ),

    boolean: ($) => token(prec(1, choice("true", "false"))),

    keyword: ($) => token(prec(1, choice(...KEYWORDS))),

    // Before `:`. Shown as `keyword`, same as `language` and `match`.
    _def: ($) => token(prec(1, "def")),

    // Between `:` and the name. Each token once, either order.
    _foreign: ($) => token(prec(1, "foreign")),

    _private: ($) => token(prec(1, "private")),

    type_identifier: ($) => token(/[A-Z][A-Za-z0-9_]*/),

    identifier: ($) => token(/[a-z_][A-Za-z0-9_]*/),

    operator: ($) => choice("--", "->", "=>", "==", ".."),
  },
});
