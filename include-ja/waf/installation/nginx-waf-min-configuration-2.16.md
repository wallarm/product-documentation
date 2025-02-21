```markdown
NGINXおよびWallarmフィルタリングノードの主な設定ファイルは、以下のディレクトリにあります：

* `/etc/nginx/conf.d/default.conf`（NGINXの設定）
* `/etc/nginx/conf.d/wallarm.conf`（グローバルなフィルタリングノードの設定）

    このファイルは、すべてのドメインに適用される設定用です。異なるドメイングループに異なる設定を適用する場合は、`default.conf`を使用するか、各ドメイングループごとに新しい設定ファイル（例：`example.com.conf`や`test.com.conf`）を作成してください。NGINX設定ファイルに関する詳細な情報は、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)に記載されています。
* `/etc/nginx/conf.d/wallarm-status.conf`（Wallarmノードの監視設定）。詳細な説明は[こちらのリンク][wallarm-status-instr]に記載されています。
* `/etc/default/wallarm-tarantool`または`/etc/sysconfig/wallarm-tarantool`（Tarantoolデータベースの設定）

#### リクエストフィルトレーションモード

デフォルトでは、フィルタリングノードは`off`状態であり、受信リクエストの解析を行いません。リクエストの解析を有効にするには、以下の手順に従ってください：

1. ファイル`/etc/nginx/conf.d/default.conf`を開いてください：

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. `https`、`server`または`location`ブロック内に`wallarm_mode monitoring;`の行を追加してください。

??? note "ファイル`/etc/nginx/conf.d/default.conf`の例"

    ```bash
    server {
        # フィルタリング対象のリクエストのポート
        listen       80;
        # フィルタリング対象のリクエストのドメイン
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

`monitoring`モードで動作している場合、フィルタリングノードはリクエスト内の攻撃の兆候を検出しますが、検出された攻撃をブロックしません。フィルタリングノードの導入後、数日間はトラフィックを`monitoring`モードでフィルタリングし、その後で`block`モードに切り替えることを推奨します。[フィルタリングノードの運用モードの設定に関する推奨事項を確認 →][waf-mode-recommendations]

#### メモリ

!!! info "別サーバー上のPostanalyticsモジュール"
    別サーバー上にPostanalyticsモジュールをインストールしている場合、この手順はスキップしてください。すでにモジュールが設定済みです。

WallarmノードはインメモリストレージのTarantoolを使用しています。必要なリソースの詳細については[こちら][memory-instr]をご参照ください。なお、テスト環境では、本番環境より低いリソースを割り当てることが可能です。

Tarantool用のメモリを割り当てるには：

1. 編集モードでTarantoolの設定ファイルを開いてください：

    === "Debian"
        ```bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. `SLAB_ALLOC_ARENA`ディレクティブにGB単位のメモリサイズを指定してください。値は整数または浮動小数点数で指定可能です（小数点記号は`.`です）。

    Tarantool用のメモリ割当に関する詳細な推奨事項は、これらの[手順][memory-instr]に記載されています。
3. 変更を反映するため、Tarantoolを再起動してください：

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### 別サーバー上のPostanalyticsサーバのアドレス

!!! info "NGINX-WallarmとPostanalyticsが同一サーバー上にある場合"
    NGINX-WallarmとPostanalyticsモジュールが同一サーバー上にインストールされている場合、この手順はスキップしてください。

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### その他の設定

その他のNGINXおよびWallarmノード設定を更新するには、NGINXのドキュメントと[利用可能なWallarmノードディレクティブ][waf-directives-instr]のリストをご参照ください。
```