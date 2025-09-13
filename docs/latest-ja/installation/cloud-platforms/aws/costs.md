# AWSでNGINX Nodeをデプロイする際のコストガイダンス

本ページでは、AMIベースのEC2インスタンスやECSベースのDockerコンテナなどの方法でWallarm NGINX Nodeをデプロイする際に発生する、一般的なAWSインフラストラクチャコストの目安を説明します。

これらはAWSネイティブのコストのみであり、[Wallarmのサブスクリプション料金](../../../about-wallarm/subscription-plans/)は含まれません。

## AMIベースのデプロイメント（EC2インスタンス） {#ami-based-deployment-ec2-instance}

[NGINX Node AMI](ami.md)はVPC内のEC2インスタンスとして起動します。高可用性のため、Application Load Balancer（ALB）の背後に複数のEC2インスタンスを配置する場合があります。ストレージにはAmazon EBSを使用し、標準的なAWSのネットワーキングコンポーネント（VPC、サブネット、セキュリティグループ）も使用します。

主なコスト要素:

* EC2インスタンスの稼働時間: コストはインスタンスタイプ、リージョン、稼働時間に依存します。たとえば、`us-east`の`t3.medium`は約$0.0416/時（24時間365日稼働で月額約$30）です。冗長化のために複数のNGINX Nodeを使用する場合は、インスタンス数に応じて掛け合わせます。
* EBSストレージ: 一般用途SSD 50 GBの場合、通常約$5/月が加算されます。
* Elastic Load BalancerまたはApplication Load Balancer: 基本料金は約$16/月に加え、トラフィックに基づく使用料（LCU）が発生し、一般的な合計は約$22/月になります。[ALBの料金](https://aws.amazon.com/elasticloadbalancing/pricing/)はトラフィックの増加に伴い増加します。
* データ転送: EC2からインターネットへの送信トラフィックは月間最初の100 GBが無料で、超過分は約$0.09/GBで課金されます。AZ間トラフィック（例: 別AZのEC2へのALB→EC2）もこのレートで課金されます。同一AZ内のトラフィックは無料です。

リージョンとトラフィックに基づく正確な見積もりには、[AWS Pricing Calculator](https://calculator.aws/)をご使用ください。

**試算例:**

`us-east-1`で、ALBの背後に`t3.medium`のEC2インスタンス1台を24時間365日稼働させ、月間約1000万リクエストと送信トラフィック200 GBを処理する、典型的なAMIベースのデプロイメント:

* EC2インスタンス: 約$30/月
* EBSストレージ: 約$5/月（50 GB SSD）
* ALB: 約$22/月（基本+LCU使用量）
* データ転送: 約$9/月（最初の100 GBは無料）
* 概算合計: 約$60〜70/月 + [Wallarmのサブスクリプション料金](../../../about-wallarm/subscription-plans/)

## Amazon ECS（Dockerコンテナ）デプロイメント

[Amazon ECSを使用してAWSでWallarm（NGINX Node）をデプロイできます](docker-container.md)。EC2インスタンス上で実行することも、AWS Fargateを使用することもできます。

* EC2上のECS: EC2インスタンスを管理し、ECSがコンテナオーケストレーションを処理します。コストは[AMIベースのデプロイメント](#ami-based-deployment-ec2-instance)と同様で、EC2、EBS、任意のALB、データ転送が該当します。
* Fargate上のECS: 完全マネージドです。割り当てたvCPUとRAMに対して秒単位で課金されます。EC2インスタンスの管理は不要です。

AWSはECS自体に対しては課金せず、コンテナが実行されるリソースに対してのみ課金されます。

リージョンとトラフィックに基づく正確な見積もりには、[AWS Pricing Calculator](https://calculator.aws/)をご使用ください。

**試算例:**

`us-west-2`で、2タスク（各タスクは1 vCPU・2 GB RAM）、月間約1000万〜1500万リクエスト、送信トラフィック約200 GBの場合:

* Fargateのコンピュート: 約$72/月（2タスク×約$36）
* ALB: 約$20/月（基本+中程度のトラフィック）
* データ転送: 約$9/月（最初の100 GBは無料、次の100 GBは$0.09/GB）
* 概算合計: 約$101/月 + [Wallarmのサブスクリプション料金](../../../about-wallarm/subscription-plans/)

Wallarmのイメージ保管にAmazon ECRを使用することもできます（通常、コストはごくわずかです）。