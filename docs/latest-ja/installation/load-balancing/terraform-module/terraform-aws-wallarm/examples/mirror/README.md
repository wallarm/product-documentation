# Terraformモジュールを使用したWallarm OOBのNGINX、Envoy、および類似のミラーリングへのデプロイ

この記事では、[Wallarm Terraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用してAWSにWallarmをOut-of-Bandソリューションとしてデプロイする方法について**例**を示しています。NGINX、Envoy、Istio、および/またはTraefikがトラフィックミラーリングを提供していることが前提となっています。

## 主な特性

* Wallarmは非同期モード（`preset=mirror`）でトラフィックを処理しながら、現在のトラフィックフローに影響を与えず、これにより最も安全なアプローチとなります。
* Wallarmソリューションは、他のレイヤーから独立して制御できる別のネットワークレイヤーとしてデプロイされます。また、ほぼ任意のネットワーク構造位置にレイヤーを配置することができます。推奨位置はプライベートネットワーク内になります。

## ソリューションのアーキテクチャ

![ミラーリングされたトラフィック向けのWallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

このWallarmソリューションの例は以下のコンポーネントを含みます：

* Wallarmノードインスタンスにトラフィックをルーティングするインターネット対面型のロードバランサー。ロードバランサーが既にデプロイされていることが前提となります。`wallarm` モジュールはこのリソースを作成しません。
* ロードバランサーからのトラフィックを提供し、HTTPリクエストを内部のALBエンドポイントとバックエンドサービスにミラーリングする任意のWebサーバーやプロキシサーバー（例：NGINX、Envoy）。既にトラフィックミラーリングを行うコンポーネントがデプロイされていることが前提となります。`wallarm` モジュールはこのリソースを作成しません。
* WebサーバーまたはプロキシサーバーからのミラーリングされたHTTPSリクエストを受け付け、それらをWallarmノードインスタンスに転送する内部のALB。
* 内部のALBからのリクエストを分析し、悪意のあるトラフィックデータをWallarmクラウドに送信するWallarmノード。

    この例では、Wallarmノードは記述された動作を引き起こす監視モードで動作します。[モード](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)を他の値に切り替えても、ノードは[OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations)アプローチが攻撃ブロックを許可しないため、トラフィックを監視し続けます。

最後の2つのコンポーネントは、提供された`wallarm`例モジュールによってデプロイされます。

## コードコンポーネント

この例には以下のコードコンポーネントがあります：

* `main.tf`：ミラーソリューションとしてデプロイされるべき`wallarm`モジュールのメイン設定。この設定は内部のAWS ALBとWallarmインスタンスを生成します。

## HTTPリクエストミラーリングの設定

トラフィックミラーリングは、多くのWebサーバーとプロキシサーバーが提供する機能です。[リンク](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring)は、それらの一部でトラフィックミラーリングを設定する方法についてのドキュメンテーションを提供します。

## 制限事項

説明された例ソリューションが最も機能的なOut-of-Band Wallarmソリューションであるにもかかわらず、非同期アプローチ固有のいくつかの制限があります：

* Wallarmノードは、トラフィック分析が実際のトラフィックフローに影響を受けずに進行するため、悪意のあるリクエストを即座にブロックしません。
* このソリューションは、追加のコンポーネント（トラフィックミラーリングまたは同様のツール（例：NGINX、Envoy、Istio、Traefik、カスタムKongモジュールなど）を提供するWebサーバーまたはプロキシサーバー）を必要とします。

## Wallarmミラーソリューションの例の実行

1. [EUクラウド](https://my.wallarm.com/nodes)または[USクラウド](https://us1.my.wallarm.com/nodes)のWallarmコンソールにサインアップします。
1. Wallarmコンソール→**ノード**を開き、**Wallarmノード**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. 例のコードが含まれているリポジトリをマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリの `examples/mirror/variables.tf` ファイルの `default` オプションで変数の値を設定し、変更を保存します。
1. `examples/mirror` ディレクトリから次のコマンドを実行してスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイされた環境を削除するには、次のコマンドを使用します：

```
terraform destroy
```

## 参考資料

* [パブリックおよびプライベートサブネット（NAT）を持つAWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)