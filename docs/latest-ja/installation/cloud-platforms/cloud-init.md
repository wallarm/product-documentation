# Wallarm cloud-initスクリプトの仕様

Infrastructure as Code (IaC)アプローチに従う場合は、パブリッククラウドへのWallarmノードの展開に[`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html)スクリプトを使用する必要があります。リリース4.0から、Wallarmはこのトピックで説明する利用可能な`cloud-init.py`スクリプトを備えたクラウドイメージを提供します。

## Wallarm cloud-initスクリプトの概要

Wallarm `cloud-init`スクリプトは[Wallarm AWS cloud image](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe)内の`/opt/wallarm/usr/share/wallarm-common/cloud-init.py`パスに配置されています。このスクリプトは、以下の主な段階を経て初期設定および高度なインスタンス構成を実行します:

* Wallarm Cloudで事前に作成されたWallarmノードを、Wallarm `register-node`スクリプトを実行することで起動します。
* （[Terraformモジュール](aws/terraform-module/overview.md)を使用してWallarmを展開する場合）`preset`変数で指定されたproxyまたはmirrorの方式に従い、インスタンスを構成します。
* NGINXスニペットに基づき、インスタンスの微調整を行います。
* Wallarmノードの微調整を行います。
* ロードバランサーのヘルスチェックを実施します。

`cloud-init`スクリプトはインスタンス起動時に一度のみ実行され、インスタンスの再起動時に強制的に起動されることはありません。詳細については、[AWSのユーザーデータに関するドキュメント](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)をご覧ください。

## Wallarm cloud-initスクリプトの実行方法

Wallarm cloud-initスクリプトは以下の方法で実行できます:

* クラウドインスタンスを起動して、そのメタデータに基づき`cloud-init.py`スクリプトを実行します。
* `cloud-init.py`スクリプトを含むインスタンス起動テンプレートを作成し、それを基にオートスケーリンググループをさらに作成します。

Wallarmノードを[httpbin.org](https://httpbin.org)のプロキシサーバーとして実行するためのスクリプト実行例は以下の通りです:

```bash
#!/bin/bash
set -e

### Wallarmが有効になっていない状態でNGINXが起動するのを防ぎます
### すべての処理が完了する前にヘルスチェックを実行することは推奨しません
###
systemctl stop nginx.service

/opt/wallarm/usr/share/wallarm-common/cloud-init.py \
    -t xxxxx-base64-registration-token-from-wallarm-cloud-xxxxx \
    -p proxy \
    -m monitoring \
    --proxy-pass https://httpbin.org

systemctl restart nginx.service

echo Wallarmノードの構成が正常に完了しました!
```

Infrastructure as Code (IaC)アプローチに対応するため、AWS向け[Terraformモジュール](aws/terraform-module/overview.md)が実装されており、これがWallarm`cloud-init`スクリプトの使用例として参考になります。

## Wallarm cloud-initスクリプトのヘルプデータ

```plain
usage: /opt/wallarm/usr/share/wallarm-common/cloud-init.py [-h] -t TOKEN [-H HOST] [--skip-register] [-p {proxy,mirror,custom}]
                                                      [-m {off,monitoring,safe_blocking,block}] [--proxy-pass PROXY_PASS]
                                                      [--libdetection] [--global-snippet GLOBAL_SNIPPET_FILE]
                                                      [--http-snippet HTTP_SNIPPET_FILE] [--server-snippet SERVER_SNIPPET_FILE]
                                                      [-l LOG_LEVEL]

指定された構成でPaaSクラスター内のWallarmノードを実行します。 https://docs.wallarm.com/installation/cloud-platforms/cloud-init/

オプション引数:
  -h, --help            このヘルプメッセージを表示して終了します。
  -t TOKEN, --token TOKEN
                        Wallarm Console UIからコピーしたWallarmノードのトークンです。
  -H HOST, --host HOST  使用するWallarm Cloudに固有のWallarm APIサーバー: https://docs.wallarm.com/about-wallarm/overview/#cloud。デフォルトはapi.wallarm.comです。
  --skip-register       Wallarm Cloudで作成済みのノードをローカルで実行する段階（register-nodeスクリプトの実行）をスキップします。この段階はノード展開の成功に重要です。
  -p {proxy,mirror,custom}, --preset {proxy,mirror,custom}
                        Wallarmノードのプリセット: "proxy" はノードをプロキシサーバーとして動作させるため、"mirror" はノードがミラーされたトラフィックを処理するため、"custom" はNGINXスニペットのみで定義された設定のためです。
  -m {off,monitoring,safe_blocking,block}, --mode {off,monitoring,safe_blocking,block}
                        トラフィックフィルトレーションモード: https://docs.wallarm.com/admin-en/configure-parameters-en/#wallarm_mode。
  --proxy-pass PROXY_PASS
                        プロキシ先サーバーのプロトコルおよびアドレス。プリセットに "proxy" が指定された場合は必須です。
  --libdetection        トラフィック解析中にlibdetectionライブラリを使用するかどうか: https://docs.wallarm.com/about-wallarm/protecting-against-attacks/#library-libdetection。
  --global-snippet GLOBAL_SNIPPET_FILE
                        NGINX全体の設定に追加するカスタム設定。
  --http-snippet HTTP_SNIPPET_FILE
                        NGINXの "http" 設定ブロックに追加するカスタム設定。
  --server-snippet SERVER_SNIPPET_FILE
                        NGINXの "server" 設定ブロックに追加するカスタム設定。
  -l LOG_LEVEL, --log LOG_LEVEL
                        詳細出力のレベル。

このスクリプトは、AWS、GCP、Azureおよびその他のPaaS向けの最も一般的な設定をいくつかカバーしています。より強力な設定が必要な場合は、Wallarmノードの公開ドキュメント: https://docs.wallarm.com をご確認ください.
```