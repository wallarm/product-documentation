[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Wallarm Proxy Bundleを使用したApigee Edge

[Apigee Edge](https://docs.apigee.com/api-platform/get-started/what-apigee-edge)は、APIゲートウェイがクライアントアプリケーションによるAPIへのアクセスのエントリーポイントとなるAPI管理プラットフォームです。ApigeeでAPIのセキュリティを向上させるために、本記事に記載の通りWallarmのAPIプロキシバンドルを統合できます。

本ソリューションは、外部にWallarmノードをデプロイし、特定プラットフォームにカスタムコードまたはポリシーを注入することで実現します。これにより、トラフィックは潜在的な脅威に対する解析と防御のために外部のWallarmノードへ誘導されます。Wallarmのコネクタと呼ばれるこれらの要素は、Azion Edge、Akamai Edge、Mulesoft、Apigee、AWS Lambdaなどのプラットフォームと外部Wallarmノードとの必須の連携点として機能します。このアプローチにより、シームレスな統合、安全なトラフィック解析、リスク軽減、全体的なプラットフォームセキュリティが確保されます。

## ユースケース

すべてのサポートされている[Wallarmデプロイメントオプション](../supported-deployment-options.md)の中で、本ソリューションは以下のユースケースに対して推奨されます：

* 単一のAPIプロキシのみでApigeeプラットフォーム上にデプロイされたAPIの保護。
* 不正リクエストの即時ブロック、包括的な攻撃検出およびレポーティングを提供するセキュリティソリューションが必要な場合。

## 制限事項

本ソリューションには、着信リクエストにのみ対応するという制限があります：

* [パッシブ検出](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)方式を用いた脆弱性検出は正しく機能しません。本ソリューションは、テスト対象の脆弱性に典型的な悪意あるリクエストに対するサーバーレスポンスに基づいてAPIが脆弱か否かを判断します。
* [Wallarm API Discovery](../../api-discovery/overview.md)は、レスポンス解析に依存するため、お客様のトラフィックに基づいたAPI在庫の探索は行えません。
* [強制ブラウジングに対する保護](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は、レスポンスコード解析を必要とするため利用できません。

## 必要条件

デプロイを進めるためには、以下の条件を満たしている必要があります：

* Apigeeプラットフォームの理解。
* お客様のAPIがApigee上で稼働していること。

## デプロイ

Apigeeプラットフォーム上のAPIを保護するため、以下の手順に従ってください：

1. GCPインスタンスにWallarmノードをデプロイします。
1. Wallarmプロキシバンドルを取得し、Apigeeにアップロードします。

### 1. Wallarmノードのデプロイ

Apigee上でWallarmプロキシを使用する場合、トラフィックフローは[インライン](../inline/overview.md)で動作します。そのため、Google Cloud Platform上でのインラインデプロイに対応する、サポートされているWallarmノードデプロイメントアーティファクトのいずれかを選択してください：

* [GCP Machine Image](../packages/gcp-machine-image.md)
* [Google Compute Engine (GCE)](../cloud-platforms/gcp/docker-container.md)

以下のテンプレートを使用してデプロイされたノードを構成します：

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

デプロイが完了したら、着信リクエストの転送設定に必要なノードインスタンスのIPアドレスを確認してください。なお、IPは内部IPでも構いません。

### 2. Wallarmプロキシバンドルの取得とApigeeへのアップロード

本統合では、APIプロキシをApigee上に作成し、正当なトラフィックをAPIへルーティングします。これを実現するために、Wallarmはカスタム構成バンドルを提供します。以下の手順に従い、Apigee上のAPIプロキシにWallarmバンドルを[使用](https://docs.apigee.com/api-platform/fundamentals/build-simple-api-proxy)してください：

1. [support@wallarm.com](mailto:support@wallarm.com)に連絡し、Apigee用のWallarmプロキシバンドルを取得します。
1. Apigee Edge UIで、**Develop** → **API Proxies** → **+Proxy** → **Upload proxy bundle**に移動します。
1. Wallarmサポートチームから提供されたバンドルをアップロードします。
1. インポートされた構成ファイルを開き、`prewall.js`および`postwall.js`に[WallarmノードインスタンスのIPアドレス](#1-deploy-a-wallarm-node)を指定します。
1. 構成を保存し、デプロイします。

## テスト

デプロイされたポリシーの動作をテストするには、以下の手順に従ってください：

1. お客様のAPIに対してテスト用の[パストラバーサル攻撃][ptrav-attack-docs]リクエストを送信します：

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)の**Attacks**セクションを開き、攻撃がリストに表示されていることを確認します。
    
    ![Attacks in the interface][attacks-in-ui-image]

    Wallarmノードのモードがblockingに設定されている場合、リクエストはブロックされます。

## サポートが必要ですか？

記載のApigeeとの連携におけるWallarmのデプロイに関して問題が発生した場合やサポートが必要な場合は、[Wallarmサポート](mailto:support@wallarm.com)チームにご連絡ください。実装プロセス中に発生する問題解決のガイダンスを提供いたします。