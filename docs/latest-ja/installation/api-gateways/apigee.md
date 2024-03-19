[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Apigee EdgeとWallarm Proxy Bundle

[Apigee Edge](https://docs.apigee.com/api-platform/get-started/what-apigee-edge)は、クライアントアプリケーションがAPIにアクセスするためのエントリーポイントとして機能するAPIゲートウェイを備えたAPI管理プラットフォームです。ApigeeのAPIセキュリティを強化するために、この記事で詳述されているようにWallarmのAPIプロキシバンドルを統合することができます。

このソリューションは、Wallarmノードを外部にデプロイし、カスタムコードやポリシーを特定のプラットフォームに注入することを含んでいます。これにより、トラフィックは分析と潜在的な脅威からの保護のために外部のWallarmノードに向けられます。Wallarmのコネクタとして知られているこれらは、Azion Edge、Akamai Edge、Mulesoft、Apigee、およびAWS Lambdaなどのプラットフォームと、外部Wallarmノードとの間の必要なリンクとして機能します。このアプローチは、シームレスな統合、セキュアなトラフィック分析、リスク軽減、および全体的なプラットフォームセキュリティを確保します。

## ユースケース

すべてのサポートされている[Wallarmのデプロイオプション](../supported-deployment-options.md)の中でも、このソリューションは以下のユースケースに対して推奨されます：

* Apigeeプラットフォーム上にデプロイされたAPIを、一つのAPIプロキシのみで保護します。
* 包括的な攻撃観察、報告、および悪意のあるリクエストの即時ブロッキングを提供するセキュリティソリューションが必要です。

## 制限事項

このソリューションは入力リクエストのみで機能するため、一部の制限があります:

* [パッシブ検出](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)法を使用した脆弱性の発見は正常に機能しません。このソリューションは、それが試験する脆弱性に典型的な攻撃リクエストに対するサーバーの応答に基づいてAPIが脆弱性を持っているかどうかを判断します。
* [Wallarm API Discovery](../../api-discovery/overview.md)は、ソリューションが応答分析に依存しているため、トラフィックに基づいてAPIインベントリーを探索することができません。
* 応答コード分析を必要とするため、[強制ブラウジングに対する保護](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は利用できません。

## 必要条件

デプロイメントを進めるためには、以下の要件を満たしていることを確認してください:

* Apigeeプラットフォームについての理解。
* あなたのAPIはApigee上で稼働しています。

## デプロイメント操作

Apigeeプラットフォーム上のAPIを保護するためには、以下のステップを実行します：

1. GCPインスタンス上にWallarmノードをデプロイします。
1. Wallarmプロキシバンドルを取得し、それをApigeeにアップロードします。

### 1. Wallarmノードをデプロイする

WallarmプロキシをApigeeで使用する場合、トラフィックフローは[インライン](../inline/overview.md)で動作します。したがって、Google Cloud Platform上でのインラインデプロイメント用のサポートされているWallarmノードデプロイメントアーティファクトの一つを選択します：

* [GCPマシンイメージ](../packages/gcp-machine-image.md)
* [Google Compute Engine (GCE)](../cloud-platforms/gcp/docker-container.md)

以下のテンプレートを使用して、デプロイされたノードを設定します：

```
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	server_name _;

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
	
	wallarm_mode block;
	real_ip_header X-LAMBDA-REAL-IP;
	set_real_ip_from unix:;

	location / {
		echo_read_request_body;
	}
}
```

デプロイメントが完了したら、仕向けリクエストの設定が必要になるため、ノードインスタンスのIPアドレスをメモしておいてください。これは内部的なIPであっても構いません。外部である必要はありません。

### 2. Wallarmプロキシバンドルを取得し、それをApigeeにアップロードします。

APIを代行するAPIプロキシをApigee上で作成し、合法的なトラフィックをあなたのAPIにルーティングするという統合が含まれます。このために、Wallarmはカスタム設定バンドルを提供します。WallarmのバンドルをApigeeのAPIプロキシで[使用](https://docs.apigee.com/api-platform/fundamentals/build-simple-api-proxy)するために、次の手順を実行します：

1. WallarmのApigee用プロキシバンドルを取得するために[support@wallarm.com](mailto:support@wallarm.com)まで連絡します。
1. Apigee Edge UIで**開発** → **API Proxies** → **+Proxy** → **Upload proxy bundle**に移動します。
1. Wallarmサポートチームから提供されたバンドルをアップロードします。
1. インポートした設定ファイルを開き、`prewall.js`および`postwall.js`内で[Wallarm node instanceのIPアドレス](#1-deploy-a-wallarm-node)を指定します。
1. 設定を保存してデプロイします。

## テスト

デプロイしたポリシーの機能をテストするには、以下の手順を実行します:

1. テスト[Path Traversal][ptrav-attack-docs]攻撃とともにリクエストをあなたのAPIに送信します：

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. [US Cloud](https://us1.my.wallarm.com/search)または[EU Cloud](https://my.wallarm.com/search)のWallarm Console → **Events** セクションを開き、攻撃がリストに表示されていることを確認します。

    ![Attacks in the interface][attacks-in-ui-image]

    もしWallarmノードモードがブロッキングに設定されている場合、リクエストもブロックされます。

## お困りですか？

Apigeeと連携したWallarmのデプロイメントについて何か問題がある、またはその実装プロセス中に何か助けが必要な場合、[Wallarmのサポート](mailto:support@wallarm.com)チームに連絡を取ることができます。彼らはガイダンスを提供し、実装プロセス中に遭遇する可能性のある問題の解決をお手伝いします。