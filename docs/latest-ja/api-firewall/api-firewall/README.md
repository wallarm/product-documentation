# WallarmによるオープンソースAPIファイアウォール [![Black Hat Arsenal USA 2022](https://github.com/wallarm/api-firewall/blob/main/images/BHA2022.svg?raw=true)](https://www.blackhat.com/us-22/arsenal/schedule/index.html#open-source-api-firewall-new-features--functionalities-28038)

APIファイアウォールは、[OpenAPI/Swagger](https://www.wallarm.com/what/what-is-openapi)スキーマに基づいたAPIリクエストとレスポンスの検証を行う高性能なプロキシです。クラウドネイティブな環境のREST APIエンドポイントを保護するように設計されています。APIファイアウォールは、リクエストとレスポンスの事前定義されたAPI仕様に一致する呼び出しを許可し、それ以外の全てを拒否するポジティブなセキュリティモデルを用いてAPIをハードニングします。

APIファイアウォールの**主な機能**は以下の通りです：

* 悪意のあるリクエストをブロックすることでREST APIエンドポイントを保護します
* 不正なAPIレスポンスをブロックしてAPIデータの違反を停止します
* Shadow APIエンドポイントを検出します
* OAuth 2.0プロトコルに基づく認証のためのJWTアクセストークンを確認します
* (新機能) コンプロミスされたAPIトークン、キー、及びクッキーをブラックリストに登録します

この製品は**オープンソース**であり、DockerHubで利用可能で、すでに10億回以上(!!!)ダウンロードされています。このプロジェクトを支援するために、[リポジトリ](https://hub.docker.com/r/wallarm/api-firewall)をスターできます。

## 使用例

### ブロッキングモードでの実行
* OpenAPI 3.0仕様に一致しない悪意のあるリクエストをブロックします
* データ違反と機密情報の露出を防ぐために不正なAPIレスポンスをブロックします

### モニタリングモードでの実行
* Shadow APIと文書化されていないAPIエンドポイントを検出します
* OpenAPI 3.0仕様に一致しない不正なリクエストとレスポンスをログに記録します

## APIスキーマの検証とポジティブなセキュリティモデル

APIファイアウォールを開始する際には、APIファイアウォールで保護するアプリケーションの[OpenAPI 3.0仕様](https://swagger.io/specification/) を提供する必要があります。起動したAPIファイアウォールはリバースプロキシとして動作し、リクエストとレスポンスが仕様に定義されたスキーマと一致するかどうかを検証します。

スキーマと一致しないトラフィックは、[`STDOUT` と `STDERR` Docker サービス](https://docs.docker.com/config/containers/logging/)を使用してログに記録されるか、またはブロックされます(APIファイアウォールの運用モードによります)。ロギングモードで運用すると、APIファイアウォールは「シャドウAPIエンドポイント」もログに記録します。これらはAPI仕様でカバーされていないエンドポイントで、リクエストに応答します(`404` コードを返すエンドポイントを除く)。

![APIファイアウォールのスキーム](https://github.com/wallarm/api-firewall/blob/main/images/Firewall%20opensource%20-%20vertical.gif?raw=true)

[OpenAPI 3.0仕様](https://swagger.io/specification/)はサポートされており、YAMLやJSONファイル(`.yaml`、`.yml`、`.json`ファイル拡張子)として提供する必要があります。

OpenAPI 3.0仕様でトラフィック要件を設定できるようにすることで、APIファイアウォールはポジティブなセキュリティモデルに依存します。

## 技術データ

[APIファイアウォールは](https://www.wallarm.com/what/the-concept-of-a-firewall)、組み込みのOpenAPI 3.0リクエストとレスポンスバリデータを持つリバースプロキシとして機能します。Golangで記述されており、fasthttpプロキシを使用しています。このプロジェクトは極端なパフォーマンスとほぼゼロの追加遅延を目指して最適化されています。

## APIファイアウォールの開始

APIファイアウォールをダウンロード、インストール、およびDockerで起動するには、[こちらの手順](https://docs.wallarm.com/api-firewall/installation-guides/docker-container/)をご覧ください。

## デモ

APIファイアウォールを試すために、APIファイアウォールで保護されたサンプルアプリケーションを展開するデモ環境を実行することができます。利用可能なデモ環境は2つあります：

* [Docker Composeを使用したAPIファイアウォールデモ](https://github.com/wallarm/api-firewall/tree/main/demo/docker-compose)
* [Kubernetesを使用したAPIファイアウォールデモ](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes)

## APIファイアウォールに関連するWallarmのブログ記事

* [APIファイアウォールを使用したShadow APIの検出](https://lab.wallarm.com/discovering-shadow-apis-with-a-api-firewall/)
* [Wallarmの API ファイアウォールが本番環境で NGINX を上回る](https://lab.wallarm.com/wallarm-api-firewall-outperforms-nginx-in-a-production-environment/)
* [OSS APIFWで無料でREST APIを保護する](https://lab.wallarm.com/securing-rest-with-free-api-firewall-how-to-guide/)

## パフォーマンス

APIファイアウォールを作成する際、私たちは速度と効率を優先し、お客様が可能な限り最速のAPIを持つことを確認しました。最新のテストでは、APIファイアウォールが1つのリクエストを処理するのに必要な平均時間は1.339ミリ秒で、これはNginxよりも66％速いです：

'''
APIファイアウォール0.6.2（JSONバリデーション付き）

$ ab -c 200 -n 10000 -p ./large.json -T application/json http://127.0.0.1:8282/test/signup

1秒あたりのリクエスト数:    13005.81 [#/sec] (平均)
リクエストあたりの時間:       15.378 [ms] (平均)
リクエストあたりの時間:       0.077 [ms] (平均、すべての同時リクエストにわたる)

NGINX 1.18.0（JSONバリデーションなし）

$ ab -c 200 -n 10000 -p ./large.json -T application/json http://127.0.0.1/test/signup

1秒あたりのリクエスト数:    7887.76 [#/sec] (平均)
リクエストあたりの時間:       25.356 [ms] (平均)
リクエストあたりの時間:       0.127 [ms] (平均, すべての同時リクエストにわたる)
'''

これらのパフォーマンス結果は、APIファイアウォールのテスト中に得られたものだけではありません。他の結果、およびAPIファイアウォールのパフォーマンスを改善するために使用した方法は、この[Wallarmのブログ記事](https://lab.wallarm.com/wallarm-api-firewall-outperforms-nginx-in-a-production-environment/)で説明されています。