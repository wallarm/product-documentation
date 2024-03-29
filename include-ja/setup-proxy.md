!!! info
    このセットアップステップは、保護されたウェブアプリケーションの動作のために自分自身のプロキシサーバを使用するユーザー向けに意図されています。

    プロキシサーバーを使用していない場合、このセットアップ手順をスキップしてください。

プロキシサーバーを使用するようにWallarmノードを設定するために、環境変数に新しい値を割り当てる必要があります。

環境変数の新しい値を `/etc/environment` ファイルに追加します：
*   httpsプロトコルのプロキシを定義するために `https_proxy` を追加します。
*   httpプロトコルのプロキシを定義するために `http_proxy` を追加します。
*   プロキシを使用しないリソースのリストを定義するために `no_proxy` を追加します。

`https_proxy` および `http_proxy` 変数に `<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>` の文字列値を割り当てます。
* `<scheme>` は使用されるプロトコルを定義します。現在の環境変数がプロキシを設定しているプロトコルと一致する必要があります。
* `<proxy_user>` はプロキシ認証用のユーザー名を定義します。
* `<proxy_pass>` はプロキシ認証用のパスワードを定義します。
* `<host>` はプロキシサーバのホストを定義します。
* `<port>` はプロキシサーバのポートを定義します。

アドレスおよび/またはドメインが `<res_1>`、`<res_2>`、`<res_3>`、および `<res_4>` の `"res_1, res_2, res_3, res_4, ..."` 配列値を `no_proxy` 変数に割り当て、プロキシを使用しないリソースのリストを定義します。この配列は、IPアドレスおよび/またはドメインで構成する必要があります。

!!! warning "プロキシを介さずに指定する必要があるリソース"
    システムが正常に動作するために、次のIPアドレスとドメインをプロキシを介さずに通信すべきリソースのリストに追加します：`127.0.0.1`、`127.0.0.8`、`127.0.0.9`、および `localhost`。
    `127.0.0.8`と `127.0.0.9`のIPアドレスは、Wallarmのフィルタリングノードの動作に使用されます。

以下の `/etc/environment` ファイルの内容の正しい例は、次の設定を示しています：
*   HTTPSおよびHTTPのリクエストは、プロキシサーバー認証のための`admin`ユーザーネームと`01234`パスワードを使用し、ホスト`1.2.3.4`のポート`1234`へプロキシされます。
*   `127.0.0.1`、`127.0.0.8`、`127.0.0.9`、そして `localhost`に送信されるリクエストに対するプロキシングは無効化されます。

```
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```