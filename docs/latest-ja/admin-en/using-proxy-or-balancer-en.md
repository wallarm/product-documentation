# HTTPプロキシまたはロードバランサー（NGINX）使用時の元のクライアントIPアドレスの特定

本手順では、HTTPプロキシまたはロードバランサー経由でサーバーに接続するクライアントの発信元IPアドレスを特定するために必要なNGINXの設定について説明します。これはセルフホスト型のNGINXベースノードに適用されます。

* セルフホストのWallarm nodeがオールインワンインストーラー、AWS / GCPイメージ、またはNGINXベースのDockerイメージからインストールされている場合は、現在の手順をご利用ください。
* セルフホストのWallarm nodeがK8s Ingress controllerとしてデプロイされている場合は、[こちらの手順](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)をご利用ください。

## Wallarm nodeがリクエストのIPアドレスを特定する方法

Wallarm nodeは、NGINX変数`$remote_addr`からリクエスト送信元IPアドレスを読み取ります。リクエストがノードに送信される前にプロキシサーバーまたはロードバランサーを経由した場合、`$remote_addr`にはそのプロキシサーバーまたはロードバランサーのIPアドレスが保持されます。

![バランサーの使用](../images/admin-guides/using-proxy-or-balancer/using-balancer-en.png)

Wallarm nodeが特定したリクエスト送信元IPアドレスは、Wallarm Consoleの[攻撃の詳細](../user-guides/events/check-attack.md#attack-analysis)に表示されます。

## リクエスト送信元としてプロキシサーバーまたはロードバランサーのIPアドレスを使用する場合の問題点

Wallarm nodeがプロキシサーバーまたはロードバランサーのIPアドレスをリクエスト送信元のIPアドレスと見なすと、以下のWallarmの機能が正しく動作しない場合があります:

* [IPアドレスによるアプリケーションへのアクセス制御](../user-guides/ip-lists/overview.md)（例）:

	元のクライアントIPアドレスをdenylistに登録しても、Wallarm nodeはロードバランサーのIPアドレスをリクエスト送信元のIPアドレスと見なすため、それらのIPから発生したリクエストをブロックしません。
* [ブルートフォース攻撃対策](configuration-guides/protecting-against-bruteforce.md)（例）:

	ロードバランサーを経由するリクエストにブルートフォース攻撃の兆候がある場合、WallarmはこのロードバランサーのIPアドレスをdenylistに登録し、その結果、このロードバランサーを経由する以降のすべてのリクエストをブロックします。
* [Threat Replay Testing](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)モジュール（例）:

    WallarmはThreat Replay Testingモジュールが生成する[テスト攻撃の送信元IPアドレス](../admin-en/scanner-addresses.md)としてロードバランサーのIPアドレスを認識します。そのため、テスト攻撃はロードバランサーのIPアドレスから発生した攻撃としてWallarm Consoleに表示され、さらにWallarmによる追加検査の対象となり、アプリケーションに余分な負荷がかかります。

Wallarm nodeが[IPCソケット](https://en.wikipedia.org/wiki/Unix_domain_socket)経由で接続されている場合、`0.0.0.0`がリクエストの送信元として扱われます。

## 元のクライアントIPアドレスを特定するための設定

元のクライアントIPアドレスを特定するには、[NGINXモジュール**ngx_http_realip_module**](https://nginx.org/en/docs/http/ngx_http_realip_module.html)を使用できます。このモジュールは、Wallarm nodeがクライアントIPアドレスの取得に[使用する](#how-wallarm-node-identifies-an-ip-address-of-a-request)`$remote_addr`の値を再定義できるようにします。

NGINXモジュール**ngx_http_realip_module**は次のいずれかの方法で使用できます:

* ロードバランサーやプロキシサーバーがリクエストに追加する特定のヘッダー（通常は[`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)）から元のクライアントIPアドレスを読み取る。
* ロードバランサーやプロキシサーバーが[PROXYプロトコル](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)に対応している場合、`PROXY`ヘッダーから元のクライアントIPアドレスを読み取る。

### `X-Forwarded-For`（`X-Real-IP`など）ヘッダーを読み取るようにNGINXを設定する

ロードバランサーまたはプロキシサーバーが元のクライアントIPアドレスを含む`X-Forwarded-For`（`X-Real-IP`など）ヘッダーを付加する場合、以下のとおりNGINXモジュール**ngx_http_realip_module**がこのヘッダーを読み取るように設定します:

1. Wallarm nodeとともにインストールされたNGINXの以下の設定ファイルを開きます:

    * Wallarm nodeがオールインワンインストーラーまたはAWS / GCPイメージからインストールされている場合は、`/etc/nginx/sites-enabled/default`。
    * Wallarm nodeがNGINXベースのDockerイメージからデプロイされている場合は、NGINXの設定ファイルをローカルで作成・編集し、Dockerコンテナのパス`/etc/nginx/http.d/default.conf`にマウントします。初期のNGINX設定ファイルのコピーおよびファイルをコンテナにマウントする手順は、[WallarmのNGINXベースDockerの手順](installation-docker-en.md#run-the-container-mounting-the-configuration-file)をご参照ください。
2. NGINXの`location`コンテキストまたはそれより上位で、プロキシサーバーまたはロードバランサーのIPアドレスを指定した`set_real_ip_from`ディレクティブを追加します。プロキシサーバーやロードバランサーに複数のIPアドレスがある場合は、その数だけ個別のディレクティブを追加します。例:

    ```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
    }
    ...
    ```
2. 使用中のロードバランサーのドキュメントで、元のクライアントIPアドレスを渡すためにそのロードバランサーが付加するヘッダー名を確認します。最も一般的なヘッダー名は`X-Forwarded-For`です。
3. NGINXの`location`コンテキストまたはそれより上位で、前の手順で確認したヘッダー名を指定して`real_ip_header`ディレクティブを追加します。例:

    ```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
        real_ip_header X-Forwarded-For;
    }
    ...
    ```
4. NGINXを再起動します:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

    NGINXは`real_ip_header`ディレクティブで指定したヘッダーの値を変数`$remote_addr`に割り当てるため、Wallarm nodeはこの変数から元のクライアントIPアドレスを読み取ります。
5. [設定をテストします](#testing-the-configuration)。

### `PROXY`ヘッダーを読み取るようにNGINXを設定する

ロードバランサーまたはプロキシサーバーが[PROXYプロトコル](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)に対応している場合、以下のとおりNGINXモジュール**ngx_http_realip_module**が`PROXY`ヘッダーを読み取るように設定できます:

1. Wallarm nodeとともにインストールされたNGINXの以下の設定ファイルを開きます:

    * Wallarm nodeがオールインワンインストーラーまたはAWS / GCPイメージからインストールされている場合は、`/etc/nginx/sites-enabled/default`。
    * Wallarm nodeがNGINXベースのDockerイメージからデプロイされている場合は、NGINXの設定ファイルをローカルで作成・編集し、Dockerコンテナのパス`/etc/nginx/http.d/default.conf`にマウントします。初期のNGINX設定ファイルのコピーおよびファイルをコンテナにマウントする手順は、[WallarmのNGINXベースDockerの手順](installation-docker-en.md#run-the-container-mounting-the-configuration-file)をご参照ください。
2. NGINXの`server`コンテキストで、`listen`ディレクティブにパラメーター`proxy_protocol`を追加します。
3. NGINXの`location`コンテキストまたはそれより上位で、プロキシサーバーまたはロードバランサーのIPアドレスを指定した`set_real_ip_from`ディレクティブを追加します。プロキシサーバーやロードバランサーに複数のIPアドレスがある場合は、その数だけ個別のディレクティブを追加します。
4. NGINXの`location`コンテキストまたはそれより上位で、値に`proxy_protocol`を指定して`real_ip_header`ディレクティブを追加します。

    すべてのディレクティブを追加したNGINX設定ファイルの例:

    ```bash
    server {
        listen 80 proxy_protocol;
        server_name localhost;

        set_real_ip_from <IP_ADDRESS_OF_YOUR_PROXY>;
        real_ip_header proxy_protocol;

        ...
    }
    ```

    * NGINXはポート80で受信接続を待ち受けます。
    * 受信リクエストに`PROXY`ヘッダーが含まれていない場合、このリクエストは無効と見なされるため、NGINXは受け付けません。
    * `<IP_ADDRESS_OF_YOUR_PROXY>`からのリクエストについて、NGINXは`PROXY`ヘッダーで渡された送信元アドレスを変数`$remote_addr`に割り当てるため、Wallarm nodeはこの変数から元のクライアントIPアドレスを読み取ります。
5. NGINXを再起動します:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
6. [設定をテストします](#testing-the-configuration)。

元のクライアントIPアドレスをログに含めるには、[NGINXのログ設定手順](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#logging-the-original-ip-address)に従い、NGINX設定で`proxy_set_header`ディレクティブを追加し、`log_format`ディレクティブの変数一覧を編集します。

`PROXY`ヘッダーに基づいて元のクライアントIPアドレスを特定する詳細は、[NGINXのドキュメント](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#changing-the-load-balancers-ip-address-to-the-client-ip-address)をご参照ください。

### 設定のテスト

1. 保護対象アプリケーションのアドレスにテスト攻撃を送信します:

    === "cURLを使用"
        ```bash
        curl http://localhost/etc/passwd
        ```
    === "printfとNetcatを使用（ヘッダー`PROXY`用）"
        ```bash
        printf "PROXY TCP4 <IP_ADDRESS_OF_YOUR_PROXY> <REAL_CLIENT_IP> 0 80\r\nGET /etc/passwd\r\n\r\n" | nc localhost 80
        ```
2. Wallarm Consoleを開き、攻撃の詳細に元のクライアントIPアドレスが表示されていることを確認します:

    ![リクエストの発信元IPアドレス](../images/request-ip-address.png)

    NGINXが`X-Forwarded-For`（`X-Real-IP`など）ヘッダーから元のアドレスを読み取った場合は、そのヘッダー値も生の攻撃データに表示されます。

    ![ヘッダーX-Forwarded-For](../images/x-forwarded-for-header.png)

## 設定例

以下に、一般的なロードバランサー経由でサーバーに接続するクライアントの発信元IPアドレスを特定するために必要なNGINX設定の例を示します。

### Cloudflare CDN

Cloudflare CDNを使用している場合は、[NGINXモジュール**ngx_http_realip_module**を設定](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar)して元のクライアントIPアドレスを特定できます。

```bash
...
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 104.16.0.0/12;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2c0f:f248::/32;
set_real_ip_from 2a06:98c0::/29;

real_ip_header CF-Connecting-IP;
#real_ip_header X-Forwarded-For;
real_ip_recursive on;
...
```

* 設定を保存する前に、上記の設定に記載したCloudflareのIPアドレスが[Cloudflareのドキュメント](https://www.cloudflare.com/ips/)に記載のものと一致していることを確認してください。 
* `real_ip_header`ディレクティブの値には、`CF-Connecting-IP`または`X-Forwarded-For`のいずれかを指定できます。Cloudflare CDNは両方のヘッダーを付加するため、どちらを読み取るようにNGINXを設定しても構いません。[詳細はCloudflare CDNのドキュメントをご参照ください](https://support.cloudflare.com/hc/en-us/articles/200170786-Restoring-original-visitor-IPs)

### Fastly CDN

Fastly CDNを使用している場合は、[NGINXモジュール**ngx_http_realip_module**を設定](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar)して元のクライアントIPアドレスを特定できます。

```bash
...
set_real_ip_from 23.235.32.0/20;
set_real_ip_from 43.249.72.0/22;
set_real_ip_from 103.244.50.0/24;
set_real_ip_from 103.245.222.0/23;
set_real_ip_from 103.245.224.0/24;
set_real_ip_from 104.156.80.0/20;
set_real_ip_from 146.75.0.0/16;
set_real_ip_from 151.101.0.0/16;
set_real_ip_from 157.52.64.0/18;
set_real_ip_from 167.82.0.0/17;
set_real_ip_from 167.82.128.0/20;
set_real_ip_from 167.82.160.0/20;
set_real_ip_from 167.82.224.0/20;
set_real_ip_from 172.111.64.0/18;
set_real_ip_from 185.31.16.0/22;
set_real_ip_from 199.27.72.0/21;
set_real_ip_from 199.232.0.0/16;
set_real_ip_from 2a04:4e40::/32;
set_real_ip_from 2a04:4e42::/32;

real_ip_header X-Forwarded-For;
real_ip_recursive on;
...
```

設定を保存する前に、上記の設定に記載したFastlyのIPアドレスが[Fastlyのドキュメント](https://api.fastly.com/public-ip-list)に記載のものと一致していることを確認してください。 

### HAProxy

HAProxyを使用する場合、元のクライアントIPアドレスを特定できるよう、HAProxy側とWallarm node側の双方で適切に設定する必要があります:

* `/etc/haproxy/haproxy.cfg`設定ファイルの、HAProxyからWallarm nodeへの接続を担当する`backend`ディレクティブブロックに、`option forwardfor header X-Client-IP`行を挿入します。

	`option forwardfor`ディレクティブは、クライアントのIPアドレスを含むヘッダーをリクエストに追加するようHAProxyバランサーに指示します。[詳細はHAProxyのドキュメントをご参照ください](https://cbonte.github.io/haproxy-dconv/1.9/configuration.html#option%20forwardfor)

	設定例:

    ```
    ...
    # リクエストを受け付けるためのパブリックIPアドレス
    frontend my_frontend
        bind <HAPROXY_IP>
        mode http
        default_backend my_backend

    # Wallarm nodeのバックエンド
    backend my_backend
        mode http
    option forwardfor header X-Client-IP
    server wallarm-node <WALLARM_NODE_IP>
    ...
    ```

    *   `<HAPROXY_IP>`は、クライアントのリクエストを受け付けるHAProxyサーバーのIPアドレスです。
    *   `<WALLARM_NODE_IP>`は、HAProxyサーバーからのリクエストを受け付けるWallarm nodeのIPアドレスです。

* Wallarm nodeとともにインストールされたNGINXの設定ファイルで、[モジュール**ngx_http_realip_module**](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar)を次のように設定します:
    
    ```bash
    ...
    location / {
        wallarm_mode block;
        
        proxy_pass http://<APPLICATION_IP>;        
        set_real_ip_from <HAPROXY_IP1>;
        set_real_ip_from <HAPROXY_IP2>;
        real_ip_header X-Client-IP;
    }
    ...
    ```

    *   `<APPLICATION_IP>`は、Wallarm nodeからのリクエストに対する保護対象アプリケーションのIPアドレスです。
    *   `<HAPROXY_IP1>`および`<HAPROXY_IP2>`は、Wallarm nodeにリクエストを転送するHAProxyバランサーのIPアドレスです。