# 特定の攻撃タイプを無視する

**特定の攻撃タイプを無視する**ルールにより、特定のリクエスト要素での特定の攻撃タイプの検出を無効にすることができます。

デフォルトでは、Wallarmノードは、リクエスト要素の任意の攻撃タイプの兆候を検出すると、リクエストを攻撃としてマークします。ただし、攻撃の兆候を含む一部のリクエストは、実際には正当なものである場合があります（例えば、データベース管理者フォーラムで投稿を公開するリクエストの本文には、[悪意のあるSQLコマンド](../../attacks-vulns-list.md#sql-injection)の説明が含まれている場合があります）。

Wallarmノードがリクエストの標準ペイロードを悪意のあるものとしてマークする場合、[false positive](../../about-wallarm/protecting-against-attacks.md#false-positives)が発生します。 false positiveを防ぐために、特定のタイプのカスタムルールを使用して、保護されたアプリケーションの特性に合わせて標準攻撃検出ルールを調整する必要があります。そのようなカスタムルールタイプの1つが **特定の攻撃タイプを無視する** です。

## ルールの作成と適用

--8<-- "../include/waf/features/rules/rule-creation-options.ja.md"

**Rules**セクションでルールを作成および適用するには：

1. Wallarm Consoleの**Rules**セクションで、**特定の攻撃タイプを無視する**ルールを作成します。このルールは、次のコンポーネントで構成されています。

      * **条件**は、[適用](add-rule.md#branch-description) るエンドポイントを説明します。
      * 指定されたリクエスト要素で無視される攻撃タイプ。

        **特定の攻撃タイプ**タブでは、ルール作成時にWallarmノードが検出できる1つ以上の攻撃タイプを選択できます。

        **すべての攻撃タイプ（自動更新）**タブは、ルール作成時にWallarmノードが検出できる攻撃タイプと、今後検出される攻撃タイプの両方の検出を無効にします。例えば、Wallarmが新しい攻撃タイプの検出をサポートする場合、ノードは選択したリクエスト要素でこの攻撃タイプの兆候を自動的に無視します。

      * **リクエストの一部**は、選択された攻撃タイプの兆候について分析されないべき元のリクエスト要素を指します。

         --8<-- "../include/waf/features/rules/request-part-reference.ja.md"

2. [ルールコンパイルの完了](compiling.md)を待ちます。

## ルールの例

データベース管理者フォーラムでの投稿の公開をユーザーが確認すると、クライアントは`https://example.com/posts/`のエンドポイントにPOSTリクエストを送信します。このリクエストには以下のプロパティがあります。

* 投稿内容は、リクエスト本文のパラメータ`postBody`で渡されます。投稿内容には、Wallarmが悪意のあるものとしてマークする可能性のあるSQLコマンドが含まれている場合があります。
* リクエスト本文は`application/json`タイプです。

[SQLインジェクション](../../attacks-vulns-list.md#sql-injection)を含むcURLリクエストの例：

```bash
curl -H "Content-Type: application/json" -X POST https://example.com/posts -d '{"emailAddress":"johnsmith@example.com", "postHeader":"SQL injections", "postBody":"My post describes the following SQL injection: ?id=1%20select%20version();"}'
```

`https://example.com/posts/`へのリクエストでパラメータ`postBody`でのSQLインジェクションを無視するように、**特定の攻撃タイプを無視する**ルールを次のように設定できます：

![!「特定の攻撃タイプを無視する」ルールの例](../../images/user-guides/rules/ignore-attack-types-rule-example.png)