# Wallarm AWS Terraformモジュールのサンプルデプロイメント：プロキシ高度なソリューション

この例では、Terraformモジュールを使用して既存のAWS Virtual Private Cloud（VPC）に高度な設定でインラインプロキシとしてWallarmをデプロイする方法を説明します。[シンプルプロキシデプロイメント](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)に似ていますが、よく利用される高度な設定オプションが示されています。

この例から簡単に開始するためには、最初に[シンプルプロキシ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)を参照してください。

Wallarmプロキシ高度なソリューション（およびシンプルプロキシ）は、WAFおよびAPIセキュリティ機能を持つ高度なHTTPトラフィックルーターとして機能する追加のネットワーク層を提供します。

## 主な特性

プロキシ高度なソリューションは、シンプルなソリューションと以下のように異なります：

* このソリューションはロードバランサー（`lb_enabled = false`）を作成しませんが、既存のロードバランサーに追加で接続できるターゲットグループは作成します。

    これにより、同期的なトラフィック処理アプローチにシームレスに切り替えることができます。
* NGINXおよびWallarmの設定は、標準変数だけでなく`global_snippet`、`http_snippet`、`server_snippet`のNGINXスニペットでも指定されます。
* Wallarmノード初期化スクリプト（cloud-init）が終了すると、カスタムの`post-cloud-init.sh`スクリプトが`/var/www/mysite/index.html`インスタンスディレクトリにカスタムHTMLインデックスページを配置します。
* デプロイされたスタックは、AWS S3への読み取り専用アクセスを可能にする追加のAWS IAMポリシーと関連付けられています。

    この例を「そのまま」使用する場合、提供されるアクセスは必要ありません。それにもかかわらず、`post-cloud-init.sh`ファイルにはAWS S3からファイルを要求する通常特別アクセスが必要な非アクティブの例が含まれています。`post-cloud-init.sh`ファイルからS3コードをアクティブにする場合、`extra_policies`変数でAWS S3アクセスIAMポリシーを指定する必要があります。
* このソリューションは、追加の内部ネットワークポート、7777からWallarmインスタンスへのインバウンド接続を許可します。これは`extra_ports`変数と`http_snippet.conf`で設定されます。

    ポート7777を`0.0.0.0/0`に許可するには、`extra_public_ports`変数を追加で使用できます（オプション）。
* Wallarmノードはブロッキングモードでトラフィックを処理します。

## ソリューションのアーキテクチャ 

![Wallarmプロキシスキーム](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

例示するWallarmプロキシ高度なソリューションには以下のコンポーネントがあります：

* ロードバランサーのないAuto Scalingグループにアタッチされたターゲットグループ。
* トラフィックを分析し、悪意のあるリクエストをブロックし、正当なリクエストをさらにプロキシするWallarmノードインスタンス。

    この例では、記述された動作を駆動するブロッキングモードでWallarmノードを実行します。Wallarmノードは、悪意のあるリクエストのブロックなしにトラフィックのみを監視することを目的とした他のモードでも操作できます。Wallarmノードモードの詳細については、[こちらのドキュメンテーション](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) をご確認ください。
* Wallarmノードはトラフィックを`https://httpbin.org`にプロキシします。

    この例の起動中に、AWS Virtual Private Cloud（VPC）から利用可能な他のサービスドメインまたはパスにトラフィックをプロキシするための任意のものを指定できます。

すべてのリストされたコンポーネント（プロキシされたサーバーを除く）は提供された`wallarm`例モジュールによってデプロイされます。

## コードのコンポーネント

この例には以下のコードコンポーネントがあります：

* `main.tf`：プロキシ高度なソリューションとしてデプロイされる`wallarm`モジュールのメイン設定。
* `global_snippet.conf`：`global_snippet`変数を使用してNGINXのグローバル設定に追加されるカスタムNGINX設定の例。マウントされた設定は、`load_module`、`stream`、`mail`、または`env`のようなディレクティブを含めることができます。
* `http_snippet.conf`：`http_snippet`変数を使用して`http` NGINXコンテキストに追加されるカスタムNGINXの設定。マウントされた設定は、`map`または`server`のようなディレクティブを含めることができます。
* `server_snippet.conf`：`server_snippet`変数を使用して`server` NGINXコンテキストに追加されるカスタムNGINXの設定。マウントされた設定は、必要な`location`設定と`if`のNGINXロジックを導入することができます。

    このスニペット設定はポート80にのみ適用されます。別のポートを開くには、`http_snippet`で対応する`server`ディレクティブを指定します。

    `server_snippet.conf`ファイルには、より複雑な設定例も見つけることができます。
* `post-cloud-init.sh`：カスタムHTMLインデックスページを`/var/www/mysite/index.html`インスタンスディレクトリに配置するカスタムスクリプト。このスクリプトは、Wallarmノードの初期化（cloud-initスクリプト）後に実行されます。

    `post-cloud-init.sh`ファイルには、インスタンスディレクトリにAWS S3のコンテンツを配置するための例のコマンドもあります。このオプションを使用する場合、`extra_policies`変数でS3アクセスポリシーを指定することを忘れないでください。

## サンプルWallarm AWSプロキシソリューションの実行

1. [EUクラウド](https://my.wallarm.com/nodes)または[USクラウド](https://us1.my.wallarm.com/nodes)でWallarmコンソールに登録します。
1. Wallarmコンソール→**ノード**を開き、**Wallarmノード**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. 例のコードが含まれるリポジトリをマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリの`examples/advanced/variables.tf`ファイルの`default`オプションで変数値を設定し、変更を保存します。
1. `examples/advanced/main.tf`→`proxy_pass`でプロキシされるサーバーのプロトコルとアドレスを設定します。

    デフォルトでは、Wallarmはトラフィックを`https://httpbin.org`にプロキシします。デフォルト値がニーズを満たす場合は、そのままにしてください。
1. 次のコマンドを実行することで、`examples/advanced`ディレクトリからスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイされた環境を削除するには、次のコマンドを使用します：

```
terraform destroy
```

## 参考資料

* [Auto ScalingグループにAWSロードバランサーをアタッチする](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)
* [パブリックサブネットとプライベートサブネット（NAT）のあるAWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [Wallarmのドキュメンテーション](https://docs.wallarm.com)