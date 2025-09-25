[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Apigee EdgeとWallarm Proxy Bundle

[Apigee Edge](https://docs.apigee.com/api-platform/get-started/what-apigee-edge)はAPIゲートウェイを備えたAPI管理プラットフォームで、クライアントアプリケーションがAPIにアクセスするためのエントリポイントとして機能します。ApigeeのAPIセキュリティを強化するために、本記事で説明するWallarmのAPIプロキシバンドルを統合できます。

本ソリューションは、外部にWallarm nodeをデプロイし、対象プラットフォームにカスタムコードやポリシーを組み込むものです。これにより、トラフィックを外部のWallarm nodeに転送して解析し、潜在的な脅威から保護できます。これらはWallarmのコネクタと呼ばれ、Azion Edge、Akamai Edge、MuleSoft、Apigee、AWS Lambdaと外部のWallarm nodeを結ぶ重要なリンクとして機能します。このアプローチにより、シームレスな統合、安全なトラフィック解析、リスク軽減、プラットフォーム全体のセキュリティが実現します。

## ユースケース

本ソリューションは次のユースケースに推奨されます。

* 単一のAPIプロキシでApigeeプラットフォームにデプロイされたAPIを保護する場合。
* 攻撃の網羅的な観測・レポートと、悪意のあるリクエストの即時ブロックを提供するセキュリティソリューションが必要な場合。

## 制限事項

本ソリューションは受信リクエストのみに対して機能するため、いくつかの制限があります。

* [パッシブ検出](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)手法による脆弱性の発見は適切に機能しません。本ソリューションは、テスト対象の脆弱性に典型的な悪意のあるリクエストに対するサーバーレスポンスに基づいて、APIが脆弱かどうかを判断します。
* [Wallarm API Discovery](../../api-discovery/overview.md)はレスポンス解析に依存するため、トラフィックに基づくAPIインベントリの探索はできません。
* レスポンスコードの解析が必要なため、[強制ブラウジングからの保護](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は利用できません。

## 要件

デプロイを進める前に、以下の要件を満たしていることを確認してください。

* Apigeeプラットフォームについての理解があること。
* APIがApigee上で稼働していること。

## デプロイ

Apigeeプラットフォーム上のAPIを保護するには、次の手順に従ってください。

1. GCPインスタンス上にWallarm nodeをデプロイします。
1. Wallarm proxy bundleを入手し、Apigeeにアップロードします。

### 1. Wallarm nodeをデプロイする

ApigeeでWallarm proxyを使用する場合、トラフィックフローは[インライン](../inline/overview.md)で動作します。そのため、Google Cloud Platformでのインラインデプロイに対応した、サポート済みのWallarm nodeのデプロイアーティファクトから1つ選択してください。

* [GCP Machine Image](../packages/gcp-machine-image.md)
* [Google Compute Engine (GCE)](../cloud-platforms/gcp/docker-container.md)

以下のテンプレートを使用してデプロイしたWallarm nodeを構成してください。

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

デプロイが完了したら、受信リクエストの転送設定に必要となるため、ノードインスタンスのIPアドレスを控えておいてください。なお、IPは内部IPで問題ありません。外部IPである必要はありません。

### 2. Wallarm proxy bundleを入手してApigeeにアップロードする

本統合では、正当なトラフィックをAPIにルーティングするAPIプロキシをApigee上に作成します。そのために、Wallarmはカスタム構成バンドルを提供します。Apigee上のAPIプロキシでWallarmバンドルを入手して[使用](https://docs.apigee.com/api-platform/fundamentals/build-simple-api-proxy)するには、次の手順に従ってください。

1. Apigee向けWallarm proxy bundleを入手するため、[support@wallarm.com](mailto:support@wallarm.com)に連絡します。
1. Apigee Edge UIで、**Develop** → **API Proxies** → **+Proxy** → **Upload proxy bundle**に移動します。
1. Wallarmサポートチームから提供されたバンドルをアップロードします。
1. インポートした構成ファイルを開き、`prewall.js`および`postwall.js`で[Wallarm nodeインスタンスのIPアドレス](#1-deploy-a-wallarm-node)を指定します。
1. 構成を保存してデプロイします。

## テスト

デプロイしたポリシーの機能をテストするには、次の手順に従ってください。

1. テスト用の[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストをAPIに送信します:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Consoleで[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)の**Attacks**セクションを開き、攻撃が一覧に表示されていることを確認します。
    
    ![インターフェイスのAttacks][attacks-in-ui-image]

    Wallarm nodeのモードがblockingに設定されている場合、このリクエストもブロックされます。

## サポートが必要ですか？

Apigeeと連携した本記事のWallarmデプロイについて問題が発生した場合や支援が必要な場合は、[Wallarm support](mailto:support@wallarm.com)チームにご連絡ください。導入プロセス中に直面する可能性のある問題の解決や各種ガイダンスを提供します。