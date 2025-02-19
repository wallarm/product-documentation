```markdown
# 公開資産 <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm Consoleの**Scanner**セクションでは、Wallarm Scannerにより自動的に検出されたドメイン、IPアドレス、ポートなどの公開資産をすべて確認できます。

プロジェクトが拡大するにつれて、リソースが増加し管理が困難になります。リソースは会社のデータセンター外に存在する場合があり、セキュリティが損なわれる可能性があります。Wallarmは倫理的ハッカーに類似した手法を用いてセキュリティを評価し、結果の可視化を提供します。

![Scanner section](../images/user-guides/scanner/check-scope.png)

## 資産の追加

Wallarmにお使いの会社の公開資産を検出させるため、最初の公開資産を手動で追加してください。**Add domain or IP**をクリックし、ドメインまたはIPを入力します。

![Scanner section](../images/user-guides/scanner/add-asset-manually.png)

新しいドメインまたはIPアドレスが追加されると、Wallarm Scannerはリソースに接続されている資産を検索するためのスキャン手順を起動し、それらをリストに追加します。Wallarmはまずポートをスキャンし、その後これらのポート上のネットワークリソースを検出します。

公開資産の収集および更新の継続的なプロセスには、以下のさまざまな手法が用いられます:

* 自動モード
    * DNSゾーン転送（[AXFR](https://tools.ietf.org/html/rfc5936)）
    * NSおよびMXレコードの取得
    * SPFレコードデータの取得
    * サブドメイン辞書検索
    * SSL証明書の解析
* Wallarm Console UIまたは[Wallarm API](../api/overview.md)を使用した手動データ入力

[資産検出手法の微調整](#fine-tuning-asset-scanning)は、**Configure**セクションで制御できます。

## ドメインの予約

公開資産リストにのみ追加可能なドメインをWallarmに予約してもらうことができます。他のアカウントがこれらのドメインを追加しないよう、[support@wallarm.com](mailto:support@wallarm.com)宛に予約リクエストを送信してください。

## 資産の管理

Wallarmは、公開資産をドメイン、IP、およびサービスグループに分類します。特定のデータセンターに属するIPアドレスの場合、Amazonの場合はAWS、Googleの場合はGCPなど、対応するタグが資産の横に表示されます。

まだユーザーによって確認されていない新たに検出された資産は**New**タブに表示され、脆弱性スキャンが[無効](#disabling-vulnerability-scanning-for-certain-assets)になっている資産は**Disabled**タブに表示されます。

リソースのドメイン、IPアドレス、およびポートは相互依存しています。資産を選択することで、選択したIPアドレスに紐付くドメインなどの関連情報を確認できます。

![Scope element with its associations](../images/user-guides/scanner/asset-with-associations.png)

### 資産間の接続の制御

既定では、低い優先順位の資産が無効化されても高い優先順位の資産は有効のままです。ドメインを[無効](#disabling-vulnerability-scanning-for-certain-assets)にすると、関連するIPアドレスとポートも無効化されます。IPアドレスを[削除](#deleting-assets)すると、関連するポートが削除されますが、ドメインは有効のままです。資産間の接続を削除することで、それぞれを個別に無効化または削除できます。

各資産のスキャン設定を個別に管理するには、以下の手順を実行してください:

1. 切断したい資産ペアから一方の資産を選択します。
1. 現在の資産にペアリングされている資産の横にあるスイッチをクリックします。

　　現在のリソースの名前は太字で表示され、発見日時もUIに表示されます。

![Disable the resource connection](../images/user-guides/scanner/disable-association.png)

資産間の接続を有効にする場合は、接続を無効化する際と同様の手順を実行してください。

### 資産の削除

資産を**削除**することで、Wallarmが誤ってリストに追加した資産を報告できます。削除された資産は、今後のスキャン時に検出されなくなります。

誤って削除された資産を復元するには、[Wallarmサポートチーム](mailto:support@wallarm.com)にお問い合わせください。

### 公開資産リストの変更に関する通知

Wallarmは、公開資産リストの変更（新たに検出された公開資産、無効化された資産、削除された資産）に関する通知を送信できます。

通知を受け取るには、メッセンジャーやSOARシステム（例: PagerDuty, Opsgenie, Slack, Telegram）との適切な[native integrations](settings/integrations/integrations-intro.md)を設定してください。

Slackメッセージの例:

```
[Test message] [Test partner] Network perimeter has changed

