[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Akamai EdgeWorkersとWallarm Code Bundle

[Akamai EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs) は、プラットフォームのエッジでカスタムロジックの実行や軽量なJavaScript関数のデプロイを可能にする強力なエッジコンピューティングプラットフォームです。Akamai EdgeWorkers上でAPIやトラフィックを運用しているお客様向けに、Wallarmはインフラストラクチャを保護するためにAkamai EdgeWorkersにデプロイ可能なコードバンドルを提供します。

このソリューションでは、Wallarmノードを外部にデプロイし、特定のプラットフォームにカスタムコードまたはポリシーを注入します。これにより、トラフィックが外部のWallarmノードに転送され、潜在的な脅威に対する分析および保護が実現されます。Wallarmのコネクタと呼ばれるこれらの要素は、Azion Edge、Akamai Edge、MuleSoft、Apigee、AWS Lambdaなどのプラットフォームと外部のWallarmノードとの間の重要な連携役を果たします。このアプローチにより、シームレスな統合、安全なトラフィック解析、リスク軽減、そして全体的なプラットフォームのセキュリティが実現されます。

## ユースケース

すべての[Wallarm導入オプション](../supported-deployment-options.md)の中で、本ソリューションは以下のユースケースに推奨されます：

* Akamai EdgeWorkers上で運用されるAPIやトラフィックの保護
* 包括的な攻撃監視、レポーティング、および悪意あるリクエストの即時ブロックを提供するセキュリティソリューションが求められる場合

## 制限事項

このソリューションは受信リクエストのみで動作するため、いくつかの制限があります：

* [パッシブ検出](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)方式を使用した脆弱性検出は正しく機能しません。このソリューションは、テスト対象の脆弱性に典型的な悪意あるリクエストに対するサーバーの応答に基づいてAPIの脆弱性を判断します。
* [Wallarm API Discovery](../../api-discovery/overview.md)は、応答解析に依存しているため、トラフィックに基づいたAPIインベントリの探索は行えません。
* [強制閲覧の防御](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は、応答コードの解析が必要なため利用できません。

また、[EdgeWorkers product limitations](https://techdocs.akamai.com/edgeworkers/docs/limitations)および[http-request](https://techdocs.akamai.com/edgeworkers/docs/http-request)による以下の制限もあります：

* サポートされるトラフィック配信方式は、強化TLSのみです。
* 最大応答ヘッダーサイズは8000バイトです。
* 最大ボディサイズは1MBです。
* サポートされないHTTPメソッド：`CONNECT`、`TRACE`、`OPTIONS`（サポートされるメソッド：`GET`、`POST`、`HEAD`、`PUT`、`PATCH`、`DELETE`）。
* サポートされないヘッダー：`connection`、`keep-alive`、`proxy-authenticate`、`proxy-authorization`、`te`、`trailers`、`transfer-encoding`、`host`、`content-length`、`vary`、`accept-encoding`、`content-encoding`、`upgrade`。

## 必要条件

デプロイを進めるために、以下の必要条件を満たしていることを確認してください：

* Akamai EdgeWorkers技術の理解
* Akamai EdgeWorkers上で運用されるAPIやトラフィック

## デプロイ

Wallarmを使用してAkamai EdgeWorkers上のAPIを保護するため、以下の手順に従ってください：

1. 利用可能なデプロイオプションのいずれかを使用してWallarmノードをデプロイします。
1. Wallarm code bundleを取得し、Akamai EdgeWorkers上で実行します。

### 1. Wallarmノードのデプロイ

Akamai EdgeWorkers上でWallarmを利用する際、トラフィックフローは[in-line](../inline/overview.md)となります。

1. [サポートされるWallarmノードデプロイソリューションまたはアーティファクト](../supported-deployment-options.md#in-line)のいずれかを選択し、提供されたデプロイ手順に従ってください。
1. 以下のテンプレートを使用して、デプロイしたノードの設定を行ってください：

    ```
    server {
        listen 80;

        server_name _;

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }

    server {
        listen 443 ssl;

        server_name yourdomain-for-wallarm-node.tld;

        ### ここにSSL構成を記述

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }


    server {
        listen unix:/tmp/wallarm-nginx.sock;
        
        server_name _;
        
        wallarm_mode monitoring;
        #wallarm_mode block;

        real_ip_header X-EDGEWRK-REAL-IP;
        set_real_ip_from unix:;

        location / {
            echo_read_request_body;
        }
    }
    ```

    以下の設定に注意してください：

    * HTTPSトラフィック用のTLS/SSL証明書：Wallarmノードが安全なHTTPSトラフィックを処理できるよう、TLS/SSL証明書を適切に設定してください。具体的な設定は選択したデプロイ手法によります。たとえば、NGINXを使用している場合は、[こちらの記事](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/)を参照してください。
    * [Wallarm operation mode](../../admin-en/configure-wallarm-mode.md) の設定。
1. デプロイが完了したら、後で受信リクエスト転送先のアドレスとして使用するため、ノードインスタンスのIPアドレスを控えておいてください。

### 2. Wallarm code bundleの取得とAkamai EdgeWorkers上での実行

Akamai EdgeWorkers上でWallarm code bundleを取得し、[実行](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1)するには、以下の手順に従ってください：

1. [support@wallarm.com](mailto:support@wallarm.com)までお問い合わせいただき、Wallarm code bundleを取得してください。
1. Akamaiの契約にEdgeWorkersを[追加](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract)してください。
1. EdgeWorker IDを[作成](https://techdocs.akamai.com/edgeworkers/docs/create-an-edgeworker-id)してください。
1. 作成したIDを開き、**Create Version**を押して、Wallarm code bundleを[アップロード](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1)してください。
1. 最初にステージング環境で、作成したバージョンを**Activate**してください。
1. すべてが正しく動作していることを確認後、本番環境で再度バージョンの公開を行ってください。
1. **Akamai Property Manager**で、Wallarmをインストールしたいプロパティを選択するか新規に作成してください。
1. 新しく作成したEdgeWorkerを使用して新規のビヘイビアを[作成](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworker-behavior-1)し、例として**Wallarm Edge**と命名し、以下の条件を追加してください：

    ```
    もし
    リクエストヘッダー
    X-EDGEWRK-REAL-IP
    が存在しない
    ```

1. **Origin Server**が[先にデプロイしたノード](#1-deploy-a-wallarm-node)を指すように、もう一つのビヘイビア**Wallarm Node**を作成してください。**Forward Host Header**を**Origin Hostname**に切り替え、以下の条件を追加してください：

    ```
    もし
    リクエストヘッダー
    X-EDGEWRK-REAL-IP
    が存在する
    ```

1. 新規プロパティ変数`PMUSER_WALLARM_MODE`に、[値](../../admin-en/configure-wallarm-mode.md)として`monitoring`（デフォルト）または`block`を追加してください。  
    セキュリティ設定では**Hidden**を選択してください。
1. 新しいバージョンを保存し、最初にステージング環境にデプロイした後、[こちら](https://techdocs.akamai.com/api-acceleration/docs/test-stage)を参照して本番環境にデプロイしてください。

## テスト

デプロイされたポリシーの機能をテストするため、以下の手順に従ってください：

1. テスト[Path Traversal][ptrav-attack-docs]攻撃を使用してAPIにリクエストを送信してください：

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Consoleを開いて、[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)の**Attacks**セクションに攻撃が表示されていることを確認してください。  

    ![インターフェース内の攻撃][attacks-in-ui-image]

    Wallarmノードモードがblockingに設定されている場合、リクエストはブロックされます。

## サポートが必要ですか？

WallarmとAkamai EdgeWorkersの連携によるデプロイに関して問題が発生した場合やサポートが必要な場合は、[Wallarm support](mailto:support@wallarm.com)チームまでお問い合わせください。実装プロセス中に発生する可能性のある問題の解決やガイダンスの提供に対応しております。