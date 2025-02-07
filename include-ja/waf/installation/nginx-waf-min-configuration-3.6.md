Main configuration files of NGINX and Wallarm filtering node are located in the directories:

* `/etc/nginx/conf.d/default.conf` with NGINX settings  
  `/etc/nginx/conf.d/default.conf`にはNGINX設定が含まれています
* `/etc/nginx/conf.d/wallarm.conf` with global filtering node settings  
  このファイルは、すべてのドメインに適用される設定用です。異なるドメイングループごとに設定を適用するには、`default.conf`を使用するか、各ドメイングループ用の新しい構成ファイル（例：`example.com.conf`および`test.com.conf`）を作成してください。NGINX構成ファイルの詳細情報は[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)にあります。
* `/etc/nginx/conf.d/wallarm-status.conf` with Wallarm node monitoring settings  
  `/etc/nginx/conf.d/wallarm-status.conf`にはWallarmノードの監視設定が含まれています。詳細な説明は[こちらのリンク][wallarm-status-instr]でご確認ください。
* `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool` with the Tarantool database settings  
  `/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`にはTarantoolデータベースの設定が含まれています。

#### リクエストフィルトレーションモード

デフォルトでは、フィルタリングノードは`off`状態であり、着信リクエストを解析しておりません。リクエスト解析を有効にするには、以下の手順に従ってください：

1. ファイル`/etc/nginx/conf.d/default.conf`を開いてください：

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `https`、`server`または`location`ブロック内に `wallarm_mode monitoring;` を追加してください：

??? note "ファイル `/etc/nginx/conf.d/default.conf` の例"

    ```bash
    server {
        # フィルタリング対象のポート
        listen       80;
        # フィルタリング対象のドメイン
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

`monitoring`モードで動作中の場合、フィルタリングノードはリクエスト内の攻撃の兆候を検出しますが、検出された攻撃をブロックしません。フィルタリングノードの展開後、数日間は`monitoring`モードでトラフィックを通過させ、その後に`block`モードを有効にすることを推奨します。[フィルタリングノード動作モード設定に関する推奨事項を確認する →][waf-mode-recommendations]

#### メモリ

!!! info "別サーバー上のPostanalyticsモジュール"
    もし別のサーバーにPostanalyticsモジュールをインストールしている場合は、この手順をスキップしてください。すでにモジュールが構成されています。

WallarmノードはインメモリストレージであるTarantoolを使用します。必要なリソース量の詳細は[こちら][memory-instr]をご確認ください。なお、テスト環境では本番環境よりも低いリソースを割り当てることが可能です。

Tarantoolのメモリ割り当て手順：

1. Tarantool構成ファイルを編集モードで開いてください：

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
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA`ディレクティブにGB単位でメモリサイズを指定してください。値は整数または浮動小数点数で指定でき、ドット `.` は小数点記号です。  
   Tarantoolのメモリ割り当てに関する詳細な推奨事項は、これらの[手順][memory-instr]に記載されています。
3. 変更を適用するには、Tarantoolを再起動してください：

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### 別サーバー上のpostanalyticsサーバーのアドレス

!!! info "同一サーバー上のNGINX-Wallarmおよびpostanalytics"
    もしNGINX-Wallarmおよびpostanalyticsモジュールが同一サーバーにインストールされている場合は、この手順をスキップしてください。

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### その他の構成

その他のNGINXおよびWallarmノードの構成を更新するには、NGINXドキュメントおよび[利用可能なWallarmノードディレクティブ][waf-directives-instr]の一覧をご参照ください。