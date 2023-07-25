# Wallarm Terraformモジュールの例を試す

異なる方法で[Wallarm Terraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用する例を用意しましたので、本番環境にデプロイする前に試すことができます。

よくあるデプロイメントアプローチを示す4つの例があります。

* プロキシソリューション
* プロキシアドバンストソリューション
* ミラーソリューション
* AWS VPCトラフィックミラーリング用ソリューション

## プロキシソリューション

[この例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)は、Terraformモジュールを使用して、WallarmをAWS Virtual Private Cloud (VPC)にインラインプロキシとしてデプロイする方法を示しています。

Wallarmプロキシソリューションは、次世代WAFおよびAPIセキュリティ機能を備えた高度なHTTPトラフィックルーターとして機能する追加のネットワーク層を提供します。これは、最も機能的で簡単に実装できるソリューションであるため、**推奨**されるデプロイメントオプションです。

![!プロキシ構成図](../../../../images/waf-installation/aws/terraform/wallarm-as-proxy.png)

ソリューションの主な特徴:

* Wallarmは、Wallarmの機能を制限しない同期モードでトラフィックを処理し、瞬時に脅威の軽減を可能にします(`preset=proxy`)。
* Wallarmソリューションは、他の層から独立して制御できる別のネットワーク層としてデプロイされ、ほぼすべてのネットワーク構造位置にレイヤーを配置できます。推奨される位置は、インターネットへのロードバランサーの後ろです。

[GitHubでの例のデプロイメントガイドを参照](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)

ソリューションの柔軟性を実際に試したい場合は、[プロキシアドバンストソリューション](#proxy-advanced-solution)を試してください。

## プロキシアドバンストソリューション

[この例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)は、Terraformモジュールを使用して、WallarmをAWS Virtual Private Cloud (VPC)にインラインプロキシとして高度な設定でデプロイする方法を示しています。これは[シンプルなプロキシデプロイメント](#proxy-solution)によく似ていますが、一部のよくある高度な構成オプションが示されています。

Wallarmプロキシアドバンストソリューション（シンプルなプロキシと同様）は、次世代WAFおよびAPIセキュリティ機能を備えた高度なHTTPトラフィックルーターとして機能する追加のネットワーク層を提供します。

[GitHubでの例のデプロイメントガイドを参照](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)

## Amazon API Gateway用プロキシソリューション

[この例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)は、Terraformモジュールを使用して、[Amazon API Gateway](https://aws.amazon.com/api-gateway/)を保護するためにWallarmをAWS Virtual Private Cloud (VPC)にインラインプロキシとしてデプロイする方法を示しています。

Wallarmプロキシソリューションは、次世代WAFおよびAPIセキュリティ機能を備えた高度なHTTPトラフィックルーターとして機能する追加のネットワーク層を提供します。これにより、Amazon API Gatewayをはじめとするほぼすべてのサービスタイプに対してリクエストをルーティングでき、その機能を制限することはありません。

[GitHubでの例のデプロイメントガイドを参照](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)

## ミラーソリューション

[この例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/mirror)は、ミラーリングされたトラフィックを分析するOutOfBandソリューションとしてWallarm Terraformモジュールをデプロイする方法を示しています。NGINX、Envoy、Istioおよび/またはTraefikウェブサーバーが既にトラフィックミラーリングを提供していることが想定されています。

![!ミラー構成図](../../../../images/waf-installation/aws/terraform/wallarm-for-mirrored-traffic.png)

ソリューションの主な特徴:

* Wallarmは、現在のトラフィックフローに影響を与えず、非同期モードでトラフィックを処理します(`preset=mirror`)。これにより、このアプローチが最も安全であることが保証されます。
* Wallarmソリューションは、他の層から独立して制御できる別のネットワーク層としてデプロイされ、ほぼすべてのネットワーク構造位置にレイヤーを配置できます。推奨される位置は、プライベートネットワーク内です。

[GitHubでの例のデプロイメントガイドを参照](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/mirror)

## AWS VPCトラフィックミラーリング用ソリューション

[この例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/vpc-mirror)は、[Amazon VPCによってミラーリングされたトラフィック](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html)を分析するOutOfBandソリューションとしてWallarm Terraformモジュールをデプロイする方法を示しています。

![!ミラー構成図](../../../../images/waf-installation/aws/terraform/wallarm-for-traffic-mirrored-by-vpc.png)

ソリューションの主な特徴:

* Wallarmは、現在のトラフィックフローに影響を与えず、非同期モードでトラフィックを処理します(`preset=mirror`)。これにより、このアプローチが最も安全であることが保証されます。
* Wallarmソリューションは、他の層から独立して制御できる別のネットワーク層としてデプロイされ、ほぼすべてのネットワーク構造位置にレイヤーを配置できます。推奨される位置は、プライベートネットワーク内です。

[GitHubでの例のデプロイメントガイドを参照](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/vpc-mirror)