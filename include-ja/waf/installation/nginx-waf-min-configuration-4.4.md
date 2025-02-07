NGINXとWallarmフィルタリングノードの主な構成ファイルは以下のディレクトリにあります:

* `/etc/nginx/conf.d/default.conf` にNGINX設定があります
* `/etc/nginx/conf.d/wallarm.conf` にフィルタリングノードのグローバル設定があります

    このファイルは全ドメインに適用される設定に使用されます。異なるドメイングループに異なる設定を適用するには、`default.conf` ファイルを使用するか、各ドメイングループごとに新しい構成ファイル（例: `example.com.conf` および `test.com.conf`）を作成してください。NGINX構成ファイルに関する詳細情報は[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)をご参照ください。
* `/etc/nginx/conf.d/wallarm-status.conf` にWallarmノードの監視設定があります。詳細な説明は[こちら][wallarm-status-instr]に記載されています
* `/etc/default/wallarm-tarantool` または `/etc/sysconfig/wallarm-tarantool` にTarantoolデータベースの設定があります

#### リクエストフィルタリングモード

デフォルトでは、フィルタリングノードは `off` 状態にあり、受信リクエストを解析しません。リクエスト解析を有効にするには、以下の手順に従ってください:

1. ファイル `/etc/nginx/conf.d/default.conf` を開いてください:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `https`、`server`または`location`ブロックに `wallarm_mode monitoring;` を追加してください。

??? note "ファイル `/etc/nginx/conf.d/default.conf` の例"

    ```bash
    server {
        # リクエストをフィルタリングするポート
        listen       80;
        # リクエストをフィルタリングするドメイン
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

`monitoring` モードで動作している場合、フィルタリングノードはリクエスト内の攻撃兆候を検出しますが、検出された攻撃をブロックしません。フィルタリングノードのデプロイ後、数日間は `monitoring` モードでトラフィックを通過させ、その後にのみ `block` モードを有効にすることを推奨します。[フィルタリングノード動作モード設定に関する推奨事項を確認する →][waf-mode-recommendations]

#### メモリ

!!! info "別サーバ上のPostanalyticsモジュール"
    別サーバ上にPostanalyticsモジュールをインストールした場合、既にモジュールが設定されているため、この手順はスキップしてください。

Wallarmノードは、インメモリストレージであるTarantoolを使用します。必要なリソース量の詳細は[こちら][memory-instr]をご確認ください。また、テスト環境では本番環境よりも低いリソースを割り当てても問題ありません。

Tarantoolのメモリ割り当て方法:

1. 編集モードでTarantool構成ファイルを開いてください:

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
    === "AlmaLinux, Rocky LinuxまたはOracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "RHEL 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA`ディレクティブにGB単位のメモリサイズを指定してください。値は整数または浮動小数点数とすることができます（小数点はドット `.` を使用します）。

    Tarantoolのメモリ割り当てに関する詳細な推奨事項は、[こちらの手順][memory-instr]に記載されています。
3. 変更を適用するには、Tarantoolを再起動してください:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### 別サーバのpostanalyticsのアドレス

!!! info "同一サーバ上のNGINX-Wallarmとpostanalytics"
    NGINX-Wallarmおよびpostanalyticsモジュールが同一サーバ上にインストールされている場合、この手順はスキップしてください。

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### その他の構成

その他のNGINXおよびWallarmノードの構成を更新するには、NGINXドキュメントおよび[利用可能なWallarmノードディレクティブ][waf-directives-instr]のリストを使用してください。