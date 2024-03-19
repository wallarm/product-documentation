[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Wallarmコードバンドルを使用したAkamai EdgeWorkers

[Akamai EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs)は、プラットフォームのエッジでカスタムロジックの実行と軽量JavaScript関数のデプロイを許可する強力なエッジコンピューティングプラットフォームです。APIとトラフィックをAkamai EdgeWorkersで実行している顧客のために、WallarmはAkamai EdgeWorkersにデプロイすることができるコードバンドルを提供します。

このソリューションは、特定のプラットフォームにカスタムコードやポリシーを注入しながら、Wallarmノードを外部でデプロイすることを含みます。これにより、トラフィックは外部のWallarmノードにある潜在的な脅威の分析と保護のために指向することができます。Wallarmのコネクタと呼ばれるこれらのノードは、Azion Edge、Akamai Edge、Mulesoft、Apigee、AWS Lambdaのようなプラットフォームと外部のWallarmノードとの間の必要不可欠なリンクとして機能します。このアプローチはシームレスな統合、安全なトラフィック分析、リスク軽減、および全体のプラットフォームセキュリティを保証します。

## 使用事例

すべてのサポートされている[Wallarmのデプロイメントオプション](../supported-deployment-options.md)の中で、次の使用事例にはこのソリューションを推奨します：

* Akamai EdgeWorkersで実行されているAPIまたはトラフィックを保護する。
* 攻撃の観察、報告、および悪意のあるリクエストの即時ブロックを提供するセキュリティソリューションが必要。

## 制限事項

このソリューションは、着信リクエストのみで動作するため、特定の制限があります：

* [パッシブ検出](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)方法を使用した脆弱性発見は正しく機能しません。このソリューションは、それがテストする脆弱性に典型的な悪意のあるリクエストへのサーバー応答に基づいて、APIが脆弱かどうかを判断します。
* [Wallarm API Discovery](../../api-discovery/overview.md)は、応答分析に依存する解決策として、トラフィックに基づいてAPIインベントリを探索することができません。
* 応答コード分析が必要なため、[強制的なブラウジングに対する保護](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は利用できません。

[EdgeWorkers製品の制限](https://techdocs.akamai.com/edgeworkers/docs/limitations)および[http-request](https://techdocs.akamai.com/edgeworkers/docs/http-request)による制限もあります：

* サポートされているトラフィック配信方法は強化されたTLSのみです。
* 最大応答ヘッダーサイズは8000バイトです。
* 最大本文サイズは1MBです。
* サポートされていないHTTPメソッド:`CONNECT`、`TRACE`、`OPTIONS`（サポートされているメソッド：`GET`、`POST`、`HEAD`、`PUT`、`PATCH`、`DELETE`）。
* サポートされていないヘッダー：`connection`、`keep-alive`、`proxy-authenticate`、`proxy-authorization`、`te`、`trailers`、`transfer-encoding`、`host`、`content-length`、`vary`、`accept-encoding`、`content-encoding`、`upgrade`。

## 要件

デプロイメントを進めるには、以下の要件を満たしていることを確認してください：

* Akamai EdgeWorkersの技術を理解している。
* Akamai EdgeWorkersを通じて実行されているAPIまたはトラフィック。

## デプロイメント

Akamai EdgeWorkers上のAPIをWallarmで保護するには、次の手順に従ってください：

1. 利用可能なデプロイメントオプションの1つを使用してWallarmノードをデプロイします。
1. Wallarmのコードバンドルを取得し、それをAkamai EdgeWorkersで実行します。

### 1. Wallarmノードのデプロイ

Akami EdgeWorkersでWallarmを利用するとき、トラフィックフローは[インライン](../inline/overview.md)です。

1. インラインデプロイメント用の[supported Wallarmノードデプロイメントソリューションまたはアーティファクト](../supported-deployment-options.md#in-line)の1つを選択し、指定されたデプロイメント指示に従います。
1. 次のテンプレートを使用してデプロイしたノードを設定します：

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

        ### SSL configuration here

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

    次の設定に注意してください：

    * HTTPSトラフィック向けのTLS/SSL証明書：Wallarmノードが安全なHTTPSトラフィックを処理できるようにするため、TLS/SSL証明書を適切に設定してください。特定の設定は選択したデプロイメント方法によります。例えば、NGINXを使用している場合、ガイダンスのために[その記事](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/)を参照できます。
    * [Wallarm操作モード](../../admin-en/configure-wallarm-mode.md)の設定。
1. デプロイメントが完了したら、着信リクエストの転送先を設定するために後で必要となるノードインスタンスのIPをメモします。

### 2. Wallarmのコードバンドルを取得し、それをAkamai EdgeWorkersで実行する

Akamai EdgeWorkersでWallarmのコードバンドルを取得し、[実行](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1)するには、次の手順に従ってください：

1. Wallarmのコードバンドルを取得するために、[support@wallarm.com](mailto:support@wallarm.com)に連絡します。
1. Akamaiの契約にEdgeWorkersを[追加](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract)します。
1. EdgeWorker IDを[作成](https://techdocs.akamai.com/edgeworkers/docs/create-an-edgeworker-id)します。
1. 作成したIDを開き、**Create Version**を押して、Wallarmのコードバンドルを[アップロード](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1)します。
1. 作成したバージョンを**Activate**します。最初はステージング環境でアクティブにします。
1. すべてが正しく動作していることを確認したら、プロダクション環境でバージョンの公開を再度行います。
1. **Akamai Property Manager**で、Wallarmをインストールしたい新しいプロパティを選択または作成します。
1. 新たに作成したEdgeWorkerで新しい振る舞いを[作成](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworker-behavior-1)し、それを例えば**Wallarm Edge**と呼び、次の基準を追加します：

    ```
    If 
    Request Header 
    X-EDGEWRK-REAL-IP 
    does not exist
    ```
1.  **Origin Server**を[前回デプロイしたノード](#1-deploy-a-wallarm-node)に指す別の振る舞い**Wallarm Node**を作成します。**Forward Host Header**を**Origin Hostname**に切り替え、次の基準を追加します：

    ```
    If 
    Request Header 
    X-EDGEWRK-REAL-IP 
    exist
    ```
1. 新しいプロパティ変数`PMUSER_WALLARM_MODE`に[value](../../admin-en/configure-wallarm-mode.md)`monitoring`（デフォルト）または`block`を追加します。 
    
    セキュリティ設定に対して**Hidden**を選択してください。
1. 新しいバージョンを保存し、最初はステージング環境にデプロイします。そして、[その後](https://techdocs.akamai.com/api-acceleration/docs/test-stage)はプロダクションにデプロイします。

## テスト

デプロイされたポリシーの機能をテストするには、以下の手順に従ってください：

1. テスト[Path Traversal][ptrav-attack-docs]攻撃であなたのAPIにリクエストを送信します：

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Console → **Events**セクションを[US Cloud](https://us1.my.wallarm.com/search)または[EU Cloud](https://my.wallarm.com/search)で開き、攻撃がリストに表示されることを確認します。
    
    ![Attacks in the interface][attacks-in-ui-image]

    Wallarmノードモードがブロッキングに設定されている場合、リクエストもブロックされます。

## アシスタンスが必要ですか？

Akamai EdgeWorkersと併せてのWallarmのデプロイメントについて問題が発生した場合や、実装プロセス中に問題が発生した場合は、[Wallarmのサポート](mailto:support@wallarm.com)チームに問い合わせることができます。彼らはガイダンスを提供し、あなたが実装プロセス中に直面する可能性のある問題の解決を支援します。