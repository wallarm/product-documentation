					# リクエストパーサーの管理

ルール **Disable/Enable request parser** では、リクエストの解析中に適用されるパーサーセットを管理することができます。

デフォルトでは、リクエストを解析する際、Wallarm ノードはリクエストの各要素に対して適切な [パーサー](request-processing.md) を順番に適用しようとします。ただし、特定のパーサーが誤って適用されることがあり、その結果、Wallarm ノードはデコードされた値に攻撃の兆候を検出することがあります。

例えば、Wallarm ノードは、未エンコードのデータを [Base64](https://en.wikipedia.org/wiki/Base64) にエンコードされたデータと誤って特定することがあります。なぜなら、Base64 のアルファベットの記号は、通常のテキスト、トークン値、UUID 値、および他のデータ形式でよく使用されるためです。未エンコードのデータをデコードし、結果の値に攻撃の兆候を検出した場合、[誤検出](../../about-wallarm/protecting-against-attacks.md#false-positives)が発生します。

このようなケースで誤検出を防ぐためには、ルール **Disable/Enable request parser** を使用して、誤って適用されたパーサーを特定のリクエスト要素に対して無効にすることができます。

## ルールの作成と適用

--8<-- "../include-ja/waf/features/rules/rule-creation-options.md"

**Rules** セクションでのルールの作成と適用：

1. Wallarm Console の **Rules** セクションで、**Disable/Enable request parser** ルールを作成します。このルールは、以下のコンポーネントで構成されています：

      * **Condition** は、ルールを適用するエンドポイントを [記述](add-rule.md#branch-description) します。
      * 指定されたリクエスト要素に対して無効化/有効化されるべきパーサー。
      * **Part of request** は、選択されたパーサーで解析/未解析とする元のリクエスト要素を指します。

         --8<-- "../include-ja/waf/features/rules/request-part-reference.md"
2. [ルールのコンパイルが完了する](compiling.md)のを待ちます。

## ルールの例

たとえば、`https://example.com/users/` へのリクエストには認証ヘッダー `X-AUTHTOKEN` が必要です。ヘッダーの値には特定の記号の組み合わせ（例：末尾に `=`）が含まれている可能性があり、Wallarm はパーサー `base64` でデコードされる可能性があります。

`X-AUTHTOKEN` の値で誤検出を防ぐための **Disable/Enable request parser** ルールは、以下のように設定できます：

![!ルール "Disable/Enable request parser" の例](../../images/user-guides/rules/disable-parsers-example.png)