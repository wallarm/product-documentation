# Wallarmのソリューションの導入と保守のベストプラクティス

この記事では、Wallarmソリューションの導入と保守のためのベストプラクティスを定式化します。

## NGINXの力を理解する

Wallarmのフィルタリングノードの導入の多くのオプションでは、リバースプロキシサーバーとしてNGINXを使用します（これはWallarmモジュールの基盤）。これは多くの機能、モジュール、パフォーマンス/セキュリティガイドを提供します。以下に便利なインターネット記事の一部をまとめます：

* [Awesome NGINX](https://github.com/agile6v/awesome-nginx)
* [NGINX：基礎とベストプラクティスのスライドショー](https://www.slideshare.net/Nginx/nginx-basics-and-best-practices-103340015)
* [Nginx設定の最適化方法](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)
* [Nginxサーバーのパフォーマンスを最適化するための3つの簡単な手順](https://www.techrepublic.com/article/3-quick-steps-to-optimize-the-performance-of-your-nginx-server/)
* [15ステップでタフなNginxサーバーを構築する方法](https://www.upguard.com/blog/how-to-build-a-tough-nginx-server-in-15-steps)
* [Nginx Webサーバーのパフォーマンスを最適化する方法](https://hostadvice.com/how-to/how-to-tune-and-optimize-performance-of-nginx-web-server/)
* [Nginxサーバーのパフォーマンスを向上させる強力な方法](https://www.freecodecamp.org/news/powerful-ways-to-supercharge-your-nginx-server-and-improve-its-performance-a8afdbfde64d/)
* [TLSのベストプラクティス](https://www.linode.com/docs/guides/tls-deployment-best-practices-for-nginx/)
* [NGINX Webサーバーのセキュリティと強化ガイド](https://geekflare.com/nginx-webserver-security-hardening-guide/)
* [NGINXのパフォーマンス最適化のためのチューニング](https://github.com/denji/nginx-tuning)
* [NGINX Webサーバーの最高のセキュリティ実践25選](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html)

## 推奨されるオンボーディングステップに従う

1. 利用可能な[Wallarmノードの導入オプション](../installation/supported-deployment-options.md)について学ぶ。
2. 必要に応じて、環境ごとに[別々にWallarmノードの設定を管理する](../admin-en/configuration-guides/wallarm-in-separated-environments/how-wallarm-in-separated-environments-works.md)ための利用可能なオプションについて学ぶ。
3. [運用モード](../admin-en/configure-wallarm-mode.md)すなわち`monitoring`に設定して、Wallarmのフィルタリングノードを非本番環境で導入する。
4. Wallarmソリューションをどのように運用、拡張、監視するか、そして新しいネットワークコンポーネントの安定性を確認する方法について学ぶ。
5. [運用モード](../admin-en/configure-wallarm-mode.md)を`monitoring`に設定して、Wallarmのフィルタリングノードを本番環境で導入する。
6. 新しいWallarmコンポーネントの適切な設定管理と[モニタリングプロセス](#enable-proper-monitoring-of-the-filtering-nodes)を実装する。
7. 7〜14日間、すべての環境（テスト環境と本番環境を含む）でフィルタリングノードを介してトラフィックを維持する。これにより、Wallarmのクラウドベースのバックエンドがアプリケーションについて学習するための時間が与えられます。
8. すべての非本番環境でWallarmの`block`[モード](../admin-en/configure-wallarm-mode.md)を有効にし、自動化されたテストまたは手動テストを使用して、保護されたアプリケーションが期待通りに動作していることを確認する。
9. 本番環境でWallarmの`block`[モード](../admin-en/configure-wallarm-mode.md)を有効にし、利用可能な方法を使用して、アプリケーションが期待通りに動作していることを確認する。

## フィルタリングノードを本番環境だけでなくテスト環境とステージング環境にも導入する

Wallarmのサービス契約のほとんどは、顧客が導入するWallarmノードの数を制限していないため、開発、テスト、ステージングなど、全ての環境に対してフィルタリングノードを導入しない理由はありません。

ソフトウェア開発および/またはサービス運用活動の全ての段階でフィルタリングノードを導入および使用することで、完全なデータフローを適切にテストし、本番環境での予期せぬ状況のリスクを最小限に抑える可能性が高くなります。

## libdetectionライブラリを有効にする

[**libdetection** ライブラリ](protecting-against-attacks.md#library-libdetection)を使用してリクエストを分析すると、フィルタリングノードがSQLi攻撃を検出する能力が大幅に向上します。全てのWallarmの顧客に対しては、フィルタリングノードソフトウェアの最新バージョンに[アップグレード](/updating-migrating/general-recommendations/)し、**libdetection** ライブラリを有効にして使用することを強く推奨します。

* フィルタリングノードバージョン4.4以降では、**libdetection** ライブラリはデフォルトで有効になっています。
* それより低いバージョンでは、導入オプションによる[アプローチ](protecting-against-attacks.md#managing-libdetection-mode)を使用して有効にすることが推奨されます。

## エンドユーザーのIPアドレス報告の正確な設定を行う

ロードバランサーまたはCDNの背後にあるWallarmフィルタリングノードについては、エンドユーザーのIPアドレスを正確に報告するようにフィルタリングノードを正しく設定するように確認してください（これをしないと、[IPリスト機能](../user-guides/ip-lists/overview.md)、[アクティブ脅威検証](detecting-vulnerabilities.md#active-threat-verification)、およびその他の一部の機能が動作しません）：

* [NGINXベースのWallarmノードのための手順](../admin-en/using-proxy-or-balancer-en.md)（AWS / GCPイメージとDockerノードコンテナを含む）
* [Wallarm Kubernetes Ingressコントローラーとして導入されたフィルタリングノードのための手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## フィルタリングノードの適切なモニタリングを有効にする

Wallarmのフィルタリングノードの適切なモニタリングを有効にすることを強く推奨します。すべてのWallarmのフィルタリングノードにインストールされる `collectd` サービスは、[リンク](../admin-en/monitoring/available-metrics.md)内に記載されているメトリクスを収集します。

フィルタリングノードの監視設定方法は、そのデプロイメントオプションによります：

* [NGINXベースのWallarmノードのための手順](../admin-en/monitoring/intro.md)（AWS / GCPイメージとKubernetesサイドカーを含む）
* [Wallarm Kubernetes Ingressコントローラーとして導入されたフィルタリングノードのための手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINXベースのDockerイメージのための手順](../admin-en/installation-docker-en.md#monitoring-configuration)

## 適切な冗長性と自動フェイルオーバー機能を実装する

他のすべての重要なコンポーネントと同様に、Wallarmノードは適切な冗長性と自動フェイルオーバーを持つように設計、導入、運用する必要があります。**少なくとも2つのアクティブなWallarmフィルタリングノード**が重要なエンドユーザーリクエストを処理するようにすべきです。以下の記事に関連する情報が提供されています：

* [NGINXベースのWallarmノードのための手順](../admin-en/configure-backup-en.md) （AWS / GCPイメージ、Dockerノードコンテナ、およびKubernetesサイドカーを含む）
* [Wallarm Kubernetes Ingressコントローラーとして導入されたフィルタリングノードのための手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)

## IPアドレスのホワイトリスト、ブラックリスト、グレーリストの使い方を学ぶ

個々の悪意のあるリクエストをブロックするだけでなく、Wallarmのフィルタリングノードは個々のエンドユーザーのIPアドレスをブロックすることもできます。IPのブロックに対するルールは、ホワイトリスト、ブラックリスト、およびグレーリストを使用して設定されます。

[IPリストの使用に関する詳細 →](../user-guides/ip-lists/overview.md)

## Wallarmの設定変更の段階的なロールアウト方法を学ぐ

* Wallarmのフィルタリングノードの低レベルの設定変更については、標準的なDevOpsの変更管理と段階的なロールアウトの方針を使用します。
* フィルタリングルールについては、異なるアプリケーション用に異なる[IDs](../admin-en/configure-parameters-en.md#wallarm_application)または`Host`リクエストヘッダーを使用します。
* [正規表現を使用した攻撃識別の作成](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule)のルールでは、特定のアプリケーションIDに関連付けることができる上に、Wallarmノードがブロックモードで動作しているときでも、モニタリングモード（**Experimental** チェックボックス）で有効にすることができます。
* [フィルタモードの設定](../admin-en/configure-wallarm-mode.md)のルールは、Wallarm ConsoleからWallarmノードの運用モード（`monitoring`、`safe_blocking`、または`block`）を制御することを可能にし、NGINXの設定での[`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode) の設定に似ています（[`wallarm_mode_allow_override`](../admin-en/configure-parameters-en.md#wallarm_mode_allow_override) の設定によります）。

## 利用可能なインテグレーションを設定して、システムからの通知を受け取る

WallarmはSlack、Telegram、PagerDuty、Opsgenieなどの他のシステムとの便利な[ネイティブインテグレーション](../user-guides/settings/integrations/integrations-intro.md)を提供しています。これにより、プラットフォームが生成するさまざまなセキュリティ通知を、例えば以下のような情報を迅速に送信することができます：

* 新たに発見されたセキュリティ脆弱性
* 会社のネットワークパラメーターの変更
* Wallarm Consoleを通じて新たに会社アカウントに追加されたユーザーなど

さらに、[トリガー](../user-guides/triggers/triggers.md)機能を使用して、システムのさまざまなイベントについてカスタムアラートを設定することもできます。

## トリガー機能の力を理解する

特定の環境に応じて、次の[トリガー](../user-guides/triggers/triggers.md)の設定を推奨します：

* Wallarmノードが検出した有害なリクエストレベルの増加を監視します。このトリガーは、以下の潜在的な問題のいずれかを示す可能性があります：

    * 攻撃を受けていて、Wallarmノードが有害なリクエストを正常にブロックしています。検出された攻撃を確認し、報告された攻撃者のIPアドレスを手動でブラックリストに登録（ブロック）することを検討してみてください。
    * Wallarmノードによって検出された攻撃の誤検出レベルが上昇しています。この問題を[Wallarmの技術サポートチーム](mailto:support@wallarm.com)にエスカレートするか、手動で[リクエストを誤検出とマーク](../user-guides/events/false-attack.md)することを検討してみてください。
    * [ブラックリストトリガー](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)がアクティブであるにもかかわらず、攻撃レベルの増加について警告を受け取る場合、その警告はトリガーが期待通りに動作していないことを示している可能性があります。

    [設定済みトリガーの例を見る →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)
* Wallarm Consoleの会社アカウントに新しいユーザーが追加されたことを通知します

    [設定済みトリガーの例を見る →](../user-guides/triggers/trigger-examples.md#slack-and-email-notification-if-new-user-is-added-to-the-account)
* リクエストをブルートフォース攻撃または強制ブラウジング攻撃としてマークし、リクエストが発生したIPアドレスをブロックします。

    [ブルートフォース保護の設定方法 →](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* 新しいIPアドレスがブロックされたことを通知します

    [設定済みトリガーの例を見る →](../user-guides/triggers/trigger-examples.md#notification-to-webhook-url-if-ip-address-is-added-to-the-denylist)
* 自動的にIPアドレスを[safe blocking](../admin-en/configure-wallarm-mode.md) モードで使用される[グレーリスト](../user-guides/ip-lists/graylist.md)に追加します。

トラフィックの処理と攻撃のアップロードを最適化するために、Wallarmはいくつかのトリガーを[事前に設定します](../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers)。

## Wallarm Consoleのアカウント用にSAML SSOを有効にする

G Suite、Okta、またはOneLogin などのSAML SSOプロバイダーを使用して、Wallarm Consoleアカウントのユーザー認証を一元化することができます。

SAML SSOをアカウントに有効にするためには、Wallarmのアカウントマネージャーまたは技術サポートチームに連絡してください。そして、それが完了したら、[これらの手順](../admin-en/configuration-guides/sso/intro.md)に従ってSAML SSOの設定を行います。

## WallarmのTerraformプロバイダーを使用してWallarm Cloudの設定管理を行う

[Wallarmの公式Terraformプロバイダー](../admin-en/managing/terraform-provider.md)を使用することで、現代のインフラストラクチャー・アズ・コード（IaC）アプローチを使用して、Wallarm Cloudの設定（ユーザー、アプリケーション、ルール、インテグレーションなど）を管理することができます。

## 新しくリリースされたWallarmノードバージョンに迅速に更新するプランを持つ

Wallarmはフィルタリングノードソフトウェアの改善に絶えず取り組んでおり、新しいリリースは約1四半期に1回提供されます。アップグレードを行うための推奨されるアプローチ、関連するリスク、および関連するアップグレード手順に関する情報は、[このドキュメント](../updating-migrating/general-recommendations.md)をお読みください。

## 既知の注意点を学ぶ

* 同じWallarmアカウントに接続されたすべてのWallarmノードは、トラフィックフィルタリングのための同じデフォルトのルールセットとカスタムルールセットを受け取ります。それでも、適切なアプリケーションIDまたは一意のHTTPリクエストパラメータ（ヘッダー、クエリ文字列パラメータなど）を使用して、異なるアプリケーションに対して異なるルールを適用することができます。
* IPアドレスを自動的にブロックするように設定されたトリガーがある場合（[トリガーの例](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)）、そのシステムはWallarmアカウント内のすべてのアプリケーションに対してIPをブロックします。

## アクティブな脅威検証のためのベストプラクティスに従う <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarmが[脆弱性を検出する](../about-wallarm/detecting-vulnerabilities.md)方法の1つは **アクティブな脅威検証**です。

**アクティブな脅威検証**では、攻撃者をペネトレーションテスターに変え、アプリやAPIに対する攻撃を形成し、可能なセキュリティ問題を発見します。このモジュールは、トラフィックから得た実際の攻撃データを使用して、アプリケーションのエンドポイントを探り、可能な脆弱性を探します。デフォルトではこの方法は無効になっています。

[**アクティブな脅威検証** モジュールの設定のためのベストプラクティスを学ぶ →](../vulnerability-detection/threat-replay-testing/setup.md)
