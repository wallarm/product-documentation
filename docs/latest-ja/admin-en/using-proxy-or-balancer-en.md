# HTTPプロキシまたはロードバランサー（NGINX）使用時にオリジナルのクライアントIPアドレスを特定する方法

これらの手順は、HTTPプロキシまたはロードバランサーを介してサーバーに接続するクライアントの発信元IPアドレスを特定するためのNGINX設定について説明します。これは、セルフホスト型NGINXベースのノードに該当します。

* セルフホスト型Wallarmノードがall-in-oneインストーラー、AWS/GCPイメージ、またはNGINXベースのDockerイメージからインストールされている場合は、**現行の手順**を使用してください。
* セルフホスト型WallarmノードがK8s Ingressコントローラーとして展開されている場合は、[こちらの手順](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)を使用してください。

## WallarmノードがリクエストのIPアドレスを特定する方法

WallarmノードはNGINX変数 `$remote_addr` からリクエストの送信元IPアドレスを読み取ります。リクエストがノードに送信される前にプロキシサーバーまたはロードバランサーを通過した場合、変数 `$remote_addr` にはプロキシサーバーまたはロードバランサーのIPアドレスが残ります。

![Using balancer](../images/admin-guides/using-proxy-or-balancer/using-balancer-en.png)

Wallarmノードが特定したリクエストの送信元IPアドレスは、Wallarm Consoleの[攻撃詳細](../user-guides/events/check-attack.md#attack-analysis)に表示されます。

## リクエストの送信元アドレスとしてプロキシサーバーまたはロードバランサーのIPアドレスを使用した場合の問題点

もしWallarmノードがプロキシサーバーまたはロードバランサーのIPアドレスをリクエストの送信元IPアドレスとみなす場合、以下のWallarm機能が正しく動作しない可能性があります：

* [IPアドレスによるアプリケーションアクセス制御](../user-guides/ip-lists/overview.md)（例）:

	オリジナルのクライアントIPアドレスがdenylistに登録されている場合でも、WallarmノードはロードバランサーのIPアドレスを送信元IPアドレスとみなすため、これらのリクエストをブロックしません。
* [ブルートフォース攻撃防御](configuration-guides/protecting-against-bruteforce.md)（例）:

	ロードバランサーを通過したリクエストにブルートフォース攻撃の兆候がある場合、WallarmはこのロードバランサーのIPアドレスをdenylistに登録し、その結果、このロードバランサーを通過する全てのリクエストがブロックされます。
* [Threat Replay Testing](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)モジュールと[Vulnerability Scanner](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)（例）:

	WallarmはロードバランサーのIPアドレスを、Threat Replay TestingモジュールおよびVulnerability Scannerが生成する[テスト攻撃発信元IPアドレス](../admin-en/scanner-addresses.md)とみなします。そのため、テスト攻撃がWallarm ConsoleでロードバランサーのIPアドレスからの攻撃として表示され、さらにWallarmによってチェックされ、アプリケーションに余分な負荷がかかります。

もしWallarmノードが[IPCソケット](https://en.wikipedia.org/wiki/Unix_domain_socket)経由で接続されている場合、`0.0.0.0`がリクエストの送信元としてみなされます。

## オリジナルのクライアントIPアドレス特定のための設定

オリジナルのクライアントIPアドレスを特定するためには、[NGINXモジュール **ngx_http_realip_module**](https://nginx.org/en/docs/http/ngx_http_realip_module.html)を使用できます。このモジュールにより、Wallarmノードが[使用](#how-wallarm-node-identifies-an-ip-address-of-a-request)する変数`$remote_addr`の値を再定義して、クライアントIPアドレスを取得できます。

NGINXモジュール **ngx_http_realip_module** は、以下のいずれかの方法で使用できます：

* 通常、ロードバランサーまたはプロキシサーバーによってリクエストに追加された特定のヘッダー（通常は[`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)）からオリジナルのクライアントIPアドレスを読み取るため。
* ロードバランサーまたはプロキシサーバーが[PROXYプロトコル](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)に対応している場合、ヘッダー`PROXY`からオリジナルのクライアントIPアドレスを読み取るため。

### ヘッダー `X-Forwarded-For`（`X-Real-IP`またはそれに類似したヘッダー）をNGINXで読む設定

もしロードバランサーまたはプロキシサーバーが、オリジナルのクライアントIPアドレスを含むヘッダー`X-Forwarded-For`（`X-Real-IP`またはそれに類似したヘッダー）を追加する場合は、NGINXモジュール **ngx_http_realip_module** を以下のように設定してください：

1. WallarmノードにインストールされたNGINXの以下の設定ファイルを開いてください：

    * Wallarmノードがall-in-oneインストーラーまたはAWS/GCPイメージからインストールされている場合は `/etc/nginx/sites-enabled/default`。
    * WallarmノードがNGINXベースのDockerイメージから展開されている場合は、ローカルでNGINX設定ファイルを作成・編集し、Dockerコンテナ内の`/etc/nginx/sites-enabled/default`にマウントしてください。初期のNGINX設定ファイルをコピーすることができ、[Wallarm NGINXベースのDockerの手順](installation-docker-en.md#run-the-container-mounting-the-configuration-file)から、ファイルのコンテナへのマウント方法について案内を得ることができます。
2. NGINXの`location`コンテキストまたはそれ以上の階層に、`set_real_ip_from`ディレクティブをプロキシサーバーまたはロードバランサーのIPアドレスと共に追加してください。プロキシサーバーやロードバランサーに複数のIPアドレスがある場合は、適切な数の個別のディレクティブを追加してください。例えば：

    ```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
    }
    ...
    ```
2. 使用しているロードバランサーに関するドキュメントから、オリジナルのクライアントIPアドレスを渡すためにこのロードバランサーが追加するヘッダー名を確認してください。ほとんどの場合、ヘッダー名は`X-Forwarded-For`です。
3. NGINXの`location`コンテキストまたはそれ以上の階層に、先ほど確認したヘッダー名で `real_ip_header`ディレクティブを追加してください。例えば：

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
4. NGINXを再起動してください：

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

    NGINXは、`real_ip_header`ディレクティブで指定されたヘッダーの値を変数`$remote_addr`に割り当てるため、Wallarmノードはこの変数からオリジナルのクライアントIPアドレスを読み取ります。
5. [設定のテスト](#testing-the-configuration)を実施してください。

### ヘッダー `PROXY` をNGINXで読む設定

もしロードバランサーまたはプロキシサーバーが[PROXYプロトコル](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)に対応している場合は、NGINXモジュール **ngx_http_realip_module** を以下のように設定してヘッダー`PROXY`を読み取るようにしてください：

1. WallarmノードにインストールされたNGINXの以下の設定ファイルを開いてください：

    * Wallarmノードがall-in-oneインストーラーまたはAWS/GCPイメージからインストールされている場合は `/etc/nginx/sites-enabled/default`。
    * WallarmノードがNGINXベースのDockerイメージから展開されている場合は、ローカルでNGINX設定ファイルを作成・編集し、Dockerコンテナ内の`/etc/nginx/sites-enabled/default`にマウントしてください。初期のNGINX設定ファイルをコピーすることができ、[Wallarm NGINXベースのDockerの手順](installation-docker-en.md#run-the-container-mounting-the-configuration-file)から、ファイルのコンテナへのマウント方法について案内を得ることができます。
2. NGINXの`server`コンテキストで、`listen`ディレクティブに`proxy_protocol`パラメータを追加してください。
3. NGINXの`location`コンテキストまたはそれ以上の階層に、`set_real_ip_from`ディレクティブをプロキシサーバーまたはロードバランサーのIPアドレスと共に追加してください。プロキシサーバーやロードバランサーに複数のIPアドレスがある場合は、適切な数の個別のディレクティブを追加してください。例えば：
4. NGINXの`location`コンテキストまたはそれ以上の階層に、値`proxy_protocol`を指定した`real_ip_header`ディレクティブを追加してください。

    以下は、全てのディレクティブを追加したNGINX設定ファイルの例です：

    ```bash
    server {
        listen 80 proxy_protocol;
        server_name localhost;

        set_real_ip_from <IP_ADDRESS_OF_YOUR_PROXY>;
        real_ip_header proxy_protocol;

        ...
    }
    ```

    *   NGINXはポート80で着信接続を待ち受けます。
    *   着信リクエストにヘッダー`PROXY`が含まれていない場合、NGINXはそのリクエストを無効とみなし受け付けません。
    *   アドレス`<IP_ADDRESS_OF_YOUR_PROXY>`から発信されたリクエストの場合、NGINXはヘッダー`PROXY`に渡された送信元アドレスを変数`$remote_addr`に割り当てるため、Wallarmノードはこの変数からオリジナルのクライアントIPアドレスを読み取ります。
5. NGINXを再起動してください：

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
6. [設定のテスト](#testing-the-configuration)を実施してください。

ログにオリジナルのクライアントIPアドレスを含めるためには、NGINX設定で`proxy_set_header`ディレクティブを追加し、`log_format`ディレクティブ内の変数リストを編集する必要があります。詳細は[NGINXログ記録手順](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#logging-the-original-ip-address)をご参照ください。

ヘッダー`PROXY`に基づいてオリジナルのクライアントIPアドレスを特定する詳細は、[NGINXドキュメント](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#changing-the-load-balancers-ip-address-to-the-client-ip-address)をご参照ください。

### 設定のテスト

1. 保護対象のアプリケーションアドレスにテスト攻撃を送信してください：

    === "Using cURL"
        ```bash
        curl http://localhost/etc/passwd
        ```
    === "Using printf and Netcat (for the header `PROXY`)"
        ```bash
        printf "PROXY TCP4 <IP_ADDRESS_OF_YOUR_PROXY> <REAL_CLIENT_IP> 0 80\r\nGET /etc/passwd\r\n\r\n" | nc localhost 80
        ```
2. Wallarm Consoleを開き、攻撃詳細にオリジナルのクライアントIPアドレスが表示されていることを確認してください：

    ![IP address originated the request](../images/request-ip-address.png)

    もしNGINXがヘッダー`X-Forwarded-For`（または`X-Real-IP`、またはそれに類似したヘッダー）からオリジナルのIPアドレスを読み取った場合、そのヘッダー値も生の攻撃データに表示されます。

    ![Header X-Forwarded-For](../images/x-forwarded-for-header.png)

## 設定例

以下に、人気のあるロードバランサーを介してサーバーに接続するクライアントのオリジナルのIPアドレスを特定するために必要なNGINX設定の例を示します。

### Cloudflare CDN

Cloudflare CDNを使用する場合は、オリジナルのクライアントIPアドレスを特定するために[NGINXモジュール **ngx_http_realip_module** の設定](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar)を行ってください。

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

* 設定を保存する前に、上記の設定で指定されているCloudflareのIPアドレスが[Cloudflareドキュメント](https://www.cloudflare.com/ips/)の内容と一致していることをご確認ください。
* `real_ip_header`ディレクティブの値として、`CF-Connecting-IP`または`X-Forwarded-For`のいずれかを指定できます。Cloudflare CDNは両方のヘッダーを追加するため、NGINXでどちらかを読むように設定できます。[Cloudflare CDNの詳細](https://support.cloudflare.com/hc/en-us/articles/200170786-Restoring-original-visitor-IPs)をご参照ください。

### Fastly CDN

Fastly CDNを使用する場合は、オリジナルのクライアントIPアドレスを特定するために[NGINXモジュール **ngx_http_realip_module** の設定](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar)を行ってください。

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

設定を保存する前に、上記のFastlyのIPアドレスが[Fastlyドキュメント](https://api.fastly.com/public-ip-list)の内容と一致していることをご確認ください。

### HAProxy

HAProxyを使用する場合、オリジナルのクライアントIPアドレスを特定するために、HAProxy側とWallarmノード側の双方で適切な設定を行う必要があります。

* `/etc/haproxy/haproxy.cfg`設定ファイル内で、Wallarmノードへの接続を担当する`backend`ディレクティブブロック内に`option forwardfor header X-Client-IP`行を挿入してください。

	`option forwardfor`ディレクティブは、クライアントのIPアドレスを含むヘッダーをリクエストに追加するようHAProxyに指示します。[HAProxyドキュメント](https://cbonte.github.io/haproxy-dconv/1.9/configuration.html#option%20forwardfor)の詳細をご参照ください。

	設定例：

    ```
    ...
    # Public IP address for receiving requests
    frontend my_frontend
        bind <HAPROXY_IP>
        mode http
        default_backend my_backend

    # Backend with the Wallarm node
    backend my_backend
        mode http
    option forwardfor header X-Client-IP
    server wallarm-node <WALLARM_NODE_IP>
    ...
    ```

    *   `<HAPROXY_IP>`はクライアントリクエストを受け取るHAProxyサーバーのIPアドレスです。
    *   `<WALLARM_NODE_IP>`はHAProxyサーバーからリクエストを受け取るWallarmノードのIPアドレスです。

* WallarmノードにインストールされたNGINXの設定ファイルで、[NGINXモジュール **ngx_http_realip_module** の設定](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar)を以下のように行ってください：
    
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

    *   `<APPLICATION_IP>`は、Wallarmノードからのリクエストを保護対象アプリケーションへ転送する際のアプリケーションのIPアドレスです。
    *   `<HAPROXY_IP1>`および`<HAPROXY_IP2>`は、Wallarmノードへリクエストを転送するHAProxyロードバランサーのIPアドレスです。