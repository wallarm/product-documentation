NGINXとWallarmフィルタリングノードのメイン設定ファイルは以下のディレクトリにあります：

* NGINX設定を持つ `/etc/nginx/conf.d/default.conf`
* グローバルフィルタリングノード設定を持つ `/etc/nginx/conf.d/wallarm.conf`

    このファイルは全てのドメインに適用される設定に使用されます。異なる設定を異なるドメイングループに適用するには、 `default.conf`ファイルを使用したり、各ドメイングループ用の新しい設定ファイルを作成します（例えば、 `example.com.conf`と`test.com.conf`）。NGINX設定ファイルに関する詳細な情報は [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html)で利用できます。
* Wallarmノード監視設定を持つ `/etc/nginx/conf.d/wallarm-status.conf`。詳細な説明は[link][wallarm-status-instr]内で利用できます。
* Tarantoolデータベース設定を持つ `/etc/default/wallarm-tarantool`または `/etc/sysconfig/wallarm-tarantool`

#### リクエストフィルタモード

デフォルトでは、フィルタリングノードは `off`ステータスで、送信リクエストは解析されません。リクエストの解析を有効にするには、以下の手順に従ってください：

1. ファイル `/etc/nginx/conf.d/default.conf`を開きます：

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `wallarm_mode monitoring;`という行を `https`, `server`または`location`ブロックに追加します：

??? note "ファイル `/etc/nginx/conf.d/default.conf`の例"

    ```bash
    server {
        # リクエストがフィルタリングされるポート
        listen       80;
        # リクエストがフィルタリングされるドメイン
        server_name  localhost;
        # フィルタリングノードモード
        wallarm_mode monitoring;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
    ```

`monitoring`モードで動作する場合、フィルタリングノードはリクエスト内の攻撃サインを検索しますが、検出した攻撃をブロックしません。フィルタリングノードのデプロイ後数日間はトラフィックをフィルタリングノード経由の`monitoring`モードで流し続け、その後のみ`block`モードを有効にすることをお勧めします。[フィルタリングノード運用モード設定の推奨事項を参照 →][waf-mode-recommendations]

#### メモリ

!!! info "別のサーバー上のPostanalyticsモジュール"
    Postanalyticsモジュールを別のサーバーにインストールした場合は、この手順をスキップします。モジュールがすでに設定されています。

WallarmノードはインメモリストレージTarantoolを使用します。必要なリソース量については [here][memory-instr]に記載されています。テスト環境ではプロダクション環境よりも少ないリソースを割り当てることができます。

Tarantoolへのメモリの割り当て：

1. 編集モードでTarantool設定ファイルを開きます：

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以下"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA`ディレクティブでメモリサイズをGB単位で指定します。その値は整数または浮動小数点数（小数点は`.`を使用）であることができます。

    Tarantool用メモリを割り当てる方法に関する詳細な推奨事項は [instructions][memory-instr]に記載されています。
3. 変更を反映するには、Tarantoolを再起動します：

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### 別のポストアナリティクスサーバーのアドレス

!!! info "同じサーバー上のNGINX-Wallarmとpostanalytics"
    NGINX-Wallarmとpostanalyticsモジュールが同じサーバーにインストールされている場合、この手順をスキップします。

--8<-- "../include-ja/waf/configure-separate-postanalytics-address-nginx.md"

#### その他の設定

NGINXとWallarmノードの他の設定を更新するには、NGINXドキュメンテーションと[利用可能なWallarmノードディレクティブのリスト][waf-directives-instr]を使用してください。