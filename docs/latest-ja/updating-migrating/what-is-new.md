# Wallarm Node 6.xおよび0.14.xの新機能

この変更履歴ではNGINX Node 6.xとNative Node 0.14.x+の更新を扱います。より古いバージョンからアップグレードする場合は[こちら](../updating-migrating/older-versions/what-is-new.md)のドキュメントをご参照ください。

Wallarm Nodeのマイナーバージョンごとの詳細な変更履歴は、[NGINX Nodeのアーティファクト一覧](node-artifact-versions.md)または[Native Nodeのアーティファクト一覧](native-node/node-artifact-versions.md)をご参照ください。

本リリースでは、Wallarm Nodeの性能と保守性を高めることを目的とした重要なアーキテクチャ改善を導入します。これらの更新は、今後の機能の基盤にもなります。

## postanalyticsにおけるTarantoolのwstoreへの置き換え

Wallarm Nodeは、ローカルpostanalytics処理にTarantoolの代わりにWallarmが開発したサービスであるwstoreを使用するようになりました。

その結果、NGINX Nodeには次の変更が導入されました。

* [All-in-oneインストーラー](../installation/nginx/all-in-one.md)、[AWS](../installation/cloud-platforms/aws/ami.md)/[GCP](../installation/cloud-platforms/gcp/machine-image.md)イメージ:

    * 他のNGINXサービスとは別にデプロイしたpostanalyticsモジュールのサーバーアドレスを定義するNGINXディレクティブ`wallarm_tarantool_upstream`は、[`wallarm_wstore_upstream`](../admin-en/configure-parameters-en.md#wallarm_wstore_upstream)に名称変更されました。

        後方互換性は非推奨警告とともに維持されます:

        ```
        2025/03/04 20:43:04 [warn] 3719#3719: "wallarm_tarantool_upstream" directive is deprecated, use "wallarm_wstore_upstream" instead in /etc/nginx/nginx.conf:19
        ```
    
    * [ログファイル](../admin-en/configure-logging.md)の名称を変更しました: `/opt/wallarm/var/log/wallarm/tarantool-out.log` → `/opt/wallarm/var/log/wallarm/wstore-out.log`。
    * 新しいwstore設定ファイル`/opt/wallarm/wstore/wstore.yaml`が、`/etc/default/wallarm-tarantool`や`/etc/sysconfig/wallarm-tarantool`などの廃止されたTarantool設定ファイルに置き換わります。
    * `/opt/wallarm/etc/wallarm/node.yaml`内の`tarantool`セクションは`wstore`になりました。後方互換性は非推奨警告とともに維持されます。
* [Dockerイメージ](../admin-en/installation-docker-en.md):

    * 上記の変更はすべてコンテナ内に適用されています。
    * 以前はTarantoolのメモリを環境変数`TARANTOOL_MEMORY_GB`で割り当てていました。現在は同じ考え方ですが新しい変数を使用します：`TARANTOOL_MEMORY_GB` → `SLAB_ALLOC_ARENA`。
    * コンテナのディレクトリ構成をAlpine Linuxの慣例に合わせて調整しました。具体的には:
        * `/etc/nginx/modules-available`と`/etc/nginx/modules-enabled`の内容を`/etc/nginx/modules`に移動しました。
        * `/etc/nginx/sites-available`と`/etc/nginx/sites-enabled`の内容を`/etc/nginx/http.d`に移動しました。
    * `/wallarm-status`サービスに許可されるIPアドレスを指定するデフォルトの`allow`値は、127.0.0.8/8ではなく127.0.0.0/8になりました。
* [Kubernetes Ingress Controller](../admin-en/installation-kubernetes-en.md):
    
    * Tarantoolは別Podではなくなり、wstoreはメインの`<CHART_NAME>-wallarm-ingress-controller-xxx` Pod内で動作します。
    * Helmの値名を変更しました：`controller.wallarm.tarantool` → `controller.wallarm.postanalytics`。
* [Kubernetes Sidecar Controller](../installation/kubernetes/sidecar-proxy/deployment.md):

    * Helmの値名を変更しました：`postanalytics.tarantool.*` → [`postanalytics.wstore.*`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L625)。
    * Sidecarデプロイ用Helmチャートから次のDockerイメージを削除しました:
        * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
        * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
        * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
        * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
        
        これらのイメージは[wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)イメージに置き換えられ、該当するサービスはこのイメージで実行されます。

上述の変更は、後述のNodeアップグレード手順に反映されています。

## collectdの削除

従来すべてのフィルタリングノードにインストールされていたcollectdサービスとその関連プラグインを削除しました。メトリクスはWallarmの組み込みメカニズムで収集・送信されるようになり、外部ツールへの依存が減ります。

PrometheusおよびJSON形式で同等のメトリクスを提供するcollectdの代替として、[`/wallarm-status`エンドポイント](../admin-en/configure-statistics-service.md)をご使用ください。

この変更に伴い、設定まわりでも以下の点が変更されています。

* `\opt\wallarm\etc\collectd\wallarm-collectd.conf.d\wallarm-tarantool.conf`のcollectd設定ファイルは使用しません。
* 以前、次のようにnetworkプラグインを使ってcollectdでメトリクスを転送していた場合は:
    ```
    LoadPlugin network

    <Plugin "network">
        Server "<Server IPv4/v6 address or FQDN>" "<Server port>"
    </Plugin>
    ```
    現在はPrometheusで`/wallarm-status`をスクレイプする方式に切り替えてください。

## Mitigation Controls

Wallarmの攻撃緩和設定を一元管理するセンターである[**Mitigation Controls**](../about-wallarm/mitigation-controls-overview.md)を導入します。Mitigation Controlsを使用すると、次のことが可能です。

* すべてのWallarmの緩和設定を1か所で表示・管理できます。
* 統一的に管理できます（すべてのコントロールは同様の設定UIとオプションを持ちます）。
* 各コントロールの現在のモードを容易に俯瞰できます。有効か、監視のみか、ブロックも行うかを確認できます。
* 各コントロールで捕捉された攻撃の概要を迅速に把握できます。

![UIのMitigation Controlsページ](../images/user-guides/mitigation-controls/mc-main-page.png)

### 列挙攻撃保護

!!! tip ""
    [NGINX Node 6.1.0以降](node-artifact-versions.md)および[Native Node 0.14.1以降](native-node/node-artifact-versions.md)

新たな[列挙攻撃](../attacks-vulns-list.md#enumeration-attacks)対策がEnumeration系Mitigation Controlsとして追加されました。

* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md)
* [BOLA enumeration protection](../api-protection/enumeration-attack-protection.md)
* [Forced browsing protection](../api-protection/enumeration-attack-protection.md)
* [Brute force protection](../api-protection/enumeration-attack-protection.md)

従来この対策に用いていたtriggersと比較して、Mitigation Controlsは次の点が向上しています。

* 列挙試行の監視対象とするパラメータを選択できます。
* どのリクエストをカウント対象とするかを高度に絞り込めます。
* [API Sessions](../api-sessions/overview.md)と深く連携します。検出された攻撃は対応するセッション内に表示され、何が起きていたのか、なぜそのセッションのアクティビティが攻撃としてマークされブロックされたのかという完全なコンテキストを提供します。

![BOLA protectionのMitigation Control - 例](../images/user-guides/mitigation-controls/mc-bola-example-01.png)

### DoS protection

!!! tip ""
    [NGINX Node 6.1.0以降](node-artifact-versions.md)および[Native Node 0.14.1以降](native-node/node-artifact-versions.md)

[unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md)は、最も深刻なAPIセキュリティリスクの一覧である[OWASP API Top 10 2023](../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023)に含まれています。これはそれ自体が脅威（過負荷によるサービスの低速化や停止）であるだけでなく、列挙攻撃などさまざまな攻撃タイプの土台にもなります。一定時間あたりのリクエストを許容しすぎることが、これらのリスクの主因の1つです。

Wallarmは新しい[**DoS protection**](../api-protection/dos-protection.md)のMitigation Controlを提供し、APIへの過剰なトラフィックを防ぐのに役立ちます。

![DoS protection - JWTの例](../images/api-protection/mitigation-controls-dos-protection-jwt.png)

### デフォルトのコントロール

Wallarmは[デフォルトのMitigation Controls](../about-wallarm/mitigation-controls-overview.md#default-controls)を提供しており、有効化するとWallarmプラットフォームの検知能力が大幅に向上します。これらのコントロールは一般的な攻撃パターンに対して堅牢な保護を提供するよう事前設定されています。現在のデフォルトのMitigation Controlsには次が含まれます。

* [GraphQL protection](../api-protection/graphql-rule.md)
* ユーザーID、オブジェクトID、ファイル名向けの[BOLA (Broken Object Level Authorization) enumeration protection](../api-protection/enumeration-attack-protection.md#bola)
* パスワード、OTP、認証コード向けの[Brute force protection](../api-protection/enumeration-attack-protection.md#brute-force)
* [Forced browsing protection](../api-protection/enumeration-attack-protection.md#forced-browsing)（404のプロービング）
* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md#generic-enumeration)（以下を含む）:
    
    * ユーザー/メールアドレスの列挙
    * SSRF（Server-Side Request Forgery）の列挙
    * User-Agentのローテーション

## ファイルアップロード制限ポリシー

Wallarmはアップロードされるファイルサイズを直接制限するためのツールを提供します。これは、最も深刻なAPIセキュリティリスクの一覧である[OWASP API Top 10 2023](../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023)に含まれる[unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md)を防止するための一連の対策の一部です。

ご契約プランに応じて、アップロード制限はMitigation ControlまたはRuleで適用されます。リクエスト全体、または指定したポイントに対してファイルサイズの制限を設定できます。

![ファイルアップロード制限MC - 例](../images/api-protection/mitigation-controls-file-upload-1.png)

## Protection from unrestricted resource consumption

!!! tip ""
    [NGINX Node 6.3.0以降](node-artifact-versions.md)。現時点では[Native Node](../installation/nginx-native-node-internals.md#native-node)は未対応です。

Wallarmの[API Abuse Prevention](../api-abuse-prevention/overview.md)は、[unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption)（適切な制限なく自動化クライアントがAPIやアプリケーションのリソースを過剰に消費する不正行為）を防止する機能を提供します。これには、大量の非悪意のリクエスト送信、コンピュート/メモリ/帯域の枯渇、正当なユーザーへのサービス劣化などが含まれます。

![API Abuse Preventionプロファイル](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

この種の自動化された脅威を検出するため、API Abuse Preventionは次の3つの新しい[ディテクタ](../api-abuse-prevention/overview.md#how-api-abuse-prevention-works)を提供します。

* **Response time anomaly**: APIレスポンスのレイテンシにおける異常なパターンを特定し、自動化された濫用やバックエンド悪用の試みを示唆する可能性のある兆候を検出します。
* **Excessive request consumption**: APIに異常に大きなリクエストペイロードを送信するクライアントを特定し、バックエンド処理リソースの濫用や誤用の可能性を検出します。
* **Excessive response consumption**: セッション存続期間中に転送されたレスポンスデータ総量に基づき疑わしいセッションにフラグを付けます。個々のリクエストに焦点を当てるディテクタとは異なり、セッション全体のレスポンスサイズを集約して、スロードリップ型や分散スクレイピング攻撃を特定します。

## どのWallarmノードのアップグレードを推奨しますか

* バージョン4.10および5.xのクライアントおよびマルチテナント向けWallarm NGINX Nodeをアップグレードすることを推奨します。最新のWallarmリリースに追随し、[インストール済みモジュールの非推奨化](versioning-policy.md#version-support-policy)を防ぐためです。
* [非サポート](versioning-policy.md#version-list)バージョン（4.8以下）のクライアントおよびマルチテナント向けWallarmノードをアップグレードすることを推奨します。

## API DiscoveryとAPIセッションにおける機微なビジネスフロー

!!! tip ""
    [NGINX Node 5.2.11以降](node-artifact-versions.md)および[Native Node 0.10.1以降](native-node/node-artifact-versions.md)

機微なビジネスフロー機能により、Wallarmの[API Discovery](../api-discovery/overview.md)は、認証、アカウント管理、請求など、特定のビジネスフローや機能に不可欠なエンドポイントを自動的に識別できます。

これにより、機微なビジネスフローに関連するエンドポイントの脆弱性や侵害に対する定期的な監視・監査が可能になり、開発、保守、およびセキュリティ対策の優先順位付けが実現されます。

![API Discovery - 機微なビジネスフロー](../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

識別された機微なビジネスフローはWallarmの[APIセッション](../api-sessions/overview.md)に連携されます。つまり、API Discoveryで重要とタグ付けされたエンドポイントに対するセッションのリクエストがある場合、そのセッションは自動的に[タグ付け](../api-sessions/exploring.md#sensitive-business-flows)され、該当ビジネスフローにも影響を及ぼすと判定されます。

セッションに機微なビジネスフローのタグが割り当てられると、特定のビジネスフローでフィルタリングでき、解析する上で最も重要なセッションを簡単に選別できるようになります。

![APIセッション - 機微なビジネスフロー](../images/api-sessions/api-sessions-sbf-no-select.png)

## 本格的なGraphQLパーサー

!!! tip ""
    [NGINX Node 5.3.0以降](node-artifact-versions.md)、現在[Native Node](native-node/node-artifact-versions.md)ではサポートされていません

本格的な[GraphQLパーサー](../user-guides/rules/request-processing.md#gql)は、GraphQLリクエスト内の入力検証攻撃（例：SQLインジェクション）の検出を大幅に改善し、**より高い精度と最小限の誤検知**を実現する改善機能です。

主な利点：

* **向上した検出**：入力検証攻撃（例：SQLインジェクション）の検出能力
* **詳細なパラメーターインサイト**：GraphQLリクエストパラメータの値をAPIセッション内で抽出・表示し、セッションコンテキストパラメータとして活用します。

    ![APIセッション設定 - GraphQLリクエストパラメータ](../images/api-sessions/api-sessions-graphql.png)

* **正確な攻撃検出**：引数、ディレクティブ、変数など、特定のGraphQLリクエストコンポーネント内で攻撃を正確に特定します。
* **高度なルール適用**：特定のGraphQLリクエスト部分に対して細かい保護ルールを適用します。これにより、特定の攻撃タイプに対する除外設定の微調整と構成が可能になります。

    ![GraphQLリクエスト箇所に適用されたルールの例](../images/user-guides/rules/rule-applied-to-graphql-point.png)

## コネクタおよびTCPトラフィックミラー向けNative Node

NGINXから独立して動作するWallarm Node向けの新たなデプロイメントオプション、Native Nodeを導入できることを嬉しく思います。本ソリューションは、NGINXが不要な環境やプラットフォームに依存しないアプローチが望まれる環境のために開発されました。

現時点では、以下のデプロイメント向けに最適化されています：

* MuleSoft、Cloudflare、CloudFront、Broadcom Layer7 API Gateway、Fastlyコネクタ（リクエストおよびレスポンス解析対応）
* Kong API GatewayおよびIstio Ingressコネクタ
* TCPトラフィックミラー解析

[続きを読む](../installation/nginx-native-node-internals.md#native-node)

## NGINX Nodeテクノロジースタックの変更

[Wallarm NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 5.xは、**Rubyベース**の実装から**Go言語**ベースの実装へと再設計されました。本リリースでは、現在および将来の開発に向けて、ソリューションをより高速でスケーラブルかつリソース効率の高いものにすることに注力しています。

### メトリクス

具体的なメトリクスに関しては、Wallarmのpostanalyticsモジュールにおいて以下のパフォーマンス向上が実現されました：

* CPU使用量は0.5コアから0.1コアに削減されました。
* 秒間500リクエストのトラフィック時に、メモリ使用量が400MB削減されました。

### ファイルシステムの変更

テクノロジースタックの変更に伴い、NGINX Nodeアーティファクトのファイルシステムは以下のように変更されました：

* ログファイルシステム：以前は、各専用スクリプトごとに複数のファイルにログが記録されていました。現在、ほぼすべてのサービスのログは単一の専用ファイル`wcli-out.log`に記録されます。過去のログファイルの一覧はこちら、現在のログファイルは[こちら](../admin-en/configure-logging.md)で確認できます。
* 診断スクリプトのパス変更：`/opt/wallarm/usr/share/wallarm-common/collect-info.sh`ファイルは`/opt/wallarm/collect-info.sh`に移動されました。

### さらなる機能の導入

NGINX Node 5.2リリース以降、新機能は新しいGoベースの実装を採用したノードでのみ導入され、以前のバージョン（4.10）にはバックポートされません。

## バージョンポリシーの変更

NGINX Nodeのテクノロジースタックの更新およびNative Nodeの導入に伴い、[Wallarm Nodeバージョンポリシー](versioning-policy.md)が更新されました：

* Wallarmは、最新のマイナーバージョンを含む、直近2つのメジャーバージョンをサポートします。
* 2リリース前のバージョン（例：6.xから4.x）のサポートは、新しいメジャーバージョンのリリースから3ヶ月後に終了します。
* メジャーバージョンは6ヶ月ごと、または重要な新機能や破壊的変更がある場合にリリースされます。
* マイナーバージョンは毎月リリースされ、既存機能の強化に注力（+1インクリメント）しています。
* Native NodeもNGINX Nodeと同様のバージョン管理パターンに従い、同時リリースおよび機能のパリティを保っています。ただし、Native Nodeのメジャーバージョン番号は0から始まります。

## アップグレードが推奨されるWallarmノードはどれですか？

* クライアントおよびマルチテナントのWallarm NGINX Node 4.8および4.10は、Wallarmリリースに追随し、[インストール済みモジュールの非推奨化](versioning-policy.md#version-support-policy)を防ぐためにアップグレードが推奨されます。
* [サポート外](versioning-policy.md#version-list)のバージョン（4.6以下）のクライアントおよびマルチテナントのWallarmノードです。

もしバージョン3.6以下からアップグレードする場合は、[別途の一覧](older-versions/what-is-new.md)ですべての変更点を確認してください。

## アップグレード手順

1. [モジュールアップグレードの推奨事項](general-recommendations.md)を確認します。
2. ご利用のWallarmノードのデプロイ方法に対応する手順に従って、インストール済みモジュールをアップグレードします。

    * NGINX Node:
        * [DEB/RPMパッケージ](nginx-modules.md)
        * [All-in-oneインストーラー](all-in-one.md)
        * [NGINX用モジュール入りDockerコンテナ](docker-container.md)
        * [Wallarmモジュール統合済みNGINX Ingress controller](ingress-controller.md)
        * [Sidecar controller](sidecar-proxy.md)
        * [クラウドノードイメージ](cloud-image.md)
        * [マルチテナントノード](multi-tenant.md)
    
    * Native Node:
        * [All-in-oneインストーラー](native-node/all-in-one.md)
        * [Helmチャート](native-node/helm-chart.md)
        * [Dockerイメージ](native-node/docker-image.md)

----------

[Wallarm製品およびコンポーネントのその他の更新 →](https://changelog.wallarm.com/)