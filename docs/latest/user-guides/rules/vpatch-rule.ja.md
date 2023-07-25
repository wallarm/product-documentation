[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png

# 仮想パッチング

仮想パッチは、監視モードや安全ブロッキングモードでも、またリクエストに既知の攻撃ベクタが含まれていない場合でも、悪意のあるリクエストをブロックすることができます。仮想パッチがブロックしない唯一のリクエストは、[許可リスト](../ip-lists/allowlist.ja.md)に登録されているIPからのものです。

仮想パッチは、コードの重大な脆弱性を修正することができなかったり、必要なセキュリティアップデートをすぐにインストールできない場合に特に役立ちます。

攻撃タイプが選択されている場合、フィルタノードが対応するパラメータのリストにあるタイプの攻撃を1つ検出した場合にのみ、リクエストがブロックされます。

設定で*任意のリクエスト*が選択されている場合、システムは、攻撃ベクタを含まなくても、定義済みのパラメータを持つリクエストをブロックします。

## ルールの作成と適用

--8<-- "../include/waf/features/rules/rule-creation-options.ja.md"

## 例：クエリストリングパラメータ`id`でのSQLi攻撃のブロック

以下の条件が成立する**場合**:

* アプリケーションがドメイン*example.com*でアクセス可能であること
* アプリケーションのパラメータ*id*がSQLインジェクション攻撃に対して脆弱であること
* フィルタノードが監視モードに設定されていること
* 脆弱性を悪用する試みをブロックする必要があること

仮想パッチを作成するには**次に**、

1. *Rules*タブに移動します
1. ブランチ`example.com/**/*.*`を見つけて*Add rule*をクリックします
1. *Create a virtual patch*を選択します
1. 攻撃タイプとして*SQLi*を選択します
1. *QUERY*パラメータを選択し、*in this part of request*の後にその値`id`を入力します

    --8<-- "../include/waf/features/rules/request-part-reference.ja.md"

1. *Create*をクリックします

![!特定のリクエストタイプの仮想パッチ][img-vpatch-example1]

## 例：クエリストリングパラメータ`refresh`を持つすべてのリクエストをブロックする

以下の条件が成立する**場合**:

* アプリケーションがドメイン*example.com*でアクセス可能であること
* アプリケーションがクエリストリングパラメータ`refresh`を処理するとクラッシュすること
* 脆弱性を悪用する試みをブロックする必要があること

仮想パッチを作成するには**次に**、

1. *Rules*タブに移動します
1. ブランチ`example.com/**/*.*`を見つけて*Add rule*をクリックします
1. *Create a virtual patch*を選択します
1. *Any request*を選択します
1. *QUERY*パラメータを選択し、*in this part of request*の後にその値`refresh`を入力します

    --8<-- "../include/waf/features/rules/request-part-reference.ja.md"

1. *Create*をクリックします

![!仮想パッチ][img-vpatch-example2]

## ルールを作成するためのAPIコール

仮想パッチルールを作成するために、Wallarm Console UIを使用する代わりに、[Wallarm APIを直接呼び出す](../../api/overview.ja.md)ことができます。以下は、対応するAPI呼び出しの例です。

**`/my/api/*`に送られる全てのリクエストをブロックする仮想パッチを作成する**

--8<-- "../include/api-request-examples/create-rule-en.ja.md"

**特定のアプリケーションインスタンスIDの仮想パッチを作成し、`/my/api/*`に送信されるすべてのリクエストをブロックする**

このリクエストを送信する前に、アプリケーションを[設定](../settings/applications.ja.md)する必要があります。`action.point[instance].value`に既存のアプリケーションのIDを指定してください。

--8<-- "../include/api-request-examples/create-rule-for-app-id.ja.md"