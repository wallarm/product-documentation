サポートされている[Wallarmのデプロイオプション][platform]の中では、次の**ユースケース**におけるWallarmのデプロイにNGINXベースのDockerイメージを推奨します:

* 組織でDockerベースのインフラストラクチャを利用している場合、WallarmのDockerイメージが最適です。AWS ECS、Alibaba ECS、その他の類似サービス上で稼働するマイクロサービスアーキテクチャを採用している場合でも、既存のセットアップに容易に統合できます。このソリューションは、Dockerコンテナで管理を簡素化したい仮想マシンを使用している場合にも適用できます。
* 各コンテナに対するきめ細かな制御が必要な場合、このDockerイメージが特に有効です。従来のVMベースのデプロイで一般的に可能なレベルよりも高いリソース分離を提供します。

一般的なパブリッククラウドのコンテナオーケストレーションサービス上でWallarmのNGINXベースのDockerイメージを実行する方法の詳細については、次のガイドを参照してください: [AWS ECS][aws-ecs-docs], [GCP GCE][gcp-gce-docs], [Azure Container Instances][azure-container-docs], [Alibaba ECS][alibaba-ecs-docs].