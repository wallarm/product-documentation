[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Wallarm Functionsを備えたAzion Edge Firewall

[Azion Edge Functions](https://www.azion.com/en/products/edge-functions/)はネットワークエッジでカスタムコードを実行可能にし、リクエストを処理するためのカスタマーのルール実装を可能にします。Wallarmのカスタムコードを組み込むことにより、受信トラフィックはWallarmノードへプロキシされ、分析およびフィルタリングが行われます。この設定は、すでに[Azion Edge Firewall](https://www.azion.com/en/products/edge-firewall/)で提供されるセキュリティ対策を強化します。本ガイドでは、WallarmノードをAzion Edgeと統合し、Azion Edge上で稼働するサービスを保護する方法について説明します。

本ソリューションは、Wallarmノードを外部にデプロイし、特定のプラットフォームにカスタムコードまたはポリシーを注入することを含みます。これにより、トラフィックは外部のWallarmノードに転送され、潜在的な脅威に対して分析および保護が行われます。Wallarmのコネクタと呼ばれるこれらは、Azion Edge、Akamai Edge、Mulesoft、Apigee、AWS Lambdaなどのプラットフォームと外部のWallarmノードとの間で必須の連携を提供します。この手法により、シームレスな統合、安全なトラフィック分析、リスク軽減、およびプラットフォーム全体のセキュリティが確保されます。

## ユースケース

すべての[Wallarmデプロイメントオプション](../supported-deployment-options.md)の中で、本ソリューションは以下のユースケース向けに推奨されます：

* Azion Edgeで稼働するAPIまたはトラフィックの保護。
* 攻撃の包括的な監視、レポート、および悪意のあるリクエストの即時ブロックを提供するセキュリティソリューションが必要な場合。

## 制限事項

本ソリューションにはいくつかの制限があり、受信リクエストに対してのみ動作します：

* [Passive detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)手法を用いた脆弱性検出は正しく機能しません。本ソリューションは、テスト対象の脆弱性に典型的な悪意のあるリクエストに対するサーバーの応答に基づき、APIが脆弱か否かを判断します。
* [Wallarm API Discovery](../../api-discovery/overview.md)は、応答分析に依存しているため、トラフィックを元にAPIのインベントリを探索することはできません。
* [Protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は、応答コードの分析が必要なため利用できません。

## 要件

デプロイメントを進める前に、以下の要件を満たしていることを確認してください：

* Azion Edge技術の理解。
* Azion Edge上で稼働するAPIまたはトラフィック。

## デプロイメント

Wallarmを用いてAzion Edge上のAPIを保護するには、以下の手順に従ってください：

1. 利用可能なデプロイメントオプションのうちの一つを使用してWallarmノードをデプロイします。
1. Edge Functions用のWallarmコードを入手し、Azion上で実行します。

### 1. Wallarmノードのデプロイ

Azion Edge上でWallarmを利用する場合、トラフィックフローは[in-line](../inline/overview.md)です。

1. in-lineデプロイメント向けに、[サポートされたWallarmノードのデプロイメントソリューションまたはアーティファクト](../supported-deployment-options.md#in-line)の中から一つを選択し、提供されたデプロイメント手順に従ってください。
1. 以下のテンプレートを使用して、デプロイされたノードを設定してください：

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

        ### SSLの設定はこちら

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
        #wallarm_modeブロック;

        real_ip_header X-EDGEWRK-REAL-IP;
        set_real_ip_from unix:;

        location / {
            echo_read_request_body;
        }
    }
    ```

    次の設定に注意してください：

    * HTTPSトラフィック用のTLS/SSL証明書：Wallarmノードが安全なHTTPSトラフィックを処理できるように、TLS/SSL証明書を適切に設定してください。具体的な設定は選択したデプロイメント手法に依存します。例えば、NGINXを使用している場合は、[その記事](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/)を参照してください。
    * [Wallarm operation mode](../../admin-en/configure-wallarm-mode.md)の設定。
1. デプロイメントが完了したら、後で受信リクエストの転送先として使用するために、ノードインスタンスのIPアドレスを記録してください。

### 2. Edge Functions用Wallarmコードの取得とAzionでの実行

Azion Edge Functions用Wallarmコードを入手し実行するため、以下の手順に従ってください：

1. [support@wallarm.com](mailto:support@wallarm.com)に連絡してWallarmコードを入手してください。
1. Azion Edgeで**Billing & Subscriptions**に移動し、**Application Acceleration**および**Edge Functions**のサブスクリプションをアクティブにしてください。
1. 新しい**Edge Application**を作成し、保存してください。
1. 作成したアプリケーションを開き、**Main Settings**で**Application Acceleration**と**Edge Functions**を有効にしてください。
1. **Domains**に移動し、**Add Domain**をクリックしてください。
1. **Edge Functions**に移動し、**Add Function**をクリックして`Edge Firewall`タイプを選択してください。
1. Wallarmソースコードを貼り付け、`wallarm.node.tld`を[先にデプロイしたWallarmノード](#1-deploy-a-wallarm-node)のアドレスに置き換えてください。
1. **Edge Firewall**に移動し、**Add Rule Set**をクリック、**Name**を入力、**Domains**を選択し、**Edge Functions**をオンにしてください。
1. **Functions**タブに切り替え、**Add Function**をクリック、先に作成した関数を選択してください。
1. **Rules Engine**タブに切り替え、**New Rule**をクリックして、Wallarmによってトラフィックがフィルタリングされるための条件を設定してください：

    * すべてのリクエストを分析およびフィルタリングするには、`If Request URI starts with /`を選択してください。
    * **Behaviors**で`Then Run Function`を選択し、先に作成した関数を選んでください。

## テスト

デプロイ済みポリシーの機能をテストするには、以下の手順に従ってください：

1. テスト用の[Path Traversal][ptrav-attack-docs]攻撃リクエストをAPIに送信してください：

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Consoleを開き、[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)の**Attacks**セクションで攻撃がリストに表示されていることを確認してください。
    
    ![インターフェース上の攻撃][attacks-in-ui-image]

    Wallarmノードのモードがblockingに設定されている場合、リクエストはブロックされます。

## サポートが必要ですか？

記載のAzion Edgeと連携したWallarmのデプロイメントに関して問題が発生する場合、またはサポートが必要な場合は、[Wallarm support](mailto:support@wallarm.com)チームにご連絡ください。実装プロセス中に直面する課題の解決やガイダンスの提供に対応いたします。