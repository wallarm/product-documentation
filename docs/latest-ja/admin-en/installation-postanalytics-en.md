[configure-selinux-instr]:    configure-selinux.md
[configure-proxy-balancer-instr]:   configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]:             ../images/check-user-no-2fa.png
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# postanalyticsモジュールの分離インストール

Wallarmのリクエスト処理には2つの段階があり、統計的なリクエスト解析を行うpostanalytics段階を含みます。postanalyticsはメモリ使用量が多く、性能最適化のために専用サーバーで実行する必要が生じる場合があります。本記事では、postanalyticsモジュールを別サーバーにインストールする方法を説明します。

## 概要

Wallarmノードでのリクエスト処理は次の2段階で構成されます:

* メモリ負荷の小さい一次処理はNGINX‑Wallarmモジュールで実行され、サーバー要件を変更することなくフロントエンドサーバー上で実行できます。
* 処理済みリクエストの統計解析はメモリ負荷が高く、postanalyticsモジュールで実行されます。

以下の図は、同一サーバーにインストールした場合と異なるサーバーにインストールした場合のモジュール間の連携を示します。

=== "1台のサーバー上のNGINX‑Wallarmとpostanalytics"
    ![postanalyticsとnginx-wallarm間のトラフィックフロー](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-the-same-server.png)
=== "異なるサーバー上のNGINX‑Wallarmとpostanalytics"
    ![postanalyticsとnginx-wallarm間のトラフィックフロー](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-different-servers.png)

## 要件

--8<-- "../include/waf/installation/all-in-one/separate-postanalytics-reqs.md"

## Step 1: オールインワンWallarmインストーラーをダウンロード

オールインワンのWallarmインストールスクリプトをダウンロードするには、次のコマンドを実行します:

=== "x86_64版"
    ```bash
    curl -O https://meganode.wallarm.com/6.4/wallarm-6.4.1.x86_64-glibc.sh
    ```
=== "ARM64版"
    ```bash
    curl -O https://meganode.wallarm.com/6.4/wallarm-6.4.1.aarch64-glibc.sh
    ```

## Step 2: Wallarmトークンを準備

ノードをインストールするには、[適切な種類][wallarm-token-types]のWallarmトークンが必要です。トークンを準備します:

