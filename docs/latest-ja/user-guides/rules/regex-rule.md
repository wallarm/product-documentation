```markdown
[link-regex]:               https://github.com/yandex/pire
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[img-regex-example2]:       ../../images/user-guides/rules/regex-rule-2.png
[img-regex-id]:             ../../images/user-guides/rules/regex-id.png
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# カスタム攻撃検出器

Wallarmは正規表現で記述された独自の攻撃サインを定義するための**Create regexp-based attack indicator**[rule](../../user-guides/rules/rules.md)を提供します。

## ルールの作成と適用

独自の攻撃検出器を設定して適用するには:

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls** → **Custom attack detector**を選択します。
1. 「If request is」で[describe](rules.md#configuring)攻撃検出ルールの適用範囲を記述します。
1. 攻撃インジケータのパラメータを設定します:

    * **Regular expression** - 正規表現(シグネチャ)。以下のパラメータの値がこの正規表現に一致する場合、そのリクエストは攻撃として検出されます。正規表現の構文や特性については、[ルール追加の手順](rules.md#condition-type-regex)に記載されています。

        !!! warning "ルールで指定された正規表現の変更"
            既存の**Create regexp-based attack indicator**タイプのルールで指定された正規表現を変更すると、以前の正規表現を使用している[**Disable regexp-based attack detection**](#partial-disabling)ルールが自動的に削除されます。

            新しい正規表現による攻撃検出を無効にするには、新たに正規表現を指定した**Disable regexp-based attack detection**ルールを作成してください。

    * **Experimental** - このフラグは、リクエストをブロックせずに正規表現のトリガーを安全に確認できるようにします。フィルターノードがブロッキングモードに設定されている場合でもリクエストはブロックされません。これらのリクエストは実験的な手法で検出された攻撃とみなされ、デフォルトではイベントリストから非表示になります。検索クエリ`experimental attacks`を使用してアクセスできます。

    * **Attack** - リクエスト内のパラメータ値が正規表現に一致した場合に検出される攻撃の種類です。

1. 「In this part of request」で、攻撃サインの検索対象となる[request parts](request-processing.md)を指定します。
1. [rule compilation and uploading to the filtering node to complete](rules.md#ruleset-lifecycle)するまでお待ちください。

## ルール例

### 誤った`X-AUTHENTICATION`ヘッダーを含むすべてのリクエストをブロック

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

### `class.module.classLoader.*`のボディパラメータを含むすべてのリクエストをブロック

Spring Core Framework(https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html)（Spring4Shell）の0-day脆弱性を悪用する方法の一つは、以下のボディパラメータに特定の悪意のあるペイロードを注入したPOSTリクエストを送信することです:

* `class.module.classLoader.resources.context.parent.pipeline.first.pattern`
* `class.module.classLoader.resources.context.parent.pipeline.first.suffix`
* `class.module.classLoader.resources.context.parent.pipeline.first.directory`
* `class.module.classLoader.resources.context.parent.pipeline.first.prefix`
* `class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat`

脆弱なSpring Core Frameworkを使用しており、かつWallarmノードの[mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)がブロッキング以外の場合、仮パッチを使用して脆弱性の悪用を防ぐことができます。以下のルールは、モニタリングやSafe modeでも上記のボディパラメータを含むすべてのリクエストをブロックします:

![Virtual patch for specific post params](../../images/user-guides/rules/regexp-rule-post-params-spring.png)

正規表現フィールドの値は次の通りです:

```bash
(class[.]module[.]classLoader[.]resources[.]context[.]parent[.]pipeline[.]first[.])(pattern|suffix|directory|prefix|fileDateFormat)
```

ブロッキング[mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)で動作しているWallarmノードは、これらの脆弱性悪用試行をデフォルトでブロックします。

Spring Cloud FunctionコンポーネントにもCVE-2022-22963の脆弱性が存在します。このコンポーネントを使用しており、かつWallarmノードのmodeがブロッキングではない場合、下記[説明](#block-all-requests-with-class-cloud-function-routing-expression-header)に従って仮パッチを作成してください。

### `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`ヘッダーを含むすべてのリクエストをブロック

Spring Cloud FunctionコンポーネントにはCVE-2022-22963の脆弱性が存在し、`CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`または`CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`ヘッダーに悪意のあるペイロードを注入することで悪用される可能性があります。

このコンポーネントを使用しており、かつWallarmノードの[mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)がブロッキング以外の場合、仮パッチを使用して脆弱性の悪用を防ぐことができます。以下のルールは、`CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`ヘッダーを含むすべてのリクエストをブロックします:

![Virtual patch for specific header](../../images/user-guides/rules/regexp-rule-header-spring.png)

!!! info " `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` ヘッダーを持つリクエストのブロック"
    このルールは`CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`ヘッダーを持つリクエスト自体をブロックしませんが、NGINXはデフォルトでこのヘッダーを含むリクエストを無効として破棄します。

ブロッキング[mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)で動作しているWallarmノードは、これらの脆弱性悪用試行をデフォルトでブロックします。

また、[Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html)（Spring4Shell）にも0-day脆弱性が存在します。[reqexp-based virtual patch](#block-all-requests-with-classmoduleclassloader-body-parameters)を使用してその悪用試行をブロックする方法を学んでください。

## 部分的な無効化

作成したルールを特定のブランチに対して部分的に無効化する場合は、以下のフィールドを使用して**Disable regexp-based attack detection**ルールを作成することで容易に実現できます。

- **Regular expression**: 以前に作成された、無視すべき正規表現。

    !!! warning "正規表現が変更された場合のルールの動作"
        既存の[**Create regexp-based attack indicator**](#creating-and-applying-rule)タイプのルールで指定された正規表現を変更すると、以前の正規表現を使用している**Disable regexp-based attack detection**ルールが自動的に削除されます。

        新しい正規表現による攻撃検出を無効化するには、新たに正規表現を指定した**Disable regexp-based attack detection**ルールを作成してください。

- **in this part of request**: 例外設定が必要なパラメータを示します。

**例: 指定されたURLに対して誤った X-AUTHENTICATION ヘッダーを許可する**

例えば、`example.com/test.php`にスクリプトがあり、そのトークンの形式を変更したいとします。

該当ルールを作成するには:

1. **Rules**タブに移動します。
2. `example.com/test.php`のブランチを見つけるか新規作成し、**Add rule**をクリックします。
3. **Fine-tuning attack detection** → **Disable custom attack detector**を選択します。
4. 無効にする正規表現を選択します。
5. `Header X-AUTHENTICATION`を指定します。
6. **Create**をクリックします。

![Regex rule second example][img-regex-example2]

## ルール作成のAPI呼び出し

正規表現ベースの攻撃検出指標を作成するには、[Wallarm APIを直接呼び出す](../../api/request-examples.md#create-a-rule-to-consider-the-requests-with-specific-value-of-the-x-forwarded-for-header-as-attacks)ことができます。
```