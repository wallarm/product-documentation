# プロキシ経由でのWallarm APIへのアクセス

この手順では、プロキシサーバー経由でWallarm APIにアクセスできるように設定する手順を説明します。

* `https://api.wallarm.com/`はEU Cloud向けです
* `https://us1.api.wallarm.com/`はUS Cloud向けです

この手順は[NGINX](../../installation/nginx-native-node-internals.md#nginx-node)および[Native](../../installation/nginx-native-node-internals.md#native-node)ノードの両方に適用されます。

## インストール時およびインストール後のアクセス

次のタイミングでアクセスを設定する必要があります。

* ノードのインストール前：`/etc/environment`ファイルで設定します。これにより、ノードのインストールプロセス自体がプロキシ経由で必要なリソースにアクセスできます。
* ノードのインストール後：`/opt/wallarm/env.list`ファイルで設定します。これにより、インストール済みのノードがプロキシ経由でWallarm APIにアクセスできるようになります。このファイルはノードをインストールするまで存在しません。

いずれの場合も、アクセスを設定するにはプロキシサーバーを定義する環境変数に値を設定します。

* `https_proxy`はHTTPSプロトコル用のプロキシを定義します。
* `http_proxy`はHTTPプロトコル用のプロキシを定義します。
* `no_proxy`はプロキシを使用しないリソースの一覧を定義します。

## https_proxyおよびhttp_proxyの値

`https_proxy`および`http_proxy`には、`<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>`という文字列を設定します。

* `<scheme>`は使用するプロトコルを定義します。設定する環境変数が対象とするプロトコルと一致させてください。
* `<proxy_user>`はプロキシ認証用のユーザー名を定義します。
* `<proxy_pass>`はプロキシ認証用のパスワードを定義します。
* `<host>`はプロキシサーバーのホストを定義します。
* `<port>`はプロキシサーバーのポートを定義します。

## no_proxyの値

`no_proxy`には、プロキシを使用しないリソースのIPアドレスやドメインの一覧を設定します。

* Wallarmノードが正しく動作するよう、`127.0.0.1`、`127.0.0.8`、`127.0.0.9`、`localhost`を含めます。
* 追加のアドレスは次の形式です：`"<res_1>, <res_2>, <res_3>, <res_4>, ..."`。ここで、`<res_1>`、`<res_2>`、`<res_3>`、`<res_4>`はIPアドレスまたはドメインです。

## 設定ファイルの例

以下の`/etc/environment`および`/opt/wallarm/env.list`の例は、次の設定を示します：

* HTTPSおよびHTTPリクエストは、プロキシサーバーでの認証に`admin`というユーザー名と`01234`というパスワードを使用し、`1.2.3.4`ホストの`1234`ポートへプロキシされます。
* `127.0.0.1`、`127.0.0.8`、`127.0.0.9`、`localhost`宛てのリクエストはプロキシ対象外です。

```bash
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```

## all-in-oneスクリプトの実行

[all-in-one](../../installation/nginx/all-in-one.md)インストーラーでフィルタリングノードをインストールする際は、スクリプトを実行するコマンドに`--preserve-env=https_proxy,no_proxy`フラグを付加してください。例：

```
sudo --preserve-env=https_proxy,no_proxy env WALLARM_LABELS='group=<GROUP>' sh wallarm-<VERSION>.<ARCH>-glibc.sh
```

これにより、インストール処理中にプロキシ設定（`https_proxy`、`no_proxy`）が正しく適用されます。

## インストール後のアクセス

ノードをインストールしたら、`/opt/wallarm/env.list`ファイルでプロキシ経由でのWallarm APIへのアクセスを設定する必要があります。変数とその値はインストール時と同じです。

!!! info "設定ファイルの有無"
    `/opt/wallarm/env.list`ファイルは、ノードをインストールするまで存在しません。

設定ファイルを変更したら、wallarmサービスを再起動してください：

```
sudo systemctl restart wallarm
```