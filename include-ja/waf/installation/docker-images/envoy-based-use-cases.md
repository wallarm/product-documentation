Among all supported [Wallarm deployment options][supported-deployments], Envoy-based Docker image is recommended for Wallarm deployment in these **use cases**:
  
すべてのサポートされる[Wallarmの展開オプション][supported-deployments]の中で、EnvoyベースのDockerイメージは、以下の**ユースケース**でのWallarm展開に推奨されます:
  
* もし組織でDockerベースのインフラストラクチャを使用している場合、Wallarm Dockerイメージは理想的な選択です。AWS ECS、Alibaba ECS、または同様のサービス上で稼働するマイクロサービスアーキテクチャを採用している場合でも、既存のセットアップにスムーズに統合されます。このソリューションは、Dockerコンテナを通じたよりシンプルな管理を目指す仮想マシン利用者にも該当します。
* 各コンテナに対するより詳細な制御が必要な場合、Dockerイメージが優れています。従来のVMベースの展開で通常可能なよりも高いレベルのリソース分離を実現します。