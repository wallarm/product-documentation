[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# 仮想パッチ

アプリケーションのコード内の重大な[脆弱性](../../user-guides/vulnerabilities.md)を修正したり、必要な更新を迅速にインストールしたりすることが不可能な場合には、これらの脆弱性を悪用され得るエンドポイントへの全リクエストまたは特定のリクエストをブロックする仮想パッチを作成できます。仮想パッチは、[allowlisted](../ip-lists/overview.md) IPからのものを除き、[monitoringおよびsafe blockingモード](../../admin-en/configure-wallarm-mode.md)でもリクエストをブロックします。

仮想パッチを作成するために、Wallarmは次の[ルール](../../user-guides/rules/rules.md)を提供します：

* **Create a virtual patch**ルール - 選択したリクエスト部分に、SQLi、SSTi、RCEなどの[既知の](../../attacks-vulns-list.md)攻撃兆候のいずれかが含まれているリクエストをブロックする仮想パッチを作成できます。また、攻撃兆候がない特定のリクエストをブロックするには**Any request**を選択できます。
* **Create regexp-based attack indicator**ルールで**Virtual patch**オプションを選択 - 正規表現で記述した独自の攻撃兆候、または独自のブロック理由([例](#blocking-all-requests-with-incorrect-x-authentication-header)を参照)を含むリクエストをブロックする仮想パッチを作成できます。正規表現ベースのルールの扱いについての詳細は[こちら](../../user-guides/rules/regex-rule.md)に記載しています。

## ルールの作成と適用

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls**を選択 →

    * **Virtual patch** または
    * **Custom attack detector**(**Virtual patch**オプションを選択 - [詳細](../../user-guides/rules/regex-rule.md)を参照)

1. **If request is**で、ルールの適用対象範囲を[設定](rules.md#configuring)します。
1. 汎用的な**Create a virtual patch**ルールの場合、すべてのリクエストをブロックするか、特定の攻撃兆候を含むリクエストのみをブロックするかを設定します(**Any request** と **Selected**)。
1. **In this part of request**で、ルールを設定したいリクエストのポイントを指定します。Wallarmは、選択したリクエストパラメータに同じ値を持つリクエストを制限します。

    利用可能なポイントは[こちら](request-processing.md)に記載されています。ユースケースに合致するものを選択できます。

1. [ルールのコンパイルとフィルタリングノードへのアップロードの完了](rules.md#ruleset-lifecycle)を待ちます。

## ルール例

### 指定エンドポイントに対する特定リクエストのブロック

例えば、`example.com/purchase`エンドポイントでアクセスできるアプリケーションのオンライン購入セクションが、クエリ文字列パラメータ`refresh`の処理時にクラッシュするとします。不具合が修正されるまで、クラッシュにつながるリクエストをブロックする必要があります。

そのためには、スクリーンショットのとおりに**Create a virtual patch**ルールを設定します。

![あらゆるリクエストタイプ向けの仮想パッチ][img-vpatch-example2]

### 検出済みだが未修正の脆弱性に対する悪用試行のブロック

例えば、`example.com`ドメインで公開されているアプリケーションに未修正の脆弱性が検出されたとします。アプリケーションの`id`パラメータがSQLインジェクション攻撃に脆弱です。一方で、Wallarmフィルタリングノードはmonitoringモードに設定されていますが、脆弱性の悪用試行を直ちにブロックする必要があります。

そのためには、スクリーンショットのとおりに**Create a virtual patch**ルールを設定します。

![特定のリクエストタイプ向けの仮想パッチ][img-vpatch-example1]

### 不正な`X-AUTHENTICATION`ヘッダーを持つ全リクエストのブロック {#blocking-all-requests-with-incorrect-x-authentication-header}

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

## 仮想パッチのAPI呼び出し

仮想パッチを作成するには、Wallarm APIを直接呼び出すことができます。以下の例をご参照ください。

* [`/my/api/*`に送信される全リクエストをブロックする仮想パッチを作成](../../api/request-examples.md#create-the-virtual-patch-to-block-all-requests-sent-to-myapi)
* [`/my/api/*`に送信される全リクエストをブロックする、特定のアプリケーションインスタンスID向けの仮想パッチを作成](../../api/request-examples.md#create-the-virtual-patch-for-a-specific-application-instance-id-to-block-all-requests-sent-to-myapi)