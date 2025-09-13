NGINXとWallarmフィルタリングノードの主な設定ファイルは、次のディレクトリにあります：

* `/etc/nginx/conf.d/default.conf`（NGINXの設定）
* `/etc/nginx/conf.d/wallarm.conf`（フィルタリングノードのグローバル設定）

    このファイルはすべてのドメインに適用される設定に使用します。異なるドメイングループに異なる設定を適用するには、`default.conf`ファイルを使用するか、各ドメイングループごとに新しい設定ファイル（例：`example.com.conf`や`test.com.conf`）を作成します。NGINXの設定ファイルに関する詳細は[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)をご参照ください。
* `/etc/nginx/conf.d/wallarm-status.conf`（Wallarmノードの監視設定）。詳細な説明は[リンク][wallarm-status-instr]にあります
* `/etc/default/wallarm-tarantool` または `/etc/sysconfig/wallarm-tarantool`（Tarantoolデータベースの設定）

#### リクエストフィルタリングモード

デフォルトでは、フィルタリングノードはステータス`off`で、受信リクエストを解析しません。リクエスト解析を有効にするには、次の手順に従ってください：

1. ファイル`/etc/nginx/conf.d/default.conf`を開きます：

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `https`、`server`または`location`ブロックに`wallarm_mode monitoring;`という行を追加します：

??? note "ファイル`/etc/nginx/conf.d/default.conf`の例"

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

`monitoring`モードで動作している場合、フィルタリングノードはリクエスト内の攻撃の兆候を検出しますが、検出された攻撃をブロックしません。フィルタリングノードの導入後は数日間、トラフィックを`monitoring`モードでフィルタリングノード経由に流し、その後に`block`モードを有効にすることを推奨します。[フィルタリングノードの運用モード設定に関する推奨事項はこちら →][waf-mode-recommendations]

#### メモリ

!!! info "別サーバー上のpostanalyticsモジュール"
    別サーバーにpostanalyticsモジュールをインストール済みの場合は、この手順をスキップしてください。すでにモジュールの設定が完了しています。

WallarmノードはインメモリストレージのTarantoolを使用します。必要なリソース量の詳細は[こちら][memory-instr]をご確認ください。テスト環境では本番環境より少ないリソースを割り当てることができます。

Tarantoolに割り当てるメモリを設定するには：

1. Tarantoolの設定ファイルを編集モードで開きます：

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOSまたはAmazon Linux 2.0.2021x以前"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA`ディレクティブにGB単位のメモリサイズを指定します。値は整数または浮動小数点数です（小数点はドット`.`です）。

    Tarantoolへのメモリ割り当てに関する詳細な推奨事項は[こちらの手順][memory-instr]に記載しています。
3. 変更を適用するために、Tarantoolを再起動します：

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### 別サーバー上のpostanalyticsのアドレス

!!! info "同一サーバー上のNGINX-Wallarmとpostanalytics"
    NGINX-Wallarmとpostanalyticsモジュールが同一サーバーにインストールされている場合は、この手順をスキップしてください。

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### その他の設定

他のNGINXおよびWallarmノードの設定を更新するには、NGINXのドキュメントと[利用可能なWallarmノードディレクティブ][waf-directives-instr]の一覧を参照してください。