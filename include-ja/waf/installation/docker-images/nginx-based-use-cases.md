Among all supported [Wallarm展開オプション][platform]の中でNGINXベースのDockerイメージは、以下の**ユースケース**におけるWallarm展開に推奨されています:

* 組織がDockerベースのインフラストラクチャを利用している場合、Wallarm Dockerイメージは最適な選択肢です。AWS ECS、Alibaba ECS、またはその他の同様のサービスで実行されるマイクロサービスアーキテクチャを採用している場合でも、既存のセットアップに容易に統合できます。このソリューションは、Dockerコンテナによるより簡素化された管理を求める仮想マシン利用者にも適用されます。
* 各コンテナに対して詳細な制御が必要な場合、Dockerイメージは優れた機能を発揮します。従来のVMベースの展開では通常実現が難しい、より高いレベルのリソース分離を提供します。

WallarmのNGINXベースのDockerイメージを主要なパブリッククラウドのコンテナオーケストレーションサービスで実行する方法の詳細については、以下のガイドをご参照ください:[AWS ECS][aws-ecs-docs]、[GCP GCE][gcp-gce-docs]、[Azure Container Instances][azure-container-docs]、[Alibaba ECS][alibaba-ecs-docs].