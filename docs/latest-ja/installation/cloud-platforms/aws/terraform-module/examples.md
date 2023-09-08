# Wallarm Terraformモジュールの試用例

私たちは、さまざまな方法で[WallarmのTerraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用する例を用意しました。これにより、製品へのデプロイ前に試すことができます。

頻繁に利用されるデプロイ方法を表す4つの例を挙げます：

* プロキシソリューション
* 高度なプロキシソリューション
* ミラーソリューション
* AWS VPCトラフィックミラーリングのためのソリューション

## プロキシソリューション

[この例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)は、Terraformモジュールを使用してWallarmをAWSの仮想プライベートクラウド（VPC）へのインラインプロキシとしてデプロイする方法を示しています。

Wallarmのプロキシソリューションは、Next-Gen WAFとAPIセキュリティ機能を備えた高度なHTTPトラフィックルーターとして機能する、追加の機能ネットワーク層を提供します。これは、最も機能的で実装が容易なソリューションを提供するため、**推奨**のデプロイオプションです。

![Proxy scheme](../../../../images/waf-installation/aws/terraform/wallarm-as-proxy.png)

ソリューションの主要な特徴：

* Wallarmは、Wallarmの機能を制限せず、すぐに脅威の軽減を可能にする同期モードでトラフィックを処理します（`preset=proxy`）。
* Wallarmのソリューションは、他の層から独立して制御できるように、別のネットワーク層としてデプロイされます。この層はほぼ任意のネットワーク構造の位置に配置できます。推奨される位置は、インターネット向けロードバランサーの背後です。

[GitHubのデプロイのガイド参照例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)

[高度なプロキシソリューション](#proxy-advanced-solution)を試すことにより、ソリューションの柔軟性を確認できます。

## 高度なプロキシソリューション

[この例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)は、AWSのVPCに対して高度な設定でWallarmをインラインプロキシとしてデプロイする方法を示しています。これは、[単純なプロキシデプロイ](#proxy-solution)と非常に似ていますが、よく使われる高度な設定オプションが示されています。

Wallarmの高度なプロキシソリューション（単純なプロキシと同様に）は、Next-Gen WAFとAPIセキュリティ機能を提供する高度なHTTPトラフィックルーターとして機能する追加のネットワーク層を提供します。

[GitHubのデプロイのガイド参照例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)

## Amazon API Gatewayのためのプロキシソリューション

[この例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)は、[Amazon API Gateway](https://aws.amazon.com/api-gateway/)を保護するために、WallarmをAWSのVPCへのインラインプロキシとしてデプロイする方法を示しています。

Wallarmのプロキシソリューションは、Next-Gen WAFとAPIセキュリティを提供する追加の機能ネットワーク層を提供します。それは、Amazon API Gatewayを含むほぼ任意のサービスタイプへのリクエストをルーティングでき、その機能を制限しません。

[GitHubのデプロイのガイド参照例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)

## ミラーソリューション

[この例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/mirror)は、WallarmのTerraformモジュールをミラードトラフィックを分析する帯域外ソリューションとしてデプロイする方法を示しています。NGINX、Envoy、Istio、および/またはTraefikがすでにトラフィックミラーリングを提供していることが期待されます。

![Mirror scheme](../../../../images/waf-installation/aws/terraform/wallarm-for-mirrored-traffic.png)

ソリューションの主要な特徴：

* Wallarmはトラフィックを非同期モードで処理します（`preset=mirror`）。これにより、現在のトラフィックフローに影響を与えずに最も安全な方法で処理できます。
* Wallarmのソリューションは、他の層から独立して制御できるように、別のネットワーク層としてデプロイされます。この層はほぼ任意のネットワーク構造の位置に配置できます。推奨される位置はプライベートネットワーク内です。

[GitHubのデプロイのガイド参照例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/mirror)

## AWS VPCトラフィックミラーリングのためのソリューション

[この例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/vpc-mirror)は、[Amazon VPCによってミラーリングされたトラフィック](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html)を分析する帯域外ソリューションとしてWallarmのTerraformモジュールをデプロイする方法を示しています。

![Mirror scheme](../../../../images/waf-installation/aws/terraform/wallarm-for-traffic-mirrored-by-vpc.png)

ソリューションの主要な特徴：

* Wallarmはトラフィックを非同期モードで処理します（`preset=mirror`）。これにより、現在のトラフィックフローに影響を与えずに最も安全な方法で処理できます。
* Wallarmのソリューションは、他の層から独立して制御できるように、別のネットワーク層としてデプロイされます。この層はほぼ任意のネットワーク構造の位置に配置できます。推奨される位置はプライベートネットワーク内です。

[GitHubのデプロイのガイド参照例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/vpc-mirror)