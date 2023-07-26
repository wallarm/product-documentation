[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Akamai EdgeWorkersとWallarmコードバンドル

[Akamai EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs)は、カスタムロジックの実行や、軽量のJavaScript関数をプラットフォームのエッジにデプロイすることを可能にする強力なエッジコンピューティングプラットフォームです。APIやトラフィックをAkamai EdgeWorkersで稼働させているお客様に対して、WallarmはAkamai EdgeWorkersにデプロイ可能なコードバンドルを提供して、インフラストラクチャを保護します。

このソリューションは、Wallarmノードを外部にデプロイして、特定のプラットフォームにカスタムコードやポリシーをインジェクトすることで動作します。これにより、トラフィックは潜在的な脅威に対する分析と保護のために外部のWallarmノードに向けられます。Wallarmのコネクタと呼ばれるこれらのコンポーネントは、Azion Edge、Akamai Edge、Mulesoft、Apigee、AWS Lambdaなどのプラットフォームと外部のWallarmノードとの間の重要なリンクとなります。このアプローチにより、シームレスな統合、安全なトラフィック分析、リスク緩和、および全体的なプラットフォームのセキュリティが確保されます。

## 使用例

全てのサポートされている[Wallarmのデプロイオプション](../supported-deployment-options.md)の中で、以下の使用例に対して、このソリューションが推奨されます：

* Akamai EdgeWorkers上で稼働するAPIまたはトラフィックを保護する。
* 攻撃の観察、報告、および悪意のあるリクエストの即時ブロックを提供するセキュリティソリューションを必要とする。

## 制約

このソリューションは、受信リクエストのみで動作するため、一部の制約があります：

* [パッシブ検出](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)法を用いた脆弱性発見は、正常に機能しません。ソリューションは、テスト対象の脆弱性に対する典型的な悪意のあるリクエストへのサーバーの応答に基づいて、APIが脆弱かどうかを判断します。
* [Wallarm API Discovery](../../about-wallarm/api-discovery.md)は、ソリューションがレスポンス分析に依存しているため、トラフィックに基づいたAPIインベントリーを探索することができません。
* [強制ブラウジングへの保護](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は、レスポンスコード分析が必要なため、利用できません。

また、[EdgeWorkersプロダクトの制約](https://techdocs.akamai.com/edgeworkers/docs/limitations)と[http-request](https://techdocs.akamai.com/edgeworkers/docs/http-request)による制約もあります：

* トラフィック配信方法は、強化TLSのみをサポートしています。
* レスポンスヘッダの最大サイズは8000バイトです。
* ボディの最大サイズは1MBです。
* サポートしていないHTTPメソッド：`CONNECT`, `TRACE`, `OPTIONS` (サポートしているメソッド：`GET`, `POST`, `HEAD`, `PUT`, `PATCH`, `DELETE`).
* サポートしていないヘッダ：`connection`, `keep-alive`, `proxy-authenticate`, `proxy-authorization`, `te`, `trailers`, `transfer-encoding`, `host`, `content-length`, `vary`, `accept-encoding`, `content-encoding`, `upgrade`.

## 要件

デプロイを進めるために、以下の要件を満たしていることを確認してください：

* Akamai EdgeWorkers技術の理解
* Akamai EdgeWorkersを経由して稼働しているAPIあるいはトラフィック。

## デプロイメント

Akamai EdgeWorkers上のAPIをWallarmで保護するには、以下の手順に従ってください：

1. 利用可能なデプロイオプションのいずれかを使用してWallarmノードをデプロイします。
1. Wallarmのコードバンドルを取得し、Akamai EdgeWorkers上で実行します。

### 1. Wallarmノードのデプロイ

Akami EdgeWorkersでWallarmを使用する際、トラフィックフローはインライン方式です。

1. インラインデプロイのための[supported Wallarmノードデプロイソリューションまたはアーティファクト](../supported-deployment-options.md)のいずれかを選択し、提供されたデプロイ指示に従います。
1. デプロイしたノードに以下のテンプレートを使用して設定します：

    ```
    server {
        listen 80;

        server_name _;

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://127.0.0.1:18080;
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
            proxy_pass http://127.0.0.1:18080;
        }
    }


    server {
        listen 127.0.0.1:18080;
        
        server_name _;
        
        wallarm_mode monitoring;
        #wallarm_mode block;

        real_ip_header X-EDGEWRK-REAL-IP;
        set_real_ip_from 127.0.0.1;

        location / {
            echo_read_request_body;
        }
    }
    ```

    次の設定に注意してください：

    * HTTPSトラフィックのためのTLS/SSL証明書：WallarmノードがセキュアなHTTPSトラフィックを処理できるようにするため、TLS/SSL証明書を適切に設定します。具体的な設定は、選択したデプロイ方法によります。たとえば、NGINXを使用している場合、ガイダンスのために[こちらの記事](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/)を参照できます。
    * [Wallarmの操作モード](../../admin-en/configure-wallarm-mode.md)の設定。
    * デプロイが完了したら、後でリクエストの転送先アドレスを設定するために、ノードインスタンスのIPをメモしておきます。

### 2. Wallarmのコードバンドルを取得し、Akamai EdgeWorkers上で実行する

Wallarmのコードバンドルを取得し、Akamai EdgeWorkers上で[実行](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1)するには、以下の手順に従ってください：

1. [support@wallarm.com](mailto:support@wallarm.com)に連絡してWallarmのコードバンドルを取得します。
1. Akamaiの契約にEdgeWorkersを[追加](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract)します。
1. EdgeWorker IDを[作成](https://techdocs.akamai.com/edgeworkers/docs/create-an-edgeworker-id)します。
1. 作成したIDを開き、**バージョンを作成**を押して、Wallarmのコードバンドルを[アップロード](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1)します。
1. 作成したバージョンを**アクティベート**し、初めにステージング環境で行います。
1. 全てが正常に動作していることを確認したら、本番環境でバージョンの公開を繰り返します。
1. **Akamai Property Manager**で、Wallarmをインストールしたいプロパティを選択または新規作成します。
1. 新たに作成したEdgeWorkerで新しい振る舞いを[作成](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworker-behavior-1)し、例えば**Wallarm Edge**と呼びましょう。その後、以下の条件を追加します：

    ```
    If 
    Request Header 
    X-EDGEWRK-REAL-IP 
    does not exist
    ```
1. **Wallarm Node**という別の振る舞いを作成し、**Origin Server**を[前にデプロイされたノード](#1-deploy-a-wallarm-node)に指定します。**Forward Host Header**を**Origin Hostname**に切り替え、以下の条件を追加します：

    ```
    If 
    Request Header 
    X-EDGEWRK-REAL-IP 
    exist
    ```
1. 新たなプロパティ変数`PMUSER_WALLARM_MODE`を追加し、[値](../../admin-en/configure-wallarm-mode.md)を`monitoring`(デフォルト)または`block`に設定します。

    セキュリティ設定には**Hidden**を選択します。
1. 新しいバージョンを保存し、初めにステージング環境にデプロイし、[その後](https://techdocs.akamai.com/api-acceleration/docs/test-stage)本番環境にデプロイします。

## テスト

デプロイされたポリシーの機能をテストするには、以下の手順に従ってください：

1. テスト[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストをAPIに送信します：

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Consoleで **イベント** セクションを開き、[US Cloud](https://us1.my.wallarm.com/search)または[EU Cloud](https://my.wallarm.com/search)から、攻撃がリストに表示されていることを確認します。
    
    ![!Attacks in the interface][attacks-in-ui-image]

    Wallarmのノードモードがブロッキングに設定されている場合、リクエストもブロックされます。

## アシスタンスが必要ですか？

Akamai EdgeWorkersと連携してWallarmをデプロイする過程で何か問題が発生した場合や、アシスタンスが必要な場合は、[Wallarmのサポート](mailto:support@wallarm.com)にご連絡ください。彼らは、実装のプロセス中に発生する問題の解決やガイダンスの提供を行います。