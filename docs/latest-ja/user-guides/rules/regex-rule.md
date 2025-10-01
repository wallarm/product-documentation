[link-regex]:               https://github.com/yandex/pire
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[img-regex-example2]:       ../../images/user-guides/rules/regex-rule-2.png
[img-regex-id]:             ../../images/user-guides/rules/regex-id.png
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# カスタム攻撃ディテクタ

Wallarmは、正規表現で表現される独自の攻撃兆候を定義するための**Create regexp-based attack indicator**[ルール](../../user-guides/rules/rules.md)を提供します。

## ルールの作成と適用

独自の攻撃ディテクタを設定して適用するには:

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls** → **Custom attack detector**を選択します。
1. **If request is**で、ルールを適用する対象を[記述](rules.md#configuring)します。
1. 攻撃インジケーターのパラメータを設定します:

    * **Regular expression** - 正規表現（シグネチャ）です。以下のパラメータの値がこの式に一致する場合、そのリクエストは攻撃として検知されます。正規表現の構文と注意点は[ルール追加の手順](rules.md#condition-type-regex)で説明しています。

        !!! warning "ルールで指定した正規表現の変更"
            既存の**Create regexp-based attack indicator**タイプのルールで指定された正規表現を変更すると、以前の正規表現を使用している[**Disable regexp-based attack detection**](#partial-disabling)ルールが自動的に削除されます。

            新しい正規表現による攻撃検知を無効化するには、新しい正規表現を指定した**Disable regexp-based attack detection**ルールを新規作成してください。

    * **Experimental** - このフラグを有効にすると、リクエストをブロックせずに正規表現の発火を安全に確認できます。フィルタノードがblockingモードに設定されている場合でも、これらのリクエストはブロックされません。これらのリクエストは実験的手法で検知された攻撃として扱われ、既定ではイベント一覧から非表示になります。検索クエリ`experimental attacks`で表示できます。

    * **Attack** - リクエスト内のパラメータ値が正規表現に一致したときに検知する攻撃の種類です。

1. **In this part of request**で、攻撃兆候を検索したい[リクエストの各部](request-processing.md)を指定します。
1. [ルールのコンパイルとフィルタリングノードへのアップロード完了](rules.md#ruleset-lifecycle)を待ちます。

## ルール例

### 不正な`X-AUTHENTICATION`ヘッダーを含むすべてのリクエストをブロックする

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

### ボディパラメータに`class.module.classLoader.*`を含むすべてのリクエストをブロックする

[Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html)（Spring4Shell）にはゼロデイ脆弱性があり、次のボディパラメータに悪意あるペイロードを注入したPOSTリクエストを送ることで悪用される可能性があります:

* `class.module.classLoader.resources.context.parent.pipeline.first.pattern`
* `class.module.classLoader.resources.context.parent.pipeline.first.suffix`
* `class.module.classLoader.resources.context.parent.pipeline.first.directory`
* `class.module.classLoader.resources.context.parent.pipeline.first.prefix`
* `class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat`

脆弱なSpring Core Frameworkを使用していて、Wallarm nodeの[mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)がblocking以外の場合は、バーチャルパッチを使用して脆弱性の悪用を防止できます。次のルールは、monitoringおよびsafe blockingモードでも、上記のボディパラメータを含むすべてのリクエストをブロックします:

![特定のPOSTパラメータ向けのバーチャルパッチ](../../images/user-guides/rules/regexp-rule-post-params-spring.png)

正規表現フィールドの値は次のとおりです:

```bash
(class[.]module[.]classLoader[.]resources[.]context[.]parent[.]pipeline[.]first[.])(pattern|suffix|directory|prefix|fileDateFormat)
```

Wallarm nodeがblocking[mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)で動作している場合、このような脆弱性の悪用試行は既定でブロックされます。

Spring Cloud Functionコンポーネントにも既知の脆弱性（CVE-2022-22963）があります。このコンポーネントを使用していてWallarm nodeのmodeがblocking以外の場合は、[以下](#block-all-requests-with-class-cloud-function-routing-expression-header)のとおりバーチャルパッチを作成してください。

### `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`ヘッダーを含むすべてのリクエストをブロックする

Spring Cloud Functionコンポーネントには既知の脆弱性（CVE-2022-22963）があり、`CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`または`CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`ヘッダーに悪意あるペイロードを注入することで悪用される可能性があります。

このコンポーネントを使用していてWallarm nodeの[mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)がblocking以外の場合は、バーチャルパッチで悪用を防止できます。次のルールは、`CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`ヘッダーを含むすべてのリクエストをブロックします:

![特定のヘッダー向けのバーチャルパッチ](../../images/user-guides/rules/regexp-rule-header-spring.png)

!!! info "`CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`ヘッダーを持つリクエストのブロックについて"
    このルールは`CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`ヘッダーを持つリクエストをブロックしませんが、NGINXは既定でこのヘッダーを持つリクエストを無効なものとして破棄します。

Wallarm nodeがblocking[mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)で動作している場合、このような脆弱性の悪用試行は既定でブロックされます。

[Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html)（Spring4Shell）にもゼロデイ脆弱性があります。[正規表現ベースのバーチャルパッチ](#block-all-requests-with-classmoduleclassloader-body-parameters)でその悪用試行をブロックする方法をご確認ください。

## 部分的な無効化

作成したルールを特定のブランチで部分的に無効化する必要がある場合は、次のフィールドで**Disable regexp-based attack detection**ルールを作成することで簡単に実現できます:

- **Regular expression**: 無視する必要がある既存の正規表現を選択します。

    !!! warning "正規表現を変更した場合のルールの挙動"
        既存の[**Create regexp-based attack indicator**](#creating-and-applying-rule)タイプのルールで指定された正規表現を変更すると、以前の正規表現を使用している**Disable regexp-based attack detection**ルールが自動的に削除されます。

        新しい正規表現による攻撃検知を無効化するには、新しい正規表現を指定した**Disable regexp-based attack detection**ルールを新規作成してください。

- **in this part of request**: 例外を設定する必要があるパラメータを指定します。

**例: 指定したURLに対して不正なX-Authenticationヘッダーを許可する**

`example.com/test.php`でスクリプトを運用していて、そのトークン形式を変更したいとします。

該当のルールを作成するには:

1. **Rules** tabに移動します。
1. `example.com/test.php`のブランチを探すか作成し、**Add rule**をクリックします。
1. **Fine-tuning attack detection** → **Disable custom attack detector**を選択します。
1. 無効化したい正規表現を選択します。
1. 項目を`Header X-AUTHENTICATION`に設定します。
1. **Create**をクリックします。

![正規表現ルールの2番目の例][img-regex-example2]

## ルールを作成するAPI呼び出し

正規表現ベースの攻撃インジケーターを作成するには、[Wallarm APIを直接呼び出す](../../api/request-examples.md#create-a-rule-to-consider-the-requests-with-specific-value-of-the-x-forwarded-for-header-as-attacks)ことができます。