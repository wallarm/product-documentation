# Wallarmソリューションのデプロイメントおよびメンテナンスベストプラクティス

本記事では、Wallarmソリューションのデプロイメントおよびメンテナンスに関するベストプラクティスをまとめます。

## NGINXの力を理解する

大多数のWallarmフィルタリングノードのデプロイメントオプションは、リバースプロキシサーバーとしてNGINX（Wallarmモジュールの基盤）を使用しており、幅広い機能、モジュール、パフォーマンス／セキュリティに関するガイドを提供します。以下は、参考となるインターネット記事のコレクションです:

* [Awesome NGINX](https://github.com/agile6v/awesome-nginx)
* [NGINX: Basics and Best Practices slide show](https://www.slideshare.net/Nginx/nginx-basics-and-best-practices-103340015)
* [How to optimize NGINX configuration](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)
* [3 quick steps to optimize the performance of your NGINX server](https://www.techrepublic.com/article/3-quick-steps-to-optimize-the-performance-of-your-nginx-server/)
* [How to Build a Tough NGINX Server in 15 Steps](https://www.upguard.com/blog/how-to-build-a-tough-nginx-server-in-15-steps)
* [How to Tune and Optimize Performance of NGINX Web Server](https://hostadvice.com/how-to/how-to-tune-and-optimize-performance-of-nginx-web-server/)
* [Powerful ways to supercharge your NGINX server and improve its performance](https://www.freecodecamp.org/news/powerful-ways-to-supercharge-your-nginx-server-and-improve-its-performance-a8afdbfde64d/)
* [TLS Deployment Best Practices](https://www.linode.com/docs/guides/tls-deployment-best-practices-for-nginx/)
* [NGINX Web Server Security and Hardening Guide](https://geekflare.com/nginx-webserver-security-hardening-guide/)
* [NGINX Tuning For Best Performance](https://github.com/denji/nginx-tuning)
* [Top 25 NGINX Web Server Best Security Practices](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html)

## 推奨されるオンボーディングステップに従う

1. 利用可能な[Wallarmノードのデプロイメントオプション](../installation/supported-deployment-options.md)について学びます。
2. 必要に応じて、[各環境ごとに個別に管理可能なWallarmノードの設定](../installation/multi-tenant/overview.md#issues-addressed-by-multitenancy)について学びます。
3. まず、[operation mode](../admin-en/configure-wallarm-mode.md)が`monitoring`に設定された状態で、Wallarmフィルタリングノードを非本番環境にデプロイします。
4. Wallarmソリューションの運用、スケールおよび監視方法について学び、新しいネットワークコンポーネントの安定性を確認します。
5. 本番環境においても、[operation mode](../admin-en/configure-wallarm-mode.md)を`monitoring`に設定した状態でWallarmフィルタリングノードをデプロイします。
6. 新しいWallarmコンポーネントに対して、適切な設定管理および[監視プロセス](#enable-proper-monitoring-of-the-filtering-nodes)を実装します。
7. Wallarmクラウドベースのバックエンドがアプリケーションを学習する時間を確保するため、テスト環境や本番環境を含むすべての環境でフィルタリングノードを通じてトラフィックを7～14日間流し続けます。
8. 非本番環境でWallarmの[operation mode](../admin-en/configure-wallarm-mode.md)を`block`に有効化し、自動または手動のテストにより保護対象アプリケーションが期待通りに動作していることを確認します。
9. 本番環境でもWallarmの[operation mode](../admin-en/configure-wallarm-mode.md)を`block`に有効化し、利用可能な手法でアプリケーションが期待通りに動作していることを確認します。

## テストおよびステージング環境にもフィルタリングノードをデプロイする

大多数のWallarmサービス契約では、顧客がデプロイするWallarmノードの数に制限は設けられていないため、開発、テスト、ステージングなどすべての環境にフィルタリングノードをデプロイしない理由はありません。

ソフトウェア開発やサービス運用の各段階でフィルタリングノードをデプロイして利用することで、全体のデータフローを適切にテストし、重要な本番環境において予期しない事態のリスクを最小限に抑える可能性が高まります。

## libdetectionライブラリを有効にする

[**libdetection**ライブラリ](protecting-against-attacks.md#library-libdetection)によるリクエスト解析は、SQLi攻撃を検出するフィルタリングノードの能力を大幅に向上させます。すべてのWallarm顧客には、フィルタリングノードソフトウェアを最新バージョンに[アップグレード](/updating-migrating/general-recommendations/)し、**libdetection**ライブラリを有効にすることを強く推奨します。

* バージョン4.4以上のフィルタリングノードでは、**libdetection**はデフォルトで有効です。
* それ以前のバージョンでは、デプロイメントオプションに応じた[アプローチ](protecting-against-attacks.md#managing-libdetection-mode)で有効にすることが推奨されます。

## エンドユーザーのIPアドレスが正しく報告されるように構成する

ロードバランサーまたはCDNの背後にあるWallarmフィルタリングノードの場合、エンドユーザーのIPアドレスが正しく報告されるようにフィルタリングノードを構成する必要があります（そうでないと、[IPリスト機能](../user-guides/ip-lists/overview.md)や[Threat Replay Testing](detecting-vulnerabilities.md#threat-replay-testing)などの機能が正しく動作しません）:

* [NGINXベースのWallarmノードに関する手順](../admin-en/using-proxy-or-balancer-en.md)（AWS/GCPのイメージおよびDockerノードコンテナを含む）
* [Wallarm Kubernetes Ingress Controllerとしてデプロイされたフィルタリングノードに関する手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## フィルタリングノードの適切な監視を有効にする

Wallarmフィルタリングノードの適切な監視を有効にすることを強く推奨します。

フィルタリングノードの監視設定は、デプロイメントオプションによって異なります:

* [Wallarm Kubernetes Ingress Controllerとしてデプロイされたフィルタリングノードに関する手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINXベースのDockerイメージに関する手順](../admin-en/installation-docker-en.md#monitoring-configuration)

## 適切な冗長性と自動フェイルオーバー機能を実装する

本番環境内の他の重要なコンポーネントと同様に、Wallarmノードは適切な冗長性および自動フェイルオーバーが確保された設計、デプロイメントおよび運用を行う必要があります。重要なエンドユーザーリクエストを処理するためには、**少なくとも2台の稼働中のWallarmフィルタリングノード**が必要です。以下の記事では、このテーマに関する関連情報が提供されています:

* [NGINXベースのWallarmノードに関する手順](../admin-en/configure-backup-en.md)（AWS/GCPのイメージ、Dockerノードコンテナ、Kubernetesサイドカーを含む）
* [Wallarm Kubernetes Ingress Controllerとしてデプロイされたフィルタリングノードに関する手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)

## IPアドレスのallowlist、denylist、およびgraylistの使用方法を学ぶ

個々の悪意あるリクエストのブロックに加え、Wallarmフィルタリングノードでは個々のエンドユーザーIPアドレスをブロックすることも可能です。IPブロックのルールはallowlist、denylist、graylistを使用して設定します。

[IPリストの使用方法の詳細はこちら →](../user-guides/ip-lists/overview.md)

## Wallarm設定変更の段階的ロールアウトの方法を学ぶ

* すべての形態のWallarmフィルタリングノードに対して、低レベルの設定変更には標準のDevOps変更管理および段階的ロールアウトポリシーを使用します。
* トラフィックフィルトレーションルールについては、異なるアプリケーション[ID](../admin-en/configure-parameters-en.md#wallarm_application)または`Host`リクエストヘッダーを使用します。
* [正規表現に基づく攻撃インジケーターの作成](../user-guides/rules/regex-rule.md#creating-and-applying-rule)ルールは、特定のアプリケーションIDに関連付ける機能に加え、Wallarmノードがブロッキングモードで実行されていても監視モード（**Experimental**チェックボックス）で有効化できます。
* [フィルトレーションモードの設定](../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)ルールにより、Wallarm ConsoleからWallarmノードの動作モード（`monitoring`、`safe_blocking`または`block`）を制御できます。これはNGINX設定内の[`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode)設定および[`wallarm_mode_allow_override`](../admin-en/configure-parameters-en.md#wallarm_mode_allow_override)設定に依存します。

## システムから通知を受信するための利用可能な統合を構成する

Wallarmは、Slack、Telegram、PagerDuty、Opsgenieなどのシステムとの便利な[ネイティブ統合](../user-guides/settings/integrations/integrations-intro.md)を提供しており、例えば以下のようなセキュリティ通知を迅速に送信できます:

* 新たに発見されたセキュリティ脆弱性
* 企業ネットワーク境界の変更
* Wallarm Console経由で企業アカウントに新たに追加されたユーザー、など

また、システム内で発生するさまざまなイベントに対するカスタムアラートを設定するために、[Triggers](../user-guides/triggers/triggers.md)機能を使用できます。

## Triggers機能の力を学ぶ

特定の環境に応じて、以下の[トリガー](../user-guides/triggers/triggers.md)の設定を推奨します:

* Wallarmノードで検出された悪意あるリクエストの増加を監視する。このトリガーは、次の潜在的な問題のいずれかを示す可能性があります:
  
    * 攻撃を受け、Wallarmノードが悪意あるリクエストを正しくブロックしている状況です。この場合、検出された攻撃を確認し、手動で攻撃元IPアドレスをdenylist（ブロック）することを検討してください。
    * Wallarmノードで誤検知（false positive）の攻撃が増加している状況です。この場合、[Wallarmテクニカルサポートチーム](mailto:support@wallarm.com)へエスカレーションするか、手動で[リクエストをfalse positiveとしてマーク](../user-guides/events/check-attack.md#false-positives)することを検討してください。
    * [denylistingトリガー](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)を有効にしているにもかかわらず、攻撃の増加に関するアラートが発生する場合、トリガーが期待通りに機能していない可能性があります。
  
    [設定されたトリガーの例をご確認ください →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)
* Wallarm Consoleに新しいユーザーが追加されたことを通知する
  
    [設定されたトリガーの例をご確認ください →](../user-guides/triggers/trigger-examples.md#slack-and-email-notification-if-new-user-is-added-to-the-account)
* ブルートフォースまたは強制ブラウジング攻撃としてリクエストをマークし、リクエストの送信元IPアドレスをブロックする
  
    [ブルートフォース保護の構成に関する手順をご覧ください →](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* 新たにブロックされたIPアドレスを通知する
  
    [設定されたトリガーの例をご確認ください →](../user-guides/triggers/trigger-examples.md#notification-to-webhook-url-if-ip-address-is-added-to-the-denylist)
* Wallarmの[safe blocking](../admin-en/configure-wallarm-mode.md)モードで使用する[graylist](../user-guides/ip-lists/overview.md)に自動でIPアドレスを追加する

Wallarmは、トラフィック処理および攻撃アップロードの最適化のため、いくつかのトリガーを[プリコンフィギュレーション](../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers)しています。

## Wallarm ConsoleでSAML SSOを有効にする

G Suite、Okta、OneLoginなどのSAML SSOプロバイダーを利用して、Wallarm Consoleアカウントのユーザー認証を集中管理できます。  
Wallarmのアカウントマネージャーまたはテクニカルサポートチームに連絡してアカウントのSAML SSOを有効にし、その後、[こちらの手順](../admin-en/configuration-guides/sso/intro.md)に従ってSAML SSOの構成を行ってください。

## Wallarm Cloudの構成管理にWallarm Terraformプロバイダーを利用する

[Wallarm公式Terraformプロバイダー](../admin-en/managing/terraform-provider.md)を利用することで、モダンなInfrastructure as Code（IaC）アプローチを用いてWallarm Cloudの構成（ユーザー、アプリケーション、ルール、統合など）を管理できます。

## 新リリースのWallarmノードへ迅速にアップデートする計画を立てる

Wallarmは、フィルタリングノードソフトウェアの改善に継続的に取り組んでおり、新リリースは四半期ごとに提供されます。アップグレードに関するリスクおよび関連する手順については、[こちらのドキュメント](../updating-migrating/general-recommendations.md)をお読みください。

## 既知の注意点を把握する

* 同一のWallarmアカウントに接続されているすべてのWallarmノードには、同じセットのデフォルトおよびカスタムルールが適用されます。特定のアプリケーションに対しては、適切なアプリケーションIDやユニークなHTTPリクエストパラメータ（ヘッダー、クエリ文字列など）を使用して、異なるルールを適用できます。
* 自動でIPアドレスをブロックするトリガーが設定されている場合（[トリガーの例](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)）、システムはWallarmアカウント内のすべてのアプリケーションに対してIPブロックを適用します。

## Threat Replay Testingのベストプラクティスに従う <a href="../subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarmが脆弱性を[検出する](../about-wallarm/detecting-vulnerabilities.md)手法の1つとして、**Threat Replay Testing**があります。  
**Threat Replay Testing**は、攻撃者の活動をペネトレーションテスターとして活用し、アプリケーション／APIの脆弱性を探る過程で潜在的なセキュリティ問題を発見することを可能にします。このモジュールは、実際の攻撃データを利用してアプリケーションのエンドポイントをプローブし、潜在的な脆弱性を発見します。デフォルトでは、この手法は無効になっています。

[**Threat Replay Testing**モジュールの構成に関するベストプラクティスの詳細はこちら →](../vulnerability-detection/threat-replay-testing/setup.md)