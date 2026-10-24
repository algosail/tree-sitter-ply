# tree-sitter-ply

Грамматика подсветки языка Ply. Программу принимает компилятор `plyc`. Этот репозиторий называет токены и узел `definition`, чтобы редактор покрасил имя объявления.

Zed забирает репозиторий по git-ревизии и компилирует `src/parser.c`. Сгенерированные файлы в `src/` входят в коммит. После правки `grammar.js`:

```sh
tree-sitter generate
tree-sitter test
```

Публикация, из этой папки:

```sh
git remote add origin git@github.com:algosail/tree-sitter-ply.git
git push -u origin main
```

Дальше в `plylang/editors/zed/extension.toml` поле `repository` можно сменить с локального `file://` на `https://github.com/algosail/tree-sitter-ply`. Поле `rev` остаётся тем же коммитом.
