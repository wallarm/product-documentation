# 特定の攻撃タイプを無視する

ルール**特定の攻撃タイプを無視する**は、特定のリクエスト要素で特定の攻撃タイプの検出を無効にすることができます。

デフォルトでは、Wallarmノードは、任意のリクエスト要素で攻撃タイプの兆候を検出すると、そのリクエストを攻撃としてマークします。しかし、攻撃の兆候を含んでいるリクエストの中には、実際には正当なものもあります（例えば、データベース管理者フォーラムで投稿を公開する際のリクエストの本文には、[悪意のあるSQLコマンド](../../attacks-vulns-list.md#sql-injection)の説明が含まれることがあります）。

Wallarmノードがリクエストの標準的なペイロードを悪意のあるものとしてマークした場合、[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)が発生します。誤検知を防ぐためには、保護対象のアプリケーションの特性に合わせて特定の種類のカスタムルールを使用して、標準的な攻撃検出ルールを調整する必要があります。そのようなカスタムルールの一つが**特定の攻撃タイプを無視する**です。

## ルールの作成と適用

--8<-- "../include-ja/waf/features/rules/rule-creation-options.md"

**ルール**セクションでルールを作成し適用する方法は以下の通りです：

1. Wallarmコンソールの**ルール**セクションで**特定の攻撃タイプを無視する**ルールを作成します。ルールは以下のコンポーネントで構成されます：

      * **条件**はルールを適用するエンドポイントを[記述します](rules.md#branch-description)。
      * 特定のリクエスト要素で無視する攻撃タイプ。

        **特定の攻撃タイプ**タブでは、ルール作成時にWallarmノードが検出可能な1つ以上の攻撃タイプを選択できます。

        **すべての攻撃タイプ（自動更新）**タブは、ルール作成時にWallarmノードが検出可能な攻撃タイプと将来検出される攻撃タイプの両方の検出を無効にします。例えば、Wallarmが新しい攻撃タイプの検出をサポートすれば、ノードは選択したリクエスト要素でこの攻撃タイプの兆候を自動的に無視します。
      
      * **リクエストの一部**は、選択した攻撃タイプの兆候の解析をするべきでないオリジナルのリクエスト要素を指します。

         --8<-- "../include-ja/waf/features/rules/request-part-reference.md"

2. [ルールのコンパイルが完了する](rules.md)のを待ちます。

## ルールの例

ユーザーがデータベース管理者フォーラムでの投稿の公開を確認すると、クライアントは`https://example.com/posts/`のエンドポイントにPOSTリクエストを送信します。このリクエストには以下の属性があります：

* 投稿内容はリクエストボディのパラメータ`postBody`で渡されます。投稿内容には、Wallarmが悪意のあるものとしてマークする可能性のあるSQLコマンドが含まれていることがあります。
* リクエストボディは`application/json`タイプです。

[SQLインジェクション](../../attacks-vulns-list.md#sql-injection)を含むcURLリクエストの例は以下の通りです：

```bash
curl -H "Content-Type: application/json" -X POST https://example.com/posts -d '{"emailAddress":"johnsmith@example.com", "postHeader":"SQL injections", "postBody":"My post describes the following SQL injection: ?id=1%20select%20version();"}'
```

 `https://example.com/posts/`へのリクエストの`postBody`パラメータでのSQLインジェクションを無視するために、**特定の攻撃タイプを無視する**ルールは以下のように設定できます：

![rule "Ignore certain attack types"の例](../../images/user-guides/rules/ignore-attack-types-rule-example.png)