# Wallarm cloud-initスクリプトの仕様

Infrastructure as Code（IaC）のアプローチに従う場合、パブリッククラウドにWallarmノードをデプロイするために[`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html)スクリプトを使用する必要がある場合があります。リリース4.0以降、Wallarmは、本トピックで説明するすぐに使用可能な`cloud-init.py`スクリプトを同梱したクラウドイメージを配布しています。

## Wallarm cloud-initスクリプトの概要

Wallarmの`cloud-init`スクリプトは[Wallarm AWSクラウドイメージ](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe)内の`/opt/wallarm/usr/share/wallarm-common/cloud-init.py`パスにあります。このスクリプトは、以下の主な段階を通じて、インスタンスの初期設定および詳細設定の両方を実行します。

* Wallarmの`register-node`スクリプトを実行して、Wallarm Cloudで事前に作成したWallarmノードを起動します
* `preset`変数に指定されたプロキシ方式に従ってインスタンスを構成します（[Terraformモジュール](aws/terraform-module/overview.md)を使用してWallarmをデプロイする場合）
* NGINXスニペットに従ってインスタンスを詳細設定します
* Wallarmノードを詳細設定します
* ロードバランサーのヘルスチェックを実行します

`cloud-init`スクリプトはインスタンスの起動時に一度だけ実行され、インスタンスの再起動では再実行されません。詳細は[スクリプトの概念に関するAWSドキュメント](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)をご参照ください。

## Wallarm cloud-initスクリプトの実行

Wallarm cloud-initスクリプトは次の方法で実行できます。

* クラウドインスタンスを起動し、そのメタデータに`cloud-init.py`スクリプトの実行内容を記述します
* `cloud-init.py`スクリプトを含むインスタンスのLaunch Templateを作成し、それに基づいてAuto Scaling groupを作成します

[httpbin.org](https://httpbin.org)向けのプロキシサーバーとしてWallarmノードを実行するためのスクリプト実行例：

```bash
#!/bin/bash
set -e

### Wallarmを有効化しないままNGINXが実行されないようにします。
### すべての処理が完了する前にヘルスチェックを実行することは
### 推奨しません。
###
systemctl stop nginx.service

/opt/wallarm/usr/share/wallarm-common/cloud-init.py \
    -t xxxxx-base64-registration-token-from-wallarm-cloud-xxxxx \
    -p proxy \
    -m monitoring \
    --proxy-pass https://httpbin.org

systemctl restart nginx.service

echo Wallarm Node successfuly configured!
```

IaCのアプローチに沿うため、Wallarmの`cloud-init`スクリプトの使用例として参考になる[AWS向けTerraformモジュール](aws/terraform-module/overview.md)を実装しています。

## Wallarm cloud-initスクリプトのヘルプデータ

```plain
usage: /opt/wallarm/usr/share/wallarm-common/cloud-init.py [-h] -t TOKEN [-H HOST] [--skip-register] [-p {proxy,custom}]
                                                      [-m {off,monitoring,safe_blocking,block}] [--proxy-pass PROXY_PASS]
                                                      [--libdetection] [--global-snippet GLOBAL_SNIPPET_FILE]
                                                      [--http-snippet HTTP_SNIPPET_FILE] [--server-snippet SERVER_SNIPPET_FILE]
                                                      [-l LOG_LEVEL]

Runs the Wallarm node with the specified configuration in the PaaS cluster. https://docs.wallarm.com/installation/cloud-platforms/cloud-init/

optional arguments:
  -h, --help            show this help message and exit
  -t TOKEN, --token TOKEN
                        Wallarm node token copied from the Wallarm Console UI.
  -H HOST, --host HOST  Wallarm API server specific for the Wallarm Cloud being used: https://docs.wallarm.com/about-wallarm/overview/#cloud. By default, api.wallarm.com.
  --skip-register       Skips the stage of local running the node created in the Wallarm Cloud (skips the register-node script
                        execution). This stage is crucial for successful node deployment.
  -p {proxy,custom}, --preset {proxy,custom}
                        Wallarm node preset: "proxy" for the node to operate as a proxy server, "custom" for configuration defined via NGINX snippets only.
  -m {off,monitoring,safe_blocking,block}, --mode {off,monitoring,safe_blocking,block}
                        Traffic filtration mode: https://docs.wallarm.com/admin-en/configure-parameters-en/#wallarm_mode.
  --proxy-pass PROXY_PASS
                        Proxied server protocol and address. Required if "proxy" is specified as a preset.
  --libdetection        Whether to use the libdetection library during the traffic analysis: https://docs.wallarm.com/about-wallarm/protecting-against-attacks/#library-libdetection.
  --global-snippet GLOBAL_SNIPPET_FILE
                        Custom configuration to be added to the NGINX global configuration.
  --http-snippet HTTP_SNIPPET_FILE
                        Custom configuration to be added to the "http" configuration block of NGINX.
  --server-snippet SERVER_SNIPPET_FILE
                        Custom configuration to be added to the "server" configuration block of NGINX.
  -l LOG_LEVEL, --log LOG_LEVEL
                        Level of verbosity.

This script covers a few most popular configurations for AWS, GCP, Azure and other PaaS. If you need a more powerful configuration,
you are welcome to review Wallarm node public documentation: https://docs.wallarm.com.
```