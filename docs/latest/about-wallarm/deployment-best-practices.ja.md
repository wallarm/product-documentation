# Wallarm ソリューションの展開とメンテナンスのベストプラクティス

本記事は、Wallarm ソリューションの展開とメンテナンスのベストプラクティスを定式化しています。

## NGINX の力を理解する

Wallarm フィルタリングノードの展開オプションの大部分は、リバースプロキシサーバーである NGINX を使用しています (Wallarm モジュールの基礎)。NGINX には多くの機能、モジュール、パフォーマンス/セキュリティガイドがあります。以下は、役立つインターネット記事のコレクションです：

- [Awesome NGINX](https://github.com/agile6v/awesome-nginx)
- [NGINX: Basics and Best Practices slide show](https://www.slideshare.net/Nginx/nginx-basics-and-best-practices-103340015)
- [How to optimize NGINX configuration](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)
- [3 quick steps to optimize the performance of your NGINX server](https://www.techrepublic.com/article/3-quick-steps-to-optimize-the-performance-of-your-nginx-server/)
- [How to Build a Tough NGINX Server in 15 Steps](https://www.upguard.com/blog/how-to-build-a-tough-nginx-server-in-15-steps)
- [How to Tune and Optimize Performance of NGINX Web Server](https://hostadvice.com/how-to/how-to-tune-and-optimize-performance-of-nginx-web-server/)
- [Powerful ways to supercharge your NGINX server and improve its performance](https://www.freecodecamp.org/news/powerful-ways-to-supercharge-your-nginx-server-and-improve-its-performance-a8afdbfde64d/)
- [TLS Deployment Best Practices](https://www.linode.com/docs/guides/tls-deployment-best-practices-for-nginx/)
- [NGINX Web Server Security and Hardening Guide](https://geekflare.com/nginx-webserver-security-hardening-guide/)
- [NGINX Tuning For Best Performance](https://github.com/denji/nginx-tuning)
- [Top 25 NGINX Web Server Best Security Practices](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html)## 推奨されるオンボーディング手順に従う

1. [利用可能な Wallarm ノード展開オプション](../installation/supported-deployment-options.md) について学びます。
2. [環境ごとに Wallarm ノード構成を分離して管理するためのオプション](../admin-en/configuration-guides/wallarm-in-separated-environments/how-wallarm-in-separated-environments-works.md) について学びます（必要に応じて）。
3. [operation mode](../admin-en/configure-wallarm-mode.md) を `monitoring` に設定して、監視用の Wallarm フィルタリング・ノードを非本番環境にデプロイします。
4. Wallarm ソリューションの操作、スケーリングとモニタリングの方法、新しいネットワーク・コンポーネントの安定性を確認します。
5. [operation mode](../admin-en/configure-wallarm-mode.md) を `monitoring` に設定して、生産環境に Wallarm フィルタリング・ノードをデプロイします。
6. 新しい Wallarm コンポーネントの適切な構成管理と [モニタリングプロセス](#enable-proper-monitoring-of-the-filtering-nodes) を実施します。
7. Wallarm クラウドベースのバックエンドがアプリケーションについて学習するのに時間を与えるため、テストと本番環境を含めて、すべての環境でフィルタリング・ノードを介してトラフィックを流し続けます（7-14日）。
8. 全ての非本番環境で Wallarm `block` [モード](../admin-en/configure-wallarm-mode.md) を有効にし、自動または手動のテストを使用して、保護されたアプリケーションが期待どおりに動作していることを確認します。
9. 生産環境で Wallarm `block` [mode](../admin-en/configure-wallarm-mode.md) を有効にし、利用可能な方法を使用してアプリケーションが期待通りに動作していることを確認します。

## 単に本番環境だけでなく、開発・テスト環境やステージング環境でもフィルタリングノードをデプロイ

Wallarm サービス契約の大部分では、顧客が展開する Wallarm ノードの数に制限がないため、開発、テスト、ステージングなどすべての環境にフィルタリングノードを展開しない理由はありません。

ソフトウェア開発やサービス運用活動のすべての段階でフィルタリングノードを展開して使用することで、データフロー全体を適切にテストすることができ、重要な本番環境での予期しない状況のリスクを最小限に抑えることができます。

## libdetection ライブラリを有効にする

[**libdetection** library](protecting-against-attacks.md#library-libdetection) を使用してリクエストを分析すると、フィルタリングノードの SQLi 攻撃検出能力が大幅に向上します。すべての Wallarm 顧客は最新バージョンのフィルタリングノード・ソフトウェアに[アップグレード](/updating-migrating/general-recommendations/)し、**libdetection** ライブラリを有効にすることを強くお勧めします。

* フィルタリングノードバージョン4.4以上では、**libdetection** がデフォルトで有効になっています。
* ローワーバージョンの場合は、[アプローチ](protecting-against-attacks.md#managing-libdetection-mode)を使用して有効にすることをお勧めします。## 正しいエンドユーザーのIPアドレスの報告の設定

ロードバランサーまたはCDNの背後にあるWallarmフィルタリングノードの場合は、フィルタリングノードを正しくエンドユーザーのIPアドレスを報告するように構成するようにしてください（そうしないと、[IPリストの機能](../user-guides/ip-lists/overview.md)、[アクティブ脅威検証](detecting-vulnerabilities.md#active-threat-verification)、および一部の他の機能が動作しない可能性があります）:

* [NGINXベースのWallarmノードの手順](../admin-en/using-proxy-or-balancer-en.md)（AWS / GCPイメージおよびDockerノードコンテナを含む）
* [Wallarm Kubernetes Ingressコントローラーとして展開されたフィルタリングノードの手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## フィルタリングノードの正しいモニタリングを有効にする

Wallarmフィルタリングノードの適切な監視を有効にすることが強くお勧めされます。 Wallarmフィルタリングノードにインストールされた`collectd`サービスは、[リンク](../admin-en/monitoring/available-metrics.md)にリストされているメトリックを収集します。

フィルタリングノードモニタリングの設定方法は、展開オプションによって異なります。

* [NGINXベースのWallarmノードの手順](../admin-en/monitoring/intro.md) （AWS / GCPイメージおよびKubernetesサイドカーを含む）
* [Wallarm Kubernetes Ingressコントローラーとして展開されたフィルタリングノードの手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINXベースのDockerイメージの手順](../admin-en/installation-docker-en.md#monitoring-configuration)

## 適切な冗長性と自動フェイルオーバー機能の実装

生産環境の他の重要なコンポーネントと同様に、Wallarmノードは、適切な冗長性と自動フェイルオーバーのレベルで設計、展開、および操作する必要があります。**少なくとも2つのアクティブなWallarmフィルタリングノード**を使用して、重要なエンドユーザーリクエストを処理します。次の記事は、このトピックに関する関連情報を提供します。

* [NGINXベースのWallarmノードの手順](../admin-en/configure-backup-en.md)（AWS / GCPイメージ、Dockerノードコンテナ、およびKubernetesサイドカーを含む）
* [Wallarm Kubernetes Ingressコントローラーとして展開されたフィルタリングノードの手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)

## IPアドレスの許可リスト、拒否リスト、およびグレーリストの使用方法の学習

個々の悪意のあるリクエストをブロックするだけでなく、Wallarmフィルタリングノードは個々のエンドユーザーIPアドレスもブロックできます。 IPブロッキングのルールは、許可リスト、拒否リスト、およびグレーリストを使用して構成されます。

[IPリストの詳細については、こちらを参照→](../user-guides/ip-lists/overview.md)## Wallarm設定変更の段階的展開の方法を学ぶ

* すべてのフォームファクターでWallarmフィルタリングノードの低レベルの構成変更については、標準のDevOps変更管理と段階的展開ポリシーを使用します。
* トラフィックフィルタリングルールについては、異なるアプリケーション[IDs](../admin-en/configure-parameters-en.md#wallarm_application) または `Host` リクエストヘッダーの別のセットを使用します。
* [Create regexp-based attack indicator](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule)ルールについては、上記で言及した特定のアプリケーションIDに関連付けられる能力に加えて、Wallarmノードがブロッキングモードで動作している場合でも、監視モード（**実験的**チェックボックス）で有効にすることができます。
* [Set filtration mode](../user-guides/rules/wallarm-mode-rule.md)ルールにより、Wallarm ConsoleからWallarmノードの操作モード(`monitoring`, `safe_blocking` または `block`)を制御することができます。これはNGINX構成の[`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode)設定に依存します（[`wallarm_mode_allow_override`](../admin-en/configure-parameters-en.md#wallarm_mode_allow_override)設定に依存）。

## 利用可能な統合を設定して、システムから通知を受信する

Wallarmは、Slack、Telegram、PagerDuty、Opsgenieなどのシステムとの便利な[ネイティブ統合](../user-guides/settings/integrations/integrations-intro.md)を提供し、次のようなプラットフォームによって生成されたさまざまなセキュリティ通知をすばやく送信することができます。

* 新たに発見されたセキュリティ上の脆弱性
* 企業のネットワーク境界線の変更
* Wallarm Consoleを介して企業アカウントに新たに追加されたユーザーなど

また、[Triggers](../user-guides/triggers/triggers.md)機能を使用して、システムで発生するさまざまなイベントに関するカスタムアラートを設定することもできます。## Triggers機能の威力を学ぶ

あなたの特定の環境に基づいて、次の [トリガー](../user-guides/triggers/triggers.md) を設定することをお勧めします。

* Wallarmノードで検出された悪意のあるリクエストの増加を監視します。このトリガーは、次の潜在的な問題のいずれかを示す可能性があります。

    * 攻撃を受けており、Wallarmノードが悪意のあるリクエストを正常にブロックしています。検出された攻撃をレビューし、報告された攻撃者のIPアドレスを手動でブロックすることを検討してください。
    * Wallarmノードで検出された偽陽性攻撃のレベルが上昇しています。[Wallarmテクニカルサポートチーム](mailto:support@wallarm.com)にエスカレーションするか、[リクエストを偽陽性としてマーク](../user-guides/events/false-attack.md)することを検討してください。
    * [denylisting トリガー](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)をアクティブにしているが、攻撃のレベルが上昇したというアラートを受け取っている場合、アラートはトリガーが期待どおりに動作していないことを示している可能性があります。

    [構成済みトリガー例を参照 →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)
* Wallarmコンソールの企業アカウントに新しいユーザーが追加されたことを通知する

    [構成済みトリガー例を参照 →](../user-guides/triggers/trigger-examples.md#slack-and-email-notification-if-new-user-is-added-to-the-account)
* ブルートフォース攻撃または強制的なブラウジング攻撃としてリクエストをマークし、リクエスト元のIPアドレスをブロックする

    [ブルートフォース保護の設定手順を参照 →](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* 新しいIPアドレスがブロックされたことを通知する

    [構成済みトリガー例を参照 →](../user-guides/triggers/trigger-examples.md#notification-to-webhook-url-if-ip-address-is-added-to-the-denylist)
* [安全ブロック](../admin-en/configure-wallarm-mode.md)モードで使用される[グレーリスト](../user-guides/ip-lists/graylist.md)にIPアドレスを自動的に追加する。

トラフィック処理と攻撃アップロードの最適化のために、Wallarmは [事前設定済みトリガー（デフォルトトリガー）](../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers)をいくつか用意しています。

## Wallarm ConsoleのアカウントでSAML SSOを有効にする

G Suite、Okta、またはOneLoginなどのSAML SSOプロバイダーを使用して、Wallarm Consoleアカウントのユーザー認証を一元化できます。

SAML SSOをアカウントで有効にするには、Wallarmアカウントマネージャーまたはテクニカルサポートチームに問い合わせ、[これらの手順](../admin-en/configuration-guides/sso/intro.md)に従ってSAML SSOの構成を実行してください。## Wallarmクラウド構成管理のためのWallarm Terraformプロバイダを使用する

[Wallarmの公式Terraformプロバイダ](../admin-en/managing/terraform-provider.md)を使用すると、現代のInfrastructure as Code(IaC)アプローチを使用して、Wallarm Cloudの構成(ユーザー、アプリケーション、ルール、統合など)を管理できます。

## 新しくリリースされたWallarmノードバージョンに迅速に更新する計画を立てる

Wallarmは、新しいリリースが約四半期ごとに利用可能になるフィルタリングノードソフトウェアの改善に取り組んでいます。関連するアップグレード手順とともに、リスクと推奨されるアプローチについては、[このドキュメント](../updating-migrating/general-recommendations.md)を参照してください。

## 既知の注意事項を確認する

* 同じWallarmアカウントに接続されているすべてのWallarmノードは、トラフィックフィルタリング用の同じデフォルトおよびカスタムルールセットを受信します。ただし、アプリケーションIDまたはユニークなHTTPリクエストパラメータ(ヘッダー、クエリストリングパラメータなど)を使用して、異なるアプリケーションに異なるルールを適用することができます。
* IPアドレスを自動的にブロックするトリガー(トリガー例: [1時間に4回以上の悪意のあるペイロードが検出された場合にIPアドレスを拒否リストに入れる](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour))が構成されている場合、システムはWallarmアカウント内のすべてのアプリケーションでIPアドレスをブロックします。

## アクティブ脅威検証のベストプラクティスに従う<a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarmが[脆弱性を検出する方法](../about-wallarm/detecting-vulnerabilities.md)の1つに使用する方法は**アクティブ脅威検証**です。

**アクティブ脅威検証**により、攻撃者をペネトレーションテスターに変え、彼らが脆弱性を探索するためにアプリ/ APIを探求する過程で、可能なセキュリティ問題を発見できます。このモジュールは、実際の攻撃データを使用してアプリケーションエンドポイントをプローブすることにより、可能な脆弱性を検出します。デフォルトでは、このメソッドは無効になっています。

[**アクティブ脅威検証**モジュールの構成のベストプラクティスを学習する →](../admin-en/attack-rechecker-best-practices.md)