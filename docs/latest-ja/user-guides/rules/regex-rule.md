[link-regex]:       https://github.com/yandex/pire

[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[img-regex-example2]:       ../../images/user-guides/rules/regex-rule-2.png
[img-regex-id]:             ../../images/user-guides/rules/regex-id.png

# ユーザー定義検出ルール

特定のケースでは、攻撃を手動で検出するためのシグネチャを追加したり、*仮想パッチ*を作成したりするのが有用であるかもしれません。そのため、Wallarmは攻撃を検出するために正規表現を使用しませんが、ユーザーが正規表現に基づく追加のシグネチャを追加することを許可しています。

## 新しい検出ルールの追加

これを行うには、*正規表現に基づく攻撃指標を作成*のルールを作成し、次のフィールドに入力します:

* *正規表現*: 正規表現（シグネチャ）。次のパラメーターの値が正規表現と一致する場合、そのリクエストは攻撃として検出されます。正規表現の構文と特性は、[ルールの追加に関する指示](rules.md#condition-type-regex)で説明されています。

    !!! warning "規則で指定された正規表現を変更する"
        **正規表現に基づく攻撃指標を作成**タイプの既存のルール中の正規表現を変更すると、その以前の表現を使用する[**正規表現に基づく攻撃検出を無効化する**](#partial-disabling-of-a-new-detection-rule)ルールが自動的に削除されます。

        新しい正規表現による攻撃の検出を無効化するには、新たな正規表現を指定して新しいルール**正規表現に基づく攻撃検出を無効化する**を作成してください。

* *実験的*: このフラグにより、リクエストをブロックせずに正規表現のトリガーを安全にチェックできます。リクエストは、フィルターノードがブロックモードに設定されていてもブロックされません。これらのリクエストは、実験的な方法で検出された攻撃とみなされ、デフォルトではイベントリストから隠されます。これらには検索クエリ`experimental attacks`を使用してアクセスできます。

* *攻撃*: リクエスト内のパラメーターの値が正規表現と一致したときに検出される攻撃のタイプ。

* *このリクエストの部分で*: システムが対応する攻撃を検出するべきリクエストの部分を決定します。

    --8<-- "../include-ja/waf/features/rules/request-part-reference.md"

### 例: 不正なX-Authenticationヘッダーを持つすべてのリクエストをブロックする

次の条件が揃った**場合**:

* アプリケーションは*example.com*ドメインで利用可能である
* アプリケーションはユーザー認証に*X-Authentication*ヘッダーを使用する
* ヘッダーの形式は32の16進記号です

これらの条件が揃った**場合**、不正な形式のトークンを拒否するルールを作成するには:

1. *Rules*タブに移動します
2. `example.com/**/*.*`のブランチを見つけて、*Add rule*をクリックします
3. *Define as an attack on the basis of a regular expression*を選択します
4. *Regex*の値として`[^0-9a-f]|^.{33,}$|^.{0,31}$`を設定します
5. *Attack*のタイプとして`Virtual patch`を選択します
6. ポイントとして`Header X-AUTHENTICATION`を設定します
7. *Create*をクリックします

![Regex rule first example][img-regex-example1]

### 例: `class.module.classLoader.*`ボディパラメータを持つすべてのリクエストをブロックする

[Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell) の0-day脆弱性を悪用する方法の1つは、次のボディパラメータに特定の悪意のあるペイロードを注入してPOSTリクエストを送信することです。

* `class.module.classLoader.resources.context.parent.pipeline.first.pattern`
* `class.module.classLoader.resources.context.parent.pipeline.first.suffix`
* `class.module.classLoader.resources.context.parent.pipeline.first.directory`
* `class.module.classLoader.resources.context.parent.pipeline.first.prefix`
* `class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat`

あなたが脆弱なSpring Core Frameworkを使用していて、Wallarmノードの[モード](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)がブロックとは異なる場合、仮想パッチを使用して脆弱性の悪用を防ぐことができます。次のルールは、リストされたボディパラメータを持つすべてのリクエストをモニタリングモードおよびセーフブロッキングモードでもブロックします。

![Virtual patch for specific post params](../../images/user-guides/rules/regexp-rule-post-params-spring.png)

正規表現フィールドの値は次のとおりです:

```bash
(class[.]module[.]classLoader[.]resources[.]context[.]parent[.]pipeline[.]first[.])(pattern|suffix|directory|prefix|fileDateFormat)
```

ブロッキング[モード](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)で動作するWallarmノードは、デフォルトでこのような脆弱性の悪用防止をブロックします。

また、Spring Cloud Functionコンポーネントにもアクティブな脆弱性（CVE-2022-22963）が存在します。このコンポーネントを使用しており、Wallarmノードのモードがブロックから異なる場合は、[以下](#example-block-all-requests-with-the-class-cloud-function-routing-expression-header)で説明されているように仮想パッチを作成してください。

### 例: `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`ヘッダーを持つすべてのリクエストをブロックする

Spring Cloud Functionコンポーネントには、`CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`または`CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`ヘッダーに悪意のあるペイロードを注入することで悪用可能なアクティブな脆弱性（CVE-2022-22963）が存在します。

このコンポーネントを使用しており、Wallarmノードの[モード](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)がブロックから異なる場合、仮想パッチを使用して脆弱性の悪用を防ぐことができます。次のルールは、`CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`ヘッダーを含むすべてのリクエストをブロックします。

![Virtual patch for specific header](../../images/user-guides/rules/regexp-rule-header-spring.png)

!!! info "`CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`ヘッダーを持つリクエストのブロック"
    このルールは`CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`ヘッダーを含むリクエストをブロックしませんが、デフォルトではNGINXはこのヘッダーを持つリクエストを無効なものとしてドロップします。

ブロッキング[モード](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)で動作するWallarmノードは、デフォルトでこのような脆弱性の悪用防止をブロックします。

また、[Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell) には0-day脆弱性が存在します。その悪用防止は、[正規表現に基づく仮想パッチ](#example-block-all-requests-with-the-class-module-class-loader-body-parameters)を使ってブロックする方法を学びましょう。

## 新しい検出ルールの部分的な無効化

作成したルールを特定のブランチに対して部分的に無効化する必要がある場合、次のフィールドを持つルール*正規表現に基づく攻撃検出の無効化*を作成することで簡単に行うことができます：

- *正規表現*: 無視しなければならない以前に作成した正規表現。

    !!! warning "正規表現が変更された場合の規則の動作"
        [**正規表現に基づく攻撃指標を作成**](#adding-a-new-detection-rule)タイプの既存の規則で指定された正規表現を変更すると、その以前の表現を使用する**正規表現に基づく攻撃検出の無効化**ルールが自動的に削除されます。

        新しい正規表現による攻撃の検出を無効にするには、新しい正規表現を指定して新しいルール**正規表現に基づく攻撃検出の無効化**を作成してください。

- *このリクエストの部分で*: 例外設定が必要なパラメータを示します。

**例：指定のURLに対して不正なX-Authenticationヘッダーを許可する**

あなたが`example.com/test.php`のスクリプトを持っており、それのトークン形式を変更したいとします。

対応するルールを作成するには:

1. *Rules*タブに移動します
1. `example.com/test.php`のブランチを見つけるか作成して、 *Add rule*をクリックします
1. *Disable regexp-based attack detection*を選択します
1. あなたが無効にしたい正規表現を選択します
1. ポイントとして`Header X-AUTHENTICATION`を設定します
1. *Create*をクリックします

![Regex rule second example][img-regex-example2]

## API呼び出しでルールを作成する

正規表現に基づく攻撃指標を作成するには、Wallarm Console UIを使用するだけでなく、[APIを直接呼び出すことができます](../../api/overview.md)。下記は対応するAPI呼び出しの例です。

次のリクエストは、正規表現`^(~(44[.]33[.]22[.]11))$`に基づくカスタム攻撃指標を作成します。

`MY.DOMAIN.COM`ドメインへのリクエストが`X-FORWARDED-FOR: 44.33.22.11`HTTPヘッダーを持つ場合、Wallarmノードはそれらをスキャナ攻撃とみなし、対応する[フィルタリングモード](../../admin-en/configure-wallarm-mode.md)が設定されている場合は攻撃をブロックします。

--8<-- "../include-ja/api-request-examples/create-rule-scanner.md"