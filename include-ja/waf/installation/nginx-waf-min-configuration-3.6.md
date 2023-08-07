NGINXとWallarmフィルタリングノードの主要な設定ファイルは以下のディレクトリに位置しています:

* NGINXの設定を含む`/etc/nginx/conf.d/default.conf`
* グローバルなフィルタリングノードの設定を含む`/etc/nginx/conf.d/wallarm.conf`

    このファイルはすべてのドメインに適用される設定のために使用されます。異なる設定を異なるドメイングループに適用するには、`default.conf` ファイルを使用するか、各ドメイングループ用の新しい設定ファイル（例: `example.com.conf` や `test.com.conf` など）を作成します。NGINXの設定ファイルについての詳しい情報は、[公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で利用可能です。
* Wallarmノードの監視設定を含む`/etc/nginx/conf.d/wallarm-status.conf`。詳細な説明は[リンク][wallarm-status-instr]にあります。
* Tarantoolデータベースの設定を含む`/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`

#### リクエストのフィルタリングモード

デフォルトでは、フィルタリングノードは `off` 状態であり、受信リクエストを解析しません。リクエスト解析を有効にするには、以下の手順に従ってください:

1. ファイル `/etc/nginx/conf.d/default.conf` を開きます:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `wallarm_mode monitoring;` という行を `https`、`server`、または `location` ブロックに追加します:

??? note "ファイル `/etc/nginx/conf.d/default.conf` の例"

    ```bash
    server {
        # リクエストがフィルタリングされるポート
        listen       80;
        # リクエストがフィルタリングされるドメイン
        server_name  localhost;
        # フィルタリングノードのモード
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
                                                                      
`monitoring` モードでは、フィルタリングノードはリクエスト中の攻撃の兆候を探しますが、検出した攻撃はブロックしません。フィルタリングノードのデプロイメント後数日間は、フィルタリングノードを通じて流れるトラフィックを `monitoring` モードで保持し、その後で `block` モードを有効にすることをお勧めします。[フィルタリングノードの動作モードの設定に関する推奨事項を参照してください →][waf-mode-recommendations]

#### メモリ

!!! info "別のサーバー上のPostanalyticsモジュール"
    Postanalyticsモジュールを別のサーバーにインストールした場合は、この手順をスキップします。モジュールはすでに設定されています。

WallarmノードはインメモリストレージTarantoolを使用します。必要なリソース量については[ここ][memory-instr]で詳しく知ることができます。テスト環境では、本番環境よりも少ないリソースを割り当てることができます。

Tarantoolにメモリを割り当てるには:

1. 編集モードでTarantoolの設定ファイルを開きます:

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
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```

2. `SLAB_ALLOC_ARENA` ディレクティブでメモリのサイズをGBで指定します。値は整数または浮動小数点（小数点はドット `.`）であることができます。

    Tarantool用のメモリ割り当てに関する詳細な推奨事項は、これらの[指示][memory-instr] で説明されています。
3. 変更を適用するために、Tarantoolを再起動します:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### 別のpostanalyticsサーバーのアドレス

!!! info "NGINX-Wallarmとpostanalyticsが同一サーバー上にある場合"
    NGINX-Wallarmとpostanalyticsモジュールが同一サーバー上にインストールされている場合は、この手順をスキップします。

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### その他の設定

NGINXとWallarmノードの他の設定を更新するには、NGINXのドキュメンテーションと[利用可能なWallarmノードディレクティブのリスト][waf-directives-instr]を使用します。