=== "APIトークン"

    1. Wallarm Console → **Settings** → **API tokens**を[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます。
    1. 使用タイプが`Node deployment/Deployment`のAPIトークンを探すか作成します。
    1. このトークンをコピーします。

=== "ノードトークン"

    1. Wallarm Console → **Nodes**を[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で開きます。
    1. 次のいずれかを実行します: 
        * **Wallarm node**タイプのノードを作成し、生成されたトークンをコピーします。
        * 既存のノードグループを使用する場合は、ノードのメニュー → **Copy token**からトークンをコピーします。

## Step 3: オールインワンWallarmインストーラーを実行してpostanalyticsをインストール

オールインワンインストーラーでpostanalyticsを分離インストールするには、次を使用します:

=== "APIトークン"
    ```bash
    # x86_64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.x86_64-glibc.sh postanalytics

    # ARM64版を使用する場合:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.aarch64-glibc.sh postanalytics
    ```        

    変数`WALLARM_LABELS`はノードが追加されるグループを設定します（Wallarm Console UIでノードを論理的にグルーピングするために使用されます）。

=== "ノードトークン"
    ```bash
    # x86_64版を使用する場合:
    sudo sh wallarm-6.4.1.x86_64-glibc.sh postanalytics

    # ARM64版を使用する場合:
    sudo sh wallarm-6.4.1.aarch64-glibc.sh postanalytics
    ```

## Step 4: postanalyticsモジュールを構成

### リソースとメモリ

wstoreが使用するメモリ量を変更するには、`/opt/wallarm/env.list`ファイル内の`SLAB_ALLOC_ARENA`設定を確認します。既定では1 GBに設定されています。必要に応じて、wstoreが実際に必要とするメモリ量に合わせて数値を調整できます。設定値の目安は、[推奨事項](configuration-guides/allocate-resources-for-node.md)を参照してください。

割り当てメモリを変更するには:

1. `/opt/wallarm/env.list`ファイルを編集用に開きます:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. `SLAB_ALLOC_ARENA`属性にメモリサイズを設定します。値は整数または浮動小数（小数点はドット`.`）が使用できます。例:

    ```
    SLAB_ALLOC_ARENA=2.0
    ```

### ホストとポート

既定では、postanalyticsモジュールはホストのすべてのIPv4アドレス（0.0.0.0）でポート3313による接続を受け付けるように設定されています。必要がない限り、既定の構成を維持することを推奨します。

ただし、既定の構成を変更する必要がある場合は:

1. postanalyticsサービスのマシンで`/opt/wallarm/wstore/wstore.yaml`ファイルを編集用に開きます:

    ```bash
    sudo vim /opt/wallarm/wstore/wstore.yaml
    ```
1. `service.address`パラメータに新しいIPアドレスとポートの値を指定します。例:

    ```yaml
    service:
      address: 192.158.1.38:3313
    ```

    `service.address`パラメータには以下の形式を指定できます:

    * IPアドレス:ポート（例: `192.158.1.38:3313`）
    * すべてのIP上の特定ポート（例: `:3313`）
1. postanalyticsサービスのマシンで`/opt/wallarm/etc/wallarm/node.yaml`ファイルを編集用に開きます:

    ```bash
    sudo vim /opt/wallarm/etc/wallarm/node.yaml
    ```
1. `wstore.host`と`wstore.port`パラメータに新しいIPアドレスとポートの値を指定します。例:
    ```yaml
    api:
      uuid: <UUID of postanalytics node>
      secret: <secret key of postanalytics node>
    wstore:
      host: '0.0.0.0'
      port: 3300
    ```

## Step 5: postanalyticsモジュールへの受信接続を有効化

postanalyticsモジュールは既定でポート3313を使用しますが、クラウドプラットフォームによってはこのポートでの受信接続をブロックする場合があります。

連携を確実にするため、ポート3313またはカスタムポートでの受信接続を許可してください。これは、別にインストールされたNGINX‑Wallarmモジュールがwstoreインスタンスに接続するために不可欠です。

## Step 6: Wallarmサービスを再起動

必要な変更を加えたら、postanalyticsモジュールをホストするマシンでWallarmサービスを再起動して更新を適用します:

```
sudo systemctl restart wallarm.service
```

## Step 7: 別サーバーにNGINX‑Wallarmモジュールをインストール

postanalyticsモジュールを別サーバーにインストールしたら:

1. 対応する[ガイド](../installation/nginx/all-in-one.md)に従って、別サーバーにNGINX‑Wallarmモジュールをインストールします。
1. 別サーバーでNGINX‑Wallarmモジュールのインストールスクリプトを起動する際、`filtering`オプションを指定します。例:

    === "APIトークン"
        ```bash
        # x86_64版を使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.x86_64-glibc.sh filtering

        # ARM64版を使用する場合:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.4.1.aarch64-glibc.sh filtering
        ```        

        変数`WALLARM_LABELS`はノードが追加されるグループを設定します（Wallarm Console UIでノードを論理的にグルーピングするために使用されます）。

    === "ノードトークン"
        ```bash
        # x86_64版を使用する場合:
        sudo sh wallarm-6.4.1.x86_64-glibc.sh filtering

        # ARM64版を使用する場合:
        sudo sh wallarm-6.4.1.aarch64-glibc.sh filtering
        ```

## Step 8: NGINX‑Wallarmモジュールをpostanalyticsモジュールに接続

NGINX‑Wallarmモジュールのあるマシンで、NGINXの[設定ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)（通常は`/etc/nginx/nginx.conf`）にpostanalyticsモジュールのサーバーアドレスを指定します:

```
http {
    # omitted

    upstream wallarm_wstore {
        server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
        server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
        keepalive 2;
    }

    wallarm_wstore_upstream wallarm_wstore;

    # omitted
}
```

* 過剰な接続の生成を防ぐため、各upstreamのwstoreサーバーに対して`max_conns`の値を指定する必要があります。
* `keepalive`の値はwstoreサーバーの台数未満にしてはいけません。

設定ファイルを変更したら、NGINX‑WallarmモジュールサーバーでNGINX/NGINX Plusを再起動します:

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## Step 9: NGINX‑Wallarmと分離postanalyticsモジュールの連携を確認

NGINX‑Wallarmと分離postanalyticsモジュールの連携を確認するには、保護対象アプリケーションのアドレスにテスト攻撃付きのリクエストを送信します:

```bash
curl http://localhost/etc/passwd
```

NGINX‑Wallarmと分離postanalyticsモジュールが正しく構成されていれば、攻撃はWallarm Cloudにアップロードされ、Wallarm Consoleの**Attacks**セクションに表示されます:

![インターフェイスのAttacks](../images/admin-guides/test-attacks-quickstart.png)

攻撃がWallarm Cloudにアップロードされなかった場合、サービスの動作にエラーがないか確認してください:

* postanalyticsモジュールのログを確認します

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/wstore-out.log
    ```

    `SystemError binary: failed to bind: Cannot assign requested address`のような記録があれば、指定したアドレスとポートでサーバーが接続を受け付けていることを確認してください。
* NGINX‑Wallarmモジュールのサーバーで、NGINXのログを確認します:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    `[error] wallarm: <address> connect() failed`のような記録があれば、NGINX‑Wallarmモジュールの設定ファイルで分離postanalyticsモジュールのアドレスが正しく指定されていること、および分離postanalyticsサーバーが指定したアドレスとポートで接続を受け付けていることを確認してください。
* NGINX‑Wallarmモジュールのサーバーで、以下のコマンドを使用して処理済みリクエストの統計を取得し、`tnt_errors`の値が0であることを確認します

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [統計サービスが返す全パラメータの説明 →](configure-statistics-service.md)

## NGINX‑Wallarmモジュールとpostanalyticsモジュール間のSSL/TLSおよびmTLS

任意で、NGINX‑Wallarmモジュールとpostanalytics間にSSL/TLSによる安全な接続を確立できます。片方向のサーバー証明書検証と相互TLSの両方に対応しています。

リリース6.2.0以降で利用可能です。

### postanalyticsモジュールへのSSL/TLS接続

NGINX‑Wallarmモジュールからpostanalyticsモジュールへの安全なSSL/TLS接続を有効にするには:

1. 稼働中のpostanalyticsモジュールのホストのFQDNまたはIPアドレスに対してサーバー証明書を発行します。
1. postanalyticsサーバーで、`/opt/wallarm/wstore/wstore.yaml`ファイルにてSSL/TLSを有効にします:

    ```yaml
    service:
      TLS:
        enabled: true
        address: 0.0.0.0:6388
        certFile: "/opt/wallarm/wstore/wstore.crt"
        keyFile: "/opt/wallarm/wstore/wstore.key"
        # caCertFile: "/opt/wallarm/wstore/wstore-ca.crt"
    ```

    * `enabled`: postanalyticsモジュールのSSL/TLSを有効化または無効化します。既定は`false`です。
    * `address`: postanalyticsモジュールが受け付けるTLS着信接続のアドレスとポート。指定したアドレスは受信接続を許可している必要があります。
    * `certFile`: TLSハンドシェイク時にクライアント（NGINX‑Wallarmモジュール）へ提示するサーバー証明書のパス。
    * `keyFile`: サーバー証明書に対応する秘密鍵のパス。
    * `caCertFile`（任意）: サーバー用のカスタムCA証明書のパス。
1. postanalyticsサーバーでWallarmサービスを再起動します:

    ```
    sudo systemctl restart wallarm.service
    ```
1. NGINX‑Wallarmサーバーで、NGINXの[設定ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)（通常は`/etc/nginx/nginx.conf`）にて次を行います:

    1. TLS経由でpostanalyticsに使用するupstreamを構成します。
    1. [`wallarm_wstore_upstream`](configure-parameters-en.md#wallarm_wstore_upstream)に`ssl=on`オプションを追加します。
    1. postanalyticsモジュールがカスタムCA発行の証明書を使用している場合、CA証明書をNGINX‑Wallarmサーバーへ配置し、そのパスを[`wallarm_wstore_ssl_ca_cert_file`](configure-parameters-en.md#wallarm_wstore_ssl_ca_cert_file)に指定します。
    
        このファイルはpostanalyticsサーバーで設定した`service.TLS.caCertFile`と一致している必要があります。

    ```
    http {
        upstream wallarm_wstore {
            server postanalytics.server.com:6388 max_fails=0 fail_timeout=0 max_conns=1;
            keepalive 1;
        }
    
        wallarm_wstore_upstream wallarm_wstore ssl=on;

        # wallarm_wstore_ssl_ca_cert_file /path/to/wstore-ca.crt;
    }
    ```
1. NGINX‑WallarmサーバーでNGINXを再起動します:

    === "Debian"
        ```bash
        sudo systemctl restart nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx restart
        ```
    === "CentOS"
        ```bash
        sudo systemctl restart nginx
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo systemctl restart nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo systemctl restart nginx
        ```
1. [連携を確認します](#step-9-check-the-nginxwallarm-and-separate-postanalytics-modules-interaction)。

### 相互TLS（mTLS）

NGINX‑Wallarmモジュールとpostanalyticsモジュールの双方が相互に証明書を検証する相互認証を有効にするには:

1. 上記のとおり[SSL/TLS接続](#ssltls-connection-to-the-postanalytics-module)をpostanalyticsモジュールに対して有効化します。
1. 稼働中のNGINX‑WallarmモジュールのホストのFQDNまたはIPアドレスに対してクライアント証明書を発行します。
1. NGINX‑Wallarmサーバーで、クライアント証明書と秘密鍵を配置し、それぞれのパスを[`wallarm_wstore_ssl_cert_file`](configure-parameters-en.md#wallarm_wstore_ssl_cert_file)および[`wallarm_wstore_ssl_key_file`](configure-parameters-en.md#wallarm_wstore_ssl_key_file)に指定します:

    ```
    http {
        upstream wallarm_wstore {
            server postanalytics.server.com:6388 max_fails=0 fail_timeout=0 max_conns=1;
            keepalive 1;
        }
    
        wallarm_wstore_upstream wallarm_wstore ssl=on;

        wallarm_wstore_ssl_cert_file /path/to/client.crt;
        wallarm_wstore_ssl_key_file /path/to/client.key;
        
        # wallarm_wstore_ssl_ca_cert_file /path/to/wstore-ca.crt;
    }
    ```

    次に、NGINXを再起動します:

    === "Debian"
        ```bash
        sudo systemctl restart nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx restart
        ```
    === "CentOS"
        ```bash
        sudo systemctl restart nginx
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo systemctl restart nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo systemctl restart nginx
        ```

1. postanalyticsサーバーで、`/opt/wallarm/wstore/wstore.yaml`にてmTLSを有効にします:

    ```yaml
    service:
      TLS:
        enabled: true
        address: 0.0.0.0:6388
        certFile: "/opt/wallarm/wstore/wstore.crt"
        keyFile: "/opt/wallarm/wstore/wstore.key"
        # caCertFile: "/opt/wallarm/wstore/wstore-ca.crt"
        mutualTLS:
          enabled: true
          # clientCACertFile: "/opt/wallarm/wstore/client-ca.crt"
    ```

    * `mutualTLS.enabled`: mTLSを有効化または無効化します。既定は`false`です。
    * `mutualTLS.clientCACertFile`（任意）: NGINX‑Wallarmクライアント用のカスタムCA証明書のパス。


    その後、Wallarmサービスを再起動します:

    ```
    sudo systemctl restart wallarm.service
    ```

## postanalyticsモジュールの保護

!!! warning "インストール済みのpostanalyticsモジュールを保護してください"
    新しくインストールしたWallarmのpostanalyticsモジュールは、ファイアウォールで保護することを強く推奨します。そうしない場合、サービスへの不正アクセスを受けるリスクがあり、次のような事態につながる可能性があります:
    
    *   処理済みリクエストに関する情報の漏えい
    *   任意のLuaコードおよびオペレーティングシステムコマンドの実行の可能性
   
    postanalyticsモジュールをNGINX‑Wallarmモジュールと同一サーバーに併設してデプロイしている場合、上記のリスクはありません。これは、postanalyticsモジュールがポート`3313`をリッスンするためです。
    
    別途インストールしたpostanalyticsモジュールに適用すべきファイアウォール設定は以下のとおりです:
    
    *   postanalyticsモジュールがWallarm APIサーバーと通信できるよう、これらのサーバーとの間のHTTPSトラフィックを許可します:
        *   `us1.api.wallarm.com`はUS Wallarm CloudのAPIサーバーです
        *   `api.wallarm.com`はEU Wallarm CloudのAPIサーバーです
    *   TCPおよびUDPプロトコルにおいて、`3313`のwstoreポートへのアクセスをWallarmフィルタリングノードのIPアドレスからの接続のみに制限します。