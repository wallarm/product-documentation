# WallarmによるオープンソースAPIファイアウォール [![Black Hat Arsenal USA 2022](https://github.com/wallarm/api-firewall/blob/main/images/BHA2022.svg?raw=true)](https://www.blackhat.com/us-22/arsenal/schedule/index.html#open-source-api-firewall-new-features--functionalities-28038)

API Firewallは、[OpenAPI](https://wallarm.github.io/api-firewall/installation-guides/docker-container/)および[GraphQL](https://wallarm.github.io/api-firewall/installation-guides/graphql/docker-container/)スキーマに基づいたAPIリクエストおよびレスポンスの検証機能を備えた高性能プロキシです。クラウドネイティブ環境におけるRESTおよびGraphQL APIエンドポイントを保護するよう設計されています。APIファイアウォールは、定義済みのAPI仕様に一致するリクエストとレスポンスのみを許可するポジティブセキュリティモデルの使用により、APIの強化を提供します。

APIファイアウォールの**主な特徴**は以下のとおりです：

* 悪意のあるリクエストをブロックしてRESTおよびGraphQL APIエンドポイントを保護する
* 不正なAPIレスポンスをブロックしてAPIデータ侵害を停止する
* シャドウAPIエンドポイントを発見する
* OAuth 2.0プロトコルに基づいた認証用のJWTアクセストークンを検証する
* 妥協されたAPIトークン、キー、およびCookieを拒否リストに登録する

この製品は**オープンソース**であり、DockerHubで利用可能で、すでに10億回(!!!)ダウンロードされています。このプロジェクトをサポートするには、[リポジトリ](https://hub.docker.com/r/wallarm/api-firewall)にスターを付けてください。

## 動作モード

Wallarm APIファイアウォールは、いくつかの動作モードを提供します：

* [`PROXY`](https://wallarm.github.io/api-firewall/installation-guides/docker-container/)：HTTPリクエストとレスポンスをOpenAPI 3.0に対して検証し、一致するリクエストをバックエンドにプロキシします。
* [`API`](https://wallarm.github.io/api-firewall/installation-guides/api-mode/)：個々のリクエストをOpenAPI 3.0に対して検証し、それ以上のプロキシングを行いません。
* [`graphql`](https://wallarm.github.io/api-firewall/installation-guides/graphql/docker-container/)：HTTPおよびWebSocketリクエストをGraphQLスキーマに対して検証し、一致するリクエストをバックエンドにプロキシします。

## ユースケース

### ブロッキングモードでの実行

* 仕様に一致しない悪意のあるリクエストをブロックする
* 不正なAPIレスポンスをブロックしてデータ侵害および機密情報の漏洩を停止する

### モニタリングモードでの実行

* シャドウAPIと文書化されていないAPIエンドポイントを発見する
* 仕様に一致しない不正なリクエストとレスポンスをログに記録する

## APIスキーマ検証とポジティブセキュリティモデル

APIファイアウォールの開始時には、APIファイアウォールで保護されるアプリケーションのRESTまたはGraphQL API仕様を提供する必要があります。開始されたAPIファイアウォールはリバースプロキシとして機能し、リクエストとレスポンスが仕様で定義されたスキーマと一致するかどうかを検証します。

スキーマと一致しないトラフィックは、[STDOUTおよびSTDERR Dockerサービス](https://docs.docker.com/config/containers/logging/)を使用してログに記録されるか、またはブロックされます（設定されたAPIファイアウォールの操作モードに応じて）。REST API上でのログモードの操作時、APIファイアウォールはAPI仕様でカバーされていないがリクエストに応答するいわゆるシャドウAPIエンドポイントもログに記録します（コード`404`を返すエンドポイントを除く）。

![APIファイアウォールスキーマ](https://github.com/wallarm/api-firewall/blob/main/images/Firewall%20opensource%20-%20vertical.gif?raw=true)

API仕様でトラフィック要件を設定できるようにすることにより、APIファイアウォールはポジティブセキュリティモデルに依存します。

## 技術データ

[APIファイアウォールは](https://www.wallarm.com/what/the-concept-of-a-firewall)、組み込みのOpenAPI 3.0またはGraphQLリクエストおよびレスポンス検証器を備えたリバースプロキシとして機能します。これはGolangで書かれており、fasthttpプロキシを使用しています。このプロジェクトは極端な性能とゼロに近い追加の待ち時間のために最適化されています。

## APIファイアウォールの開始

DockerでAPIファイアウォールをダウンロード、インストール、および開始するには、次を参照してください：

* [REST APIガイド](https://wallarm.github.io/api-firewall/installation-guides/docker-container/)
* [GraphQL APIガイド](https://wallarm.github.io/api-firewall/installation-guides/graphql/docker-container/)

## デモ

APIファイアウォールで保護された例示アプリケーションをデプロイするデモ環境を実行することで、APIファイアウォールを試すことができます。利用可能なデモ環境は2つあります：

* [Docker Composeを使用したAPIファイアウォールデモ](https://github.com/wallarm/api-firewall/tree/main/demo/docker-compose)
* [Kubernetesを使用したAPIファイアウォールデモ](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes)

## APIファイアウォールに関連するWallarmのブログ記事

* [APIファイアウォールでシャドウAPIを発見する](https://lab.wallarm.com/discovering-shadow-apis-with-a-api-firewall/)
* [Wallarm APIファイアウォール、本番環境でNGINXを上回る](https://lab.wallarm.com/wallarm-api-firewall-outperforms-nginx-in-a-production-environment/)
* [無料のAPIFWを使用してREST APIを保護する方法](https://lab.wallarm.com/securing-rest-with-free-api-firewall-how-to-guide/)

## パフォーマンス

APIファイアウォールを作成する際に、速度と効率を優先し、お客様が可能な限り速いAPIを持つことを確かめました。最新のテストでは、APIファイアウォールが1つのリクエストを処理するのに必要な平均時間は1.339 msであり、これはNginxよりも66%速いです：

```
APIファイアウォール 0.6.2 JSON検証付き

$ ab -c 200 -n 10000 -p ./large.json -T application/json http://127.0.0.1:8282/test/signup

1秒間あたりのリクエスト数:    13005.81 [#/sec] (平均)
リクエストあたりの時間:       15.378 [ms] (平均)
リクエストあたりの時間:       0.077 [ms] (平均、すべての同時リクエストを通じて)

NGINX 1.18.0 JSON検証なし

$ ab -c 200 -n 10000 -p ./large.json -T application/json http://127.0.0.1/test/signup

1秒間あたりのリクエスト数:    7887.76 [#/sec] (平均)
リクエストあたりの時間:       25.356 [ms] (平均)
リクエストあたりの時間:       0.127 [ms] (平均、すべての同時リクエストを通じて)
```

これらのパフォーマンス結果は、APIファイアウォールのテスト中に得られたものだけではありません。他の結果およびAPIファイアウォールの性能を向上させるために使用された方法については、この[Wallarmのブログ記事](https://lab.wallarm.com/wallarm-api-firewall-outperforms-nginx-in-a-production-environment/)で説明されています。