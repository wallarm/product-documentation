[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Azion EdgeファイヤウォールとWallarm関数

[Azion Edge関数](https://www.azion.com/en/products/edge-functions/)は、カスタマールールの実装を可能にし、ネットワークエッジでカスタムコードの実行を可能にします。Wallarmのカスタムコードを組み込むことで、着信トラフィックを分析とフィルタリングのためのWallarmノードにプロキシすることができます。この設定は、[Azion Edgeファイヤウォール](https://www.azion.com/en/products/edge-firewall/)が提供する既存のセキュリティ対策を強化します。このガイドでは、Azion Edgeで実行されているサービスを保護するために、WallarmノードをAzion Edgeと統合する方法について説明します。

解決策として、Wallarmノードを外部にデプロイし、カスタムコードやポリシーを特定のプラットフォームに注入します。これにより、トラフィックは潜在的な脅威から保護するための分析と外部のWallarmノードに向けて誘導できます。これはWallarmのコネクタと呼ばれ、Azion Edge、Akamai Edge、Mulesoft、Apigee、そしてAWS Lambdaといったプラットフォームと外部のWallarmノードとの間での重要なリンクとなります。このアプローチはシームレスな統合、安全なトラフィック分析、リスクの軽減、そして全体的なプラットフォームセキュリティを保証します。

## ユースケース

サポートされている[Wallarmのデプロイメントオプション](../supported-deployment-options.md)の中で、以下のユースケースに対してこの解決策が推奨されます：

* Azion Edge上で稼働しているAPIまたはトラフィックのセキュリティ対策。
* 攻撃観測、レポーティング、および悪意のあるリクエストの即時ブロッキングを提供するセキュリティソリューションが必要。

## 制限

この解決策には、受信リクエストのみを扱うという制限があります：

* [パッシブ検出](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)法を使用した脆弱性の発見は正常に機能しません。このソリューションは、測定対象の脆弱性に対して典型的な悪意のあるリクエストへのサーバーレスポンスに基づいてAPIが脆弱かどうかを判断します。
* [Wallarm API Discovery](../../api-discovery/overview.md)はトラフィックに基づいたAPIインベントリを探索することができません。なぜなら、このソリューションはレスポンス分析に依存しているからです。
* [強制ブラウジング防止](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は利用できません。これはレスポンスコード分析が必要だからです。

## 要件

デプロイメントを進めるために、以下の要件を満たしていることを確認してください：

* Azion Edge技術の理解
* Azion Edge上で稼働するAPIまたはトラフィック。

## デプロイメント

Azion Edge上でWallarmを利用してAPIを保護するには、以下の手順を実施してください：

1. 利用可能なデプロイメンオプションの中から、Wallarmノードをデプロイします。
1. Edge Functions用のWallarmコードを取得し、それをAzionで実行します。

### 1. Wallarmノードのデプロイ

Azion Edge上でWallarmを使用する際、トラフィックフローは[インライン](../inline/overview.md)となります。

1. インラインデプロイメント用の[サポートされているWallarmノードデプロイメントソリューションまたはバイナリ](../supported-deployment-options.md#in-line)の中から1つを選び、提供されたデプロイメント手順に従います。
1. 以下のテンプレートを使用してデプロイしたノードを設定します：

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

    次に示す設定に注意を払ってください：

    * HTTPSトラフィックのTLS/SSL証明書：Wallarmノードが安全なHTTPSトラフィックを処理することができるようにするため、TLS/SSL証明書を適切に設定します。具体的な設定は、選択したデプロイメント方法によります。例えば、NGINXを使用している場合は、[その記事](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/)を参照することができます。
    * [Wallarmの動作モード](../../admin-en/configure-wallarm-mode.md)の設定。
1. デプロイメントが完了したら、着信リクエスト転送のアドレスを設定するために必要となるノードインスタンスのIPをメモします。

### 2. Edge Functions用のWallarmコードの取得とAzionでの実行

Azion Edge Functions用のWallarmコードを取得し、実行するには以下の手順を実施してください。

1. Wallarmコードを取得するために[support@wallarm.com](mailto:support@wallarm.com)に連絡します。
1. Azion Edgeで**課金＆サブスクリプション**に移動し、**アプリケーションアクセラレーション**および**Edge Functions**のサブスクリプションを有効にします。
1. 新しい**Edgeアプリケーション**を作成し保存します。
1. 作成したアプリケーションを開き、**メイン設定**から**アプリケーションアクセラレーション**と**Edge Functions**を有効にします。
1. **ドメイン**に移動し、**ドメイン追加**をクリックします。
1. **Edge Functions**に移動し、**Add Function**をクリックし、`Edge Firewall`タイプを選択します。
1. Wallarmソースコードを貼り付け、`wallarm.node.tld`を[前にデプロイされたWallarmノード](#1-wallarm-nodeのデプロイ)のアドレスに置き換えます。
1. **Edge Firewall**に進み、**ルールセット追加**→**名前の入力**→**Domain選択**を行い、**Edge Functions**をオンにします。
1. **Functions**タブに切り替え、**機能追加**をクリックし、前に作成した機能を選択します。
1. **Rules Engine**タブに切り替え→**新規ルール**を設定し、Wallarmによってフィルタリングされるトラフィックの基準を設定します：

    * すべてのリクエストを分析およびフィルタリングするには、`If Request URI starts with /`を選択します。
    * **Behaviors**で、`Then Run Function`を選び、前に作成した機能を選択します。

## テスト

デプロイされたポリシーの機能をテストするには、以下の手順を実施してください：

1. テスト[Path Traversal][ptrav-attack-docs]攻撃と共にリクエストをAPIに送信します：

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. [USクラウド](https://us1.my.wallarm.com/search)または[EUクラウド](https://my.wallarm.com/search)のWallarmコンソールで**Events**セクションを開き、攻撃がリストに表示されていることを確認します。
    
    ![Attacks in the interface][attacks-in-ui-image]

    Wallarmノードモードがブロックに設定されている場合、リクエストもブロックされます。

## 必要なアシスタンス

Azion Edgeと組み合わせたWallarmのデプロイメントについて説明した内容に問題が発生したり、アシスタンスが必要な場合は、[Wallarmサポート](mailto:support@wallarm.com)チームにご連絡ください。彼らはガイダンスを提供し、実装プロセス中に遭遇する可能性のある問題の解決を支援することができます。