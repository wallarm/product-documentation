# NGINXノードのアーティファクトのバージョンと変更履歴

このドキュメントでは、各種形態で提供される[NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 6.xの[バージョン](versioning-policy.md)を一覧化し、リリースの追跡とアップグレード計画に役立てます。

## all-in-oneインストーラー

バージョン4.10以降、Wallarmノードのインストールとアップグレードは[all-in-oneインストーラー](../installation/nginx/all-in-one.md)のみで実行します。個別のLinuxパッケージによる手動アップグレードはサポートされなくなりました。

all-in-oneインストーラーの更新履歴はx86_64版およびARM64（ベータ）版に同時に適用されます。

[DEB/RPMパッケージからの移行方法](nginx-modules.md)

[以前のall-in-oneインストーラーからの移行方法](all-in-one.md)

<!-- ### 6.5.0
new loggin variable wallarm_block_reason
new attack types in logging variables and search bars?
-->

### 6.4.1 (2025-08-07)

* PrometheusメトリクスによるAPI Specification Enforcementサービスの動作（組み込みのAPI Firewallサービスに基づく）のサポートを追加しました:

    * `/opt/wallarm/env.list`で`APIFW_METRICS_ENABLED=true`を設定して有効化します
    * デフォルトのエンドポイント: `:9010/metrics`
    * 変数`APIFW_METRICS_HOST`と`APIFW_METRICS_ENDPOINT_NAME`でホストとエンドポイント名を設定できます

### 6.4.0 (2025-07-31)

* stuffed credentialsのCloudへのエクスポートを修正しました
* GraphQLパーサーを改善しました
* バグ修正と内部的な改善を行いました

### 6.3.1 (2025-07-23)

* メモリリークを修正しました

### 6.3.0 (2025-07-08)

* [ファイルアップロード制限ポリシー](../api-protection/file-upload-restriction.md)をサポートしました
* [API Abuse Prevention](../api-abuse-prevention/overview.md)による[無制限なリソース消費](../attacks-vulns-list.md#unrestricted-resource-consumption)の緩和をサポートしました
* ルールにおいて、URI・名前空間・タグ名を組み合わせた[**xml_tag**](../user-guides/rules/request-processing.md#xml)値の区切り文字を`:`から`|`に変更しました
* 内部的な改善を行いました
<!-- * [Node part only, no public announcement yet] Added support for SOAP-XML API Discovery
* [Node part only, no public announcement yet] Added support file upload restriction policy -->

### 6.2.1 (2025-06-23)

* 内部のファイル構成を一部変更しました

### 6.2.0 (2025-06-20)

* gRPCトラフィックのストリーム処理を最適化しました
* gRPCおよびWebSocketトラフィックにおける単一メッセージペイロードとストリーム全体のボディサイズの最大値を制御するため、NGINXディレクティブ[`wallarm_max_request_stream_message_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_message_size)と[`wallarm_max_request_stream_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_size)を導入しました
* 処理済みのgRPC/WebSocketストリームとメッセージの数を報告するため、[`/wallarm-status`サービス](../admin-en/configure-statistics-service.md)の出力に`streams`と`messages`パラメータを追加しました
* Nodeが解析するHTTPリクエストボディの最大サイズを制御するため、NGINXディレクティブ[`wallarm_max_request_body_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_body_size)を導入しました
* NGINX-Wallarmモジュールとpostanalyticsモジュールを別々にインストールしている場合の両者間での[SSL/TLSおよびmTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module)をサポートしました
* wstoreのポートバインディングを修正しました: `0.0.0.0`ではなく`127.0.0.1`にバインドされるようにしました
* 軽微なバグを修正しました

### 6.1.0 (2025-05-09)

* バグ修正: 許可リストに登録されたソースからの攻撃は、**Attacks**セクションに表示されなくなりました
* 識別を容易にするため、wstoreのログに`"component": "wstore"`が含まれるようになりました

### 6.0.3 (2025-05-07)

* Amazon Linux 2をサポートしました
* カスタムNGINXでのインストールの問題を修正しました

### 6.0.2 (2025-04-29)

* NGINX stable 1.28.0をサポートしました
* NGINX mainline 1.27.5をサポートしました

### 6.0.1 (2025-04-22)

* [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406)、[CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115)の脆弱性を修正しました

### 6.0.0 (2025-04-03)

* 6.0の初回リリースです。[変更履歴はこちら](what-is-new.md)

## Wallarm NGINX Ingress controller用Helmチャート

[アップグレード方法](ingress-controller.md)

### 6.4.0 (2025-07-31)

* stuffed credentialsのCloudへのエクスポートを修正しました
* GraphQLパーサーを改善しました
* バグ修正と内部的な改善を行いました

### 6.3.1 (2025-07-23)

* メモリリークを修正しました

### 6.3.0 (2025-07-08)

* [ファイルアップロード制限ポリシー](../api-protection/file-upload-restriction.md)をサポートしました
* [API Abuse Prevention](../api-abuse-prevention/overview.md)による[無制限なリソース消費](../attacks-vulns-list.md#unrestricted-resource-consumption)の緩和をサポートしました
* 危険な`server-snippet`および`configuration-snippet`アノテーションをブロックするCELルールを切り替えるための[`validation.forbidDangerousAnnotations`](../admin-en/configure-kubernetes-en.md#validationforbiddangerousannotations)チャート値を追加しました

    デフォルトでは`false`に設定されており、危険なアノテーションはブロックされません。

    Node 6.2.0の挙動は変更ありません（`validation.enableCel`が`true`のときはデフォルトでアノテーションがブロックされます）。
* 受信**wstore**接続のアドレスとポートをカスタマイズできるよう、[`controller.wallarm.postanalytics.serviceAddress`](../admin-en/configure-kubernetes-en.md#controllerwallarmpostanalyticsserviceaddress)パラメータをサポートしました
* ルールにおいて、URI・名前空間・タグ名を組み合わせた[**xml_tag**](../user-guides/rules/request-processing.md#xml)値の区切り文字を`:`から`|`に変更しました
* 内部的な改善を行いました

### 6.2.0 (2025-06-20)

* gRPCトラフィックのストリーム処理を最適化しました
* gRPCおよびWebSocketトラフィックにおける単一メッセージペイロードとストリーム全体のボディサイズの最大値を制御するため、NGINXディレクティブ[`wallarm_max_request_stream_message_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_message_size)と[`wallarm_max_request_stream_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_size)を導入しました
* 処理済みのgRPC/WebSocketストリームとメッセージの数を報告するため、[`/wallarm-status`サービス](../admin-en/configure-statistics-service.md)の出力に`streams`と`messages`パラメータを追加しました
* Nodeが解析するHTTPリクエストボディの最大サイズを制御するため、NGINXディレクティブ[`wallarm_max_request_body_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_body_size)を導入しました
* フィルタリングノードとpostanalyticsモジュール間の[SSL/TLSおよびmTLS](../admin-en/configure-kubernetes-en.md#controllerwallarmpostanalyticstls)をサポートしました
* `values.yaml`内の統合コンポーネント`controller.wallarm.wcli`を、2つの個別に[設定可能なユニット](../admin-en/configure-kubernetes-en.md)である`wcliController`と`wcliPostanalytics`に分割し、コンテナをきめ細かく制御できるようにしました
* 軽微なバグを修正しました

### 6.1.0 (2025-05-09)

* バグ修正: 許可リストに登録されたソースからの攻撃は、**Attacks**セクションに表示されなくなりました
* 識別を容易にするため、wstoreのログに`"component": "wstore"`が含まれるようになりました

### 6.0.2 (2025-04-25)

* Validating Admission Policies経由でIngressリソースの検証を有効化するための[`validation.enableCel`](../admin-en/configure-kubernetes-en.md#validationenablecel)パラメータを追加しました

### 6.0.1 (2025-04-22)

* [CVE-2025-22871](https://nvd.nist.gov/vuln/detail/CVE-2025-22871)の脆弱性を修正しました

### 6.0.0 (2025-04-03)

* 6.0の初回リリースです。[変更履歴はこちら](what-is-new.md)

## Sidecar用Helmチャート

[アップグレード方法](sidecar-proxy.md)

### 6.4.0 (2025-07-31)

* stuffed credentialsのCloudへのエクスポートを修正しました
* GraphQLパーサーを改善しました
* バグ修正と内部的な改善を行いました

### 6.3.1 (2025-07-23)

* メモリリークを修正しました

### 6.3.0 (2025-07-08)

* [ファイルアップロード制限ポリシー](../api-protection/file-upload-restriction.md)をサポートしました
* [API Abuse Prevention](../api-abuse-prevention/overview.md)による[無制限なリソース消費](../attacks-vulns-list.md#unrestricted-resource-consumption)の緩和をサポートしました
* 受信**wstore**接続のアドレスとポートをカスタマイズできるよう、[`postanalytics.wstore.config.serviceAddress`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#postanalyticswstoreconfigserviceaddress)パラメータをサポートしました
* ルールにおいて、URI・名前空間・タグ名を組み合わせた[**xml_tag**](../user-guides/rules/request-processing.md#xml)値の区切り文字を`:`から`|`に変更しました
* 内部的な改善を行いました

### 6.2.0 (2025-06-20)

* gRPCトラフィックのストリーム処理を最適化しました
* フィルタリングノードとpostanalyticsモジュール間の[SSL/TLSおよびmTLS](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#postanalyticswstoretls)をサポートしました
* Alpineのバージョンを3.22に更新しました
* NGINXをバージョン1.28.0にアップグレードしました
* 軽微なバグを修正しました

### 6.1.0 (2025-05-09)

* バグ修正: 許可リストに登録されたソースからの攻撃は、**Attacks**セクションに表示されなくなりました
* 識別を容易にするため、wstoreのログに`"component": "wstore"`が含まれるようになりました

### 6.0.1 (2025-04-22)

* [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406)、[CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115)の脆弱性を修正しました

### 6.0.0 (2025-04-03)

* 6.0の初回リリースです。[変更履歴はこちら](what-is-new.md)

## NGINXベースのDockerイメージ

[アップグレード方法](docker-container.md)

### 6.4.1 (2025-08-07)

* PrometheusメトリクスによるAPI Specification Enforcementサービスの動作（組み込みのAPI Firewallサービスに基づく）のサポートを追加しました:

    * 環境変数`APIFW_METRICS_ENABLED=true`で有効化します
    * デフォルトのエンドポイント: `:9010/metrics`
    * コンテナ内でメトリクスポートを公開してください（例: デフォルト状態では`-p 9010:9010`を使用します）
    * 変数`APIFW_METRICS_HOST`と`APIFW_METRICS_ENDPOINT_NAME`でホストとエンドポイント名を設定できます

### 6.4.0 (2025-07-31)

* stuffed credentialsのCloudへのエクスポートを修正しました
* GraphQLパーサーを改善しました
* バグ修正と内部的な改善を行いました

### 6.3.1 (2025-07-23)

* メモリリークを修正しました

### 6.3.0 (2025-07-08)

* [ファイルアップロード制限ポリシー](../api-protection/file-upload-restriction.md)をサポートしました
* [API Abuse Prevention](../api-abuse-prevention/overview.md)による[無制限なリソース消費](../attacks-vulns-list.md#unrestricted-resource-consumption)の緩和をサポートしました
* ルールにおいて、URI・名前空間・タグ名を組み合わせた[**xml_tag**](../user-guides/rules/request-processing.md#xml)値の区切り文字を`:`から`|`に変更しました
* 内部的な改善を行いました

### 6.2.0 (2025-06-20)

* gRPCトラフィックのストリーム処理を最適化しました
* 処理済みのgRPC/WebSocketストリームとメッセージの数を報告するため、[`/wallarm-status`サービス](../admin-en/configure-statistics-service.md)の出力に`streams`と`messages`パラメータを追加しました
* NGINX-Wallarmモジュールとpostanalyticsモジュールを別々にインストールしている場合の両者間での[SSL/TLSおよびmTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module)をサポートしました
* wstoreのポートバインディングを修正しました: `0.0.0.0`ではなく`127.0.0.1`にバインドされるようにしました
* Alpineのバージョンを3.22に更新しました
* NGINXをバージョン1.28.0にアップグレードしました
* 軽微なバグを修正しました

### 6.1.0 (2025-05-09)

* バグ修正: 許可リストに登録されたソースからの攻撃は、**Attacks**セクションに表示されなくなりました
* 識別を容易にするため、wstoreのログに`"component": "wstore"`が含まれるようになりました

### 6.0.1 (2025-04-22)

* [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406)、[CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115)の脆弱性を修正しました

### 6.0.0 (2025-04-03)

* 6.0の初回リリースです。[変更履歴はこちら](what-is-new.md)

## Amazon Machine Image (AMI)

[アップグレード方法](cloud-image.md)

### 6.4.0 (2025-07-31)

* stuffed credentialsのCloudへのエクスポートを修正しました
* GraphQLパーサーを改善しました
* バグ修正と内部的な改善を行いました

### 6.3.1 (2025-07-23)

* メモリリークを修正しました

### 6.3.0 (2025-07-08)

* [ファイルアップロード制限ポリシー](../api-protection/file-upload-restriction.md)をサポートしました
* [API Abuse Prevention](../api-abuse-prevention/overview.md)による[無制限なリソース消費](../attacks-vulns-list.md#unrestricted-resource-consumption)の緩和をサポートしました
* ルールにおいて、URI・名前空間・タグ名を組み合わせた[**xml_tag**](../user-guides/rules/request-processing.md#xml)値の区切り文字を`:`から`|`に変更しました
* 内部的な改善を行いました

### 6.2.0 (2025-06-20)

* gRPCトラフィックのストリーム処理を最適化しました
* 処理済みのgRPC/WebSocketストリームとメッセージの数を報告するため、[`/wallarm-status`サービス](../admin-en/configure-statistics-service.md)の出力に`streams`と`messages`パラメータを追加しました
* NGINX-Wallarmモジュールとpostanalyticsモジュールを別々にインストールしている場合の両者間での[SSL/TLSおよびmTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module)をサポートしました
* wstoreのポートバインディングを修正しました: `0.0.0.0`ではなく`127.0.0.1`にバインドされるようにしました
* 軽微なバグを修正しました

### 6.1.0 (2025-05-09)

* バグ修正: 許可リストに登録されたソースからの攻撃は、**Attacks**セクションに表示されなくなりました
* 識別を容易にするため、wstoreのログに`"component": "wstore"`が含まれるようになりました

### 6.0.1 (2025-04-22)

* [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406)、[CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115)の脆弱性を修正しました

### 6.0.0 (2025-04-03)

* 6.0の初回リリースです。[変更履歴はこちら](what-is-new.md)

## Google Cloud Platformイメージ

[アップグレード方法](cloud-image.md)

### wallarm-node-6-4-0-20250730-083353 (2025-07-31)

* stuffed credentialsのCloudへのエクスポートを修正しました
* GraphQLパーサーを改善しました
* バグ修正と内部的な改善を行いました

### wallarm-node-6-3-1-20250721-082413 (2025-07-23)

* メモリリークを修正しました

### wallarm-node-6-3-0-20250708-175541 (2025-07-08)

* ルールにおいて、URI・名前空間・タグ名を組み合わせた[**xml_tag**](../user-guides/rules/request-processing.md#xml)値の区切り文字を`:`から`|`に変更しました
* 内部的な改善を行いました

### wallarm-node-6-2-0-20250618-150224 (2025-06-20)

* gRPCトラフィックのストリーム処理を最適化しました
* 処理済みのgRPC/WebSocketストリームとメッセージの数を報告するため、[`/wallarm-status`サービス](../admin-en/configure-statistics-service.md)の出力に`streams`と`messages`パラメータを追加しました
* NGINX-Wallarmモジュールとpostanalyticsモジュールを別々にインストールしている場合の両者間での[SSL/TLSおよびmTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module)をサポートしました
* wstoreのポートバインディングを修正しました: `0.0.0.0`ではなく`127.0.0.1`にバインドされるようにしました
* 軽微なバグを修正しました

### wallarm-node-6-1-0-20250508-144827 (2025-05-09)

* バグ修正: 許可リストに登録されたソースからの攻撃は、**Attacks**セクションに表示されなくなりました
* 識別を容易にするため、wstoreのログに`"component": "wstore"`が含まれるようになりました

### wallarm-node-6-0-1-20250422-104749 (2025-04-22)

* [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406)、[CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115)の脆弱性を修正しました

### wallarm-node-6-0-0-20250403-102125 (2025-04-03)

* 6.0の初回リリースです。[変更履歴はこちら](what-is-new.md)