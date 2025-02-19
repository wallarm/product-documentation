# JA3フィンガープリンティングを有効化する

本記事では、NGINXなどの主要なソフトウェアや、AWS、Google Cloud、Azureといったインフラにおいて、JA3フィンガープリンティングを有効化する方法について説明します。

## 概要

攻撃者は、ユーザーエージェント(UA)の偽装やIPローテーションなど、セキュリティ対策を回避するための様々な手法を頻繁に用います。これらの手法により、未認証トラフィックにおける行動ベースの攻撃が検出しにくくなります。[JA3フィンガープリンティング](https://www.peakhour.io/learning/fingerprinting/what-is-ja3-fingerprinting/)は、クライアントとサーバ間のTLSネゴシエーション中に定義される特定のパラメーターからMD5ハッシュを生成します。このフィンガープリンティング手法は、[API session](../api-sessions/overview.md)の処理の一環として脅威アクターの識別を強化し、[API abuse prevention](../api-abuse-prevention/overview.md)のための行動プロファイル構築にも寄与します。

## NGINX

NGINXでJA3フィンガープリンティングを取得する機能により、すべてのNGINXベースのWallarm [deployment options](..//installation/nginx-native-node-internals.md#nginx-node)でこの識別手法が利用可能となります。JA3用のNGINXモジュールは2種類存在します：

| モジュール | 説明 | インストール |
| - | - | - |
| [nginx-ssl-ja3](https://github.com/fooinha/nginx-ssl-ja3) | JA3用のメインNGINXモジュールです。`THIS IS NOT PRODUCTION`の表示があるため、成功が保証されません。 | [Instructions](https://github.com/fooinha/nginx-ssl-ja3#compilation-and-installation) |
| [nginx-ssl-fingerprint](https://github.com/phuslu/nginx-ssl-fingerprint) | JA3用の第2のNGINXモジュールです。`high performance`の評価があり、スターやフォークも多くなっています。 | [Instructions](https://github.com/phuslu/nginx-ssl-fingerprint#quick-start) |

どちらのモジュールにおいても、OpenSSLとNGINXのパッチを当てる必要があります。

`nginx-ssl-fingerprint`モジュールからのモジュールインストール例:

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

Example NGINX configuration:

```
server {
  listen 80;
  server_name example.com;
  …
  # 他のアプリケーションにJA3フィンガープリンティングヘッダーをプロキシパスします。
  proxy_set_header X-Client-TLS-FP-Value $http_ssl_ja3_hash;
  proxy_set_header X-Client-TLS-FP–Raw-Value $http_ssl_ja3;

  # プロキシされたアプリケーションへリクエストを転送します。
  proxy_pass http://app:8080;
}
```

## AWS

AWS CloudFrontから[JA3フィンガープリンティングを取得](https://aws.amazon.com/about-aws/whats-new/2022/11/amazon-cloudfront-supports-ja3-fingerprint-headers/)する設定が可能です。

WallarmはCloudFrontと連携し、`CloudFront-Viewer-JA3-Fingerprint`および`CloudFront-Viewer-TLS`のJA3ヘッダーを取得できます：

1. CloudFrontコンソールにアクセスし、**Origin Request Policies**タブを選択します。
1. **Create Origin Request Policy**をクリックし、ポリシーの詳細を設定します。

    ![CloudFront - オリジンリクエストポリシーの作成](../images/configuration-guides/ja3/aws-cloudfront-create-origin-request-policy.png)

1. **Actions**セクションで、**Add Header**を選択します。
1. **Header Name**フィールドに`CloudFront-Viewer-JA3-Fingerprint`と入力します。

    ![CloudFront - オリジンリクエストポリシーへのヘッダー追加](../images/configuration-guides/ja3/aws-cloudfront-origin-request-policy-add-header.png)

1. **Create**をクリックします。これにより、オリジンリクエストポリシーが作成されます。
1. 作成したリクエストポリシーをCloudFrontディストリビューションに紐づけるには、以下の手順に従います。
1. CloudFrontコンソールで、ポリシーを紐づけるディストリビューションを選択します。
1. **Origin Request Policies**の横にある**Edit**ボタンをクリックします。
1. 作成したポリシーの横のチェックボックスを選択し、変更を保存します。

    ![CloudFront - ディストリビューションへのポリシー紐づけ](../images/configuration-guides/ja3/aws-cloudfront-attach-policy-to-distribution.png)

これで、オリジンリクエストポリシーがCloudFrontディストリビューションに紐づけられました。ディストリビューションにリクエストを行うクライアントのリクエストには、`CloudFront-Viewer-JA3-Fingerprint`ヘッダーが追加されます。

## Google Cloud

クラシックGoogle Cloud Application Load Balancerにおいて、カスタムヘッダーを設定し、`tls_ja3_fingerprint`変数を通じてその値を取得することで、JA3フィンガープリンティングを取得する設定が可能です：

1. Google Cloudコンソールにアクセスし、→ **Load balancing**をクリックします。
1. **Backends**をクリックします。
1. バックエンドサービスの名前をクリックし、次に**Edit**をクリックします。
1. **Advanced configurations**をクリックします。
1. **Custom request headers**の下で、**Add header**をクリックします。
1. **Header name**に適当なヘッダー名を入力し、**Header value**に`tls_ja3_fingerprint`と設定します。
1. 変更を保存します。

詳細な手順については[こちら](https://cloud.google.com/load-balancing/docs/https/custom-headers)を参照してください。

Example configuration request:

```
PATCH https://compute.googleapis.com/compute/v1/projects/PROJECT_ID/global/backendServices/BACKEND_SERVICE_NAME
"customRequestHeaders": [
   "X-Client-TLS-FP-Value: {tls_ja3_fingerprint}"
]
```

## Azure

[Azure Wallarm展開](../installation/cloud-platforms/azure/docker-container.md)の場合、[上記](#nginx)のNGINXによるJA3フィンガープリンティングの取得方法を使用します。