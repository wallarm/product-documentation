NGINXおよびWallarmフィルタリングノードのメイン設定ファイルは、以下のディレクトリに位置しています：

* `/etc/nginx/conf.d/default.conf` は NGINXの設定で
* `/etc/nginx/conf.d/wallarm.conf` はグローバルフィルタリングノードの設定で

    このファイルは、全てのドメインに適用される設定用です。異なるドメイングループに異なる設定を適用するには、`default.conf`ファイルを使用するか、各ドメイングループのために新しい設定ファイルを作成します（例えば、`example.com.conf`や`test.com.conf`）。NGINX設定ファイルに関する詳細情報は、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)で利用可能です。
* `/etc/nginx/conf.d/wallarm-status.conf` はWallarmノードモニタリングの設定で。詳細な説明は[このリンク][wallarm-status-instr]で利用可能です
* `/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool` は Tarantoolデータベースの設定で

#### リクエストフィルタリングモード

デフォルトでは、フィルタリングノードは`off`状態であり、受信リクエストを解析しません。リクエストの解析を有効にするには、次の手順に従ってください：

1. ファイル`/etc/nginx/conf.d/default.conf`を開きます：

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `https`、`server`または`location`ブロックに`wallarm_mode monitoring;`という行を追加します：

??? note "`/etc/nginx/conf.d/default.conf`ファイルの例"

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

`monitoring`モードで運用しているとき、フィルタリングノードはリクエスト内の攻撃の兆候を検索しますが、検出された攻撃をブロックしません。フィルタリングノードの展開後数日間はトラフィックを`monitoring`モードでフィルタリングノードを経由させ続け、その後`block`モードを有効にすることをお勧めします。[フィルタリングノードの運用モード設定に関する推奨事項を学ぶ →][waf-mode-recommendations]

#### メモリ

!!! info "別のサーバー上のPostanalyticsモジュール"
    別のサーバーにpostanalyticsモジュールをインストールした場合、このステップをスキップしてください。既にモジュールが設定されています。

Wallarmノードは、インメモリストレージTarantoolを使用しています。必要なリソースの量については[こちら][memory-instr]で詳しく知ることができます。テスト環境の場合は、本番環境よりも少ないリソースを割り当てることができます。

Tarantoolのメモリを割り当てるには：

1. 編集モードでTarantoolの設定ファイルを開きます：

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x 以下"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "RHEL 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA`指示子に、GB単位のメモリサイズを指定します。値は整数または浮動小数点数（小数点は`.`が小数点区切り記号です）である可能性があります。

    Tarantoolのメモリ割り当てに関する詳細な推奨事項は、これらの[指示][memory-instr]に記述されています。
3. 変更を適用するため、Tarantoolを再起動してください：

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### 別のpostanalyticsサーバーのアドレス

!!! info "NGINX-Wallarmとpostanalyticsが同じサーバー上"
    NGINX-Wallarmとpostanalyticsモジュールが同じサーバー上にインストールされている場合、このステップをスキップしてください。

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### その他の設定

他のNGINXおよびWallarmノード設定を更新するには、NGINXドキュメントと[利用可能なWallarmノード指示][waf-directives-instr]のリストを使用してください。