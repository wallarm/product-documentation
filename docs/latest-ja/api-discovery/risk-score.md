# エンドポイントのリスクスコア <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Discovery](overview.md)は、APIインベントリ内の各エンドポイントに対して自動的にリスクスコアを計算します。リスクスコアによって、どのエンドポイントが攻撃対象になりやすいかを把握でき、セキュリティ対応の重点を定められます。

## リスクスコアの要因

リスクスコアは複数の要因で構成され、最終的なリスクスコアの計算時に各要因には固有の重みが設定されます。既定では、すべての要因の中で最も高い重みがエンドポイントのリスクスコアとして使用されます。

| 要因 | 説明 | 既定の重み |
| --- | --- | --- |
| アクティブな脆弱性 | [アクティブな脆弱性](../about-wallarm/detecting-vulnerabilities.md)は不正なデータアクセスや破損につながる可能性があります。 | 9 |
| BOLAに脆弱である可能性 | ユーザーIDなどの[可変パス部](exploring.md#variability)の存在（例：`/api/articles/author/{parameter_X}`）。攻撃者はオブジェクトIDを操作し、リクエスト認証が不十分な場合、オブジェクトの機微データを読み取ったり変更したりできます（[BOLA攻撃](../admin-en/configuration-guides/protecting-against-bola.md)）。 | 6 |
| 機微データを含むパラメータ | 攻撃者はAPIを直接攻撃するのではなく、[機微データ](overview.md#sensitive-data-detection)を盗み、それを用いてシームレスにリソースへ到達することがあります。 | 8 |
| クエリおよびボディパラメータの数 | パラメータが多いほど、攻撃ベクトルが増加します。 | 6 |
| XML / JSONオブジェクトを受け付ける | リクエストで渡されるXMLまたはJSONのオブジェクトは、攻撃者に悪意のあるXML外部エンティティやインジェクションをサーバーへ送る手段として悪用される可能性があります。 | 6 |
| サーバーへのファイルアップロードを許可 | エンドポイントは、悪意のあるコードを含むファイルがサーバーにアップロードされる[Remote Code Execution（RCE）](../attacks-vulns-list.md#remote-code-execution-rce)攻撃の標的となることがよくあります。これらのエンドポイントを保護するため、アップロードされるファイルの拡張子と内容を[OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)で推奨されているとおり適切に検証する必要があります。 | 6 |

要因の重要度に対する考え方に合わせるため、リスクスコアの計算における各要因の重みや計算方法は[設定](#customizing-risk-score-calculation)できます。

## リスクスコアのレベル

リスクスコアは`1`（最小）から`10`（最大）までです。

| 値 | リスクレベル | 色 |
| --------- | ----------- | --------- |
| 1〜3 | 低 | グレー |
| 4〜7 | 中 | オレンジ |
| 8〜10 | 高 | レッド |

* `1`は、このエンドポイントにリスク要因が存在しないことを意味します。
* 未使用のエンドポイントにはリスクスコアは表示されません（`N/A`）。
* **Risk**列でリスクスコア順にソートします。
* **Risk score**フィルターを使用して、`High`、`Medium`、`Low`で絞り込みます。

エンドポイントのリスクスコアの要因やリスク低減方法を確認するには、エンドポイントの詳細を開きます。

![API Discovery - リスクスコア](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

また、[米国](https://us1.my.wallarm.com/dashboard-api-discovery)または[EU](https://my.wallarm.com/dashboard-api-discovery)のCloudにある**Dashboards** → **API Discovery**で、リスクスコアレベル別のAPIの概要も確認できます。

## リスクスコア計算のカスタマイズ

リスクスコアの計算における各要因の重みと計算方法を設定できます。

リスクスコアの計算方法を変更するには:

1. **API Discovery**セクションで**Configure API Discovery**ボタンをクリックします。
1. **Risk scoring**タブに切り替えます。
1. 計算方法として、最大重みまたは平均重みを選択します。
1. 必要に応じて、リスクスコアに影響させたくない要因を無効化します。
1. 残りの要因の重みを設定します。

    ![API Discovery - リスクスコアのセットアップ](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)

1. 変更を保存します。数分以内に、新しい設定に従ってエンドポイントのリスクスコアをWallarmが再計算します。