# Terraformモジュールを使用してAWS VPCミラーリングのためのWallarm OOBをデプロイする方法

この例では、[Amazon VPCによるトラフィックミラーリング](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html)を分析するための[Terraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用してWallarmをOut-of-Bandソリューションとしてデプロイする方法を説明します。

## 主な特性

* Wallarmは非同期モード（`preset=mirror`）でトラフィックを処理するため、現在のトラフィックフローに影響を与えず、これが最も安全なアプローチになります。
* Wallarmソリューションは独立したネットワークレイヤーとしてデプロイされ、それにより他のレイヤーから独立して設定が可能で、ほぼ任意のネットワーク構造位置に配置できます。推奨される位置はプライベートネットワーク内です。

## ソリューションのアーキテクチャ

![!OOB scheme for VPC mirroring](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-traffic-mirrored-by-vpc.png?raw=true)

この例のWallarmソリューションには以下のコンポーネントが含まれています：

* トラフィックを受け入れてリクエストをインスタンスターゲットにルーティングするロードバランサ。ロードバランサーがすでにデプロイされていることが想定され、`wallarm`モジュールはこのリソースを作成しません。
* ロードバランサをサービングするインスタンス。ロードバランサーがすでにデプロイされていることが想定され、`wallarm`モジュールはこのリソースを作成しません。
* スキーム上の破線の矢印のようにロードバランサのトラフィックまたはインスタンスのトラフィックのいずれかをミラーリングするように設定されたAmazon VPC。
* ミラーリングされたトラフィックをUDP/4789経由でEthernetフレームとしてVXLANにカプセル化された形式で受け取るミラーリングパケットのためのNLB。
* HTTPリクエストをVXLANにカプセル化されたパケットの中から検出するAuto Scaling Groupのインスタンスにトラフィックを分散するトラフィックリビルダー。提供された例では、このレイヤーをcloud-initスクリプト実行ステージでデプロイし、[goreplay](https://github.com/buger/goreplay)を使用してトラフィックからHTTPリクエストを取得します。
* 取得したHTTPリクエストをWallarmインスタンスに転送するALB。
* 内部のALBからのリクエストを分析し、悪意のあるトラフィックデータをWallarm Cloudに送信するWallarmノードインスタンス。

    この例では、Wallarmノードは説明された動作を駆動するための監視モードで実行されます。[モード](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)を別の値に切り替えた場合でも、ノードは引き続き[OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations)アプローチにより攻撃のブロックが許可されないため、トラフィックの監視のみを続けます。

## コードコンポーネント

この例には以下のコードコンポーネントがあります：

* `main.tf`：AWS VPCミラーソリューションとしてデプロイされる`wallarm`モジュールの主な設定。この設定は、NLB、ALB、およびWallarmインスタンスを生成します。
* `./modules/vpc-mirror-sessions/*`：AWS VPCトラフィックミラーリング機能を設定する内部の例のモジュール。
* `./modules/vpc-mirror-rebuild/*`：ミラーリングされたトラフィックの中からHTTPリクエストを検出するAuto Scaling Groupを作成する内部の例のモジュール。
* `./enis/*`：異なるユースケースのENI設定の例。
* `interfaces.tf`：`vpc-mirror`モジュールへのパスを行うためのENI IDを収集します。

## 制限事項

説明された例のソリューションには、AWS VPCトラフィックミラーリング機能固有のいくつかの制約があります：

* トラフィックは、すべてがこのオプションをサポートしているわけではないElastic Network Interfaces（ENI）からのみミラーリングできます。
* トラフィックはELB ENIから直接ミラーリングできますが、ALB、NLB、またはEC2インスタンスのものからはミラーリングできません。
* EC2からのトラフィックのミラーリングは、ロードバランサーパケットのキャッチを引き起こす可能性があります。
* 実際のIPアドレスは、ALB + EC2スタックからのみ明らかにすることができます。
* プロキシプロトコル（例：ELBのためのv1、NLBのためのv2）は、トラフィックがEC2 ENIからミラーリングされていてもサポートされていません。
* EKSがデフォルトのCNI（AWS VPC CNI）に基づいている場合、ALB Ingressは`"alb.ingress.kubernetes.io/target-type": "instance"`アノテーションが適用された状態でのみ機能します。

## AWS VPCのためのWallarmミラーソリューションの例の実行方法

1. [EU Cloud](https://my.wallarm.com/nodes)または[US Cloud](https://us1.my.wallarm.com/nodes)でWallarm Consoleにサインアップします。
1. Wallarm Console → **Nodes** を開き、**Wallarm node**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. サンプルコードを含むリポジトリをあなたのマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリの`examples/vpc-mirror/variables.tf`ファイルの変数値を設定し、変更を保存します。
1. `examples/vpc-mirror/enis/*`ディレクトリで適切なEMIs設定を選択し、`examples/vpc-mirror/interfaces.tf`ファイルで選択したものを指定します。
1. `examples/vpc-mirror`ディレクトリから次のコマンドを実行してスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイした環境を削除するには、次のコマンドを使用します：

```
terraform destroy
```

## 参考リンク

* [Amazon VPC Traffic Mirroring](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html)
* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [Elastic network interfaces](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html)
