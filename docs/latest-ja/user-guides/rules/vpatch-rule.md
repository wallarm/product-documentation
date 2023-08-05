[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png

# 仮想パッチ

仮想パッチにより、モニタリングおよび安全なブロックモードであっても、またリクエストが既知の攻撃ベクトルを含んでいないように見える場合でも、悪意のあるリクエストをブロックすることができます。仮想パッチがブロックしないリクエストは、[許可リスト](../ip-lists/allowlist.md)の IP から発生したものだけです。

仮想パッチは、コードの重大な脆弱性を修正することが不可能であったり、必要なセキュリティ更新を迅速にインストールすることができなかったりする場合に特に役立ちます。

攻撃の種類が選択された場合、フィルターノードが一覧に表示されている種類の攻撃を検出した場合にのみ、リクエストがブロックされます。

設定で*任意のリクエスト*が選択された場合、システムは攻撃ベクトルを含んでいない場合でも、定義されたパラメータを持つリクエストをブロックします。

## ルールの作成と適用

--8<-- "../include/waf/features/rules/rule-creation-options.md"

## 例：クエリ文字列パラメータ `id` 内の SQLi 攻撃のブロック

次の条件が満たされる**場合**：

* アプリケーションはドメイン *example.com* でアクセス可能です
* アプリケーションのパラメータ *id* は SQL インジェクション攻撃に対して脆弱です
* フィルターノードは監視モードに設定されています
* 脆弱性を悪用する試みはブロックされるべきです
  
次の手順で仮想パッチを作成します

1. *Rules* タブに移動します
1. ブランチ `example.com/**/*.*` を探し、*Add rule* をクリックします
1. *Create a virtual patch* を選択します
1. 攻撃の種類として *SQLi* を選択します
1. *QUERY* パラメータを選択し、*in this part of request* の後にその値 `id` を入力します。

    --8<-- "../include/waf/features/rules/request-part-reference.md"

1. *Create* をクリックします

![!特定のリクエストタイプの仮想パッチ][img-vpatch-example1]


## 例：クエリ文字列パラメータ `refresh` を含むすべてのリクエストをブロック

次の条件が満たされる**場合**：

* アプリケーションはドメイン *example.com* でアクセス可能です
* アプリケーションは、クエリ文字列パラメータ `refresh` を処理するとクラッシュします
* 脆弱性を悪用する試みはブロックされるべきです
  
次の手順で仮想パッチを作成します

1. *Rules* タブに移動します
1. ブランチ `example.com/**/*.*` を探し、*Add rule* をクリックします
1. *Create a virtual patch* を選択します
1. *Any request* を選択します
1. *QUERY* パラメータを選択し、*in this part of request* の後にその値 `refresh` を入力します。

    --8<-- "../include/waf/features/rules/request-part-reference.md"

1. *Create* をクリックします

![!任意のリクエストタイプの仮想パッチ][img-vpatch-example2]

## ルール作成の API コール

仮想パッチルールを作成するためには、Wallarm Console UI を使用する他に、[Wallarm API に直接コール](../../api/overview.md)を行うこともできます。以下に、対応する API コールの一部の例を示します。

**`/my/api/*` 宛てのすべてのリクエストをブロックする仮想パッチを作成する**

--8<-- "../include/api-request-examples/create-rule-en.md"

**特定のアプリケーションインスタンス ID のために `/my/api/*` 宛てのすべてのリクエストをブロックする仮想パッチを作成する**

このリクエストを送信する前に、アプリケーションは[設定](../settings/applications.md)されているべきです。`action.point[instance].value` に既存のアプリケーションの ID を指定します。

--8<-- "../include/api-request-examples/create-rule-for-app-id.md"