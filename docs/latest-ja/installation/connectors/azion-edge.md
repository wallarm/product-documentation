[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Wallarm Functionsを利用したAzion Edge Firewall

[Azion Edge Functions](https://www.azion.com/en/products/edge-functions/)はネットワークエッジでカスタムコードを実行でき、リクエスト処理のための独自ルールを実装できます。Wallarmのカスタムコードを組み込むことで、受信トラフィックをWallarmノードにプロキシして解析およびフィルタリングできます。この構成は[Azion Edge Firewall](https://www.azion.com/en/products/edge-firewall/)が既に提供するセキュリティ対策を強化します。本ガイドでは、Azion Edge上で稼働するサービスを保護するために、WallarmノードをAzion Edgeに統合する方法を説明します。

このソリューションでは、外部にWallarmノードをデプロイし、対象プラットフォームにカスタムコードまたはポリシーを組み込みます。これにより、トラフィックを外部のWallarmノードに誘導して解析し、潜在的な脅威から保護できるようになります。これらはWallarmのコネクタと呼ばれ、Azion Edge、Akamai Edge、MuleSoft、Apigee、AWS Lambdaなどのプラットフォームと外部のWallarmノードをつなぐ必須のリンクとして機能します。このアプローチにより、シームレスな統合、安全なトラフィック解析、リスク低減、プラットフォーム全体のセキュリティを実現します。

## ユースケース

このソリューションは、以下のユースケースに推奨されます。

* Azion Edge上で稼働するAPIまたはトラフィックを保護したい場合。
* 攻撃の包括的な観測・レポートおよび悪意のあるリクエストの即時ブロックを提供するセキュリティソリューションが必要な場合。

## 制限事項

このソリューションは受信リクエストのみを対象とするため、いくつかの制限があります。

* [パッシブ検出](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)方式による脆弱性発見は正しく機能しません。この方式は、テスト対象の脆弱性に典型的な悪意のあるリクエストに対するサーバーの応答に基づいてAPIが脆弱かどうかを判定します。
* 本ソリューションでは応答解析を利用できないため、[Wallarm API Discovery](../../api-discovery/overview.md)はトラフィックに基づいてAPIインベントリを探索できません。
* 応答コードの解析を必要とするため、[強制ブラウジング対策](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は利用できません。

## 要件

デプロイを進める前に、以下の要件を満たしていることを確認してください。

* Azion Edgeのテクノロジーに関する理解
* Azion Edge上で稼働するAPIまたはトラフィック

## デプロイ

WallarmでAzion Edge上のAPIを保護するには、次の手順に従ってください。

1. 利用可能なデプロイオプションのいずれかを使用してWallarmノードをデプロイします。
1. Edge Functions用のWallarmコードを入手し、Azionで実行します。

### 1. Wallarmノードをデプロイする

Azion EdgeでWallarmを利用する場合、トラフィックフローは[インライン](../inline/overview.md)になります。

1. インラインデプロイ用に、[サポートされているWallarmノードのデプロイソリューションまたはアーティファクト](../supported-deployment-options.md#in-line)のいずれかを選択し、案内された手順に従ってデプロイします。
1. 次のテンプレートを使用して、デプロイしたノードを構成します。

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

        ### ここにSSLの設定

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

    以下の構成に注意してください。

    * HTTPSトラフィックのTLS/SSL証明書：WallarmノードでセキュアなHTTPSトラフィックを扱えるように、適切にTLS/SSL証明書を構成してください。具体的な設定内容は選択したデプロイ方法に依存します。たとえばNGINXを使用している場合は、[該当記事](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/)を参照してください。
    * [Wallarmの動作モード](../../admin-en/configure-wallarm-mode.md)の構成。
1. デプロイが完了したら、後で受信リクエストの転送先アドレスを設定する際に必要になるため、ノードインスタンスのIPを控えておいてください。

### 2. Edge Functions用のWallarmコードを入手してAzionで実行する

Azion Edge Functions向けのWallarmコードを入手して実行するには、次の手順に従ってください。

1. [support@wallarm.com](mailto:support@wallarm.com)へ連絡してWallarmコードを入手します。
1. Azion Edgeで、**Billing & Subscriptions**に移動し、**Application Acceleration**と**Edge Functions**のサブスクリプションを有効化します。
1. 新しい**Edge Application**を作成して保存します。
1. 作成したアプリケーションを開き → **Main Settings**で**Application Acceleration**と**Edge Functions**を有効化します。
1. **Domains**に移動し、**Add Domain**をクリックします。
1. **Edge Functions**に移動し、**Add Function**をクリックして`Edge Firewall`タイプを選択します。
1. Wallarmソースコードを貼り付け、`wallarm.node.tld`を[前段でデプロイしたWallarmノード](#1-deploy-a-wallarm-node)のアドレスに置き換えます。
1. **Edge Firewall** → **Add Rule Set** → **Name**を入力 → **Domains**を選択し、**Edge Functions**をオンにします。
1. **Functions**タブに切り替え、**Add Function**をクリックして先ほど作成した関数を選択します。
1. **Rules Engine**タブに切り替え → **New Rule**を選択し、Wallarmでフィルタリングするトラフィックの条件を設定します。

    * すべてのリクエストを解析・フィルタリングするには、`If Request URI starts with /`を選択します。
    * **Behaviors**で`Then Run Function`を選択し、先ほど作成した関数を選びます。

## テスト

デプロイしたポリシーの機能をテストするには、次の手順に従ってください。

1. テスト用の[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストをAPIに送信します。

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Console → **Attacks**セクションを[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)で開き、攻撃が一覧に表示されていることを確認します。
    
    ![インターフェイスのAttacks][attacks-in-ui-image]

    Wallarmノードのモードがブロックに設定されている場合、リクエストもブロックされます。

## サポートが必要ですか？

Azion Edgeと組み合わせた本ドキュメントのWallarmデプロイで問題が発生した場合や支援が必要な場合は、[Wallarm support](mailto:support@wallarm.com)チームにお問い合わせください。実装プロセス中に直面する問題の解決に向けたガイダンスを提供します。