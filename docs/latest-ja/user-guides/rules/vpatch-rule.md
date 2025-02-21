[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# 仮想パッチ

アプリケーションのコード内に存在する重大な[脆弱性](../../user-guides/vulnerabilities.md)を修正することや必要なアップデートを迅速に適用することが不可能な場合、これらの脆弱性を悪用する可能性があるエンドポイントへのすべてまたは特定のリクエストをブロックするために仮想パッチを作成することができます。仮想パッチは、[許可リスト](../ip-lists/overview.md)に登録されたIPから発信されたリクエストを除き、モニタリングおよびSafe modeの[modes](../../admin-en/configure-wallarm-mode.md)においてもリクエストをブロックします。

Wallarmでは、以下の[ルール](../../user-guides/rules/rules.md)を提供して仮想パッチを作成できます：

* **Create a virtual patch**ルール ― SQLi、SSTi、RCEなどの[既知](../../attacks-vulns-list.md)の攻撃サインのいずれかを選択した部分に含むリクエストをブロックする仮想パッチを作成できます。また、攻撃サインを含まない特定のリクエストをブロックするために**Any request**を選択することも可能です。
* **Create regexp-based attack indicator**ルールにおいて**Virtual patch**オプションを選択 ― 正規表現で記述された独自の攻撃サインやブロック理由（[例](#blocking-all-requests-with-incorrect-x-authentication-header)を参照）を含むリクエストをブロックする仮想パッチを作成できます。正規表現に基づくルールの詳細な操作方法は[こちら](../../user-guides/rules/regex-rule.md)に記載されています。

## ルールの作成と適用

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls** を選択します →

    * **Virtual patch** または
    * **Custom attack detector** （**Virtual patch**オプション付き ― [詳細](../../user-guides/rules/regex-rule.md)を参照）

1. **If request is** で、ルールを適用する対象の範囲を[設定](rules.md#configuring)します。
1. 一般的な**Create a virtual patch**ルールの場合、特定の攻撃サインを含むリクエストのみをブロックするか、すべてのリクエストをブロックするか（**Any request** vs. **Selected**）を設定します。
1. **In this part of request** で、ルールを設定したいリクエスト項目を指定します。Wallarmは、選択したリクエストパラメータの値が同一であるリクエストを制限します。

    利用可能なすべての項目は[こちら](request-processing.md)に記載されており、用途に合わせて選択できます。

1. [ルールのコンパイルとフィルタリングノードへのアップロード](rules.md#ruleset-lifecycle)が完了するまでお待ちください。

## ルールの例

### 特定のエンドポイントに対する特定のリクエストのブロック

例えば、`example.com/purchase`エンドポイントでアクセス可能なアプリケーションのオンライン購入セクションが、`refresh`クエリ文字列パラメータの処理時にクラッシュするとします。バグが修正される前に、クラッシュを引き起こすリクエストをブロックする必要があります。

そのため、以下のスクリーンショットに示すように**Create a virtual patch**ルールを設定します：

![Virtual patch for any request type][img-vpatch-example2]

### 発見済みだがまだ修正されていない脆弱性に対する悪用試行のブロック

例えば、`example.com`ドメインでアクセス可能なアプリケーションに、発見済みだがまだ修正されていない脆弱性があり、アプリケーションの`id`パラメータがSQLインジェクション攻撃に対して脆弱であるとします。その間、Wallarmフィルタリングノードがモニタリングモードに設定されているにも関わらず、脆弱性の悪用試行を即座にブロックする必要があります。

そのため、以下のスクリーンショットに示すように**Create a virtual patch**ルールを設定します：

![Virtual patch for a certain request type][img-vpatch-example1]

### 不正な`X-AUTHENTICATION`ヘッダーを含むすべてのリクエストのブロック

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

## 仮想パッチのためのAPIコール

仮想パッチを作成するために、Wallarm APIを直接呼び出すことができます。以下の例を参照してください：

* [すべての`/my/api/*`へ送信されるリクエストをブロックする仮想パッチの作成](../../api/request-examples.md#create-the-virtual-patch-to-block-all-requests-sent-to-myapi)
* [特定のアプリケーションインスタンスIDに対する`/my/api/*`へ送信されるすべてのリクエストをブロックする仮想パッチの作成](../../api/request-examples.md#create-the-virtual-patch-for-a-specific-application-instance-id-to-block-all-requests-sent-to-myapi)