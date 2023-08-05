# Wallarm cloud-initスクリプト仕様

Infrastructure as Code (IaC)アプローチに従っている場合、パブリッククラウドにWallarmノードをデプロイするために[`cloud-init`](https://cloudinit.readthedocs.io/en/latest/index.html)スクリプトが必要になるかもしれません。リリース4.0から、Wallarmはこのトピックで説明される用意して使い始めることができる`cloud-init.py`スクリプトを含むクラウドイメージを配布しています。

## Wallarm cloud-initスクリプトの概要

Wallarmの`cloud-init`スクリプトは、[Wallarm AWSクラウドイメージ](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe)の`/usr/share/wallarm-common/cloud-init.py`パスで利用できます。このスクリプトは、初期設定と高度なインスタンス設定を以下の主な段階で実行します：

* Wallarm `register-node`スクリプトを実行してWallarm Cloudで事前に作成されたWallarmノードを実行 
* `preset`変数で指定されたプロキシまたはミラーアプローチに従ってインスタンスを設定（Wallarmを[Terraformモジュール](aws/terraform-module/overview.md)でデプロイしている場合）
* NGINXスニペットに従ってインスタンスを微調整
* Wallarmノードを微調整
* ロードバランサーのヘルスチェックを実行

`cloud-init`スクリプトは、インスタンスブート時に一度だけ実行され、インスタンスの再起動では起動を強制されません。詳細は[AWSドキュメンテーションのスクリプトコンセプト](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)でご覧いただけます。

## Wallarm cloud-initスクリプトの実行

Wallarmのcloud-initスクリプトは以下のように実行できます：

* クラウドインスタンスを起動し、そのメタデータを使用して`cloud-init.py`スクリプトの実行を記述
* `cloud-init.py`スクリプトと一緒にインスタンスのLaunch Templateを作成し、それを基に自動スケーリンググループを作成

[httpbin.org](https://httpbin.org)に対するプロキシサーバーとしてWallarmノードを実行するスクリプトの実行例：

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

Infrastructure as Code (IaC)アプローチを満たすために、Wallarmの`cloud-init`スクリプトの使用例となる[AWSのためのTerraformモジュール](aws/terraform-module/overview.md)を実装しました。

## Wallarm cloud-initスクリプトヘルプデータ

```plain
usage: /usr/share/wallarm-common/cloud-init.py [-h] -t TOKEN [-H HOST] [--skip-register] [-p {proxy,mirror,custom}]
                                                      [-m {off,monitoring,safe_blocking,block}] [--proxy-pass PROXY_PASS]
                                                      [--libdetection] [--global-snippet GLOBAL_SNIPPET_FILE]
                                                      [--http-snippet HTTP_SNIPPET_FILE] [--server-snippet SERVER_SNIPPET_FILE]
                                                      [-l LOG_LEVEL]

指定された設定でPaaSクラスタでWallarmノードを実行します。 https://docs.wallarm.com/waf-installation/cloud-
platforms/cloud-init/

オプション引数：
  -h, --help            このヘルプメッセージを表示して終了
  -t TOKEN, --token TOKEN
                        Wallarm Console UIからコピーしたWallarmノードのトークン。
  -H HOST, --host HOST  使用しているWallarm Cloud専用のWallarm APIサーバー。デフォルトはapi.wallarm.com。 https://docs.wallarm.com/about-wallarm-
                        waf/overview/#cloud
  --skip-register       Wallarm Cloudで作成されたノードのローカルの実行ステージをスキップします（register-nodeスクリプトの実行をスキップします）。このステージはノードのデプロイメントの成功にとって重要です。
  -p {proxy,mirror,custom}, --preset {proxy,mirror,custom}
                        Wallarmノードのプリセット："proxy"はノードがプロキシサーバーとして動作するため、"mirror"はノードがミラーリングされたトラフィックを処理するため、"custom"はNGINXスニペットのみで定義された設定。
  -m {off,monitoring,safe_blocking,block}, --mode {off,monitoring,safe_blocking,block}
                        トラフィックフィルタリングモード：https://docs.wallarm.com/admin-en/configure-parameters-en/#wallarm_mode。
  --proxy-pass PROXY_PASS
                        プロキシサーバーのプロトコルとアドレス。 "proxy"がプリセットとして指定されている場合は必須です。
  --libdetection        トラフィック分析中にlibdetectionライブラリを使用するかどうか：https://docs.wallarm.com/about-wallarm-
                        waf/protecting-against-attacks.md#library-libdetection。
  --global-snippet GLOBAL_SNIPPET_FILE
                        NGINXグローバル設定に追加するカスタム設定。
  --http-snippet HTTP_SNIPPET_FILE
                        NGINXの"http"設定ブロックに追加するカスタム設定。
  --server-snippet SERVER_SNIPPET_FILE
                        NGINXの"server"設定ブロックに追加するカスタム設定。
  -l LOG_LEVEL, --log LOG_LEVEL
                        冗長性のレベル。

このスクリプトは、AWS、GCP、Azure、その他のPaaSの最も一般的な構成をいくつかカバーしています。 次の構成が必要な場合は、Wallarmノードの公開ドキュメンテーションをご覧ください：https://docs.wallarm.com.
```
