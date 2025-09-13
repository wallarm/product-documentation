NGINXおよびWallarmフィルタリングノードの主な設定ファイルは次のディレクトリにあります:

* `/etc/nginx/conf.d/default.conf`にはNGINXの設定があります
* `/etc/nginx/conf.d/wallarm.conf`にはグローバルなフィルタリングノードの設定があります

    このファイルは、すべてのドメインに適用される設定に使用します。異なるドメイングループに異なる設定を適用するには、`default.conf`ファイルを使用するか、各ドメイングループ（例:`example.com.conf`および`test.com.conf`）ごとに新しい設定ファイルを作成してください。NGINXの設定ファイルに関する詳細は[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)にあります。
* `/etc/nginx/conf.d/wallarm-status.conf`にはWallarmノードの監視設定があります。詳細な説明は[リンク][wallarm-status-instr]にあります。
* `/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`にはTarantoolデータベースの設定があります

#### リクエストのフィルタリングモード

デフォルトでは、フィルタリングノードは`off`状態で、受信リクエストを解析しません。リクエスト解析を有効にするには、次の手順を実行してください:

1. ファイル`/etc/nginx/conf.d/default.conf`を開きます:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. 行`wallarm_mode monitoring;`を`https`、`server`または`location`ブロックに追加します:

??? note "ファイル`/etc/nginx/conf.d/default.conf`の例"

    ```bash
    server {
        # リクエストをフィルタリングするポートです
        listen       80;
        # リクエストをフィルタリングするドメインです
        server_name  localhost;
        # フィルタリングノードのモードです
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

`monitoring`モードで動作している場合、フィルタリングノードはリクエスト内の攻撃の兆候を解析しますが、検出された攻撃はブロックしません。フィルタリングノードの導入後は、数日間は`monitoring`モードでフィルタリングノード経由でトラフィックを流し、その後に`block`モードを有効化することを推奨します。[フィルタリングノードの運用モード設定に関する推奨事項 →][waf-mode-recommendations]

#### メモリ

!!! info "別サーバー上のpostanalyticsモジュール"
    postanalyticsモジュールを別サーバーにインストール済みの場合、この手順はスキップしてください。すでにモジュールの設定が完了しています。

WallarmノードはインメモリストレージのTarantoolを使用します。必要なリソース量の詳細は[こちら][memory-instr]を参照してください。テスト環境では本番環境より少ないリソースを割り当てることができます。

Tarantoolに割り当てるメモリを設定するには:

1. Tarantoolの設定ファイルを編集モードで開きます:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021xおよびそれ以前"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA`ディレクティブにGB単位のメモリサイズを指定します。値は整数または浮動小数点数（小数点の区切りはドット`.`）にできます。

    Tarantoolへのメモリ割り当てに関する詳細な推奨事項は、これらの[手順][memory-instr]に記載されています。
3. 変更を適用するには、Tarantoolを再起動します:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### 個別のpostanalyticsサーバーのアドレス

!!! info "NGINX-Wallarmとpostanalyticsが同一サーバー上にある場合"
    NGINX-Wallarmとpostanalyticsの各モジュールが同じサーバーにインストールされている場合、この手順はスキップしてください。

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### その他の設定

その他のNGINXおよびWallarmノードの設定を更新するには、NGINXのドキュメントと[利用可能なWallarmノードのディレクティブ][waf-directives-instr]の一覧を参照してください。