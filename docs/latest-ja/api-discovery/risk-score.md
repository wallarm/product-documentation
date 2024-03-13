# エンドポイントリスクスコア <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Discovery](overview.md)は、APIインベントリ内の各エンドポイントの**リスクスコア**を自動的に計算します。リスクスコアにより、どのエンドポイントが攻撃の対象となりやすいかを理解し、セキュリティ対策の重点を設定できます。

## リスクスコアの要因

リスクスコアは、計算する際にそれぞれの重みを持つ様々な要因から成り立っています。デフォルトでは、すべての要因から最高の重みがエンドポイントリスクスコアとして使用されます。

| 要因 | 説明 | デフォルトの重み |
| --- | --- | --- |
| アクティブな脆弱性 | [アクティブな脆弱性](../about-wallarm/detecting-vulnerabilities.md)は、不正なデータアクセスまたはデータ汚染を引き起こす可能性があります。 | 9 |
| BOLAに潜在的に脆弱 | ユーザーIDなど、`/api/articles/author/{parameter_X}`のような[変動するパス部分](exploring.md#variability-in-endpoints)の存在。攻撃者はオブジェクトIDを操作し、リクエスト認証が不十分な場合、オブジェクトの機密データを読み取るか変更する([BOLA攻撃](../admin-en/configuration-guides/protecting-against-bola.md))ことがあります。 | 6 |
| 機密データを持つパラメータ | 攻撃者はAPIを直接攻撃するのではなく、[機密データ](overview.md#sensitive-data-detection)を盗み出し、あなたのリソースに無断でアクセスするために使用することがあります。 | 8 |
| クエリ及びボディパラメータの数 | 多数のパラメータは、攻撃の方向性を増加させます。 | 6 |
| XML/JSONオブジェクトを受け付ける | リクエストで渡されたXMLまたはJSONオブジェクトは、攻撃者によって悪意のあるXML外部エンティティやインジェクションをサーバーに転送するために使用される可能性があります。 | 6 |
| サーバーへのファイルアップロードを許可 | エンドポイントは、悪意のあるコードを含むファイルがサーバーにアップロードされる[リモートコード実行(RCE)](../attacks-vulns-list.md#remote-code-execution-rce)攻撃の一般的な対象です。これらのエンドポイントを保護するには、アップロードされるファイルの拡張子と内容を[OWASPチートシート](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)に従って適切に検証する必要があります。 | 6 |

リスクスコアの推定をあなたの要因の重要性の理解に適応させるには、リスクスコア計算での各要因の重みと計算方法を[設定](#customizing-risk-score-calculation)できます。

## リスクスコアレベル

リスクスコアは、`1`（最低）から`10`（最高）までの範囲です：

| 値 | リスクレベル | 色 |
| --------- | ----------- | --------- |
| 1から3 | 低 | グレー |
| 4から7 | 中 | オレンジ |
| 8から10 | 高 | 赤 |

* `1`は、このエンドポイントにリスク要因がないことを意味します。
* リスクスコアは使用されていないエンドポイントに対しては表示されません（`N/A`）。
* **リスク**列でリスクスコアでソートします。
* **リスクスコア**フィルターを使用して`高`、`中`、または`低`をフィルタリングします。

エンドポイントのリスクスコアが何によって引き起こされたのか、そしてリスクをどのように減らすかを理解するには、エンドポイントの詳細に進んでください：

![API Discovery - リスクスコア](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

また、[US](https://us1.my.wallarm.com/dashboard-api-discovery)または[EU](https://my.wallarm.com/dashboard-api-discovery)クラウドの**ダッシュボード** → **API Discovery**で、リスクスコアレベル別のAPIの概要を取得することもできます。

## リスクスコア計算のカスタマイズ

リスクスコア計算の各要因の重みと計算方法を設定できます。

リスクスコアの計算方法を変更するには：

1. **API Discovery**セクションで**API Discoveryを設定**ボタンをクリックします。
1. **リスクスコア**タブに切り替えます。
1. 計算方法として、最高または平均の重みを選択します。
1. 必要に応じて、リスクスコアに影響を与えたくない要因を無効にします。
1. 残りの要因に対して重みを設定します。

    ![API Discovery - リスクスコア設定](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)

1. 変更を保存します。Wallarmは数分以内に新しい設定に従ってエンドポイントのリスクスコアを再計算します。