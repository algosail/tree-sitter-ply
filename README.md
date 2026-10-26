# tree-sitter-ply

Tree-sitter grammar for highlighting Ply. The `plylang` compiler accepts or rejects a program. This repository names the tokens so an editor can color a file.

Files under `src/` are generated and committed. After a change to `grammar.js`, rebuild the parser and run the corpus:

```sh
tree-sitter generate
tree-sitter test
```
