# WallarmによるオープンソースAPIファイアウォール [![Black Hat Arsenal USA 2022](https://github.com/wallarm/api-firewall/blob/main/images/BHA2022.svg?raw=true)](https://www.blackhat.com/us-22/arsenal/schedule/index.html#open-source-api-firewall-new-features--functionalities-28038)

APIファイアウォールは、[OpenAPI/Swagger](https://www.wallarm.com/what/what-is-openapi)スキーマに基づくAPIリクエストとレスポンスの検証を提供する高性能プロキシです。これはクラウドネイティブ環境でREST APIエンドポイントを保護するためのデザインとなっています。APIファイアウォールは、リクエストとレスポンスの事前定義されたAPI仕様に一致する呼び出しを許可し、それ以外のすべてを拒否することによる、ポジティブセキュリティモデルを使用してAPIのハードニングを提供します。

APIファイアウォールの**主な特長**は次のとおりです：

* 悪意のあるリクエストをブロックし、REST APIエンドポイントを保護します
* 形式が不正なAPIレスポンスをブロックし、APIデータ侵害を止めます
* Shadow APIエンドポイントを検出します
* OAuth 2.0プロトコルベースの認証のためのJWTアクセストークンを検証します
* （新機能）APIトークン、キー、およびCookiesをブラックリストに追加します

この製品は**オープンソース**であり、DockerHubで利用可能で、すでに10憶回（！）ダウンロードされています。このプロジェクトを支援するためには、[リポジトリ](https://hub.docker.com/r/wallarm/api-firewall)にスターをつけることができます。

## 使用事例

### ブロッキングモードでの運用
* OpenAPI 3.0仕様に一致しない悪意のあるリクエストをブロックします
* データ侵害と機密情報の漏えいを防ぐために、形式が不正なAPIレスポンスをブロックします

### モニタリングモードでの運用
* Shadow APIやドキュメント化されていないAPIエンドポイントを検出します
* OpenAPI 3.0仕様に一致しない形式の不正なリクエストとレスポンスをログに記録します

## APIスキーマ検証およびポジティブセキュリティモデル

APIファイアウォールを開始するとき、APIファイアウォールが保護する予定のアプリケーションの[OpenAPI 3.0仕様](https://swagger.io/specification/)を提供する必要があります。開始したAPIファイアウォールはリバースプロキシとして動作し、リクエストとレスポンスが仕様のスキーマに一致するかどうかを検証します。

スキーマに一致しないトラフィックは、[`STDOUT（標準出力）`および`STDERR（標準エラー出力）` Dockerサービス](https://docs.docker.com/config/containers/logging/)を使用してログに記録されるか、またはブロックされる（APIファイアウォールの設定モードによる）。ログモードで動作するとき、APIファイアウォールは、API仕様には含まれていないがリクエストに応答する所謂シャドウAPIエンドポイントもログに記録します（ただし、`404`のコードを返すエンドポイントは除く）。

![API Firewall scheme](https://github.com/wallarm/api-firewall/blob/main/images/Firewall%20opensource%20-%20vertical.gif?raw=true)

[OpenAPI 3.0仕様](https://swagger.io/specification/)は対応しており、YAMLまたはJSONファイル（`.yaml`、`.yml`、`.json`ファイル拡張子）として提供する必要があります。

OpenAPI 3.0仕様を使用してトラフィック要件を設定することにより、APIファイアウォールはポジティブセキュリティモデルに依存します。

## 技術情報

[APIファイアウォールは](https://www.wallarm.com/what/the-concept-of-a-firewall)、組み込みのOpenAPI 3.0リクエストおよびレスポンスバリデータを備えたリバースプロキシとして動作します。これはGolangで書かれており、fasthttpプロキシを使用しています。プロジェクトは極限のパフォーマンスとほぼゼロの追加遅延を目指して最適化されています。

## APIファイアウォールの起動

Docker上でAPIファイアウォールをダウンロード、インストール、および起動するには、[こちらの説明](https://docs.wallarm.com/api-firewall/installation-guides/docker-container/)をご覧ください。

## デモ

APIファイアウォールを試すため、APIファイアウォールで保護されたサンプルアプリケーションをデプロイするためのデモ環境を実行できます。利用可能なデモ環境は2つあります：

* [APIファイアウォールのDocker Composeによるデモ](https://github.com/wallarm/api-firewall/tree/main/demo/docker-compose)
* [APIファイアウォールのKubernetesによるデモ](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes)

## APIファイアウォールに関連するWallarmのブログ記事

* [APIファイアウォールでShadow APIを発見](https://lab.wallarm.com/discovering-shadow-apis-with-a-api-firewall/)
* [Wallarm APIファイアウォール、本番環境でのNGINXのパフォーマンスを上回る](https://lab.wallarm.com/wallarm-api-firewall-outperforms-nginx-in-a-production-environment/)
* [OSS APIFWを利用し、無償でREST APIを保護](https://lab.wallarm.com/securing-rest-with-free-api-firewall-how-to-guide/)

## パフォーマンス

APIファイアウォールの作成において、私たちは速度と効率を優先し、お客様が最速のAPIを持てるようにしました。最新のテストでは、APIファイアウォールが1つのリクエストを処理するのに必要な平均時間は1.339 msであり、これはNginxよりも66%高速です：

```
API Firewall 0.6.2 with JSON validation

$ ab -c 200 -n 10000 -p ./large.json -T application/json http://127.0.0.1:8282/test/signup

Requests per second:    13005.81 [#/sec] (mean)
Time per request:       15.378 [ms] (mean)
Time per request:       0.077 [ms] (mean, across all concurrent requests)

NGINX 1.18.0 without JSON validation

$ ab -c 200 -n 10000 -p ./large.json -T application/json http://127.0.0.1/test/signup

Requests per second:    7887.76 [#/sec] (mean)
Time per request:       25.356 [ms] (mean)
Time per request:       0.127 [ms] (mean, across all concurrent requests)
```

これらのパフォーマンスの結果は、APIファイアウォールのテスト中に得られたものだけでなく、他の結果やAPIファイアウォールのパフォーマンスを向上させるための方法については、[このWallarmのブログ記事](https://lab.wallarm.com/wallarm-api-firewall-outperforms-nginx-in-a-production-environment/)で詳しく説明されています。