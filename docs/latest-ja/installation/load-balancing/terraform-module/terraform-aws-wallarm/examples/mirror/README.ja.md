# Wallarm OOBのNGINX、Envoy、および類似のミラーリングをTerraformモジュールを用いて展開する

本記事では、[Wallarm Terraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を用いて、AWS上にWallarmをOut-of-Bandソリューションとしてデプロイする**例**を説明します。以降、NGINX、Envoy、Istio、および/またはTraefikがトラフィックミラーリングを提供することが前提となります。

## 主要特長

* Wallarmは非同期モード（`preset=mirror`）を用いて現存のトラフィックフローに影響を与えることなくトラフィックを処理します。そのため、本手法は最も安全な手法であると考えられます。
* Wallarmソリューションは独立したネットワークレイヤーとして他のレイヤーからの制御を排除してデプロイすることができ、このレイヤーをほぼ任意のネットワーク構造位置に配置できます。推奨する位置はプライベートネットワークとなります。

## ソリューションのアーキテクチャ 

![Wallarm for mirrored traffic](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

本例のWallarmソリューションには以下のコンポーネントが含まれています：

* WallarmノードインスタンスへトラフィックをルーティングするInternet-facingロードバランサ。ロードバランサは既にデプロイしていることが前提となり、`wallarm`モジュールはこのリソースを生成しません。
* ロードバランサからトラフィックを取得し、HTTPリクエストを内部ALBエンドポイントおよびバックエンドサービスにミラーリングする任意のWebまたはプロキシサーバー（例：NGINX、Envoy）。トラフィックミラーリングに使用されるコンポーネントも既にデプロイしていることが前提となり、`wallarm`モジュールはこのリソースを生成しません。
* WebまたはプロキシサーバーからのミラーリングされたHTTPSリクエストを受信し、それらをWallarmノードインスタンスに転送する内部ALB。
* 内部ALBからのリクエストを分析し、悪意のあるトラフィックデータをWallarmクラウドに送信するWallarmノード。

この例では、説明したような動作を指導するモニタリングモードでWallarmノードを実行します。[モード](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)を異なる値に切り替えると、ノードは[OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations)アプローチが攻撃ブロックを許可しないため、トラフィックの監視を続けます。

最後の2つのコンポーネントは、提供された `wallarm`例モジュールによってデプロイされます。

## コードコンポーネント

以下のコードコンポーネントがこの例に含まれます：

* `main.tf`：ミラーソリューションとしてデプロイされる `wallarm`モジュールの主要な設定。この設定は、内部のAWS ALBとWallarmインスタンスを生成します。

## HTTPリクエストミラーリングの設定

トラフィックミラーリングは多くのWebおよびプロキシサーバーが提供する機能です。[リンク](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring)は、いくつかのサーバーでトラフィックミラーリングを設定する方法のドキュメンテーションを提供します。

## 制約条件

説明した例のソリューションが最も機能的なOut-of-Band Wallarmソリューションであるように、非同期アプローチにはいくつか制約があります：

* トラフィック解析が実際のトラフィックフローに関わりなく進行するため、Wallarmノードは即時に悪意のあるリクエストをブロックしません。
* このソリューションには追加のコンポーネントが必要であり、それはトラフィックミラーリングまたは類似のツールを提供するWebまたはプロキシサーバー（例：NGINX、Envoy、Istio、Traefik、カスタムKongモジュール等）です。

## 例のWallarmミラーソリューション実行

1. [EU Cloud](https://my.wallarm.com/nodes)または [US Cloud](https://us1.my.wallarm.com/nodes)でWallarmコンソールにサインアップします。
1. Wallarm Console→ **Nodes**を開き、**Wallarm node**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. 例のコードを含むリポジトリをマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリの `examples/mirror/variables.tf`ファイルで `default`オプションにある変数の値を設定し、変更を保存します。
1. `examples/mirror`ディレクトリから以下のコマンドを実行してスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイした環境を削除するには、以下のコマンドを使用します：

```
terraform destroy
```

## 参考資料

* [パブリックとプライベートのサブネットを持つAWS VPC（NAT）](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)