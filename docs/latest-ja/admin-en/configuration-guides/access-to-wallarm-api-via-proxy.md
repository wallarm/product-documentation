# プロキシ経由でのWallarm APIアクセス

これらの手順は、プロキシサーバを通じてWallarm APIへのアクセスを設定する手順を説明しています。

* EU Cloudの場合は`https://api.wallarm.com/`です
* US Cloudの場合は`https://us1.api.wallarm.com/`です

アクセスを設定するには、`/etc/environment`ファイル内のプロキシサーバを定義する環境変数に新たな値を割り当ててください:

* HTTPSプロトコル用のプロキシを定義するには、`https_proxy`を使用します
* HTTPプロトコル用のプロキシを定義するには、`http_proxy`を使用します
* プロキシを使用しないリソースの一覧を定義するには、`no_proxy`を使用します

## https_proxyおよびhttp_proxyの値

`https_proxy`および`http_proxy`変数には、`<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>`形式の文字列値を割り当ててください:

* `<scheme>`は使用するプロトコルを定義します。現在の環境変数がプロキシ用に設定するプロトコルに一致する必要があります
* `<proxy_user>`はプロキシ認証のユーザー名を定義します
* `<proxy_pass>`はプロキシ認証のパスワードを定義します
* `<host>`はプロキシサーバのホストを定義します
* `<port>`はプロキシサーバのポートを定義します

## no_proxyの値

プロキシを使用しないリソース（IPアドレスおよび/またはドメイン）の配列を`no_proxy`変数に割り当ててください:

* Wallarmノードの正しい動作のために、`127.0.0.1`、`127.0.0.8`、`127.0.0.9`および`localhost`を指定します
* `<res_1>`, `<res_2>`, `<res_3>`, `<res_4>`などがIPアドレスおよび/またはドメインである追加のアドレスを次の形式で指定します:`"<res_1>, <res_2>, <res_3>, <res_4>, ..."`

## /etc/environmentファイルの例

`/etc/environment`ファイルの以下の例は、次の構成を示しています:

* HTTPSおよびHTTPリクエストは、プロキシサーバでの認証に`admin`ユーザー名および`01234`パスワードを使用し、ホスト`1.2.3.4`のポート`1234`へ転送されます
* `127.0.0.1`、`127.0.0.8`、`127.0.0.9`および`localhost`に送信されるリクエストについては、プロキシが無効です

```bash
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```

## all-in-oneスクリプトの実行

フィルタリングノードを[all-in-one](../../installation/nginx/all-in-one.md)インストーラーでインストールする場合、スクリプトを実行するコマンドに`--preserve-env=https_proxy,no_proxy`フラグを追加することを確認してください。例えば:

```
sudo --preserve-env=https_proxy,no_proxy env WALLARM_LABELS='group=<GROUP>' sh wallarm-<VERSION>.<ARCH>-glibc.sh
```

これにより、インストールプロセス中にプロキシ設定（`https_proxy`、`no_proxy`）が正しく適用されることが保証されます。