					[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Wallarm ポリシーと共に使う Mulesoft 

[MuleSoft](https://www.mulesoft.com/) は、API ゲートウェイがクライアントアプリケーションがAPIにアクセスするためのエントリーポイントとなるサービス間のシームレスな接続性とデータ統合を可能にする統合プラットフォームです。Wallarm を用いると、Mulesoft Anypoint プラットフォーム上の API を Wallarm ポリシーを使用して保護することができます。この記事では、そのポリシーの取り付け方と利用方法について説明します。

以下の図は、Wallarm ポリシーが MuleSoft Anypoint プラットフォームの API に取り付けられ、Wallarm が悪意のある活動をブロックするように設定されているときの高レベルのトラフィックフローを示しています。

![Mulesoft と Wallarm ポリシー](../../images/waf-installation/gateways/mulesoft/traffic-flow.png)

このソリューションは、Wallarm ノードを外部に展開し、特定のプラットフォームにカスタムコードやポリシーを注入することで、トラフィックを外部の Wallarm ノードに向けて分析し、潜在的な脅威から保護します。これをWallarmのコネクタと呼びます。これは、Azion Edge、Akamai Edge、Mulesoft、Apigee、AWS Lambda などのプラットフォームと外部の Wallarm ノードとの間の重要なリンクとなります。このアプローチは、シームレスな統合、安全なトラフィック解析、リスク軽減、および全体的なプラットフォームセキュリティを確保することができます。

## 使用ケース

すべてのサポートされている [Wallarm デプロイメントオプション](../supported-deployment-options.md) の中から、次の使用ケースのためにこのソリューションが推奨されます：

* MuleSoft Anypoint プラットフォームにデプロイされた API を一つのポリシーだけで保護する。
* 攻撃の観察、報告、悪意のあるリクエストの即時ブロックを提供するセキュリティソリューションが必要。

## 制限事項

このソリューションは、受信リクエストだけで動作するため、いくつかの制限があります：

* [受動検出](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) 方法を使用したバルネラビリティの発見は正しく機能しません。このソリューションは、サーバーのレスポンスを基にAPIがバルネラビリティがあるかどうかを判断します。
* [Wallarm API Discovery](../../about-wallarm/api-discovery.md) は、レスポンス分析に依存しているため、あなたのトラフィックに基づいたAPIのリストを作成することはできません。
* レスポンスコードの解析が必要なため、[強制ブラウジングに対する保護](../../admin-en/configuration-guides/protecting-against-bruteforce.md) は利用できません。

## 要件

デプロイメントを進めるためには、次の要件を満たしていることを確認してください：

* Mulesoftプラットフォームの理解
* [Maven (`mvn`)](https://maven.apache.org/install.html) 3.8 またはそれ以前のバージョンがインストールされています。Mavenの新しいバージョンはMuleプラグインと互換性の問題を起こす可能性があります。
* Mulesoft Exchangeの投稿者ロールが割り当てられており、団体のMulesoft Anypoint Platformアカウントに成果物をアップロードすることが可能です。
* あなたの [Mulesoft Exchangeの認証情報 (ユーザー名とパスワード)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) が `<MAVEN_DIRECTORY>/conf/settings.xml` ファイルに指定されています。
* あなたのアプリケーションとAPIがMulesoft上でリンクされており、稼働しています。

## デプロイメント

Mulesoft Anypoint プラットフォーム上のAPIを Wallarm ポリシーを使用して保護するには、以下のステップに従ってください：

1. 使用可能なデプロイメントオプションの中から一つを選び、Wallarm ノードをデプロイする。
1. Wallarm ポリシーを取得し、それを Mulesoft Exchange にアップロードする。
1. Wallarm ポリシーをあなたの API に取り付ける。

### 1. Wallarm ノードのデプロイ

Wallarm ポリシーを利用すると、トラフィックフローはインラインになります。

1. インラインデプロイメント用の [サポートされている Wallarm ノードのデプロイメントソリューションやアーティファクト](../supported-deployment-options.md) の中から一つを選び、提供されているデプロイメント手順に従います。
1. 以下のテンプレートを使用してデプロイしたノードを設定します：

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

        real_ip_header X-FORWARDED-FOR;
        set_real_ip_from 127.0.0.1;

        location / {
            echo_read_request_body;
        }
    }
    ```

    以下の設定に注意してください：

    * HTTPS トラフィックのための TLS/SSL の証明書：Wallarm ノードがセキュアな HTTPS トラフィックを処理できるようにするには、TLS/SSL の証明書を適切に設定します。具体的な設定は選択したデプロイメント方法によります。たとえば、NGINXを使用している場合は、[その記事](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/)を参考にすることができます。
    * [Wallarm の動作モード](../../admin-en/configure-wallarm-mode.md)の設定。

1. デプロイメントが完了したら、後で受信リクエストの転送先のアドレスを設定するために、ノードインスタンスのIPをメモしておきます。

### 2. Wallarm ポリシーの取得と Mulesoft Exchange へのアップロード

Wallarm ポリシーを取得し、それを [Mulesoft Exchange にアップロード](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange)するには、以下のステップに従ってください：

1. Wallarm Mulesoft ポリシーを取得するために [support@wallarm.com](mailto:support@wallarm.com) に連絡します。
1. 受け取ったポリシーのアーカイブを展開します。
1. ポリシーのディレクトリに移動します：

    ```
    cd <POLICY_DIRECTORY/wallarm
    ```
1. `pom.xml` ファイルの `groupId` パラメータにあなたの Mulesoft 組織 ID を指定します。

    あなたの組織 ID は Mulesoft Anypoint Platform → **アクセス管理** → **組織** → あなたの組織を選択 → ID をコピー で見つけることができます。
1. 以下のコマンドを使ってポリシーを Mulesoft にデプロイします：

    ```
    mvn clean deploy
    ```

あなたのカスタムポリシーは、あなたの Mulesoft Anypoint Platform Exchange で利用可能になりました。

![Mulesoft と Wallarm ポリシー](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. Wallarm ポリシーをあなたの API に取り付ける

Wallarm ポリシーは、すべての API または個々の API に取り付けることができます。

#### すべての API にポリシーを取り付ける

[Mulesoft の自動化ポリシーオプション](https://docs.mulesoft.com/gateway/1.4/policies-automated-applying) を使用してすべての API に Wallarm ポリシーを適用するには、以下のステップに従ってください：

1. あなたの Anypoint Platform で **API マネージャー** → **自動化ポリシー** に移動します。
1. **自動化ポリシーを追加** をクリックし、Exchange から Wallarm ポリシーを選択します。
1. [Wallarm ノードインスタンス](#1-wallarm-ノードのデプロイ)の IP アドレスを `http://` または `https://` を含めて `WLRM REPORTING ENDPOINT` に指定します。
1. 必要であれば、Wallarm が単一のリクエストを処理するための最大時間を、 `WALLARM NODE REQUEST TIMEOUT` の値を変更することで調整します。
1. ポリシーを適用します。

![Wallarm ポリシー](../../images/waf-installation/gateways/mulesoft/automated-policy.png)

#### 個々の API にポリシーを取り付ける

個々の API を Wallarm ポリシーで保護するには、以下の手順に従ってください：

1. あなたの Anypoint Platform で **API マネージャー** に移動し、目的の API を選択します。
1. **ポリシー** → **ポリシーを追加** に移動し、Wallarm ポリシーを選択します。
1. [Wallarm ノードインスタンス](#1-wallarm-ノードのデプロイ)の IP アドレスを `http://` または `https://` を含めて `WLRM REPORTING ENDPOINT` に指定します。
1. 必要であれば、Wallarm が単一のリクエストを処理するための最大時間を、 `WALLARM NODE REQUEST TIMEOUT` の値を変更することで調整します。
1. ポリシーを適用します。

![Wallarm ポリシー](../../images/waf-installation/gateways/mulesoft/policy-for-an-api.png)## テスト

デプロイされたポリシーの機能をテストするには、以下の手順に従ってください:

1. テストの[Path Traversal][ptrav-attack-docs]攻撃をAPIに送信します:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Consoleを開いて→ [米国クラウド](https://us1.my.wallarm.com/search) または[EUクラウド](https://my.wallarm.com/search)の**イベント**セクションに移動し、攻撃がリストに表示されることを確認します。

    ![攻撃のUI][attacks-in-ui-image]

    Wallarmノードモードがブロッキングに設定されている場合、リクエストもブロックされます。

期待通りの動作をしない場合、Mulesoft Anypoint Platform → **ランタイムマネージャー** → ご使用のアプリケーション → **ログ**へアクセスして、APIのログを参照してください。

また、**APIマネージャー**でAPIをナビゲートし、**ポリシー**タブで適用されているポリシーを確認することで、ポリシーがAPIに適用されているかどうかを確認することもできます。自動化ポリシーについては、**カバーされたAPIを見る**オプションを使用して、カバーされているAPIと除外された理由を確認することができます。

## 更新とアンインストール

デプロイされたWallarmポリシーを更新するには、以下の手順に従ってください:

1. 自動化ポリシー一覧または個々のAPIに適用されたポリシー一覧の**ポリシーを削除**オプションを使用して、現在デプロイされているWallarmポリシーを削除します。
1. 上記の手順 2-3に従って新しいポリシーを追加します。
1. 新しいポリシーを適用するために**ランタイムマネージャー**でアタッチされたアプリケーションを再起動します。

ポリシーをアンインストールするには、更新プロセスの最初のステップを実行するだけです。## 援助が必要ですか？

Wallarmのポリシーの展開と、MuleSoftとの結合に関して問題が生じたり、助けが必要な場合、[Wallarmのサポート](mailto:support@wallarm.com)チームに連絡してください。彼らはガイダンスを提供し、実装プロセス中に直面する可能性のある問題を解決する手助けをすることが可能です。