NGINXおよびWallarmフィルタリングノードのメイン設定ファイルは、以下のディレクトリにあります。

* `/etc/nginx/conf.d/default.conf`は、NGINX設定が含まれます。
* `/etc/nginx/conf.d/wallarm.conf`は、グローバルフィルタリングノード設定が含まれます。

    このファイルは、すべてのドメインに適用される設定に使用されます。異なるドメイングループに異なる設定を適用するには、`default.conf`ファイルを使用するか、各ドメイングループの新しい設定ファイル（例：`example.com.conf`および`test.com.conf`）を作成します。NGINX設定ファイルに関する詳細情報は、[公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)で入手できます。
* `/etc/nginx/conf.d/wallarm-status.conf`は、Wallarmノードの監視設定を含みます。詳細説明は、[リンク][wallarm-status-instr]の中に用意されています。
* `/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`は、Tarantoolデータベース設定が含まれます。

#### 要求フィルタリングモード

デフォルトでは、フィルタリングノードは`off`ステータスにあり、受信リクエストを解析しません。リクエスト解析を有効にするには、次の手順に従ってください。

1. `/etc/nginx/conf.d/default.conf`ファイルを開きます。

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `https`、`server`または`location`ブロックに`wallarm_mode monitoring;`行を追加します：

??? note "ファイル`/etc/nginx/conf.d/default.conf`の例"

    ```bash
    server {
        # リクエストがフィルタリングされるポート
        listen       80;
        # リクエストがフィルタリングされるドメイン名
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

`monitoring`モードで動作すると、フィルタリングノードはリクエストに攻撃サインを検索しますが、検出された攻撃はブロックしません。フィルタリングノードの展開後、いくつかの日間`monitoring`モードでトラフィックがフィルタリングノードを経由してから、`block`モードを有効にすることをお勧めします。[フィルタリングノードの操作モード設定に関する推奨事項を学ぶ →][waf-mode-recommendations]

#### メモリ

!!! info "別のサーバー上のPostanalyticsモジュール"
    別のサーバーにpostanalyticsモジュールをインストールした場合、この手順をスキップして、すでにモジュールが設定されています。

WallarmノードはインメモリーストレージTarantoolを使用します。本番環境では、Tarantoolに割り当てられる推奨RAMの量は、サーバーの合計メモリの75%です。Wallarmノードをテストしている場合や、インスタンスサイズが小さい場合は、より低い量（例：合計メモリの25%）で十分です。

Tarantoolのメモリを割り当てるには：

1. 編集モードでTarantool設定ファイルを開きます：

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA`ディレクティブで、GB単位のメモリサイズを指定します。値は整数または小数（ピリオド`.`が小数点）になります。

    例：
    
    === "ノードをテストする場合"
        ```bash
        SLAB_ALLOC_ARENA=0.5
        ```
    === "本番環境にノードを展開する場合"
        ```bash
        SLAB_ALLOC_ARENA=24
        ```

    Tarantoolのメモリ割り当てに関する詳細な推奨事項は、これらの[instructions][memory-instr]で説明されています。
3. 変更を適用するには、Tarantoolを再起動します：

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### 別のpostanalyticsサーバーのアドレス

!!! info "NGINX-Wallarmとpostanalyticsが同じサーバー上にある場合"
    NGINX-Wallarmおよびpostanalyticsモジュールが同じサーバーにインストールされている場合、この手順をスキップしてください。

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### その他の設定

他のNGINXおよびWallarmノード設定を更新するには、NGINXドキュメントおよび[利用可能なWallarmノードディレクティブのリスト][waf-directives-instr]を使用してください。