```markdown
# NGINX Nodeアーティファクトのバージョンと変更履歴

本ドキュメントでは、さまざまな形態における[NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 5.xの利用可能な[バージョン](versioning-policy.md)を一覧し、リリースの追跡およびアップグレードの計画に役立つ情報を提供します。

## オールインワンインストーラー

バージョン4.10以降、Wallarm Nodeのインストールおよびアップグレードは**常に**[オールインワンインストーラー](../installation/nginx/all-in-one.md)を用いて実施されます。個別のLinuxパッケージによる手動アップグレードはもうサポートされません。

オールインワンインストーラーの更新履歴は、x86_64版およびARM64(beta)版の両方に同時に適用されます。

[DEB/RPMパッケージからの移行方法](nginx-modules.md)

[前のオールインワンインストーラー版からの移行方法](all-in-one.md)

### 5.3.0 (2024-01-29)

* API Sessionsにおけるレスポンスパラメータのサポートを追加し、ユーザー活動の完全なコンテキストおよびより正確な[セッショングルーピング](../api-sessions/setup.md#session-grouping)を提供します（詳細な[変更内容](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions)を参照）。
* 完全な[GraphQLパーサー](../user-guides/rules/request-processing.md#gql)を追加し、以下の機能を実現します（詳細な[変更内容](../updating-migrating/what-is-new.md#full-fledged-graphql-parser)を参照）:

    * GraphQL特有のリクエストポイントにおける入力検証攻撃の検出精度の向上
    * 特定のGraphQLポイントに対する攻撃検出の微調整（例：特定のポイントで特定の攻撃タイプの検出を無効化）
    * API SessionsにおいてGraphQLリクエストの特定部分の解析
* シリアライズされたリクエスト内の無効な時刻値を修正し、[リソースオーバーリミット](../user-guides/rules/configure-overlimit-res-detection.md)攻撃を正しく表示します。

### 5.2.11 (2024-12-25)

* NGINX Mainline v1.27.2および1.27.3のサポートを追加します。
* NGINX Plus R33のサポートを追加します。
* [API Discovery](../api-discovery/sbf.md)および[API Sessions](../api-sessions/exploring.md#sensitive-business-flows)において、機微なビジネスフローのサポートを追加します。
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337)および[CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338)の脆弱性を解決しました。
* 一部のリクエストが正常に処理されず、API Sessions、Credential Stuffing、およびAPI Abuse Preventionに影響を及ぼす可能性がある問題を修正しました。

### 5.2.1 (2024-12-07)

* 拡張ロギングのために、新たに`$wallarm_attack_point_list`および`$wallarm_attack_stamp_list`変数を導入しました（[NGINXベースフィルターノードの拡張ロギング設定](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)を参照）。

    これらの変数は、悪意のあるペイロードと攻撃サインIDを含むリクエストポイントを記録し、Nodeの動作の高度なデバッグを可能にします。
* 軽微なバグ修正を行いました。

### 5.1.1 (2024-11-08)

* `wallarm-status`サービスの動作におけるいくつかのバグを修正しました。

### 5.1.0 (2024-11-06)

* [API Sessions](../api-sessions/overview.md)のサポートを追加しました。
* リクエスト処理時間の制限を[改善](what-is-new.md#new-in-limiting-request-processing-time)しました。
* Node登録時のメモリ使用量を削減しました。

### 5.0.3 (2024-10-10)

* API Discoveryにおいて[機微なデータ検出のカスタマイズ](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection)のサポートを追加しました。
* [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)における重複レスポンスヘッダーでのメモリリークを修正しました。
* [IPリスト](../user-guides/ip-lists/overview.md)に存在しないが既知のソースを持つIPアドレスに関連するメモリリークを修正しました（[選択オブジェクト](../user-guides/ip-lists/overview.md#select-object)を参照）。

### 5.0.2 (2024-09-18)

* WAAP+API Securityのサブスクリプションが有効化されていない場合に発生するインストール失敗の問題を修正しました。
* 攻撃エクスポートの遅延を解消しました。

### 5.0.1 (2024-08-21)

* 初回リリース5.0です（[変更履歴](what-is-new.md)を参照）。
* NGINX v1.26.2stableのサポートを追加しました。

## Wallarm NGINX Ingress Controller用Helmチャート

[アップグレード方法](ingress-controller.md)

### 5.3.0 (2024-01-29)

* API Sessionsにおけるレスポンスパラメータのサポートを追加し、ユーザー活動の完全なコンテキストおよびより正確な[セッショングルーピング](../api-sessions/setup.md#session-grouping)を提供します（詳細な[変更内容](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions)を参照）。
* 完全な[GraphQLパーサー](../user-guides/rules/request-processing.md#gql)を追加し、以下の機能を実現します（詳細な[変更内容](../updating-migrating/what-is-new.md#full-fledged-graphql-parser)を参照）:

    * GraphQL特有のリクエストポイントにおける入力検証攻撃の検出精度の向上
    * 特定のGraphQLポイントに対する攻撃検出の微調整（例：特定のポイントで特定の攻撃タイプの検出を無効化）
    * API SessionsにおいてGraphQLリクエストの特定部分の解析
* シリアライズされたリクエスト内の無効な時刻値を修正し、[リソースオーバーリミット](../user-guides/rules/configure-overlimit-res-detection.md)攻撃を正しく表示します。

### 5.2.12 (2025-01-08)

* コントローラーにおける[CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338)の脆弱性を解決しました。

### 5.2.11 (2024-12-27)

* [API Discovery](../api-discovery/sbf.md)および[API Sessions](../api-sessions/exploring.md#sensitive-business-flows)において、機微なビジネスフローのサポートを追加しました。
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337)および[CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338)の脆弱性を解決しました。
* 一部のリクエストが正常に処理されず、API Sessions、Credential Stuffing、およびAPI Abuse Preventionに影響を及ぼす可能性がある問題を修正しました。

### 5.2.2 (2024-12-11)

* [GHSA-c5pj-mqfh-rvc3](https://scout.docker.com/vulnerabilities/id/GHSA-c5pj-mqfh-rvc3)の脆弱性に対する修正を再適用しました。

### 5.2.1 (2024-12-07)

* Community Ingress NGINX Controllerバージョン1.11.3にアップグレードし、上流のHelmチャートバージョン4.11.3と整合させました。
* Community Ingress NGINX Controllerのアップグレードにより、以下の破壊的変更が導入されました:

    * OpentracingおよびZipkinモジュールのサポートを廃止し、Opentelemetryのみをサポート
    * `PodSecurityPolicy`のサポートを廃止
* Kubernetesバージョン1.30までの互換性が拡張されました。
* NGINX 1.25.5に更新されました。
* 軽微なバグ修正を行いました。

### 5.1.1 (2024-11-14)

* [GHSA-c5pj-mqfh-rvc3](https://scout.docker.com/vulnerabilities/id/GHSA-c5pj-mqfh-rvc3)の脆弱性を修正しました。
* `wallarm-status`サービスの動作におけるいくつかのバグを修正しました。

### 5.1.0 (2024-11-06)

* [API Sessions](../api-sessions/overview.md)のサポートを追加しました。
* リクエスト処理時間の制限を[改善](what-is-new.md#new-in-limiting-request-processing-time)しました。
* Node登録時のメモリ使用量を削減しました。
* API Specification Enforcement用の新しい設定を追加しました:

    * `readBufferSize`
    * `writeBufferSize`
    * `maxRequestBodySize`
    * `disableKeepalive`
    * `maxConnectionsPerIp`
    * `maxRequestsPerConnection`

    設定の説明およびデフォルト値は[こちら](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall)を参照してください。

### 5.0.3 (2024-10-10)

* API Discoveryにおいて[機微なデータ検出のカスタマイズ](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection)のサポートを追加しました。
* [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)における重複レスポンスヘッダーでのメモリリークを修正しました。
* [IPリスト](../user-guides/ip-lists/overview.md)に含まれるべきではないが[既知のソース](../user-guides/ip-lists/overview.md#select-object)を持つIPアドレスに関連するメモリリークを修正しました。

### 5.0.2 (2024-09-18)

* WAAP+API Securityのサブスクリプションが有効化されていない場合に発生するインストール失敗の問題を修正しました。
* 攻撃エクスポートの遅延を解消しました。

### 5.0.1 (2024-08-21)

* 初回リリース5.0です（[変更履歴](what-is-new.md)を参照）。

## Sidecar用Helmチャート

[アップグレード方法](sidecar-proxy.md)

### 5.3.0 (2024-01-29)

* API Sessionsにおけるレスポンスパラメータのサポートを追加し、ユーザー活動の完全なコンテキストおよびより正確な[セッショングルーピング](../api-sessions/setup.md#session-grouping)を提供します（詳細な[変更内容](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions)を参照）。
* 完全な[GraphQLパーサー](../user-guides/rules/request-processing.md#gql)を追加し、以下の機能を実現します（詳細な[変更内容](../updating-migrating/what-is-new.md#full-fledged-graphql-parser)を参照）:

    * GraphQL特有のリクエストポイントにおける入力検証攻撃の検出精度の向上
    * 特定のGraphQLポイントに対する攻撃検出の微調整（例：特定のポイントで特定の攻撃タイプの検出を無効化）
    * API SessionsにおいてGraphQLリクエストの特定部分の解析
* シリアライズされたリクエスト内の無効な時刻値を修正し、[リソースオーバーリミット](../user-guides/rules/configure-overlimit-res-detection.md)攻撃を正しく表示します。
* API Specification Enforcement用の新しい設定を追加しました:

    * `readBufferSize`
    * `writeBufferSize`
    * `maxRequestBodySize`
    * `disableKeepalive`
    * `maxConnectionsPerIp`
    * `maxRequestsPerConnection`

    設定の説明およびデフォルト値は[こちら](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmapifirewall)を参照してください。
* NGINXにおける拡張ロギングのため、Helmチャート値[`config.nginx.logs.extended`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#confignginxlogsextended)および[`config.nginx.logs.format`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#confignginxlogsformat)を追加しました。

### 5.2.11 (2024-12-27)

* [API Discovery](../api-discovery/sbf.md)および[API Sessions](../api-sessions/exploring.md#sensitive-business-flows)において、機微なビジネスフローのサポートを追加しました。
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337)および[CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338)の脆弱性を解決しました。
* 一部のリクエストが正常に処理されず、API Sessions、Credential Stuffing、およびAPI Abuse Preventionに影響を及ぼす可能性がある問題を修正しました。

### 5.2.1 (2024-12-09)

* 拡張ロギングのために、新たに`$wallarm_attack_point_list`および`$wallarm_attack_stamp_list`変数を導入しました（[NGINXベースフィルターノードの拡張ロギング設定](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)を参照）。

    これらの変数は、悪意のあるペイロードと攻撃サインIDを含むパラメータを記録し、Nodeの動作の高度なデバッグを可能にします。
* 軽微なバグ修正を行いました。

### 5.1.0 (2024-11-06)

* [API Sessions](../api-sessions/overview.md)のサポートを追加しました。
* リクエスト処理時間の制限を[改善](what-is-new.md#new-in-limiting-request-processing-time)しました。
* Node登録時のメモリ使用量を削減しました。

### 5.0.3 (2024-10-10)

* API Discoveryにおいて[機微なデータ検出のカスタマイズ](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection)のサポートを追加しました。
* [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)における重複レスポンスヘッダーでのメモリリークを修正しました。
* [IPリスト](../user-guides/ip-lists/overview.md)に含まれないが[既知のソース](../user-guides/ip-lists/overview.md#select-object)を持つIPアドレスに関連するメモリリークを修正しました。

### 5.0.2 (2024-09-19)

* WAAP+API Securityのサブスクリプションが有効化されていない場合に発生するインストール失敗の問題を修正しました。
* 攻撃エクスポートの遅延を解消しました。

### 5.0.1 (2024-08-21)

* 初回リリース5.0です（[変更履歴](what-is-new.md)を参照）。

<!-- ## Helm chart for Wallarm eBPF‑based solution

### 0.10.22 (2024-03-01)

* [初回リリース](../installation/oob/ebpf/deployment.md) -->

## NGINXベースDockerイメージ

[アップグレード方法](docker-container.md)

### 5.3.0 (2024-01-29)

* API Sessionsにおけるレスポンスパラメータのサポートを追加し、ユーザー活動の完全なコンテキストおよびより正確な[セッショングルーピング](../api-sessions/setup.md#session-grouping)を提供します（詳細な[変更内容](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions)を参照）。
* 完全な[GraphQLパーサー](../user-guides/rules/request-processing.md#gql)を追加し、以下の機能を実現します（詳細な[変更内容](../updating-migrating/what-is-new.md#full-fledged-graphql-parser)を参照）:

    * GraphQL特有のリクエストポイントにおける入力検証攻撃の検出精度の向上
    * 特定のGraphQLポイントに対する攻撃検出の微調整（例：特定のポイントで特定の攻撃タイプの検出を無効化）
    * API SessionsにおいてGraphQLリクエストの特定部分の解析
* シリアライズされたリクエスト内の無効な時刻値を修正し、[リソースオーバーリミット](../user-guides/rules/configure-overlimit-res-detection.md)攻撃を正しく表示します。

### 5.2.11 (2024-12-25)

* [API Discovery](../api-discovery/sbf.md)および[API Sessions](../api-sessions/exploring.md#sensitive-business-flows)において、機微なビジネスフローのサポートを追加しました。
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337)および[CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338)の脆弱性を解決しました。
* 一部のリクエストが正常に処理されず、API Sessions、Credential Stuffing、およびAPI Abuse Preventionに影響を及ぼす可能性がある問題を修正しました。

### 5.2.1 (2024-12-07)

* 拡張ロギングのために、新たに`$wallarm_attack_point_list`および`$wallarm_attack_stamp_list`変数を導入しました（[NGINXベースフィルターノードの拡張ロギング設定](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)を参照）。

    これらの変数は、悪意のあるペイロードと攻撃サインIDを含むパラメータを記録し、Nodeの動作の高度なデバッグを可能にします。
* イメージのソースおよびDockerfileを[GitHub](https://github.com/wallarm/docker-wallarm-node)から内部のGitLabリポジトリへ移動しました。

### 5.1.0-1 (2024-11-06)

* [API Sessions](../api-sessions/overview.md)のサポートを追加しました。
* リクエスト処理時間の制限を[改善](what-is-new.md#new-in-limiting-request-processing-time)しました。
* Node登録時のメモリ使用量を削減しました。

### 5.0.3-1 (2024-10-10)

* API Discoveryにおいて[機微なデータ検出のカスタマイズ](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection)のサポートを追加しました。
* [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)における重複レスポンスヘッダーでのメモリリークを修正しました。
* [IPリスト](../user-guides/ip-lists/overview.md)に含まれないが[既知のソース](../user-guides/ip-lists/overview.md#select-object)を持つIPアドレスに関連するメモリリークを修正しました。

### 5.0.2-1 (2024-09-18)

* WAAP+API Securityのサブスクリプションが有効化されていない場合に発生するインストール失敗の問題を修正しました。
* 攻撃エクスポートの遅延を解消しました。

### 5.0.1-1 (2024-08-21)

* 初回リリース5.0です（[変更履歴](what-is-new.md)を参照）。
* NGINX v1.26.2stableのサポートを追加しました。

<!-- ## Envoy-based Docker image

!!! info "Pending upgrade to 4.10"
    This artifact has not been updated to Wallarm node 4.10 yet; an upgrade is pending. The 4.10 features are not supported on nodes deployed with this artifact.

[アップグレード方法](docker-container.md)

### 4.8.0-1 (2023-10-19)

* 初回リリース4.8です（[変更履歴](what-is-new.md)を参照）。 -->

## Amazon Machine Image (AMI)

[アップグレード方法](cloud-image.md)

### 5.3.0 (2024-01-30)

* API Sessionsにおけるレスポンスパラメータのサポートを追加し、ユーザー活動の完全なコンテキストおよびより正確な[セッショングルーピング](../api-sessions/setup.md#session-grouping)を提供します（詳細な[変更内容](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions)を参照）。
* 完全な[GraphQLパーサー](../user-guides/rules/request-processing.md#gql)を追加し、以下の機能を実現します（詳細な[変更内容](../updating-migrating/what-is-new.md#full-fledged-graphql-parser)を参照）:

    * GraphQL特有のリクエストポイントにおける入力検証攻撃の検出精度の向上
    * 特定のGraphQLポイントに対する攻撃検出の微調整（例：特定のポイントで特定の攻撃タイプの検出を無効化）
    * API SessionsにおいてGraphQLリクエストの特定部分の解析
* シリアライズされたリクエスト内の無効な時刻値を修正し、[リソースオーバーリミット](../user-guides/rules/configure-overlimit-res-detection.md)攻撃を正しく表示します。

### 5.2.11 (2024-12-28)

* [API Discovery](../api-discovery/sbf.md)および[API Sessions](../api-sessions/exploring.md#sensitive-business-flows)において、機微なビジネスフローのサポートを追加しました。
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337)および[CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338)の脆弱性を解決しました。
* 一部のリクエストが正常に処理されず、API Sessions、Credential Stuffing、およびAPI Abuse Preventionに影響を及ぼす可能性がある問題を修正しました。

### 5.2.1 (2024-12-07)

* 拡張ロギングのために、新たに`$wallarm_attack_point_list`および`$wallarm_attack_stamp_list`変数を導入しました（[NGINXベースフィルターノードの拡張ロギング設定](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)を参照）。

    これらの変数は、悪意のあるペイロードと攻撃サインIDを含むパラメータを記録し、Nodeの動作の高度なデバッグを可能にします。
* 軽微なバグ修正を行いました。

### 5.1.0-1 (2024-11-06)

* [API Sessions](../api-sessions/overview.md)のサポートを追加しました。
* リクエスト処理時間の制限を[改善](what-is-new.md#new-in-limiting-request-processing-time)しました。
* Node登録時のメモリ使用量を削減しました。

### 5.0.3-1 (2024-10-10)

* API Discoveryにおいて[機微なデータ検出のカスタマイズ](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection)のサポートを追加しました。
* [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)における重複レスポンスヘッダーでのメモリリークを修正しました。
* [IPリスト](../user-guides/ip-lists/overview.md)に含まれないが[既知のソース](../user-guides/ip-lists/overview.md#select-object)を持つIPアドレスに関連するメモリリークを修正しました。

### 5.0.2-1 (2024-09-19)

* WAAP+API Securityのサブスクリプションが有効化されていない場合に発生するインストール失敗の問題を修正しました。
* 攻撃エクスポートの遅延を解消しました。

### 5.0.1-1 (2024-08-21)

* 初回リリース5.0です（[変更履歴](what-is-new.md)を参照）。

## Google Cloud Platformイメージ

[アップグレード方法](cloud-image.md)

### wallarm-node-5-3-20250129-150255 (2025-01-30)

* API Sessionsにおけるレスポンスパラメータのサポートを追加し、ユーザー活動の完全なコンテキストおよびより正確な[セッショングルーピング](../api-sessions/setup.md#session-grouping)を提供します（詳細な[変更内容](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions)を参照）。
* 完全な[GraphQLパーサー](../user-guides/rules/request-processing.md#gql)を追加し、以下の機能を実現します（詳細な[変更内容](../updating-migrating/what-is-new.md#full-fledged-graphql-parser)を参照）:

    * GraphQL特有のリクエストポイントにおける入力検証攻撃の検出精度の向上
    * 特定のGraphQLポイントに対する攻撃検出の微調整（例：特定のポイントで特定の攻撃タイプの検出を無効化）
    * API SessionsにおいてGraphQLリクエストの特定部分の解析
* シリアライズされたリクエスト内の無効な時刻値を修正し、[リソースオーバーリミット](../user-guides/rules/configure-overlimit-res-detection.md)攻撃を正しく表示します.

### wallarm-node-5-2-20241227-095327 (2024-12-27)

* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337)および[CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338)の脆弱性を解決しました。
* 一部のリクエストが正常に処理されず、API Sessions、Credential Stuffing、およびAPI Abuse Preventionに影響を及ぼす可能性がある問題を修正しました。

### wallarm-node-5-2-20241209-114655 (2024-12-07)

* 拡張ロギングのために、新たに`$wallarm_attack_point_list`および`$wallarm_attack_stamp_list`変数を導入しました（[NGINXベースフィルターノードの拡張ロギング設定](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)を参照）。

    これらの変数は、悪意のあるペイロードと攻撃サインIDを含むパラメータを記録し、Nodeの動作の高度なデバッグを可能にします。
* 軽微なバグ修正を行いました。

### wallarm-node-5-1-20241108-120238 (2024-11-08)

* 初回リリース5.xです（[変更履歴](what-is-new.md)を参照）。
```