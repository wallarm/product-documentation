					# Wallarm cloud-init スクリプトの仕様

Infrastructure as Code（IaC）アプローチに従っている場合、Wallarmノードをパブリッククラウドにデプロイするための [`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html) スクリプトを使用する必要があるかもしれません。リリース4.0以降、Wallarmはこのトピックで説明されている `cloud-init.py` スクリプトを使用準備ができた状態でクラウドイメージを配布しています。

## Wallarm cloud-init スクリプトの概要

Wallarmの `cloud-init` スクリプトは、[Wallarm AWSクラウドイメージ](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe) の `/usr/share/wallarm-common/cloud-init.py` パスで利用できます。このスクリプトでは、以下の主要な段階が含まれた初期および高度なインスタンス構成を実行します。

* Wallarm Cloudで事前に作成されたWallarmノードを実行するために、Wallarmの `register-node` スクリプトを実行します
* `preset` 変数で指定されたプロキシまたはミラーアプローチに従ってインスタンスを構成（[Terraformモジュール](aws/terraform-module/overview.ja.md)を使ってWallarmをデプロイする場合）
* NGINXスニペットに従ってインスタンスを微調整します
* Wallarmノードを微調整します
* ロードバランサのヘルスチェックを実行します

`cloud-init` スクリプトは、インスタンスの起動時に一度だけ実行され、インスタンスの再起動時には実行されません。詳細については、[AWSドキュメントのスクリプトコンセプト](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)を参照してください。

## Wallarm cloud-init スクリプトの実行方法

Wallarm cloud-init スクリプトは以下のように実行できます。

* クラウドインスタンスを起動し、そのメタデータを使用して `cloud-init.py` スクリプトの実行を記述します
* `cloud-init.py` スクリプトを使用したインスタンス起動テンプレートを作成し、それを基に自動スケーリンググループを作成します

[httpbin.org](https://httpbin.org) のプロキシサーバーとしてWallarmノードを実行するためのスクリプトの実行例：

```bash
#!/bin/bash
set -e

### Prevent NGINX from running without
### Wallarm enabled, it is not recommended to
### run health check before all things get done
###
systemctl stop nginx.service

/usr/share/wallarm-common/cloud-init.py \
    -t xxxxx-base64-registration-token-from-wallarm-cloud-xxxxx \
    -p proxy \
    -m monitoring \
    --proxy-pass https://httpbin.org

systemctl restart nginx.service

echo Wallarm Node successfuly configured!
```

Infrastructure as Code（IaC）アプローチに対応するために、Wallarmの `cloud-init` スクリプトの使用例として[AWS用Terraformモジュール](aws/terraform-module/overview.ja.md)を実装しました。

## Wallarm cloud-init スクリプトのヘルプデータ

```plain
usage: /usr/share/wallarm-common/cloud-init.py [-h] -t TOKEN [-H HOST] [--skip-register] [-p {proxy,mirror,custom}]
                                                      [-m {off,monitoring,safe_blocking,block}] [--proxy-pass PROXY_PASS]
                                                      [--libdetection] [--global-snippet GLOBAL_SNIPPET_FILE]
                                                      [--http-snippet HTTP_SNIPPET_FILE] [--server-snippet SERVER_SNIPPET_FILE]
                                                      [-l LOG_LEVEL]

Runs the Wallarm node with the specified configuration in the PaaS cluster. https://docs.wallarm.com/waf-installation/cloud-
platforms/cloud-init/

optional arguments:
  -h, --help            show this help message and exit
  -t TOKEN, --token TOKEN
                        Wallarm node token copied from the Wallarm Console UI.
  -H HOST, --host HOST  Wallarm API server specific for the Wallarm Cloud being used: https://docs.wallarm.com/about-wallarm-
                        waf/overview/#cloud. By default, api.wallarm.com.
  --skip-register       Skips the stage of local running the node created in the Wallarm Cloud (skips the register-node script
                        execution). This stage is crucial for successful node deployment.
  -p {proxy,mirror,custom}, --preset {proxy,mirror,custom}
                        Wallarm node preset: "proxy" for the node to operate as a proxy server, "mirror" for the node to process
                        mirrored traffic, "custom" for configuration defined via NGINX snippets only.
  -m {off,monitoring,safe_blocking,block}, --mode {off,monitoring,safe_blocking,block}
                        Traffic filtration mode: https://docs.wallarm.com/admin-en/configure-parameters-en/#wallarm_mode.
  --proxy-pass PROXY_PASS
                        Proxied server protocol and address. Required if "proxy" is specified as a preset.
  --libdetection        Whether to use the libdetection library during the traffic analysis: https://docs.wallarm.com/about-wallarm-
                        waf/protecting-against-attacks.ja.md#library-libdetection.
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