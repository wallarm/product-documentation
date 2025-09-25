# Wallarmソリューションのデプロイおよび運用保守に関するベストプラクティス

本記事では、Wallarmソリューションのデプロイおよび運用保守に関するベストプラクティスを示します。

## フィルタリングノードは本番環境だけでなくテストやステージングにもデプロイします - 技術的ベストプラクティス

多くのWallarmサービス契約では、お客様がデプロイできるWallarmノードの数に制限はありません。そのため、開発・テスト・ステージングなど、あらゆる環境にフィルタリングノードをデプロイしない理由はありません。

ソフトウェア開発やサービス運用の全段階でフィルタリングノードをデプロイして使用することで、データフロー全体を適切にテストでき、重要な本番環境での予期しない事態のリスクを最小化できます。

## エンドユーザーのIPアドレスを正確に報告するよう設定します - 技術的ベストプラクティス、かつこの項目へのリンクはすべてのデプロイ手順に含めます

ロードバランサーやCDNの背後にあるWallarmフィルタリングノードについては、エンドユーザーのIPアドレスを正確に報告するようノードを必ず設定してください（そうしないと、[IPリスト機能](user-guides/ip-lists/overview.md)、[Threat Replay Testing](detecting-vulnerabilities.md#threat-replay-testing)など一部の機能が動作しません）:

* [NGINXベースのWallarmノード向け手順](../admin-en/using-proxy-or-balancer-en.md)（AWS / GCPイメージおよびDockerノードコンテナを含みます）
* [Wallarm Kubernetes Ingress controllerとしてデプロイされたフィルタリングノード向け手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## フィルタリングノードの適切な監視を有効化します - 監視手順にも技術的ベストプラクティスにも反映します

Wallarmフィルタリングノードの適切な監視を有効化することを強く推奨します。フィルタリングノードの監視の設定方法は、デプロイ方式によって異なります:

* [Wallarm Kubernetes Ingress controllerとしてデプロイされたフィルタリングノード向け手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINXベースのDockerイメージ向け手順](../admin-en/installation-docker-en.md#monitoring-configuration)

## 適切な冗長化と自動フェイルオーバー機能を実装します

本番環境の他の重要なコンポーネントと同様に、Wallarmノードは適切な冗長化および自動フェイルオーバーのレベルを考慮して設計・デプロイ・運用してください。重要なエンドユーザーリクエストを処理する**アクティブなWallarmフィルタリングノードを少なくとも2台**用意する必要があります。以下の記事に関連情報があります:

* [NGINXベースのWallarmノード向け手順](../admin-en/configure-backup-en.md)（AWS / GCPイメージ、Dockerノードコンテナ、Kubernetesサイドカーを含みます）
* [Wallarm Kubernetes Ingress controllerとしてデプロイされたフィルタリングノード向け手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)