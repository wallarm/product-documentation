# Wallarmソリューションの展開とメンテナンスのベストプラクティス

この記事では、Wallarmソリューションの展開とメンテナンスに関するベストプラクティスを定式化します。

## 本番環境だけでなく、テスト環境やステージング環境にもフィルタリングノードを展開する - 技術的なベストプラクティス

Wallarmサービス契約の大部分は、顧客によるWallarmノードの展開数を制限していないため、開発、テスト、ステージングなど、すべての環境にフィルタリングノードを展開する理由はありません。

ソフトウェア開発および/またはサービス運用活動のすべての段階でフィルタリングノードを展開および使用することにより、データフロー全体を適切にテストし、重要な本番環境での予期しない状況のリスクを最小限に抑える可能性を高めることができます。

## エンドユーザーのIPアドレスの適切な報告を設定する - 技術的なベストプラクティス、これに関するリンクはデプロイの各指示に含まれるべきです

ロードバランサーやCDNの後ろに位置するWallarmフィルタリングノードの場合、[IPリスト機能](user-guides/ip-lists/overview.md)、[アクティブな脅威の検証](detecting-vulnerabilities.md#active-threat-verification)、およびその他のいくつかの機能が機能しないため、フィルタリングノードがエンドユーザーのIPアドレスを適切に報告するように設定してください：

* [NGINXベースのWallarmノード用の指示](../admin-en/using-proxy-or-balancer-en.md)（AWS / GCPイメージおよびDockerノードコンテナを含む）
* [Wallarm Kubernetes Ingressコントローラとして展開されたフィルタリングノード用の指示](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## フィルタリングノードの適切なモニタリングを有効にする - モニタリングに関する指示と技術的なベストプラクティスの両方に移動する

Wallarmフィルタリングノードの適切なモニタリングを有効にすることを強くお勧めします。すべてのWallarmフィルタリングノードにインストールされた`collectd`サービスは、[リンク](../admin-en/monitoring/available-metrics.md)内でリストされているメトリクスを収集します。

フィルタリングノードのモニタリングの設定方法は、その展開オプションによって異なります：

* [NGINXベースのWallarmノード用の指示](../admin-en/monitoring/intro.md)（AWS / GCPイメージおよびKubernetesサイドカーを含む）
* [Wallarm Kubernetes Ingressコントローラとして展開されたフィルタリングノード用の指示](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [NGINXベースのDockerイメージ用の指示](../admin-en/installation-docker-en.md#monitoring-configuration)

## 適切な冗長性と自動フェイルオーバー機能を実装する

他のすべての重要な本番環境のコンポーネントと同様に、Wallarmノードは、適切なレベルの冗長性と自動フェイルオーバーを持つように設計、展開、運用されるべきです。重要なエンドユーザーリクエストを処理する**少なくとも2つのアクティブなWallarmフィルタリングノード**を持つべきです。以下の記事は、このトピックに関する関連情報を提供します：

* [NGINXベースのWallarmノード用の指示](../admin-en/configure-backup-en.md)（AWS / GCPイメージ、Dockerノードコンテナ、およびKubernetesサイドカーを含む）
* [Wallarm Kubernetes Ingressコントローラとして展開されたフィルタリングノード用の指示](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)