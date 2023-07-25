[ptrav-attack-docs]: ../../attacks-vulns-list.ja.md#path-traversal
[attacks-in-ui-image]: ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Wallarm Proxy Bundleとの連携が可能なApigee Edge

[Apigee Edge](https://docs.apigee.com/api-platform/get-started/what-apigee-edge)は、クライアントアプリケーションがAPIにアクセスするためのエントリーポイントとしてAPIゲートウェイを提供するAPI管理プラットフォームです。ApigeeのAPIセキュリティを強化するために、この記事で詳述するようにWallarmのAPIプロキシバンドルを統合することができます。

このソリューションでは、Wallarmノードを外部にデプロイし、特定のプラットフォームにカスタムコードやポリシーを注入します。これにより、トラフィックは外部のWallarmノードへと向けられ、潜在的な脅威からの分析と保護が可能となります。Wallarmのコネクタと呼ばれるこれらの要素は、Azion Edge、Akamai Edge、Mulesoft、Apigee、AWS Lambdaなどのプラットフォームと外部のWallarmノードとの間の必須のリンクとして機能します。このアプローチは、統合のシームレスさ、セキュリティトラフィックの分析、リスクの軽減、そして全体的なプラットフォームのセキュリティを保証します。

## 利用場面

すべての対応[Wallarmのデプロイオプション](../supported-deployment-options.ja.md)の中でも、このソリューションは次のような利用場面で推奨されます。

* Apigeeプラットフォーム上でデプロイされているAPIを1つのAPIプロキシで保護する必要がある
* 攻撃の観察、レポート、悪意のあるリクエストの即時ブロックを提供するセキュリティソリューションが必要な場合

## 制限事項

このソリューションは、入力されるリクエストのみに対応するため、一部の制限があります：

* [パッシブ検出](../../about-wallarm/detecting-vulnerabilities.ja.md#passive-detection)を用いた脆弱性の検出は、適切に機能しません。このソリューションは、それがテストしている脆弱性に典型的な悪意のあるリクエストへのサーバーのレスポンスに基づいて、APIが脆弱かどうかを判断します。
* [Wallarm API Discovery](../../about-wallarm/api-discovery.ja.md)は、レスポンスの分析を頼りにしてサービスを拡大するため、あなたのトラフィックに基づいてAPIのインベントリを探索することはできません。
* 応答コードの分析を必要とするため、[強制的なブラウジングに対する保護](../../admin-en/configuration-guides/protecting-against-bruteforce.ja.md)が利用できません。

## 要件

デプロイメントを進めるためには、以下の要件を満たしていることを確認してください：

* Apigeeプラットフォームについての理解
* Apigee上でAPIが稼働している

## デプロイメント

ApigeeプラットフォームのAPIを保護するためには、次の手順を行ってください：

1. GCPインスタンス上にWallarmノードをデプロイする
1. Wallarmプロキシバンドルを取得し、Apigeeにアップロードする

### 1. Wallarmノードのデプロイ

Apigee上でWallarmプロキシを使用する際、トラフィックフローはインラインで動作します。そのため、Google Cloud Platform上でのインラインデプロイメント用のサポートされるWallarmノードのデプロイメントアーティファクトの中から一つを選択してください：

* [GCPマシンイメージ](../packages/gcp-machine-image.ja.md)
* [Google Compute Engine (GCE)](../cloud-platforms/gcp/docker-container.ja.md)

デプロイされたノードを以下のテンプレートを使用して設定します：

```
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	server_name _;

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
	
	wallarm_mode block;
	real_ip_header X-LAMBDA-REAL-IP;
	set_real_ip_from 127.0.0.1;

	location / {
		echo_read_request_body;
	}
}
```

デプロイメントが完了したら、着信リクエストの転送設定を行うために必要なノードインスタンスのIPアドレスを控えておきます。IPは内部のものであっても構いません。外部向けである必要はありません。

### 2. Wallarmプロキシバンドルを取得し、Apigeeにアップロードする

この統合では、合法的なトラフィックをあなたのAPIにルーティングするApigee上のAPIプロキシを作成することが求められます。この目的のために、Wallarmはカスタムの設定バンドルを提供しています。Wallarmバンドルを取得し、Apigee上のAPIプロキシで[使用](https://docs.apigee.com/api-platform/fundamentals/build-simple-api-proxy)するために以下の手順を行ってください：

1. Wallarmのサポートチームが提供したバンドルをアップロードするために[support@wallarm.com](mailto:support@wallarm.com)に連絡を取ってください。
1. Apigee Edge UIで **Develop** → **API Proxies** → **+Proxy** → **Upload proxy bundle** へと進んでください。
1. Wallarmのサポートチームが提供したバンドルをアップロードします。
1. インポートした設定ファイルを開き、`prewall.js` と `postwall.js` に[WallarmノードインスタンスのIPアドレス](#1-deploy-a-wallarm-node)を指定します。
1. 設定を保存し、デプロイします。

## テスト

デプロイしたポリシーの機能をテストするには、次の手順を行ってください：

1. あなたのAPIに対してテスト[Path Traversal][ptrav-attack-docs]攻撃を含むリクエストを送信します：

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. [US Cloud](https://us1.my.wallarm.com/search)または[EU Cloud](https://my.wallarm.com/search)のWallarmコンソール → **Events**セクション を開き、攻撃がリストに表示されていることを確認します。
    
    ![!Attacks in the interface][attacks-in-ui-image]

    Wallarmノードモードがブロックに設定されている場合、リクエストもブロックします。

## アシスタンスが必要ですか？

Apigeeと連携したWallarmのデプロイメントに関する問題を解決するためのヘルプが必要な場合、または何か問題が発生した場合は、[Wallarmのサポート](mailto:support@wallarm.com)チームに連絡を取ってください。実装プロセス中に遭遇する問題の解決をサポートするために彼らは常に利用可能です。