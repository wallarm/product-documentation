# テキスト書式設定規約

本ガイドでは、実行または入力するための一定数のテキスト文字列やコマンドが提示されます。必要に応じて、いくつかの文字列やコマンドキーワードは異なる書式で提示されます。以下の規則が全体のガイドに適用されます:

| 書式設定規則                 | 説明 |
| -----------------------------  | ------------------------------------------------------------    |
|`regular` | 通常の等幅フォントで記述された文字列は参考情報として提示され、読者が入力することは想定していません。<br>このような文字列はコマンドの出力やその他の情報を表すことがあります。|
|例: | Bashシェルのプロンプト:<br>`$`                     |
|**`boldface`**  | 太字の等幅フォントで記述された文字列は読者がそのまま入力する必要があります。 |
|例: | Linuxでシステム情報を表示するには、次のコマンドを入力します:<br>`$` **`uname -a`** |
|*`italics`*または*`<italics>`* | 斜体の等幅フォントで記述された文字列は、読者が入力すべき値を示します。たとえば、コマンド引数が *`<name>`* として書式設定されている場合、*`<name>`* とそのまま入力するのではなく、該当する値を入力する必要があります。<br>入力値が単一の単語で表現できない場合、その文字列は<...>括弧で囲まれます。値を入力する際には括弧を省略します。たとえば、コマンド引数が *`<user password>`* として書式設定されている場合、<および>記号を除いてパスワードを入力してください。 |
|例: | Linuxでファイルの内容を表示するには、`cat`コマンドを次のように使用できます:<br>`$` **`cat`** *`filename`*<br>`$` **`cat`** *`<file name>`*<br><br>ファイル名が MyFile.txt のファイルの内容を表示する必要がある場合、次のコマンドを実行してください:<br>`cat MyFile.txt` |