# Wallarmソリューションのデプロイおよび運用のベストプラクティス

本記事では、Wallarmソリューションのデプロイおよび運用に関するベストプラクティスを示します。

## NGINXの強みを理解します

多くのWallarmフィルタリングノードのデプロイオプションは、リバースプロキシサーバー（Wallarmモジュールの基盤）としてNGINXを使用しており、豊富な機能、モジュール、パフォーマンス/セキュリティガイドを提供します。以下は有用なインターネット記事のコレクションです。

* [Awesome NGINX](https://github.com/agile6v/awesome-nginx)
* [NGINX: Basics and Best Practices スライドショー](https://www.slideshare.net/Nginx/nginx-basics-and-best-practices-103340015)
* [NGINX構成を最適化する方法](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)
* [NGINXサーバーのパフォーマンスを最適化する3つの迅速なステップ](https://www.techrepublic.com/article/3-quick-steps-to-optimize-the-performance-of-your-nginx-server/)
* [15ステップで堅牢なNGINXサーバーを構築する方法](https://www.upguard.com/blog/how-to-build-a-tough-nginx-server-in-15-steps)
* [NGINX Webサーバーのチューニングとパフォーマンス最適化の方法](https://hostadvice.com/how-to/how-to-tune-and-optimize-performance-of-nginx-web-server/)
* [NGINXサーバーを強化しパフォーマンスを改善する強力な方法](https://www.freecodecamp.org/news/powerful-ways-to-supercharge-your-nginx-server-and-improve-its-performance-a8afdbfde64d/)
* [TLSデプロイメントのベストプラクティス](https://www.linode.com/docs/guides/tls-deployment-best-practices-for-nginx/)
* [NGINX Webサーバーのセキュリティとハードニングガイド](https://geekflare.com/nginx-webserver-security-hardening-guide/)
* [最高のパフォーマンスのためのNGINXチューニング](https://github.com/denji/nginx-tuning)
* [NGINX Webサーバーのセキュリティベストプラクティス25選](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html)

## 推奨されるオンボーディング手順に従います

1. 次のWallarmノードのデプロイオプションについて学びます。

    * [Security Edge](../installation/security-edge/overview.md)
    * [セルフホステッドデプロイ](../installation/supported-deployment-options.md)
    * [コネクタデプロイ](../installation/connectors/overview.md)
2. 必要に応じて、環境ごとに[Wallarmノード構成を個別に管理するオプション](../installation/multi-tenant/overview.md#issues-addressed-by-multitenancy)について学びます。
3. 本番以外の環境にWallarmフィルタリングノードをデプロイし、[運用モード](../admin-en/configure-wallarm-mode.md)を`monitoring`に設定します。
4. Wallarmソリューションの運用、スケール、監視方法を学び、新しいネットワークコンポーネントの安定性を確認します。
5. 本番環境にWallarmフィルタリングノードをデプロイし、[運用モード](../admin-en/configure-wallarm-mode.md)を`monitoring`に設定します。
6. 新しいWallarmコンポーネントに対して適切な構成管理と[監視プロセス](#enable-proper-monitoring-of-the-filtering-nodes)を実装します。
7. すべての環境（テストと本番を含む）でフィルタリングノード経由のトラフィックを7‑14日間維持し、Wallarmのクラウドベースのバックエンドがアプリケーションを学習する時間を確保します。
8. すべての本番以外の環境でWallarmの`block`[モード](../admin-en/configure-wallarm-mode.md)を有効化し、自動または手動テストで保護対象アプリケーションが期待どおり動作することを確認します。
9. 本番環境でWallarmの`block`[モード](../admin-en/configure-wallarm-mode.md)を有効化し、利用可能な方法でアプリケーションが期待どおり動作することを確認します。

## フィルタリングノードは本番環境だけでなくテストやステージングにもデプロイします

多くのWallarmのサービス契約では、顧客がデプロイするWallarmノード数に制限がありません。そのため、開発、テスト、ステージングなど、すべての環境にフィルタリングノードをデプロイしない理由はありません。

ソフトウェア開発やサービス運用の全段階でフィルタリングノードをデプロイ・使用することで、データフロー全体を適切にテストし、重要な本番環境での予期せぬ事象のリスクを最小化できます。

## libdetectionライブラリを有効化します

[**libdetection**ライブラリ](protecting-against-attacks.md#library-libdetection)でリクエストを分析すると、フィルタリングノードのSQLi攻撃検知能力が大幅に向上します。すべてのWallarmのお客様に、フィルタリングノードソフトウェアを最新バージョンに[アップグレード](/updating-migrating/general-recommendations/)し、**libdetection**ライブラリを有効のままにすることを強く推奨します。

* フィルタリングノードのバージョン4.4以上では**libdetection**はデフォルトで有効です。
* それ未満のバージョンでは、デプロイオプションに応じた[方法](protecting-against-attacks.md#managing-libdetection-mode)で有効化することを推奨します。

## エンドユーザーIPアドレスの適切なレポート設定を行います

ロードバランサやCDNの背後にあるWallarmフィルタリングノードでは、エンドユーザーIPアドレスを正しく報告するようにフィルタリングノードを設定してください（そうしないと、[IP list機能](../user-guides/ip-lists/overview.md)、[Threat Replay Testing](detecting-vulnerabilities.md#threat-replay-testing)など一部機能が動作しません）。

* [NGINXベースのWallarmノード向け手順](../admin-en/using-proxy-or-balancer-en.md)（AWS/GCPイメージおよびDockerノードコンテナを含みます）
* [Wallarm Kubernetes Ingress controllerとしてデプロイしたフィルタリングノード向け手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## フィルタリングノードの適切な監視を有効化します

Wallarmフィルタリングノードの適切な監視を有効化することを強く推奨します。

フィルタリングノードの監視設定方法は、デプロイオプションによって異なります。

* [Wallarm Kubernetes Ingress controllerとしてデプロイしたフィルタリングノード向け手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINXベースのDockerイメージ向け手順](../admin-en/installation-docker-en.md#monitoring-configuration)

## 適切な冗長化と自動フェイルオーバー機能を実装します

本番環境の他の重要コンポーネントと同様に、Wallarmノードは適切な冗長性と自動フェイルオーバーを備えるよう設計・デプロイ・運用する必要があります。重要なエンドユーザーリクエストを処理する**少なくとも2台の稼働中のWallarmフィルタリングノード**を用意してください。以下の記事が参考になります。

* [NGINXベースのWallarmノード向け手順](../admin-en/configure-backup-en.md)（AWS/GCPイメージ、Dockerノードコンテナ、Kubernetesサイドカーを含みます）
* [Wallarm Kubernetes Ingress controllerとしてデプロイしたフィルタリングノード向け手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)

## IPアドレスのallowlist、denylist、graylistの使い方を理解します

個々の悪意あるリクエストのブロックに加え、Wallarmフィルタリングノードは個々のエンドユーザーIPアドレスもブロックできます。IPのブロックはallowlist、denylist、graylistで設定します。

[IP listsの使用方法の詳細 →](../user-guides/ip-lists/overview.md)

## Wallarm構成変更の段階的ロールアウト方法を理解します

* すべてのフォームファクタのWallarmフィルタリングノードにおける低レベルの構成変更には、標準的なDevOpsの変更管理と段階的ロールアウトのポリシーを使用します。
* トラフィックフィルタリングルールには、アプリケーション[IDs](../admin-en/configure-parameters-en.md#wallarm_application)や`Host`リクエストヘッダーを使い分けます。
* [Create regexp-based attack indicator](../user-guides/rules/regex-rule.md#creating-and-applying-rule)ルールは、特定のアプリケーションIDに関連付けられる能力に加え、Wallarmノードがブロッキングモードで動作している場合でも、監視モード（**Experimental**チェックボックス）で有効化できます。
* [Set filtration mode](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)ルールは、NGINX構成の[`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode)設定と同様に、Wallarm ConsoleからWallarmノードの運用モード（`monitoring`、`safe_blocking`、`block`）を制御できるようにします（[`wallarm_mode_allow_override`](../admin-en/configure-parameters-en.md#wallarm_mode_allow_override)の設定に依存します）。

## システムからの通知を受け取るために連携を設定します

WallarmはSlack、Telegram、PagerDuty、Opsgenieなどのシステムと便利な[ネイティブ連携](../user-guides/settings/integrations/integrations-intro.md)を提供しており、プラットフォームが生成するさまざまなセキュリティ通知を迅速に受け取れます。例えば次のような通知です。

* 新たに発見されたセキュリティ脆弱性
* 会社のネットワーク境界の変更
* Wallarm Console経由で会社アカウントに新規追加されたユーザー、など

また、[Triggers](../user-guides/triggers/triggers.md)機能を使用して、システム内で発生するさまざまなイベントに関するカスタムアラートを設定できます。

## Triggers機能を活用します

環境に応じて、次の[triggers](../user-guides/triggers/triggers.md)を設定することを推奨します。

* Wallarmノードが検知する悪意のあるリクエストの増加を監視します。このtriggerは次のいずれかの可能性を示します。

    * 受攻中であり、Wallarmノードが悪意のあるリクエストを正常にブロックしています。検知された攻撃を確認し、報告された攻撃者のIPアドレスを手動でdenylist（block）することを検討します。
    * Wallarmノードが検知するfalse positivesが増加しています。これを[Wallarmテクニカルサポートチーム](mailto:support@wallarm.com)へエスカレーションするか、手動で[リクエストをfalse positivesとしてマーク](../user-guides/events/check-attack.md#false-positives)することを検討します。
    * [denylisting trigger](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)が有効にもかかわらず、依然として攻撃増加のアラートを受け取る場合、triggerが期待どおり動作していない可能性を示します。

    [設定済みtriggerの例を見る →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)
* Wallarm Consoleで会社アカウントに新しいユーザーが追加されたことを通知します

    [設定済みtriggerの例を見る →](../user-guides/triggers/trigger-examples.md#slack-and-email-notification-if-new-user-is-added-to-the-account)
* リクエストをブルートフォースまたは強制ブラウジング攻撃としてマークし、発信元のIPアドレスをブロックします

    [ブルートフォース保護の設定方法 →](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* 新しいIPアドレスがブロックされたことを通知します

    [設定済みtriggerの例を見る →](../user-guides/triggers/trigger-examples.md#notification-to-webhook-url-if-ip-address-is-added-to-the-denylist)
* [safe blocking](../admin-en/configure-wallarm-mode.md)モードで使用される[graylist](../user-guides/ip-lists/overview.md)にIPアドレスを自動的に追加します。

トラフィック処理と攻撃のアップロードを最適化するため、Wallarmは一部の[triggersをあらかじめ構成](../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers)します。

## Wallarm ConsoleのアカウントにSAML SSOを有効化します

G Suite、Okta、OneLoginなどのSAML SSOプロバイダを使用して、Wallarm Consoleアカウントのユーザー認証を集中化できます。

アカウントでSAML SSOを有効化するには、Wallarmのアカウントマネージャーまたはテクニカルサポートチームに連絡し、その後[この手順](../admin-en/configuration-guides/sso/intro.md)に従ってSAML SSOの構成を実施します。

## Wallarm Cloudの構成管理にWallarm Terraform providerを使用します

[Wallarmの公式Terraform provider](../admin-en/managing/terraform-provider.md)により、最新のIaC（Infrastructure as Code）アプローチでWallarm Cloudの構成（ユーザー、アプリケーション、ルール、連携など）を管理できます。

## 新しいWallarmノードバージョンへ迅速に更新する計画を用意します

Wallarmはフィルタリングノードソフトウェアの改善を継続的に行っており、おおむね四半期に一度の頻度で新リリースを提供します。推奨されるアップグレード手順、リスク、関連する移行手順については[このドキュメント](../updating-migrating/general-recommendations.md)を参照します。

## 既知の注意点を理解します

* 同一のWallarmアカウントに接続されたすべてのWallarmノードは、トラフィックフィルタリングのための既定およびカスタムルールの同一セットを受け取ります。適切なアプリケーションIDやヘッダー、クエリ文字列パラメータなどの一意なHTTPリクエストパラメータを使用することで、アプリケーションごとに異なるルールを適用できます。
* IPアドレスを自動的にブロックするようにtriggerを構成している場合（[trigger例](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)）、そのIPはWallarmアカウント内のすべてのアプリケーションに対してブロックされます。

## Threat Replay Testingのベストプラクティスに従います <a href="../subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarmが[脆弱性を検知](../about-wallarm/detecting-vulnerabilities.md)する手法の1つが**Threat Replay Testing**です。

**Threat Replay Testing**により、攻撃者をペネトレーションテスターに変え、アプリケーションやAPIの脆弱性を探る彼らの活動から潜在的なセキュリティ問題を発見できます。このモジュールは、トラフィック中の実際の攻撃データを用いてアプリケーションのエンドポイントをプロービングし、潜在的な脆弱性を見つけます。デフォルトではこの方法は無効です。

[**Threat Replay Testing**モジュールの設定に関するベストプラクティスを見る →](../vulnerability-detection/threat-replay-testing/setup.md)