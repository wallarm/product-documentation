# Terraformモジュールを使用してAWS VPCミラーリング向けのWallarm OOBをデプロイする

この例は、[Amazon VPCによってミラーリングされたトラフィック](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html)を分析するための[Terraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用して、WallarmをOut-of-Bandソリューションとしてデプロイする方法を示しています。

## 主な特性

* Wallarmは現在のトラフィックフローに影響を与えずに(`preset=mirror`)非同期モードでトラフィックを処理します。これにより、このアプローチが最も安全であると言えます。
* Wallarmソリューションは独立したネットワークレイヤーとしてデプロイされるため、他のレイヤーから独立して構成することができます。このレイヤーはほぼ任意のネットワーク構造の位置に配置することができます。推奨される位置はプライベートネットワーク内です。

## ソリューションの構造

![!OOB scheme for VPC mirroring](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-traffic-mirrored-by-vpc.png?raw=true)

この例のWallarmソリューションには以下のコンポーネントがあります：

* トラフィックを受け付け、リクエストをインスタンスターゲットにルーティングするロードバランサー。ロードバランサーはすでにデプロイされていることが前提であり、`wallarm` モジュールはこのリソースを作成しません。
* ロードバランサーの負荷をサービングするインスタンス。ロードバランサーはすでにデプロイされていることが前提であり、`wallarm` モジュールはこのリソースを作成しません。
* Amazon VPCは、ロードバランサーのトラフィックまたはインスタンスのトラフィックをミラーリングするように設定されています（スキームの破線矢印）。
* ミラーリングされたパケット用のNLBは、VXLANにカプセル化されたEthernetフレームとしてUDP/4789経由でミラーリングされたトラフィックを受け取ります。
* トラフィックリビルダーはVXLANにカプセル化されたパケットの中からHTTPリクエストを検出するAuto Scaling Groupインスタンスにトラフィックを配布します。提供される例では、このレイヤーはcloud-initスクリプトの実行ステージでデプロイされ、トラフィックからHTTPリクエストを取得するために[goreplay](https://github.com/buger/goreplay)を使用します。
* ALBは取得したHTTPリクエストをWallarmインスタンスに転送します。
* Wallarmノードインスタンスは内部ALBからのリクエストを分析し、悪意のあるトラフィックデータをWallarm Cloudに送信します。

    この例では、Wallarmノードはモニタリングモードで動作し、上記の動作を駆動します。[モード](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)を他の値に切り替えると、ノードは攻撃ブロッキングを許可しない[OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations)アプローチと同じように、トラフィックの監視のみを続けます。

## コードコンポーネント

この例には以下のコードコンポーネントがあります：

* `main.tf`: `wallarm` モジュールの主設定をAWS VPCミラーソリューションとしてデプロイするためのもの。この設定を使用して、NLB、ALB、およびWallarmインスタンスが生成されます。
* `./modules/vpc-mirror-sessions/*`: AWS VPCトラフィックミラーリング機能を設定する内部例のモジュール。
* `./modules/vpc-mirror-rebuild/*`: ミラーリングされたトラフィックの中からHTTPリクエストを検出するAuto Scaling Groupを作成する内部例のモジュール。
* `./enis/*`: 異なる使用例のENI設定の例。
* `interfaces.tf`: `vpc-mirror`モジュールへの渡しのためのENI IDを収集します。

## 制約点

説明された例のソリューションには、AWS VPCトラフィックミラーリング機能の固有の制約がいくつかあります：

* トラフィックはElastic Network Interfaces（ENI）からのみミラーリングでき、すべてがこのオプションをサポートしているわけではありません。
* トラフィックはELB ENIから直接ミラーリングできるだけで、ALB、NLB、またはEC2インスタンスからはできません。
* EC2からのトラフィックのミラーリングはロードバランサーパケットがキャッチされる可能性があります。
* 実際のIPアドレスはALB + EC2スタックからのみ明らかにすることができます。
* プロキシプロトコル（たとえば、ELBのv1、NLBのv2）は、トラフィックがEC2 ENIからミラーリングされていてもサポートされていません。
* EKSがデフォルトのCNI（AWS VPC CNI）に基づいている場合、ALB Ingressは`"alb.ingress.kubernetes.io/target-type": "instance"` アノテーションが適用されている場合にのみ動作します。

## AWS VPC向けの例のWallarmミラーソリューションの実行

1. [EUクラウド](https://my.wallarm.com/nodes)または[USクラウド](https://us1.my.wallarm.com/nodes)でWallarmコンソールにサインアップします。
1. Wallarm Console → **ノード**を開いて**Wallarmノード**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. サンプルコードが含まれるリポジトリをマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリの`examples/vpc-mirror/variables.tf` ファイルに変数の値を設定し、変更を保存します。
1. `examples/vpc-mirror/enis/*` ディレクトリで適切なEMI設定を選択し、`examples/vpc-mirror/interfaces.tf` ファイルで選択したものを指定します。
1. `examples/vpc-mirror` ディレクトリから次のコマンドを実行してスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイされた環境を削除するには、次のコマンドを使用します：

```
terraform destroy
```

## 参考リンク

* [Amazon VPC トラフィックミラーリング](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html)
* [公開およびプライベートのサブネット（NAT）を使用したAWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [Elasticネットワークインタフェース](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html)