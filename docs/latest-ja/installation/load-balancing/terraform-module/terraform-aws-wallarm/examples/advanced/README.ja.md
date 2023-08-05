# Wallarm AWS Terraform モジュールのデプロイ例：プロキシ高度ソリューション

この例では、Wallarmを高度な設定を備えたインラインプロキシとして、既存のAWSバーチャルプライベートクラウド（VPC）にTerraformモジュールを使用してデプロイする方法を説明します。[シンプルなプロキシデプロイメント](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)と似ていますが、頻繁に使用される高度な設定オプションの一部を示しています。

この例をすぐに始めるのが難しい場合は、まず[シンプルなプロキシ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)をご覧ください。

Wallarmプロキシ高度ソリューション（シンプルなプロキシも同様）は、WAFとAPIセキュリティ機能を備えた高度なHTTPトラフィックルータとしての機能をネットワークレイヤに追加します。

## 主な特性

プロキシ高度ソリューションは以下のような特性でシンプルなプロキシと異なります：

* このソリューションではロードバランサー（`lb_enabled=false`）を作成しませんが、既存のロードバランサーにアタッチ可能なターゲットグループは作成されます。

    これにより、トラフィック処理の同期的なアプローチにシームレスに切り替えることが可能になります。
* NGINXとWallarmの設定は標準の変数だけでなく、`global_snippet`、`http_snippet`、`server_snippet`というNGINXスニペットでも指定できます。
* Wallarmノード初期化スクリプト（cloud-init）が完了すると、カスタムの`post-cloud-init.sh`スクリプトがカスタムHTMLインデックスページを`/var/www/mysite/index.html`インスタンスディレクトリに配置します。
* デプロイされたスタックには、AWS S3への読み取り専用アクセスを可能にする追加のAWS IAMポリシーが関連付けられています。

    この例を"そのまま"使用する場合、S3への読み取り専用アクセスは必要ありません。しかし、`post-cloud-init.sh`ファイルには通常、AWS S3からのファイルリクエストの非アクティブ化された例が含まれています。これらの特別なアクセスが必要となります。 `post-cloud-init.sh`ファイルからS3コードをアクティブにしようとする場合は、`extra_policies`変数でAWS S3アクセスIAMポリシーを指定する必要があります。
* このソリューションでは、追加の内部ネットワークポート7777からWallarmインスタンスへのインバウンド接続が可能です。これは、`extra_ports`変数と`http_snippet.conf`で設定されます。

    ポート7777を`0.0.0.0/0`に許可するには、追加の`extra_public_ports`変数を使用できます（オプション）。
* Wallarmノードは、ブロッキングモードでトラフィックを処理します。

## ソリューションのアーキテクチャ

![Wallarmプロキシスキーム](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Wallarmプロキシ高度ソリューションの例には以下のコンポーネントが含まれています：

* ロードバランサーがなく、Auto Scalingグループにアタッチされたターゲットグループ。
* トラフィックを分析し、悪意のあるリクエストをブロックし、正当なリクエストをさらにプロキシへと送ります。これにはWallarmノードインスタンスが使用されます。

    この例では、記述された動作を制御するために、ブロッキングモードでWallarmノードを実行します。Wallarmノードは、悪意のあるリクエストのブロッキングを含まないトラフィックモニタリングのみを目指した他のモードでも動作することができます。Wallarmノードモードの詳細は、[弊社のドキュメンテーション](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)を参照してください。
* Wallarmノードはトラフィックを`https://httpbin.org`にプロキシします。

    この例を実行する際に、AWSバーチャルプライベートクラウド（VPC）から利用可能な他のサービスドメインやパスにトラフィックをプロキシするために指定することができます。

提供される`wallarm`例モジュールにより、上記のリストされたコンポーネント（プロキシされたサーバを除く）がデプロイされます。

## コードコンポーネント

この例には以下のコードコンポーネントが含まれています：

* `main.tf`：`wallarm`モジュールの主要設定は、プロキシ高度ソリューションとしてデプロイされます。
* `global_snippet.conf`：`global_snippet`変数を使用してNGINXグローバル設定に追加されるカスタムNGINX設定の例。マウントポイントの設定に`load_module`、`stream`、`mail`、`env`などのディレクティブを含めることができます。
* `http_snippet.conf`：`http_snippet`変数を使用して`http` NGINXコンテキストに追加されるカスタムNGINX設定の例。マウントされた設定には`map`や`server`などのディレクティブを含めることができます。
* `server_snippet.conf`：`server_snippet`変数を使用して`server` NGINXコンテキストに追加されるカスタムNGINX設定の例。マウントされた設定は、 `if`のようなNGINXロジックと必要な`location`設定を導入できます。

    このスニペット設定はポート80にのみ適用されます。他のポートを開くには、`http_snippet`で対応する`server`ディレクティブを指定します。

    `server_snippet.conf`ファイルでは、より複雑な設定例も見つけることができます。
* `post-cloud-init.sh`：カスタムHTMLインデックスページを`/var/www/mysite/index.html`インスタンスディレクトリに配置するカスタムスクリプトの例。このスクリプトはWallarmノード初期化（cloud-initスクリプト）後に実行されます。

    `post-cloud-init.sh`ファイルでは、AWS S3のコンテンツをインスタンスディレクトリに配置するコマンドの例も見つけることができます。このオプションを使用する場合、`extra_policies`変数でS3アクセスポリシーを指定することを忘れないようにしてください。

## Wallarm AWSプロキシソリューションの実行

1. [EUクラウド](https://my.wallarm.com/nodes)または[USクラウド](https://us1.my.wallarm.com/nodes)でWallarm Consoleにサインアップします。
1. Wallarm Consoleから**ノード**を選択し、**Wallarmノード**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. あなたマシンに例のコードを含むリポジトリをクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリの`examples/advanced/variables.tf`ファイルにある`default`オプションで変数値を設定し、変更を保存します。
1. `examples/advanced/main.tf`ファイルの `proxy_pass`内でプロキシされるサーバのプロトコルとアドレスを設定します。

    デフォルトでは、Wallarmはトラフィックを`https://httpbin.org`にプロキシします。あなたのニーズに適している場合はそのまま使用してください。
1. `examples/advanced`ディレクトリから以下のコマンドを実行してスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイした環境を削除するには以下のコマンドを使用します：

```
terraform destroy
```

## 参考文献

* [AWSのロードバランサーをAuto Scalingグループにアタッチする](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)
* [公開および非公開のサブネット（NAT）を有するAWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [Wallarmドキュメンテーション](https://docs.wallarm.com)