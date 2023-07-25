[ptrav-attack-docs]:                ../../attacks-vulns-list.ja.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Wallarm Node.js for AWS Lambda

[AWS Lambda@Edge](https://aws.amazon.com/lambda/edge/)は、さまざまなタイプのアプリケーションやバックエンドサービスのコードを実行するために、サーバーのプロビジョニングや管理が不要なサーバーレス、イベント駆動コンピューティングサービスです。Wallarm Node.jsコードを組み込むことで、来るトラフィックをWallarmノードにプロキシして分析やフィルタリングが可能になります。本記事では、AWSアプリケーションのNode.jsラムダに特化したトラフィック分析とフィルタリングを設定する方法について説明します。

<!-- ![!Lambda](../../images/waf-installation/gateways/aws-lambda-traffic-flow.png) -->

この解決策は、Wallarmノードを外部にデプロイし、特定のプラットフォームにカスタムコードやポリシーを注入することを含んでいます。これにより、トラフィックは外部のWallarmノードに向けられ、分析と潜在的な脅威に対する保護が可能になります。これらはWallarmのコネクタとも呼ばれ、Azion Edge、Akamai Edge、Mulesoft、Apigee、そしてAWS Lambdaのようなプラットフォームと外部のWallarmノードとの間の不可欠なリンクとなります。このアプローチにより、シームレスな統合、安全なトラフィック分析、リスク軽減、および全体的なプラットフォームのセキュリティが確保されます。

## ユースケース

すべての[supported Wallarm deployment options](../supported-deployment-options.ja.md) の中で、以下のユースケースには、この解決策が最も推奨されます：

* Node.jsラムダを使用するAWS上のアプリケーションのセキュリティ確保。
* 攻撃の観察、レポート作成、悪意のあるリクエストの即時ブロックを提供するセキュリティソリューションが必要。

## 制限事項

この解決策は、次のような制限があるため、送信されたリクエストのみを扱います。

* [パッシブ検出](../../about-wallarm/detecting-vulnerabilities.ja.md#passive-detection) 方法を用いた脆弱性の発見が適切に機能しない。この解決策は、脆弱性のテストに典型的な悪意あるリクエストへのサーバーのレスポンスに基づいて、APIが脆弱かどうかを判断します。
* [Wallarm API Discovery](../../about-wallarm/api-discovery.ja.md)は、解決策が応答分析に依存しているため、あなたのトラフィックに基づいたAPIのインベントリを探索することができません。
* 応答コード分析が必要なため、[強制ブラウジングに対する保護](../../admin-en/configuration-guides/protecting-against-bruteforce.ja.md)は利用できません。

また、他にも以下の制限があります:

* ビューワーリクエストレベルでのHTTPパケットボディのサイズは40 KBに、オリジンリクエストレベルでは1 MBに制限されています。
* Wallarmノードからの最大応答時間は、ビューワーリクエストでは5秒、オリジンリクエストでは30秒に制限されています。
* Lambda@Edgeはプライベートネットワーク（VPC）内で動作しません。
* 同時に処理されるリクエストの最大数は、地域あたり1,000（デフォルトのクォータ）、しかし何万まで増やすことが可能です。

## 必要条件

デプロイを行うには、以下の条件を満たしていることを確認してください:

* AWS Lambdaテクノロジーについての理解。
* AWS上で実行中のAPIまたはトラフィック。

## デプロイ

AWS上のアプリケーションでNode.jsラムダを使用してWallarmを安全にするには、以下の手順を守ってください：

1. AWSインスタンスにWallarmノードをデプロイします。
2. Wallarm Node.jsスクリプトをAWS Lambdaで提供し、実行します。

### 1. Wallarmノードのデプロイ

AWS LambdaとWallarmを統合する際は、トラフィックの流れはインラインで動作します。したがって、AWSでのインラインデプロイメントに対応したサポートされるWallarmノードデプロイメントアーティファクトの一つを選んでください:

* [AWS AMI](../packages/aws-ami.ja.md)
* [Amazon Elastic Container Service (ECS)](../cloud-platforms/aws/docker-container.ja.md)

次のテンプレートを使用してデプロイしたノードを設定してください:

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

	real_ip_header X-Lambda-Real-IP;
	set_real_ip_from 127.0.0.1;

	location / {
		echo_read_request_body;
	}
}
```

以下の設定に注意を払うようにしてください:

* HTTPSトラフィックのためのTLS/SSL証明書: WallarmノードがセキュアなHTTPSトラフィックを扱うことができるように、TLS/SSL証明書を適切に設定してください。具体的な設定は、選択したデプロイメント方法によります。例えば、NGINXを使用している場合は、[こちらの記事](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/)を参照してください。
* [Wallarmの動作モード](../../admin-en/configure-wallarm-mode.ja.md)の設定。

### 2. AWS Lambda用のWallarm Node.jsスクリプトの取得と実行

AWS LambdaでWallarm Node.jsスクリプトを取得して実行するには、以下の手順を守ってください：

1. Wallarm Node.jsを取得するために、[support@wallarm.com](mailto:support@wallarm.com)に連絡します。
2. 次の以下の許可を含む新たなIAMポリシーを[作成](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html)してください。

    ```
    lambda:CreateFunction, 
    lambda:UpdateFunctionCode, 
    lambda:AddPermission, 
    iam:CreateServiceLinkedRole, 
    lambda:GetFunction, 
    lambda:UpdateFunctionConfiguration, 
    lambda:DeleteFunction, 
    cloudfront:UpdateDistribution, 
    cloudfront:CreateDistribution, 
    lambda:EnableReplication. 
    ```
3. AWS Lambdaサービスで、Node.js 14.xをランタイムとし、前のステップで作成したロールを使用して新しい機能を作成します。**基本的なLambda権限を持つ新しいロールを作成** を選択します。
4. コードソースエディタで、Wallarmサポートチームから受け取ったコードを貼り付けます。
5. 貼り付けられたコードの中で、`WALLARM_NODE_HOSTNAME` および `WALLARM_NODE_PORT` の値を、[以前にデプロイしたWallarmノード](#1-deploy-a-wallarm-node) を指すように更新します。
    
    フィルタリングノードに対して443/SSLを介してトラフィックを送信するには、以下の設定を使用してください。

    ```
    const WALLARM_NODE_PORT = '443';

    var http = require('https');
    ```

    自己署名証明書を使用している場合は、厳密な証明書の強制を無効にするために以下の変更を行ってください：

    ```
    var post_options = {
        host: WALLARM_NODE_HOSTNAME,
        port: WALLARM_NODE_PORT,
        path: request.uri + request.querystring,
        method: request.method,
        // only need if self-signed cert
        rejectUnauthorized: false, 
        // 
        headers: newheaders
        
    };
    ```
6. IAMセクションに戻り、新たに作成されたロールを編集するために以下のポリシーを添付します: `AWSLambda_FullAccess`, `AWSLambdaExecute`, `AWSLambdaBasicExecutionRole`, `AWSLambdaVPCAccessExecutionRole`, そして 前のステップで作成した `LambdaDeployPermissions`。
7. 信頼関係において、**Service**に以下の変更を加えます：

    ```
    "Service": [
                        "edgelambda.amazonaws.com",
                        "lambda.amazonaws.com"
                    ]
    ```
8. Lambda → Functions → <YOUR_FUNCTION>に移動し、**Add Trigger**をクリックします。
9. Deploy to Lambda@Edgeのオプションで、**Deploy to Lambda@Edge**をクリックし、Wallarmハンドラを追加する必要があるCloudFront Distributionを選択するか、新しいものを作成します。

    このプロセスの間には、CloudFront イベントのために **Viewer request** を選択し、**Include body** のボックスをチェックします。

## テスト

デプロイしたポリシーの機能をテストするには、以下の手順を守ってください：

1. テストの[Path Traversal][ptrav-attack-docs]攻撃を含むリクエストをあなたのAPIに送ります：

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
2. [US Cloud](https://us1.my.wallarm.com/search)または[EU Cloud](https://my.wallarm.com/search)のWallarm Console → **Events** セクションを開き、攻撃がリストに表示されていることを確認します。
    
    ![!Attacks in the interface][attacks-in-ui-image]

    Wallarmノードのモードがブロックに設定されている場合、リクエストもまたブロックされます。

## 助けが必要ですか？
AWS Lambdaと組み合わせたWallarmのデプロイに関して問題が発生した場合や、実装過程で助けが必要な場合は、[Wallarmサポート](mailto:support@wallarm.com)チームに連絡してください。彼らはあなたが直面する問題の解決や、ガイダンスの提供をするためにいつでもご利用いただけます。