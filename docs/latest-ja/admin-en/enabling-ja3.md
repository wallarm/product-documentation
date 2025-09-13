# JA3フィンガープリンティングの有効化

本記事では、NGINXなどの主要なソフトウェアやAWS、Google Cloud、AzureなどのインフラでJA3フィンガープリンティングを有効化する方法を説明します。

## 概要

攻撃者は、ユーザーエージェント（UA）偽装やIPローテーションなど、セキュリティ対策を回避するさまざまな手法を頻繁に用います。これらの手法により、未認証トラフィックにおける振る舞いベースの攻撃の検知が難しくなります。[JA3フィンガープリンティング](https://www.peakhour.io/learning/fingerprinting/what-is-ja3-fingerprinting/)は、クライアントとサーバー間のTLSネゴシエーション中に定義される特定のパラメータからMD5ハッシュを生成します。このフィンガープリンティング手法は、[APIセッション](../api-sessions/overview.md)処理の一環として脅威アクターの識別を強化し、[API不正利用対策](../api-abuse-prevention/overview.md)における行動プロファイルの構築にも寄与します。

## NGINX

NGINXからJA3フィンガープリントを取得できると、NGINXベースのWallarmのすべての[デプロイオプション](..//installation/nginx-native-node-internals.md#nginx-node)でこの識別手法を利用できます。JA3用のNGINXモジュールは2つあります。

| モジュール | 説明 | インストール |
| - | - | - |
| [nginx-ssl-ja3](https://github.com/fooinha/nginx-ssl-ja3) | JA3向けの主要なnginxモジュールです。`THIS IS NOT PRODUCTION`の表示があるため、動作の保証はありません。 | [手順](https://github.com/fooinha/nginx-ssl-ja3#compilation-and-installation) |
| [nginx-ssl-fingerprint](https://github.com/phuslu/nginx-ssl-fingerprint) | JA3向けの2つ目のnginxモジュールです。`high performance`のラベルがあり、スターやフォークもあります。 | [手順](https://github.com/phuslu/nginx-ssl-fingerprint#quick-start) |

どちらのモジュールでも、OpenSSLとNGINXにパッチを適用する必要があります。

モジュールのインストール例（`nginx-ssl-fingerprint`モジュールからの例）:

```
# クローン

$ git clone -b OpenSSL_1_1_1-stable --depth=1 https://github.com/openssl/openssl
$ git clone -b release-1.23.1 --depth=1 https://github.com/nginx/nginx
$ git clone https://github.com/phuslu/nginx-ssl-fingerprint

# パッチ適用

$ patch -p1 -d openssl < nginx-ssl-fingerprint/patches/openssl.1_1_1.patch
$ patch -p1 -d nginx < nginx-ssl-fingerprint/patches/nginx.patch

# 設定とビルド

$ cd nginx
$ ASAN_OPTIONS=symbolize=1 ./auto/configure --with-openssl=$(pwd)/../openssl --add-module=$(pwd)/../nginx-ssl-fingerprint --with-http_ssl_module --with-stream_ssl_module --with-debug --with-stream --with-cc-opt="-fsanitize=address -O -fno-omit-frame-pointer" --with-ld-opt="-L/usr/local/lib -Wl,-E -lasan"
$ make

# テスト

$ objs/nginx -p . -c $(pwd)/../nginx-ssl-fingerprint/nginx.conf
$ curl -k https://127.0.0.1:8444
```

NGINX設定の例:

```
server {
  listen 80;
  server_name example.com;
  …
  # JA3フィンガープリントのヘッダーを別のアプリにプロキシ転送します。
  proxy_set_header X-Client-TLS-FP-Value $http_ssl_ja3_hash;
  proxy_set_header X-Client-TLS-FP–Raw-Value $http_ssl_ja3;

  # リクエストをプロキシ先のアプリに転送します。
  proxy_pass http://app:8080;
}
```

## AWS

[AWS CloudFrontからJA3フィンガープリントを取得するように設定](https://aws.amazon.com/about-aws/whats-new/2022/11/amazon-cloudfront-supports-ja3-fingerprint-headers/)できます。

WallarmはCloudFrontと連携して、`CloudFront-Viewer-JA3-Fingerprint`および`CloudFront-Viewer-TLS`のJA3ヘッダーを取得できます。

1. CloudFrontコンソールに移動し、**Origin Request Policies**タブを選択します。
1. **Create Origin Request Policy**をクリックし、ポリシーの詳細を設定します。

    ![CloudFront - オリジンリクエストポリシーの作成](../images/configuration-guides/ja3/aws-cloudfront-create-origin-request-policy.png)

1. **Actions**セクションで、**Add Header**を選択します。
1. **Header Name**フィールドに`CloudFront-Viewer-JA3-Fingerprint`と入力します。

    ![CloudFront - オリジンリクエストポリシーへのヘッダー追加](../images/configuration-guides/ja3/aws-cloudfront-origin-request-policy-add-header.png)

1. **Create**をクリックします。これでオリジンリクエストポリシーが作成されます。
1. 作成したリクエストポリシーをCloudFrontディストリビューションにアタッチするには、以下の手順に従います。
1. CloudFrontコンソールで、ポリシーをアタッチするディストリビューションを選択します。
1. **Origin Request Policies**の横にある**Edit**ボタンをクリックします。
1. 作成したポリシーのチェックボックスを選択して、変更を保存します。

    ![CloudFront - ディストリビューションへのポリシーのアタッチ](../images/configuration-guides/ja3/aws-cloudfront-attach-policy-to-distribution.png)

    これでオリジンリクエストポリシーがCloudFrontディストリビューションにアタッチされました。ディストリビューションにリクエストを送信するクライアントのリクエストには、`CloudFront-Viewer-JA3-Fingerprint`ヘッダーが追加されます。

## Google Cloud

従来のGoogle Cloud Application Load Balancerでカスタムヘッダーを設定し、`tls_ja3_fingerprint`変数経由でその値を取得することで、JA3フィンガープリントを取得するように設定できます。

1. Google Cloudコンソールに移動し、**Load balancing**を開きます。
1. **Backends**をクリックします。
1. バックエンドサービス名をクリックし、**Edit**をクリックします。
1. **Advanced configurations**をクリックします。
1. **Custom request headers**の下で**Add header**をクリックします。
1. **Header name**を入力し、**Header value**に`tls_ja3_fingerprint`を設定します。
1. 変更を保存します。

詳細な手順は[こちら](https://cloud.google.com/load-balancing/docs/https/custom-headers)をご覧ください。

設定リクエストの例:

```
PATCH https://compute.googleapis.com/compute/v1/projects/PROJECT_ID/global/backendServices/BACKEND_SERVICE_NAME
"customRequestHeaders": [
   "X-Client-TLS-FP-Value: {tls_ja3_fingerprint}"
]
```

## Azure

[AzureでのWallarmデプロイ](../installation/cloud-platforms/azure/docker-container.md)では、[上記](#nginx)で説明したNGINXからJA3フィンガープリントを取得する方法を使用します。