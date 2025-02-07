# エンドポイントリスクスコア <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Discovery](overview.md)は、APIインベントリ内の各エンドポイントに対して自動的に**リスクスコア**を算出します。リスクスコアにより、攻撃対象となる可能性が最も高いエンドポイントを把握でき、セキュリティ対策の重点箇所を判断できます。

## リスクスコアの要因

リスクスコアは、最終的なリスクスコアを算出する際に個々に重みが設定された各要因で構成されます。デフォルトでは、すべての要因の中で最も高い重みがエンドポイントリスクスコアとして使用されます。

| 要因 | 説明 | デフォルトの重み |
| --- | --- | --- |
| Active vulnerabilities | [Active vulnerabilities](../about-wallarm/detecting-vulnerabilities.md)により、不正なデータアクセスまたはデータ破損が発生する可能性があります。 | 9 |
| Potentially vulnerable to BOLA | ユーザーIDなどの[可変パス部分](exploring.md#variability)が存在する場合、例：`/api/articles/author/{parameter_X}`。攻撃者はオブジェクトIDを操作し、リクエスト認証が不十分な場合、オブジェクトの機密データを読み取るまたは変更する可能性があり（[BOLA attacks](../admin-en/configuration-guides/protecting-against-bola.md)）、攻撃対象になりやすくなります。 | 6 |
| Parameters with sensitive data | 攻撃者はAPIを直接攻撃するのではなく、[sensitive data](overview.md#sensitive-data-detection)を窃取し、リソースにシームレスにアクセスできるようにする可能性があります。 | 8 |
| Number of query and body parameters | パラメータの数が多いほど、攻撃の方向性が多くなります。 | 6 |
| Accepts XML / JSON objects | リクエスト内に渡されるXMLまたはJSONオブジェクトは、攻撃者によって悪意あるXML外部エンティティやインジェクションをサーバーに転送するために使用される可能性があります。 | 6 |
| Allows uploading files to the server | エンドポイントは、悪意あるコードが仕込まれたファイルがサーバーにアップロードされる[Remote Code Execution (RCE)](../attacks-vulns-list.md#remote-code-execution-rce)攻撃の標的となる場合が多くなります。これらのエンドポイントを保護するため、アップロードされたファイルの拡張子及び内容は、[OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)で推奨されるように適切に検証すべきです。 | 6 |

リスクスコアの要因の重要性に基づいてリスクスコアの算出方法を調整するには、[リスクスコア計算のカスタマイズ](#customizing-risk-score-calculation)にて、各要因の重みおよび計算方法を設定できます。

## リスクスコアのレベル

リスクスコアは`1`（最低）から`10`（最高）までの値を取り得ます。

| 値 | リスクレベル | 色 |
| --------- | ----------- | --------- |
| 1〜3 | 低 | Gray |
| 4〜7 | 中 | Orange |
| 8〜10 | 高 | Red |

* `1`は、このエンドポイントにリスク要因が一切存在しないことを意味します。
* 使用されていないエンドポイントについては、リスクスコアは表示されません（`N/A`）。
* **Risk**欄でリスクスコアの順に並べ替えます。
* **Risk score**フィルターを使って、`High`、`Medium`、または`Low`をフィルターできます。

エンドポイントのリスクスコアの原因とリスク低減方法を把握するには、エンドポイントの詳細をご確認ください。

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

また、[US](https://us1.my.wallarm.com/dashboard-api-discovery)または[EU](https://my.wallarm.com/dashboard-api-discovery) Cloudの**Dashboards** → **API Discovery**にて、APIごとのリスクスコアレベルの概要をご確認いただけます。

## リスクスコア計算のカスタマイズ

リスクスコアの算出方法および各要因の重みは設定によりカスタマイズできます。

リスクスコアの計算方法を変更するには：

1. **API Discovery**セクションにある**Configure API Discovery**ボタンをクリックします。
2. **Risk scoring**タブに切り替えます。
3. 計算方法を選択します：最高重みまたは平均重み。
4. 必要に応じて、リスクスコアに影響させたくない要因を無効にします。
5. 残っている要因の重みを設定します。

    ![API Discovery - Risk score setup](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)

6. 変更内容を保存します。Wallarmは、新しい設定に従い数分以内にエンドポイントのリスクスコアを再計算します。