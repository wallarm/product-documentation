# Wallarm Node 5.x と 0.x の新機能

本ドキュメントはNGINX Node 5.xおよびNative Node 0.xのメジャーバージョン向けのチェンジログについて説明しています。古いメジャーバージョンからアップグレードされる場合、このドキュメントを参照ください。

Wallarm Nodeのマイナーバージョンに関する詳細なチェンジログについては、[NGINX Nodeアーティファクト一覧](node-artifact-versions.md)または[Native Nodeアーティファクト一覧](native-node/node-artifact-versions.md)を参照してください。

## APIセッション

!!! tip ""
    [NGINX Node 5.1.0以降](node-artifact-versions.md)および[Native Node 0.8.1以降](native-node/node-artifact-versions.md)

API経済に特化したユニークなセキュリティ機能、[APIセッション](../api-sessions/overview.md)を導入します。この機能により、攻撃、異常、及びAPI全体でのユーザー行動を可視化でき、ユーザーがAPIおよびアプリケーションとどのように連携しているかの透明性が向上します。

![APIセッションセクション - 監視されるセッション](../images/api-sessions/api-sessions.png)

攻撃者は脆弱なエンドポイントを正当なユーザー行動に紛れ込ませることで悪用することが多く、そのセッション全体の文脈がなければパターンや脅威を特定することは、複数のツールやシステムを必要とする手間のかかる作業となります。組織はAPIレベルでの十分な可視性を持っていない場合があります。

APIセッションにより、セキュリティチームはユーザーセッションごとにグループ化されたすべての関連アクティビティを確認でき、攻撃シーケンス、ユーザーの異常、及び通常の動作を前例のない見通しで把握できます。従来、数時間または数日を要した調査を、Wallarm Console上で数分で実行できるようになりました。

主な特徴：

* 攻撃、異常、及びユーザー行動の可視化：セッション内の各リクエストを閲覧・解析し、攻撃ベクターや疑わしいパターンを追跡します。
* レガシーセッションと最新セッションの両方に対応：アプリケーションがクッキーセッションまたはJWT/OAuthに依存している場合でも、Wallarm APIセッションは完全な互換性と可視性を提供します。
* 個別の攻撃とそれに対応するセッション間をシームレスに移動できます。

APIセッションを用いることで、セキュリティチームは容易に以下を実行できます：

* 脅威アクターの全アクティビティを調査し、潜在的な攻撃経路や侵害されたリソースを理解します。
* シャドウAPIやゾンビAPIへのアクセス状況を特定し、未文書化または旧式のAPIに起因するリスクを軽減します。
* キーインサイトを同僚と共有し、セキュリティ調査時の協業を促進します。

[続きを読む](../api-sessions/overview.md)

## APIセッションにおけるレスポンスパラメータ

!!! tip ""
    [NGINX Node 5.3.0以降](node-artifact-versions.md)、現在[Native Node](native-node/node-artifact-versions.md)ではサポートされていません

Wallarmの[APIセッション](../api-sessions/overview.md)は、ユーザーアクティビティのシーケンスの可視化を提供します。この機能追加により、各セッション内でリクエストだけでなくレスポンス情報も利用可能になりました：

* どのヘッダーやレスポンスのパラメータでも、対応するリクエスト内に表示するよう設定でき、ユーザーアクティビティの明確かつ完全な全体像を提供します。
* レスポンスパラメータをセッションのグループキーとして利用でき（[例](../api-sessions/setup.md#grouping-keys-example)参照）、リクエストをセッションに正確にグループ化できます。

![APIセッション - グルーピングキー動作例](../images/api-sessions/api-sessions-grouping-keys.png)

## リクエスト処理時間制限における新機能

!!! tip ""
    [NGINX Node 5.1.0以降](node-artifact-versions.md)および[Native Node 0.8.1以降](native-node/node-artifact-versions.md)

Wallarmは、システムメモリ不足に陥り、ノードが停止してアプリケーションが保護されなくなるのを防ぐために、リクエスト処理時間を[制限](../user-guides/rules/configure-overlimit-res-detection.md)します。今回、このメカニズムの透明性が向上しました：

* 制限超過のすべてのケースが記録され、即座に**Attacks**に`overlimit_res`イベントとして表示され、容易に特定・解析できます。
* 制限超過が発生した場合、すべてのリクエスト処理が停止します。
* システム動作の設定が容易になりました。一般設定は**Settings**→**General**に表示され、そこで変更できます。
* **Limit request processing time**（旧**Fine-tune the overlimit_res attack detection**）ルールは、特定のエンドポイント向けに異なる設定を適用できるよう簡略化されました。

## API Discoveryにおける機微なデータ検出のカスタマイズ

!!! tip ""
    [NGINX Node 5.0.3以降](node-artifact-versions.md)および[Native Node 0.7.0以降](native-node/node-artifact-versions.md)

API Discoveryは、APIで利用および転送される機微なデータを検出し強調表示します。既存の検出プロセスを[微調整](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection)し、独自の機微なデータパターンを追加できます。

パターンは、どの機微なデータがどのように検出されるかを定義するために使用されます。既定のパターンを変更し独自のものを追加するには、Wallarm Consoleで**API Discovery**→**Configure API Discovery**→**Sensitive data**に移動してください。

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

1. [モジュールアップグレードに関する推奨事項](general-recommendations.md)を確認します。
2. ご利用のWallarmノードデプロイメントオプションに応じた手順に従って、インストール済みモジュールをアップグレードします：

    * NGINX Node:
        * [DEB/RPMパッケージ](nginx-modules.md)
        * [オールインワンインストーラー](all-in-one.md)
        * [NGINX用モジュールを含むDockerコンテナ](docker-container.md)
        * [Wallarmモジュールが統合されたNGINX Ingressコントローラー](ingress-controller.md)
        * [サイドカーコントローラー](sidecar-proxy.md)
        * [クラウドノードイメージ](cloud-image.md)
        * [マルチテナントノード](multi-tenant.md)
    
    * Native Node:
        * [オールインワンインストーラー](native-node/all-in-one.md)
        * [Helmチャート](native-node/helm-chart.md)
        * [Dockerイメージ](native-node/docker-image.md)

----------

[Wallarm製品およびコンポーネントのその他の更新情報 →](https://changelog.wallarm.com/)