# Wallarm AWS Terraformモジュールのサンプルデプロイメント：AWS VPCトラフィックミラーリングソリューション

この例では、Wallarm Terraformモジュールを、[Amazon VPCによってミラーリングされたトラフィック](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html)を分析する帯域外ソリューションとしてデプロイする方法を説明します。

## 主要な特徴

* Wallarmは、現在のトラフィックフローに影響を与えずに非同期モード(`preset=mirror`)でトラフィックを処理するため、このアプローチは最も安全と言えます。
* Wallarmソリューションは独立したネットワークレイヤーとしてデプロイされ、それを他のレイヤーから独立して設定し、ほぼ任意のネットワーク構造位置にレイヤーを配置することができます。推奨される位置はプライベートネットワーク内です。

## ソリューションのアーキテクチャ

![Wallarm scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-traffic-mirrored-by-vpc.png?raw=true)

この例のWallarmソリューションには以下のコンポーネントが含まれています。

* トラフィックを受け入れてリクエストをインスタンスターゲットにルーティングするロードバランサー。ロードバランサーはすでにデプロイされていることが期待されており、`wallarm`モジュールはこのリソースを作成しません。
* ロードバランサーの負荷を処理するインスタンス。ロードバランサーはすでにデプロイされていることが期待されており、`wallarm`モジュールはこのリソースを作成しません。
* ロードバランサートラフィックまたはインスタンストラフィックのいずれかをミラーリングするように設定されたAmazon VPC（スキーム上の破線の矢印）。
* ミラーリングされたパケット用のNLBで、VXLANにカプセル化されたEthernetフレームとしてUDP/4789でミラーリングされたトラフィックを受け取ります。
* Auto Scaling Groupのインスタンス間でトラフィックを分配するトラフィックリビルダーで、VXLANカプセル化されたパケットの中からHTTPリクエストを検出します。提供された例では、このレイヤーをcloud-initスクリプト実行ステージでデプロイし、[goreplay](https://github.com/buger/goreplay)を使用してトラフィックからHTTPリクエストを取得します。
* 取得したHTTPリクエストをWallarmインスタンスに転送するALB。
* 内部ALBからのリクエストを分析し、任意のリクエストをさらにプロキシするWallarmノードインスタンス。

  この例では、説明された動作を制御する監視モードでWallarmノードを実行します。Wallarmノードは、悪意のあるリクエストをブロックし、合法的なものだけをさらに転送することを目指した他のモードでも動作することができます。Wallarmノードモードの詳細については、[当社のドキュメンテーション](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)をご覧ください。

## コードコンポーネント

この例には、以下のコードコンポーネントがあります。

* `main.tf`：AWS VPCミラーソリューションとしてデプロイされる`wallarm`モジュールのメイン設定。この設定はNLB、ALB、およびWallarmインスタンスを生成します。
* `./modules/vpc-mirror-sessions/*`：AWS VPCトラフィックミラーリング機能を設定する内部の例のモジュール。
* `./modules/vpc-mirror-rebuild/*`：ミラーリングされたトラフィックの中からHTTPリクエストを検出するAuto Scaling Groupを作成する内部の例のモジュール。
* `./enis/*`：異なるユースケースのENI設定の例。
* `interfaces.tf`：`vpc-mirror`モジュールに渡すためのENI IDを集めます。

## 制約

説明された例のソリューションには、AWS VPCトラフィックミラーリング機能に固有の制限がいくつかあります。

* トラフィックはElastic Network Interfaces（ENI）からのみミラーリングでき、すべてがこのオプションをサポートしているわけではありません。
* ELB ENIから直接ミラーリングされたトラフィックでなければならないため、ALB、NLBまたはEC2 Instanceのものからはミラーリングされません。
* EC2からのトラフィックのミラーリングは、ロードバランサーパケットのキャッチにつながる場合があります。
* リアルなIPアドレスは、ALB ＋ EC2スタックからのみ特定できます。
* プロキシプロトコル（例：ELB用のv1、NLB用のv2）は、EC2 ENIからのトラフィックのミラーリングであってもサポートされていません。
* EKSがデフォルトのCNI（AWS VPC CNI）に基づいている場合、ALB Ingressは、`"alb.ingress.kubernetes.io/target-type": "instance"`アノテーションが適用されているときのみ動作します。

## AWS VPCのための例のWallarmミラーソリューションの実行

1. [EU Cloud](https://my.wallarm.com/nodes)または[US Cloud](https://us1.my.wallarm.com/nodes)でWallarm Consoleにサインアップします。
2. Wallarm Console→ **Nodes**を開き、**Wallarm node**タイプのノードを作成します。
3. 生成されたノードトークンをコピーします。
4. 例のコードを含むリポジトリをマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
5. クローンしたリポジトリの`examples/vpc-mirror/variables.tf`ファイルで変数値を設定し、変更を保存します。
6. `examples/vpc-mirror/enis/*`ディレクトリで適切なEMIs設定を選択し、`examples/vpc-mirror/interfaces.tf`ファイルで選択した設定を指定します。
7. `examples/vpc-mirror`ディレクトリから次のコマンドを実行してスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイされた環境を削除するには、次のコマンドを使用します：

```
terraform destroy
```

## 参考リンク

* [Amazon VPC Traffic Mirroring](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html)
* [公開サブネットとプライベートサブネット(NAT)を持つAWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [Elastic network interfaces](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html)
* [Wallarmドキュメンテーション](https://docs.wallarm.com)