# Native Nodeのアーティファクトのバージョンと変更履歴

このドキュメントでは、さまざまな形態で提供される[バージョン](../versioning-policy.md)の[Native Wallarm Node](../../installation/nginx-native-node-internals.md#native-node) 0.14.x+を一覧で示し、リリースの追跡とアップグレード計画に役立てられるようにします。

## All-in-oneインストーラ

Native Nodeのオールインワンインストーラは、[TCPトラフィックミラーの解析](../../installation/oob/tcp-traffic-mirror/deployment.md)およびMuleSoftの[Mule](../../installation/connectors/mulesoft.md)または[Flex](../../installation/connectors/mulesoft-flex.md) Gateway、[Akamai](../../installation/connectors/akamai-edgeworkers.md)、[CloudFront](../../installation/connectors/aws-lambda.md)、[Cloudflare](../../installation/connectors/cloudflare.md)、[Istio](../../installation/connectors/istio.md)、[Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md)、[Fastly](../../installation/connectors/fastly.md)、[IBM DataPower](../../installation/connectors/ibm-api-connect.md)各コネクタを用いたセルフホスト型ノードのデプロイに使用します。

オールインワンインストーラの更新履歴はx86_64版とARM64(ベータ)版に同時に適用されます。

[アップグレード方法](all-in-one.md)

### 0.17.1 (2025-08-15)

* Cloudへの資格情報エクスポートに関する不具合を修正しました
* GraphQLパーサを改善しました
* スループット向上のため、Nodeとwstore間の内部チャネルを最適化しました
    
    これにより、Nodeがトラフィックを取り込む速度がpostanalyticsへのエクスポート速度を上回る場合の潜在的なデータ損失を防ぎます。
* 送信元IPアドレスがないシリアライズ済みリクエストがpostanalyticsへエクスポートに失敗する問題を修正しました
* バグ修正および内部的な改善を行いました

### 0.16.3 (2025-08-05)

* [Akamaiコネクタ](../../installation/connectors/akamai-edgeworkers.md)をサポートしました
* アップグレード時に`--preserve`フラグを`true`に設定すると無言で失敗する問題を修正しました

### 0.16.1 (2025-08-01)

* 高負荷時に過剰な入力をドロップするかを制御する[`drop_on_overload`](../../installation/native-node/all-in-one-conf.md#drop_on_overload)パラメータを導入しました

    デフォルトで有効です（`true`）。
* 新しい[Prometheusメトリクス](../../admin-en/native-node-metrics.md)を追加しました:

    * 一般的なNative Nodeインスタンス情報を提供する`wallarm_gonode_application_info`（例）:
    
        ```bash
        wallarm_gonode_application_info{deployment_type="node-native-aio-installer",mode="connector-server",version="0.16.1"} 1
        ```
    
    * `wallarm_gonode_http_inspector_balancer_workers`
    * `wallarm_gonode_http_inspector_debug_container_len`に`type="channel:in"`の場合の`aggregate="sum"`を追加しました
    * `wallarm_gonode_http_inspector_errors_total`に新しい`type="FlowTimeouts"`を追加しました
* 内部`http_inspector`モジュールの安定性を改善しました

### 0.16.0 (2025-07-23)

* [MuleSoft Flex Gatewayコネクタ](../../installation/connectors/mulesoft-flex.md)をサポートしました
* どのリクエストをNodeが検査またはバイパスするかを定義できる[`input_filters`](../../installation/native-node/all-in-one-conf.md#input_filters)設定セクションを導入しました
* メモリリークを修正しました
* URI・名前空間・タグ名を結合した[**xml_tag**](../../user-guides/rules/request-processing.md#xml)値の区切り文字を`:`から`|`に変更しました
* denylistに登録されたオリジンとWallarm ConsoleのUIで設定したモードの組み合わせで発生するブロック問題を修正しました
* 内部的な改善を行いました

### 0.15.1 (2025-07-08)

* 信頼済みネットワークの設定および実クライアントIP・Hostヘッダー抽出を行う[`proxy_headers`](../../installation/native-node/all-in-one-conf.md#proxy_headers)設定を導入しました

    これは、`tcp-capture`モードの旧バージョンで使用していた`http_inspector.real_ip_header`を置き換えます。
* `go-node`バイナリが公開するPrometheusメトリクスのプレフィックスをカスタマイズできる[`metrics.namespace`](../../installation/native-node/all-in-one-conf.md#metricsnamespace)設定オプションを追加しました
* `keep-alive`接続の上限を制御するため[`connector.per_connection_limits`](../../installation/native-node/all-in-one-conf.md#connectorper_connection_limits)を追加しました
* 些細な内部ファイル構造の変更を行いました
* wstoreのポートバインドを修正しました: `0.0.0.0`ではなく`127.0.0.1`にバインドするようにしました
* [CVE-2025-22874](https://nvd.nist.gov/vuln/detail/CVE-2025-22874)の脆弱性を修正しました
* [CVE-2025-47273](https://nvd.nist.gov/vuln/detail/CVE-2025-47273)の脆弱性を修正しました

### 0.14.1 (2025-05-07)

* [**enumeration**](../../api-protection/enumeration-attack-protection.md)の緩和コントロールをサポートしました
* [**DoS保護**](../../api-protection/dos-protection.md)の緩和コントロールをサポートしました
* [IBM API Connectコネクタ](../../installation/connectors/ibm-api-connect.md)をサポートしました
* [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406)、[CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115)の脆弱性を修正しました
* `connector-server`モードで外部ヘルスチェックエンドポイントをサポートしました

    これは新しい[`connector.external_health_check`](../../installation/native-node/all-in-one-conf.md#connectorexternal_health_check)設定セクションで制御します。
* リクエスト/レスポンスボディが断続的に破損することがある再発性の間欠的なバグを修正しました
* `tcp-capture`モードで以下の修正と更新を行いました:

    * GoReplayをGo 1.24でビルドするようにしました
    * 修正: `goreplay`プロセスがクラッシュしても`go-node`プロセスがハングしなくなりました
    * 修正: GoReplayのヘッダー解析時のスライス範囲外アクセスによるクラッシュを修正しました
* Wallarm Console → **Nodes**でのNative Nodeバージョン表示の不具合を修正しました

### 0.14.0 (2025-04-16)

* ローカルpostanalytics処理において、Wallarmが開発したサービスである**wstore**を使用するようになり、Tarantoolの使用を廃止しました
* すべてのフィルタリングノードにインストールされていたcollectdサービスと関連プラグインを削除しました
    
    これにより、外部ツールへの依存を減らし、Wallarmの組み込みメカニズムでメトリクスを収集・送信します。

## Helmチャート

Native NodeのHelmチャートは、MuleSoftの[Mule](../../installation/connectors/mulesoft.md)または[Flex](../../installation/connectors/mulesoft-flex.md) Gateway、[Akamai](../../installation/connectors/akamai-edgeworkers.md)、[CloudFront](../../installation/connectors/aws-lambda.md)、[Cloudflare](../../installation/connectors/cloudflare.md)、[Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md)、[Fastly](../../installation/connectors/fastly.md)、[IBM DataPower](../../installation/connectors/ibm-api-connect.md)、[Kong API Gateway](../../installation/connectors/kong-api-gateway.md)、[Istio](../../installation/connectors/istio.md)各コネクタを用いたセルフホスト型ノードのデプロイに使用します。

[アップグレード方法](helm-chart.md)

### 0.17.1 (2025-08-15)

* 信頼済みネットワークの設定および実クライアントIP・Hostヘッダー抽出を行う[`proxy_headers`](../../installation/native-node/helm-chart-conf.md#configconnectorproxy_headers)設定を導入しました
* Cloudへの資格情報エクスポートに関する不具合を修正しました
* GraphQLパーサを改善しました
* スループット向上のため、Nodeとwstore間の内部チャネルを最適化しました
    
    これにより、Nodeがトラフィックを取り込む速度がpostanalyticsへのエクスポート速度を上回る場合の潜在的なデータ損失を防ぎます。
* 送信元IPアドレスがないシリアライズ済みリクエストがpostanalyticsへエクスポートに失敗する問題を修正しました
* バグ修正および内部的な改善を行いました

### 0.16.3 (2025-08-05)

* [Akamaiコネクタ](../../installation/connectors/akamai-edgeworkers.md)をサポートしました
* バグ修正を行いました

### 0.16.1 (2025-08-01)

* どのリクエストをNodeが検査またはバイパスするかを定義できる[`input_filters`](../../installation/native-node/helm-chart-conf.md#configconnectorinput_filters)設定セクションを導入しました
* 高負荷時に過剰な入力をドロップするかを制御する[`drop_on_overload`](../../installation/native-node/helm-chart-conf.md#drop_on_overload)パラメータを導入しました

    デフォルトで有効です（`true`）。
* 新しい[Prometheusメトリクス](../../admin-en/native-node-metrics.md)を追加しました:

    * 一般的なNative Nodeインスタンス情報を提供する`wallarm_gonode_application_info`（例）:
    
        ```bash
        wallarm_gonode_application_info{deployment_type="node-native-aio-installer",mode="connector-server",version="0.16.1"} 1
        ```
    
    * `wallarm_gonode_http_inspector_balancer_workers`
    * `wallarm_gonode_http_inspector_debug_container_len`に`type="channel:in"`の場合の`aggregate="sum"`を追加しました
    * `wallarm_gonode_http_inspector_errors_total`に新しい`type="FlowTimeouts"`を追加しました
* [Luaプラグインに依存するIstio向けのWallarm Connector](/5.x/installation/connectors/istio/)を非推奨化しました

    代わりに[Istio向けgRPCベースの外部処理フィルター](../../installation/connectors/istio.md)の使用を推奨します。
* 非推奨のIstioコネクタについて、既存デプロイの互換性を確保するため以下の改善を行いました:

    * メッセージのメッシュバランシングロジックを修正しました
    * メッシュバランシングなしでNode上で全コネクタトラフィックを処理するための`disable_mesh`パラメータを追加しました（デフォルトは`false`で、メッシュバランシングは有効）
    * `drop_on_overload`パラメータをサポートしました
* 内部`http_inspector`モジュールの安定性を改善しました

### 0.16.0 (2025-07-23)

* [MuleSoft Flex Gatewayコネクタ](../../installation/connectors/mulesoft-flex.md)をサポートしました
* メモリリークを修正しました
* URI・名前空間・タグ名を結合した[**xml_tag**](../../user-guides/rules/request-processing.md#xml)値の区切り文字を`:`から`|`に変更しました
* denylistに登録されたオリジンとWallarm ConsoleのUIで設定したモードの組み合わせで発生するブロック問題を修正しました
* 内部的な改善を行いました

### 0.15.1 (2025-07-08)

* 受信**wstore**接続のアドレスとポートをカスタマイズするための[`config.aggregation.serviceAddress`](../../installation/native-node/helm-chart-conf.md#configaggregationserviceaddress)パラメータをサポートしました
* 些細な内部ファイル構造の変更を行いました
* [CVE-2025-22874](https://nvd.nist.gov/vuln/detail/CVE-2025-22874)の脆弱性を修正しました
* [CVE-2025-47273](https://nvd.nist.gov/vuln/detail/CVE-2025-47273)の脆弱性を修正しました
<!-- * Added [`connector.per_connection_limits`](../../installation/native-node/all-in-one-conf.md#connectorper_connection_limits) to control `keep-alive` connection limits -->

### 0.14.1 (2025-05-07)

* [IBM API Connectコネクタ](../../installation/connectors/ibm-api-connect.md)をサポートしました
* [CVE-2025-22871](https://nvd.nist.gov/vuln/detail/CVE-2025-22871)の脆弱性を修正しました
* HelmチャートのヘッドレスServiceにおける`clusterIP: None`の処理を修正しました
* リクエスト/レスポンスボディが断続的に破損することがある再発性の間欠的なバグを修正しました
* Wallarm Console → **Nodes**でのNative Nodeバージョン表示の不具合を修正しました

### 0.14.0 (2025-04-16)

* ローカルpostanalytics処理において、Wallarmが開発したサービスである**wstore**を使用するようになり、Tarantoolの使用を廃止しました
* `values.yaml`内のすべての`tarantool`参照（コンテナ名・パラメータキーを含む）を`wstore`へリネームしました

    設定でこれらのパラメータを上書きしている場合は、名称を対応して更新してください。
* すべてのフィルタリングノードにインストールされていたcollectdサービスと関連プラグインを削除しました
    
    これにより、外部ツールへの依存を減らし、Wallarmの組み込みメカニズムでメトリクスを収集・送信します。
* Kubernetesのシステムラベルとの競合を避けるため、`*_container_*`に一致するすべてのPrometheusメトリクスでラベル`container`を`type`にリネームしました

## Dockerイメージ

Native NodeのDockerイメージは、MuleSoftの[Mule](../../installation/connectors/mulesoft.md)または[Flex](../../installation/connectors/mulesoft-flex.md) Gateway、[Akamai](../../installation/connectors/akamai-edgeworkers.md)、[CloudFront](../../installation/connectors/aws-lambda.md)、[Cloudflare](../../installation/connectors/cloudflare.md)、[Istio](../../installation/connectors/istio.md)、[Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md)、[Fastly](../../installation/connectors/fastly.md)、[IBM DataPower](../../installation/connectors/ibm-api-connect.md)各コネクタを用いたセルフホスト型ノードのデプロイに使用します。

[アップグレード方法](docker-image.md)

### 0.17.1 (2025-08-15)

* Cloudへの資格情報エクスポートに関する不具合を修正しました
* GraphQLパーサを改善しました
* スループット向上のため、Nodeとwstore間の内部チャネルを最適化しました
    
    これにより、Nodeがトラフィックを取り込む速度がpostanalyticsへのエクスポート速度を上回る場合の潜在的なデータ損失を防ぎます。
* 送信元IPアドレスがないシリアライズ済みリクエストがpostanalyticsへエクスポートに失敗する問題を修正しました
* バグ修正および内部的な改善を行いました

### 0.16.3 (2025-08-05)

* [Akamaiコネクタ](../../installation/connectors/akamai-edgeworkers.md)をサポートしました
* アップグレード時に`--preserve`フラグを`true`に設定すると無言で失敗する問題を修正しました

### 0.16.1 (2025-08-01)

* 高負荷時に過剰な入力をドロップするかを制御する[`drop_on_overload`](../../installation/native-node/all-in-one-conf.md#drop_on_overload)パラメータを導入しました

    デフォルトで有効です（`true`）。
* 新しい[Prometheusメトリクス](../../admin-en/native-node-metrics.md)を追加しました:

    * 一般的なNative Nodeインスタンス情報を提供する`wallarm_gonode_application_info`（例）:
    
        ```bash
        wallarm_gonode_application_info{deployment_type="node-native-aio-installer",mode="connector-server",version="0.16.1"} 1
        ```
    
    * `wallarm_gonode_http_inspector_balancer_workers`
    * `wallarm_gonode_http_inspector_debug_container_len`に`type="channel:in"`の場合の`aggregate="sum"`を追加しました
    * `wallarm_gonode_http_inspector_errors_total`に新しい`type="FlowTimeouts"`を追加しました
* 内部`http_inspector`モジュールの安定性を改善しました

### 0.16.0 (2025-07-23)

* [MuleSoft Flex Gatewayコネクタ](../../installation/connectors/mulesoft-flex.md)をサポートしました
* どのリクエストをNodeが検査またはバイパスするかを定義できる[`input_filters`](../../installation/native-node/all-in-one-conf.md#input_filters)設定セクションを導入しました
* メモリリークを修正しました
* URI・名前空間・タグ名を結合した[**xml_tag**](../../user-guides/rules/request-processing.md#xml)値の区切り文字を`:`から`|`に変更しました
* denylistに登録されたオリジンとWallarm ConsoleのUIで設定したモードの組み合わせで発生するブロック問題を修正しました
* 内部的な改善を行いました

### 0.15.1 (2025-07-08)

* 信頼済みネットワークの設定および実クライアントIP・Hostヘッダー抽出を行う[`proxy_headers`](../../installation/native-node/all-in-one-conf.md#proxy_headers)設定を導入しました

    これは、`tcp-capture`モードの旧バージョンで使用していた`http_inspector.real_ip_header`を置き換えます。
* `go-node`バイナリが公開するPrometheusメトリクスのプレフィックスをカスタマイズできる[`metrics.namespace`](../../installation/native-node/all-in-one-conf.md#metricsnamespace)設定オプションを追加しました
* `keep-alive`接続の上限を制御するため[`connector.per_connection_limits`](../../installation/native-node/all-in-one-conf.md#connectorper_connection_limits)を追加しました
* 些細な内部ファイル構造の変更を行いました
* wstoreのポートバインドを修正しました: `0.0.0.0`ではなく`127.0.0.1`にバインドするようにしました
* [CVE-2025-22874](https://nvd.nist.gov/vuln/detail/CVE-2025-22874)の脆弱性を修正しました
* [CVE-2025-47273](https://nvd.nist.gov/vuln/detail/CVE-2025-47273)の脆弱性を修正しました

### 0.14.1 (2025-05-07)

* [IBM API Connectコネクタ](../../installation/connectors/ibm-api-connect.md)をサポートしました
* [CVE-2025-22871](https://nvd.nist.gov/vuln/detail/CVE-2025-22871)の脆弱性を修正しました
* 外部ヘルスチェックエンドポイントをサポートしました

    これは新しい[`connector.external_health_check`](../../installation/native-node/all-in-one-conf.md#connectorexternal_health_check)設定セクションで制御します。
* リクエスト/レスポンスボディが断続的に破損することがある再発性の間欠的なバグを修正しました
* Wallarm Console → **Nodes**でのNative Nodeバージョン表示の不具合を修正しました

### 0.14.0 (2025-04-16)

* ローカルpostanalytics処理において、Wallarmが開発したサービスである**wstore**を使用するようになり、Tarantoolの使用を廃止しました
* すべてのフィルタリングノードにインストールされていたcollectdサービスと関連プラグインを削除しました
    
    これにより、外部ツールへの依存を減らし、Wallarmの組み込みメカニズムでメトリクスを収集・送信します。

## Amazon Machine Image(AMI)

<!-- How to upgrade -->

### 0.14.0 (2025-05-07)

* 初回リリース