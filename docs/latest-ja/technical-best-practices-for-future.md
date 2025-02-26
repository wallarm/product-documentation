# Wallarmソリューションの展開および保守に関するベストプラクティス

本記事ではWallarmソリューションの展開および保守に関するベストプラクティスを示します。

## 本番環境だけでなくテスト環境やステージング環境にもフィルタリングノードを展開する - 技術的ベストプラクティス

ほとんどのWallarmサービス契約では、顧客が展開するWallarmノードの数に制限がないため、開発、テスト、ステージングなどすべての環境にフィルタリングノードを展開しない理由はありません。

ソフトウェア開発やサービス運用のすべての段階でフィルタリングノードを展開および使用することにより、全体のデータフローを適切にテストし、重要な本番環境における予期せぬ事態のリスクを最小限に抑える可能性が高まります。

## エンドユーザーIPアドレスの正しい報告を設定する - 技術的ベストプラクティス、さらにこのリンクはすべての展開手順書に記載される必要があります

ロードバランサーやCDNの背後に配置されたWallarmフィルタリングノードの場合、フィルタリングノードがエンドユーザーIPアドレスを正しく報告するように設定することを確認してください（そうしないと[IP list functionality](user-guides/ip-lists/overview.md)、[Threat Replay Testing](detecting-vulnerabilities.md#threat-replay-testing)やその他の機能が動作しなくなります）:

* [NGINXベースのWallarmノードの手順](../admin-en/using-proxy-or-balancer-en.md)（AWS/GCPイメージおよびDockerノードコンテナを含む）
* [Wallarm Kubernetes Ingress controllerとして展開されたフィルタリングノードの手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## フィルタリングノードの適切な監視の有効化 - モニタリング手順書および技術的ベストプラクティスの両方に含める

Wallarmフィルタリングノードの適切な監視を有効化することを強く推奨します。

フィルタリングノードの監視設定方法は、その展開オプションに依存します:

* [Wallarm Kubernetes Ingress controllerとして展開されたフィルタリングノードの手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINXベースのDockerイメージの手順](../admin-en/installation-docker-en.md#monitoring-configuration)

## 適切な冗長性と自動フェイルオーバー機能の実装

本番環境のその他の重要なコンポーネントと同様に、Wallarmノードは適切な冗長性と自動フェイルオーバーを備えて設計、展開、運用すべきです。重要なエンドユーザーリクエストを処理するために、**少なくとも2つのアクティブなWallarmフィルタリングノード**を用意する必要があります。以下の記事には関連情報が記載されています:

* [NGINXベースのWallarmノードの手順](../admin-en/configure-backup-en.md)（AWS/GCPイメージ、Dockerノードコンテナ、Kubernetesサイドカーを含む）
* [Wallarm Kubernetes Ingress controllerとして展開されたフィルタリングノードの手順](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)