[link-regex]: https://github.com/yandex/pire

[img-regex-example1]: ../../images/user-guides/rules/regex-rule-1.png
[img-regex-example2]: ../../images/user-guides/rules/regex-rule-2.png
[img-regex-id]: ../../images/user-guides/rules/regex-id.png

# ユーザー定義の検出ルール

場合によっては、手動で攻撃検出用のシグネチャを追加したり、いわゆる*仮想パッチ*を作成したりすることが有益である。そのため、Wallarmは攻撃を検出するために正規表現を使用するわけではないが、ユーザーは正規表現を基に追加のシグネチャを追加することができる。

## 新しい検出ルールの追加

これを行うには、*Create regexp-based attack indicator*ルールを作成し、以下のフィールドに記入する必要があります:

* *Regular expression*: 正規表現 (シグネチャ)。次のパラメータの値がこの表現に一致する場合、そのリクエストは攻撃として検出されます。正規表現の構文と特性は、[rulesを追加する方法](add-rule.ja.md#condition-type-regex)の説明で明らかにされています。

    !!! warning "規則で指定された正規表現を変更すること"
        既存の **Create regexp-based attack indicator** の規則で指定された正規表現を変更すると、以前の表現を使用する、[**Disable regexp-based attack detection**](#partial-disabling-of-a-new-detection-rule)のルールが自動的に削除されます。

        新しい正規表現による攻撃の検出を無効にするには、新しい正規表現を指定して新しいルール **Disable regexp-based attack detection** を作成してください。

* *Experimental*: このフラグは、リクエストをブロックせずに正規表現のトリガーを安全に確認することができます。フィルタリングノードがブロックモードに設定されていても、リクエストはブロックされない。これらのリクエストは、実験的な方法によって検出された攻撃とみなされ、デフォルトではイベントリストから非表示になる。これらには検索クエリ `experimental attacks` を使用してアクセスできます。

* *Attack*: リクエスト内のパラメータ値が正規表現に一致するときに検出される攻撃のタイプ。

* *in this part of request*: リクエスト内で対応する攻撃を検出するシステムを決定する。

    --8<-- "../include/waf/features/rules/request-part-reference.ja.md"

### 例：不正なX-Authenticationヘッダーを持つ全てのリクエストをブロックする

**以下の条件が適用される場合:**

* アプリケーションが *example.com* ドメインでアクセス可能
* アプリケーションがユーザの認証に *X-Authentication* ヘッダを使用
* ヘッダの形式は32桁の16進数記号

**次に**、間違った形式のトークンを拒否するためのルールを作成するには：

1. *Rules* タブに移動
2. `example.com/**/*.*`のブランチを見つけ、*Add rule*をクリック
3. *Define as an attack on the basis of a regular expression* を選択
4. *Regex*の値を `[^0-9a-f]|^.{33,}$|^.{0,31}$` と設定
5. *Attack*のタイプとして `Virtual patch` を選択
6. ポイント `Header X-AUTHENTICATION` を設定
7. クリック *Create*

![!Regex rule first example][img-regex-example1]

### 例：`class.module.classLoader.*` ボディパラメータを含むすべてのリクエストをブロックする

[Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html)（Spring4Shell）での0-day 脆弱性を悪用する方法の一つは、以下のボディパラメータに悪意のあるペイロードを注入してPOSTリクエストを送信することです。

* `class.module.classLoader.resources.context.parent.pipeline.first.pattern`
* `class.module.classLoader.resources.context.parent.pipeline.first.suffix`
* `class.module.classLoader.resources.context.parent.pipeline.first.directory`
* `class.module.classLoader.resources.context.parent.pipeline.first.prefix`
* `class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat`

脆弱なSpring Core Frameworkを使用していて、Wallarmノードの[mode](../../admin-en/configure-wallarm-mode.ja.md#available-filtration-modes)がブロックと異なる場合、仮想パッチを使用して脆弱性の悪用を防ぐことができます。次のルールでは、リストされたボディパラメータを含むすべてのリクエストが監視モードおよび安全なブロックモードでもブロックされます。

![!Virtual patch for specific post params](../../images/user-guides/rules/regexp-rule-post-params-spring.png)

正規表現フィールドの値は以下の通りです。

```bash
(class[.]module[.]classLoader[.]resources[.]context[.]parent[.]pipeline[.]first[.])(pattern|suffix|directory|prefix|fileDateFormat)
```

ブロック[mode](../../admin-en/configure-wallarm-mode.ja.md#available-filtration-modes)で動作するWallarmノードは、デフォルトでそのような脆弱性悪用の試みをブロックします。

Spring Cloud Function コンポーネントにも活発な脆弱性（CVE-2022-22963）があります。このコンポーネントを使用していて、Wallarmノードのモードがブロックと異なる場合、以下で説明されているように仮想パッチを作成してください。
 (#example-block-all-requests-with-the-class-cloud-function-routing-expression-header).

### 例：`CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` ヘッダーが含まれるすべてのリクエストをブロックする

Spring Cloud Functionコンポーネントには、`CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` や `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` ヘッダーに悪意のあるペイロードを注入することによって悪用できる活発な脆弱性（CVE-2022-22963）があります。

このコンポーネントを使用していて、Wallarmノードの[mode](../../admin-en/configure-wallarm-mode.ja.md#available-filtration-modes)がブロックと異なる場合、仮想パッチを使用して脆弱性悪用を防ぐことができます。次のルールでは、`CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` ヘッダーが含まれるすべてのリクエストがブロックされます。

![!Virtual patch for specific header](../../images/user-guides/rules/regexp-rule-header-spring.png)

!!! info "`CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` ヘッダーを持つリクエストをブロックする方法"
    このルールは `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` ヘッダーを持つリクエストはブロックしませんが、NGINXはデフォルトでこのヘッダーを持つ不正なリクエストとしてドロップします。

ブロック[mode](../../admin-en/configure-wallarm-mode.ja.md#available-filtration-modes)で動作するWallarmノードは、デフォルトでそのような脆弱性悪用の試みをブロックします。

[Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html)（Spring4Shell）での0-day 脆弱性もあります。[reqexp-based virtual patch](#example-block-all-requests-with-the-classmoduleclassloader-body-parameters)でその悪用試みをブロックする方法を学習してください。

## 新しい検出ルールの部分的な無効化

作成されたルールが特定のブランチに対して部分的に無効化される必要がある場合、*Disable regexp-based attack detection*ルールを作成し、以下のフィールドを使用して簡単に実行できます。

- *Regular expression*: 無視されるべき以前に作成された正規表現。

    !!! warning "正規表現が変更された場合のルールの動作"
        既存の[**Create regexp-based attack indicator**](#adding-a-new-detection-rule)のタイプのルールで指定された正規表現を変更すると、以前の表現を使用する **Disable regexp-based attack detection** のルールが自動的に削除されます。

        新しい正規表現による攻撃の検出を無効にするには、新しい正規表現を指定して新しいルール **Disable regexp-based attack detection** を作成してください。

- *in this part of request*: 例外を設定するために必要なパラメータを示します。

**例：指定されたURLの不正なX-Authenticationヘッダを許可**

`example.com/test.php` にスクリプトがあり、そのトークンの形式を変更したいとします。

そのためのルールを作成するには：

1. *Rules* タブに移動
1. `example.com/test.php` のブランチを見つけるか作成し、*Add rule* をクリック
1. *Disable regexp-based attack detection* を選択
1. 無効にしたい正規表現を選択
1. ポイント `Header X-AUTHENTICATION` を設定
1. クリック *Create*

![!Regex rule second example][img-regex-example2]## ルールの作成用 API コール

正規表現ベースのアタック指標を作成するには、Wallarm Console UI を使用する他に、[Wallarm API を直接呼び出す](../../api/overview.ja.md)ことができます。以下は、対応する API コールの例です。

次のリクエストで、正規表現 `^(~(44[.]33[.]22[.]11))$` に基づくカスタムアタック指標が作成されます。

ドメイン `MY.DOMAIN.COM` へのリクエストに `X-FORWARDED-FOR: 44.33.22.11` HTTP ヘッダーがある場合、Wallarm ノードはそれらをスキャナ攻撃とみなし、対応する[フィルタリングモード](../../admin-en/configure-wallarm-mode.ja.md)が設定されている場合に攻撃をブロックします。

--8<-- "../include/api-request-examples/create-rule-scanner.ja.md"