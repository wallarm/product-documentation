# Wallarm AWS Terraformモジュールのデプロイメント例：AWS VPCトラフィックミラーリングソリューション

この例は、Out-of-BandソリューションとしてWallarm Terraformモジュールをデプロイし、[Amazon VPCによってミラーリングされたトラフィック](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html)を分析する方法を示しています。

## 主な特徴

* Wallarmは非同期モードでトラフィックを処理します（`preset=mirror`）。これにより、現在のトラフィックフローに影響を与えることなく、最も安全なアプローチを実現します。
* Wallarmソリューションは、独立したネットワークレイヤとしてデプロイされ、他のレイヤとは独立して構成できます。これにより、ほぼ任意のネットワーク構造の位置にレイヤを配置することが可能になります。推奨する位置はプライベートネットワーク内です。

## ソリューションのアーキテクチャ

![Wallarm scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-traffic-mirrored-by-vpc.png?raw=true)

この例のWallarmソリューションには次のコンポーネントが含まれています：

* トラフィックを受け入れてインスタンスターゲットにリクエストをルーティングするロードバランサー。ロードバランサーがすでにデプロイされていることが期待されており、`wallarm`モジュールはこのリソースを作成しません。
* ロードバランサーをサポートするインスタンス。ロードバランサーがすでにデプロイされていることが期待されており、`wallarm`モジュールはこのリソースを作成しません。
* Amazon VPCは、ロードバランサーのトラフィックまたはインスタンスのトラフィック（スキーマ上の破線矢印）をミラーリングするように設定されています。
* ミラーリングされたパケットのためのNLBは、VXLANにカプセル化されたEthernetフレームとしてUDP/4789経由でミラーリングされたトラフィックを受け取ります。
* トラフィックリビルダーは、VXLANにカプセル化されたパケットの中からHTTPリクエストを検出するAuto Scaling Groupインスタンス間でトラフィックを分散します。提供された例は、このレイヤをcloud-initスクリプト実行段階でデプロイし、[goreplay](https://github.com/buger/goreplay)を使用してトラフィックからHTTPリクエストを取り出します。
* ALBは、取得したHTTPリクエストをWallarmインスタンスに転送します。
* Wallarmノードインスタンスは内部ALBからのリクエストを解析し、任意のリクエストをさらにプロキシします。

    この例では、Wallarmノードは、説明された動作を制御するモニタリングモードで動作します。Wallarmノードは、悪意のあるリクエストをブロックして正当なものだけをさらに転送することを目指した他のモードで動作することもできます。Wallarmノードのモードについて詳しくは[当社のドキュメンテーション](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)をご覧ください。

## コードコンポーネント

この例には、以下のコードコンポーネントが含まれています：

* `main.tf`：AWS VPCミラーソリューションとしてデプロイされる`wallarm`モジュールの主な設定。この設定では、NLB、ALB、およびWallarmインスタンスが作成されます。
* `./modules/vpc-mirror-sessions/*`：AWS VPCトラフィックミラーリング機能を設定する内部例のモジュール。
* `./modules/vpc-mirror-rebuild/*`：ミラーリングされたトラフィックの間でHTTPリクエストを検出するAuto Scaling Groupを作成する内部例のモジュール。
* `./enis/*`：異なるユースケースのためのENI配置の例。
* `interfaces.tf`：`vpc-mirror`モジュールに渡すためのENI IDを収集します。

## 制限事項

以下のように、AWS VPCトラフィックミラーリング機能に固有の制限事項が含まれています：

* トラフィックは、すべてがこのオプションをサポートしていない可能性のあるElastic Network Interfaces（ENI）からのみミラーリングできます。
* トラフィックは、ALB、NLB、またはEC2インスタンスからではなく、ELB ENIから直接ミラーリングできます。
* EC2からのトラフィックのミラーリングは、ロードバランサーパケットがキャッチされる可能性があります。
* 実際のIPアドレスは、ALB + EC2スタックからのみ明らかにできます。
* Proxyプロトコル（例：ELB用のv1、NLB用のv2）は、EC2 ENIからのトラフィックがミラーリングされていてもサポートされません。
* EKSがデフォルトのCNI（AWS VPC CNI）に基づいている場合、ALB Ingressは「"alb.ingress.kubernetes.io/target-type": "instance"」注釈が適用されている場合にのみ動作します。

## AWS VPC用の例のWallarmミラーソリューションの実行

1. [EUクラウド](https://my.wallarm.com/nodes)または[USクラウド](https://us1.my.wallarm.com/nodes)でWallarm Consoleにサインアップします。
1. Wallarm Consoleを開き、**Nodes**で**Wallarm node**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. 例のコードが含まれるリポジトリをお使いのマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. 保存したクローンリポジトリの`examples/vpc-mirror/variables.tf`ファイルで変数の値を設定し、変更を保存します。
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
* [Wallarm documentation](https://docs.wallarm.com)