Notification type: new_scope_object_ips

New IP addresses were discovered in the network perimeter:
8.8.8.8

Client: TestCompany
Cloud: EU
```

## 資産スキャンの微調整

Wallarmで資産スキャンを微調整するには、**Configure**ボタンをクリックしてください。そこから、Wallarm Scannerが会社の公開資産を検出するために使用する手法を制御できます。既定では、利用可能なすべての手法が使用されます。

![Scanner config](../images/user-guides/vulnerabilities/scanner-configuration-options.png)

また、Wallarm Scanner全体のグローバルスイッチである**Basic Scanner functionality**も存在します。このスイッチにより、資産スキャンと脆弱性検出の両プロセスが管理され、会社全体のアカウントに対してScannerを有効または無効にできます。同じトグルスイッチは**Vulnerabilities**セクションにもあり、一方のセクションでスイッチを変更すると、もう一方のセクションの設定も自動的に更新されます。

## 脆弱性検出のための公開資産スキャン

Wallarmは、公開資産に対する典型的な脆弱性スキャンを含む、複数の手法を用いてインフラストラクチャ内のセキュリティ問題を検出します。Wallarm Scannerは、公開資産の収集後、すべてのIPアドレスおよびドメインに対して脆弱性を自動的にチェックします。

Wallarm Consoleの[**Vulnerabilities**セクション](vulnerabilities.md)には、検出された脆弱性が表示され、どの脆弱性を検出するかを制御できます。

### 特定の資産に対する脆弱性スキャンの無効化

**Scanner**セクションでは、各資産に対して、当該資産の脆弱性スキャンをオンまたはオフにするスイッチが設けられています。スイッチは、現在選択されている資産の左側にあり、太字で表示されます。スイッチを探すために要素にカーソルを合わせる必要はありません。

### 脆弱性スキャンの制限

Wallarm Scannerは、検出されたリソースのレスポンスに基づいて脆弱性を検出するため、テスト用の悪意あるリクエストを使用します。リソースに過度の負荷をかけないよう、Wallarm ScannerリクエストのRequests Per Second（RPS）及びRequests Per Minute（RPM）を管理できます。Threat Replay Testingモジュールも、公開資産のリソースに対してユーザー定義の値に基づきリクエストを制限します。

すべてのドメインおよびIPアドレスに同じ制限を設定するには、**Configure**をクリックし、該当セクションに値を入力してください。

特定のIPアドレスまたはドメインに対して制限を上書きするには:

1. **Domain**または**IP**タイプの資産を開きます。
1. **Set RPS limits**ボタンをクリックし、希望の制限値を指定してください。

　　ドメインのRPSを設定する場合は、ドメインに紐付く各IPアドレスに対し、**RPS per IP**フィールドに希望の値を入力できます。
1. **Save**をクリックしてください。

既定の設定に戻すには、空の値を使用するか`0`を入力してください。

![Setting domain RPS](../images/user-guides/scanner/set-rps-for-domain.png)

複数のドメインが同一のIPアドレスに関連付けられている場合、そのIPアドレスへのリクエスト速度はIPアドレスの制限を超えません。複数のIPアドレスが1つのドメインに関連付けられている場合、これらのIPアドレスへの合計リクエスト速度はドメインの制限を超えません。

## Scannerがブロックされるのを防ぐ方法

Wallarmのほかに、トラフィックを自動でフィルタリングおよびブロックする追加の機能（ソフトウェアまたはハードウェア）を使用している場合は、Wallarm Scannerの[IP addresses](../admin-en/scanner-addresses.md)を利用してallowlistを設定することを推奨します。

これにより、Wallarmコンポーネントが脆弱性スキャンのためにリソースを円滑にスキャンできるようになります。

## リソーススキャナーの停止に関するWallarmサポートへの連絡

Wallarm Scannerが、公開設定していない会社のリソースをスキャンしている場合は、[Wallarm Support](mailto:support@wallarm.com)に連絡して、該当リソースのスキャンからの除外を依頼してください。
```