# ネイティブNodeアーティファクトのバージョンと変更履歴

本書では、さまざまな形態の[Native Wallarm Node](../../installation/nginx-native-node-internals.md#native-node)0.xの[バージョン](../versioning-policy.md)を一覧表示し、リリース状況の追跡およびアップグレードの計画にお役立ていただけます。

## オールインワンインストーラー

Native Node用オールインワンインストーラーは、[TCP traffic mirror analysis](../../installation/oob/tcp-traffic-mirror/deployment.md)および[MuleSoft](../../installation/connectors/mulesoft.md)、[CloudFront](../../installation/connectors/aws-lambda.md)、[Cloudflare](../../installation/connectors/cloudflare.md)、[Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md)、[Fastly](../../installation/connectors/fastly.md)コネクタを用いたセルフホステッドノード展開に使用されます。

オールインワンインストーラーの更新履歴は、x86_64およびARM64 (beta) バージョンの両方に適用されます。

[アップグレード方法](all-in-one.md)

### 0.11.0 (2025-01-31)

* API Discoveryのみモードを有効にする[`WALLARM_APID_ONLY`環境変数](../../installation/native-node/all-in-one.md#installer-launch-options)のサポートを追加しました

    このモードでは、攻撃はローカルで遮断され（[有効](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)の場合）、Wallarm Cloudへは転送されず、[API Discovery](../../api-discovery/overview.md)は完全に機能します。このモードはほとんどの環境では不要です。
* Native NodeのGoReplayとの連携を改善し、以下の構成変更が発生しました:

    ``` diff
    -version: 2
    +version: 3

    -middleware:
    +goreplay:
      parse_responses: true
      response_timeout: 5s
      url_normalize: true
    ```

    アップグレード時には、`version`の値を更新し、初期構成ファイルで明示的に指定されている場合は`middleware`セクションを`goreplay`に置き換えてください。
* tcp-captureモードにおける小規模なHTTP解析バグを修正しました.

### 0.10.1 (2025-01-02)

* [API Discovery](../../api-discovery/sbf.md)および[API Sessions](../../api-sessions/exploring.md#sensitive-business-flows)におけるセンシティブなビジネスフローのサポートを追加しました.
* [Fastly](../../installation/connectors/fastly.md)コネクタのサポートを追加しました.
* メッシュ起動時のリクエスト損失の可能性を修正しました.
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337)および[CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338)の脆弱性を解消しました.
* 一部のリクエストが正常に処理されなかった問題を修正し、これによりAPI Sessions、Credential StuffingおよびAPI Abuse Preventionに影響を及ぼす可能性がありました.

### 0.10.0 (2024-12-19)

* tcp-captureモードにおいて、ルート構成選択およびlibprotonによるデータ解析の前にURL正規化を追加しました

    これは[`middleware.url_normalize`](../../installation/native-node/all-in-one-conf.md#goreplayurl_normalize)パラメータで制御され（デフォルトは`true`です）.
* リクエストのローカル処理時間を制御するために[`http_inspector.wallarm_process_time_limit`](../../installation/native-node/all-in-one-conf.md#http_inspectorwallarm_process_time_limit)パラメータを導入しました

    デフォルトはWallarm Console設定で上書きされない限り`1s`です.
* Prometheusメトリクスの更新（:9000ポートで利用可能）:

    * 静的なゼロ値が設定された廃止済みメトリクスを削除しました.
    * `http_inspector_requests_processed`および`http_inspector_threats_found`メトリクスにおいて、`source`ラベルに`anything`を指定可能にしました.
    * リクエストおよび攻撃数の追跡用に`http_inspector_adjusted_counters`メトリクスを追加しました.

### 0.9.1 (2024-12-10)

* 小規模なバグ修正を行いました.

### 0.9.0 (2024-12-04)

* JSON形式の`/wallarm-status`メトリクスのデフォルトエンドポイントが`metrics.legacy_status.listen_address`パラメータ値である`127.0.0.1:10246`に変更されました.

    このレガシーサービスはNodeの機能にとって重要ですが、直接の操作は必要ありません.
    
### 0.8.3 (2024-11-14)

* Mulesoftコネクタ3.0.xのサポートを追加しました.

### 0.8.2 (2024-11-11)

* wallarm-statusサービスの動作におけるいくつかのバグを修正しました.

### 0.8.1 (2024-11-06)

* 0.8.0で導入された`request_id`形式の回帰問題を修正しました.

### 0.8.0 (2024-11-06)

* [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md)コネクタのサポートを追加しました.
* [API Sessions](../../api-sessions/overview.md)のサポートを追加しました.
* リクエスト処理時間の制限を[改善](../what-is-new.md#new-in-limiting-request-processing-time)しました.
* 以下のパラメータのデフォルト値を変更しました:

    * [`connector.blocking`](../../installation/native-node/all-in-one-conf.md#connectorblocking)パラメータのデフォルトが`true`になり、デプロイ時の手動設定なしでNative Nodeが受信リクエストを遮断する一般機能が有効になりました.
    * トラフィックフィルトレーションモードを設定する[`route_config.wallarm_mode`](../../installation/native-node/all-in-one-conf.md#route_configwallarm_mode)パラメータのデフォルトが`monitoring`に変更され、初期デプロイに最適な設定が提供されます.
* ルート構成選択およびlibprotonによるデータ解析の前にURL正規化を追加しました（デフォルトは`true`に設定されている[`controller.url_normalize`](../../installation/native-node/all-in-one-conf.md#connectorurl_normalize)パラメータで制御）。
* ノード登録時のメモリ使用量を削減しました.
* その他、いくつかのバグを修正しました.

### 0.7.0 (2024-10-16)

* 処理前に一部の内部サービスコネクタヘッダーが除去されない問題を修正しました.
* connector-serverモードにおいて、複数のノードレプリカ間で一貫したリクエスト/レスポンスルーティングを可能にするメッシュ機能のサポートを追加しました

    メッシュ機能の設定には、[`connector.mesh`](../../installation/native-node/all-in-one-conf.md#connectormesh)の下に新たな構成パラメータが導入されました.
    
### 0.6.0 (2024-10-10)

* API Discoveryにおける[センシティブデータ検出のカスタマイズ](../../api-discovery/setup.md#customizing-sensitive-data-detection)のサポートを追加しました.
* [libproton](../../about-wallarm/protecting-against-attacks.md#library-libproton)における重複レスポンスヘッダーのメモリリークを修正しました.
* [IP lists](../../user-guides/ip-lists/overview.md)に登録されていないが[既知のソース](../../user-guides/ip-lists/overview.md#select-object)を持つIPアドレスに関連するメモリリークを修正しました.
* アーティファクトの命名を"next"から"native"に更新しました
    
    `https://meganode.wallarm.com/next/aionext-<VERSION>.<ARCH>.sh` → `https://meganode.wallarm.com/native/aio-native-<VERSION>.<ARCH>.sh`

### 0.5.2 (2024-09-17)

* WAAP+API Securityのサブスクリプションが有効でない場合のインストール失敗問題を修正しました.
* 攻撃のエクスポート遅延を修正しました.
* Cメモリアロケータにおけるパフォーマンス低下を引き起こす問題を修正しました.

### 0.5.1 (2024-09-16)

* [`log.access_log`](../../installation/native-node/all-in-one-conf.md#logaccess_logenabled)パラメータによるアクセスログ出力の構成可能な設定を追加しました.

### 0.5.0 (2024-09-11)

* 小規模な技術改善と最適化を行いました.

### 0.4.3 (2024-09-05)

* タイプミスにより約0.1%のデータソースメッセージが静かに失われる問題を修正しました.

### 0.4.1 (2024-08-27)

* [`route_config.routes.host`](../../installation/native-node/all-in-one-conf.md#host)構成パラメータにおけるワイルドカードマッチングのサポートを追加しました.

### 0.4.0 (2024-08-22)

* [初回リリース](../../installation/oob/tcp-traffic-mirror/deployment.md)

## Helmチャート

Native Node用Helmチャートは、[MuleSoft](../../installation/connectors/mulesoft.md)、[CloudFront](../../installation/connectors/aws-lambda.md)、[Cloudflare](../../installation/connectors/cloudflare.md)、[Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md)、[Fastly](../../installation/connectors/fastly.md)、[Kong API Gateway](../../installation/connectors/kong-api-gateway.md)、[Istio](../../installation/connectors/istio.md)コネクタを用いたセルフホステッドノードの展開に使用されます.

[アップグレード方法](helm-chart.md)

### 0.11.0 (2025-01-31)

* いくつかのバグを修正しました.

### 0.10.1 (2025-01-02)

* [API Discovery](../../api-discovery/sbf.md)及び[API Sessions](../../api-sessions/exploring.md#sensitive-business-flows)におけるセンシティブなビジネスフローのサポートを追加しました.
* [Fastly](../../installation/connectors/fastly.md)コネクタのサポートを追加しました.
* メッシュ起動時のリクエスト損失の可能性を修正しました.
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337)および[CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338)の脆弱性を解消しました.
* 一部のリクエストが正常に処理されなかった問題を修正しました.

### 0.10.0 (2024-12-19)

* 単一の`config.connector.log_level`パラメータに代えて、[`config.connector.log`](../../installation/native-node/helm-chart-conf.md#configconnectorlog)セクションにおいて、より細かなロギング構成オプションを導入しました.
* デフォルトのログレベルは`info`になりました（以前は`debug`でした）.

### 0.9.1 (2024-12-10)

* 小規模なバグ修正を行いました.

### 0.9.0 (2024-12-04)

* すべての集約レプリカ間で一貫したトラフィック分散のための修正を行いました.
* JSON形式の`/wallarm-status`メトリクスのデフォルトエンドポイントが`metrics.legacy_status.listen_address`パラメータ値である`127.0.0.1:10246`に変更されました. このレガシーサービスはNodeの機能にとって重要ですが、直接の操作は必要ありません.
* 多様なデプロイ条件下での信頼性向上のため、いくつかの小規模な修正を行いました.

### 0.8.3 (2024-11-14)

* Mulesoftコネクタv3.0.xのサポートを追加しました.

### 0.8.2 (2024-11-11)

* wallarm-statusサービスの動作におけるいくつかのバグを修正しました.

### 0.8.1 (2024-11-07)

* [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md)コネクタのサポートを追加しました.
* [API Sessions](../../api-sessions/overview.md)のサポートを追加しました.
* リクエスト処理時間の制限を[改善](../what-is-new.md#new-in-limiting-request-processing-time)しました.
* 以下のパラメータのデフォルト値を変更しました:

    * トラフィックフィルトレーションモードを設定する[`config.connector.mode`](../../installation/native-node/helm-chart-conf.md#configconnectormode)パラメータのデフォルトが`monitoring`に変更され、初期デプロイに最適な設定が提供されます.
    * ノード登録時のメモリ使用量を削減しました.
    * その他、いくつかのバグを修正しました.
    
### 0.7.0 (2024-10-17)

* 処理前に一部の内部サービスコネクタヘッダーが除去されない問題を修正しました.
* API Discoveryにおける[センシティブデータ検出のカスタマイズ](../../api-discovery/setup.md#customizing-sensitive-data-detection)のサポートを追加しました.
* [libproton](../../about-wallarm/protecting-against-attacks.md#library-libproton)における重複レスポンスヘッダーのメモリリークを修正しました.
* [IP lists](../../user-guides/ip-lists/overview.md)に登録されていないが[既知のソース](../../user-guides/ip-lists/overview.md#select-object)を持つIPアドレスに関連するメモリリークを修正しました.
* アーティファクトの命名を"next"から"native"に更新しました.
    
    `wallarm/wallarm-node-next` → `wallarm/wallarm-node-native`
* Wallarm Luaプラグインを有効化するために使用されるKongClusterPlugin Kubernetesリソース内の`config.wallarm_node_address`パラメータ値を更新しました:

    `http://next-processing.wallarm-node.svc.cluster.local:5000` → `http://native-processing.wallarm-node.svc.cluster.local:5000`

### 0.5.3 (2024-10-01)

* 初回リリース

## Dockerイメージ

Native Node用Dockerイメージは、[MuleSoft](../../installation/connectors/mulesoft.md)、[CloudFront](../../installation/connectors/aws-lambda.md)、[Cloudflare](../../installation/connectors/cloudflare.md)、[Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md)、[Fastly](../../installation/connectors/fastly.md)コネクタを用いたセルフホステッドノード展開に使用されます.

[アップグレード方法](docker-image.md)

### 0.11.0 (2025-01-31)

* API Discoveryのみモードを有効にする[`WALLARM_APID_ONLY`環境変数](../../installation/native-node/docker-image.md#4-run-the-docker-container)のサポートを追加しました

    このモードでは、攻撃はローカルで遮断され（[有効](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)の場合）、Wallarm Cloudへは転送されず、[API Discovery](../../api-discovery/overview.md)は完全に機能します。このモードはほとんどの環境では不要です.

### 0.10.1 (2025-01-02)

* [API Discovery](../../api-discovery/sbf.md)及び[API Sessions](../../api-sessions/exploring.md#sensitive-business-flows)におけるセンシティブなビジネスフローのサポートを追加しました.
* [Fastly](../../installation/connectors/fastly.md)コネクタのサポートを追加しました.
* メッシュ起動時のリクエスト損失の可能性を修正しました.
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337)および[CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338)の脆弱性を解消しました.
* 一部のリクエストが正常に処理されなかった問題を修正し、これによりAPI Sessions、Credential StuffingおよびAPI Abuse Preventionに影響を及ぼす可能性がありました.

### 0.10.0 (2024-12-19)

* 重大な[CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337)の脆弱性を解消し、その他いくつかの小規模な脆弱性にも対処しました.
* tcp-captureモードにおいて、ルート構成選択およびlibprotonによるデータ解析の前にURL正規化を追加しました

    （デフォルトは[`middleware.url_normalize`](../../installation/native-node/all-in-one-conf.md#goreplayurl_normalize)パラメータで制御されます）.
* リクエスト処理時間をローカルで制御するために[`http_inspector.wallarm_process_time_limit`](../../installation/native-node/all-in-one-conf.md#http_inspectorwallarm_process_time_limit)パラメータを導入しました

    デフォルトはWallarm Console設定で上書きされない限り`1s`です.
* Prometheusメトリクスの更新（:9000ポートで利用可能）:

    * 静的なゼロ値が設定された廃止済みメトリクスを削除しました.
    * `http_inspector_requests_processed`および`http_inspector_threats_found`メトリクスにおいて、`source`ラベルに`anything`を指定可能にしました.
    * リクエストおよび攻撃数の追跡用に`http_inspector_adjusted_counters`メトリクスを追加しました.

### 0.9.1 (2024-12-10)

* 小規模なバグ修正を行いました.

### 0.9.0 (2024-12-04)

* すべての集約レプリカ間で一貫したトラフィック分散のための修正を行いました.
* JSON形式の`/wallarm-status`メトリクスのデフォルトエンドポイントが`metrics.legacy_status.listen_address`パラメータ値である`127.0.0.1:10246`に変更されました. このレガシーサービスはNodeの機能にとって重要ですが、直接操作する必要はありません.
* 多様なデプロイ条件下での信頼性向上のため、いくつかの小規模な修正を行いました.

### 0.8.3 (2024-11-14)

* Mulesoftコネクタv3.0.xのサポートを追加しました.

### 0.8.2 (2024-11-11)

* wallarm-statusサービスの動作におけるいくつかのバグを修正しました.

### 0.8.1 (2024-11-06)

* [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md)コネクタのサポートを追加しました.
* [API Sessions](../../api-sessions/overview.md)のサポートを追加しました.
* リクエスト処理時間の制限を[改善](../what-is-new.md#new-in-limiting-request-processing-time)しました.
* 以下のパラメータのデフォルト値を変更しました:

    * [`connector.blocking`](../../installation/native-node/all-in-one-conf.md#connectorblocking)パラメータのデフォルトが`true`になり、デプロイ時の手動設定なしでNative Nodeが受信リクエストを遮断する一般機能が有効になります.
    * トラフィックフィルトレーションモードを設定する[`route_config.wallarm_mode`](../../installation/native-node/all-in-one-conf.md#route_configwallarm_mode)パラメータのデフォルトが`monitoring`に変更され、初期デプロイに最適な設定が提供されます.
* ルート構成選択およびlibprotonによるデータ解析の前にURL正規化を追加しました（デフォルトは`true`に設定されている[`controller.url_normalize`](../../installation/native-node/all-in-one-conf.md#connectorurl_normalize)パラメータで制御されます）.
* ノード登録時のメモリ使用量を削減しました.
* その他、いくつかのバグを修正しました.

### 0.7.0 (2024-10-16)

* 処理前に一部の内部サービスコネクタヘッダーが除去されない問題を修正しました.
* connector-serverモードにおいて、複数のノードレプリカ間で一貫したリクエスト/レスポンスルーティングを可能にするメッシュ機能のサポートを追加しました

    メッシュ機能の構成には、[`connector.mesh`](../../installation/native-node/all-in-one-conf.md#connectormesh)の下に新たな構成パラメータが導入されました.
    
### 0.6.0 (2024-10-10)

* 初回リリース