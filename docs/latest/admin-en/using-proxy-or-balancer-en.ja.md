# HTTPプロキシまたはロードバランサ（NGINX）を使用した場合のオリジナルクライアントIPアドレスの識別

これらの手順では、HTTPプロキシまたはロードバランサを介してサーバーに接続するクライアントの発信元IPアドレスを識別するために必要なNGINX設定について説明します。

* WallarmノードがDEB / RPMパッケージ、AWS / GCPイメージ、またはNGINXベースのDockerイメージからインストールされている場合は、**現在の手順**を使用してください。
* WallarmノードがK8s Ingressコントローラーとしてデプロイされている場合は、[これらの指示](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.ja.md)を使用してください。

## WallarmノードがリクエストのIPアドレスを識別する方法

Wallarmノードは、NGINX変数`$remote_addr`からリクエスト元のIPアドレスを読み取ります。リクエストがプロキシサーバーまたはロードバランサを経由してノードに送信される場合、変数`$remote_addr`にはプロキシサーバーまたはロードバランサのIPアドレスが保持されます。

![!バランサーを使う](../images/admin-guides/using-proxy-or-balancer/using-balancer-en.png)

Wallarmノードによって識別されたリクエスト元のIPアドレスは、Wallarmコンソールの[攻撃の詳細](../user-guides/events/check-attack.ja.md#attacks)に表示されます。

## プロキシサーバーまたはロードバランサのIPアドレスをリクエスト元のアドレスとして使用する際の問題点

WallarmノードがプロキシサーバーまたはロードバランサのIPアドレスをリクエスト元のIPアドレスとみなす場合、Wallarmの以下の機能が正しく動作しない場合があります。

* [IPアドレスによるアプリケーションへのアクセス制御](../user-guides/ip-lists/overview.ja.md)。例：

	元のクライアントIPアドレスがdenylistに登録されていても、WallarmノードはロードバランサのIPアドレスをリクエスト元のIPアドレスとみなすため、それらからのリクエストはブロックされません。
* [ブルートフォース攻撃対策](configuration-guides/protecting-against-bruteforce.ja.md)。例：

	ロードバランサを経由したリクエストにブルートフォース攻撃の兆候がある場合、WallarmはこのロードバランサのIPアドレスをdenylistに登録し、このロードバランサを経由したすべてのリクエストをブロックします。
* [アクティブ脅威検証](../about-wallarm/detecting-vulnerabilities.ja.md#active-threat-verification)モジュールおよび[脆弱性スキャナー](../about-wallarm/detecting-vulnerabilities.ja.md#vulnerability-scanner)。例：

	Wallarmは、アクティブ脅威検証モジュールおよび脆弱性スキャナーによって生成された[テスト攻撃の発信元IPアドレス](scanner-address-eu-cloud.ja.md)としてロードバランサのIPアドレスを考慮します。したがって、テスト攻撃は、WallarmコンソールでロードバランサのIPアドレスから発信された攻撃として表示され、Wallarmによって追加でチェックされ、アプリケーションに負荷がかかります。

Wallarmノードが[IPCソケット](https://en.wikipedia.org/wiki/Unix_domain_socket)を介して接続されている場合、`0.0.0.0`がリクエスト元として考慮されます。

## オリジナルクライアントIPアドレス識別の設定

オリジナルクライアントIPアドレス識別を設定するには、[NGINXモジュール **ngx_http_realip_module**](https://nginx.org/en/docs/http/ngx_http_realip_module.html)を使用できます。このモジュールを使用すると、WallarmノードがクライアントIPアドレスを取得するために[使用](#how-wallarm-node-identifies-an-ip-address-of-a-request)する`$remote_addr`の値を再定義できます。

NGINXモジュール**ngx_http_realip_module**は、次のいずれかの方法で使用できます。

* ロードバランサまたはプロキシサーバによってリクエストに追加された特定のヘッダー（通常は、[`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)）からオリジナルクライアントIPアドレスを読み取る。
* ロードバランサまたはプロキシサーバが[PROXYプロトコル](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)をサポートしている場合は、ヘッダー`PROXY`からオリジナルクライアントIPアドレスを読み取る。

### ヘッダー`X-Forwarded-For`（`X-Real-IP`またはそれに類する）を読むようにNGINXを設定する

ロードバランサまたはプロキシサーバがオリジナルクライアントIPアドレスを含むヘッダ`X-Forwarded-For`（`X-Real-IP`またはそれに類する）を追加する場合、NGINXモジュール**ngx_http_realip_module**を次のように設定して、このヘッダを読み取るようにしてください。

1. WallarmノードをインストールしたNGINXの以下の設定ファイルを開きます。

   * WallarmノードがDEB / RPMパッケージからインストールされている場合は、`/etc/nginx/conf.d/default.conf`。
   * WallarmノードがAWS / GCPイメージからデプロイされている場合は、`/etc/nginx/nginx.conf`。
   * WallarmノードがNGINXベースのDockerイメージからデプロイされている場合、ローカルでNGINX設定ファイルを作成および編集し、Dockerコンテナに`/etc/nginx/sites-enabled/default`のパスでマウントする必要があります。初期NGINX設定ファイルのコピーとコンテナへのファイルマウントの手順は、[Wallarm NGINXベースのDocker指示](installation-docker-en.ja.md#run-the-container-mounting-the-configuration-file)で入手できます。
2. NGINXのコンテキスト`location`またはそれ以上に、プロキシサーバまたはロードバランサのIPアドレスを持つディレクティブ`set_real_ip_from`を追加します。プロキシサーバまたはロードバランサに複数のIPアドレスがある場合は、適切な数の個別のディレクティブを追加してください。例：

   ```bash
   ...
   location / {
       wallarm_mode block;

       set_real_ip_from 1.2.3.4;
       set_real_ip_from 192.0.2.0/24;
   }
   ...
   ```
3. 使用しているロードバランサのドキュメントで、このロードバランサによってオリジナルクライアントIPアドレスを渡すために追加されるヘッダーの名前を探します。最も一般的なヘッダーは`X-Forwarded-For`と呼ばれます。
4. NGINXのコンテキスト`location`またはそれ以上に、前のステップで見つけたヘッダー名を持つディレクティブ`real_ip_header`を追加します。例：

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
5. NGINXを再起動します：

    --8<-- "../include/waf/restart-nginx-3.6.ja.md"

    NGINXは、`real_ip_header`ディレクティブで指定されたヘッダーの値を`$remote_addr`変数に割り当てるため、Wallarmノードはこの変数からオリジナルクライアントIPアドレスを読み取ります。
6. [設定をテストします](#testing-the-configuration)。### ヘッダー `PROXY` を読み取るように NGINX を設定する

ロードバランサーまたはプロキシサーバーが [PROXY プロトコル](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) をサポートしている場合、NGINX モジュール **ngx_http_realip_module** を次のように設定して、ヘッダー `PROXY` を読み取ることができます。

1. Wallarm ノードとともにインストールされた NGINX の次の設定ファイルを開きます。

    * Wallarm ノードが DEB / RPM パッケージからインストールされている場合は、`/etc/nginx/conf.d/default.conf` 。
    * Wallarm ノードが AWS / GCP イメージからデプロイされている場合は、`/etc/nginx/nginx.conf` 。
    * Wallarm ノードが NGINX ベースの Docker イメージからデプロイされている場合は、ローカルで NGINX 設定ファイルを作成して編集し、Docker コンテナに `/etc/nginx/sites-enabled/default` のパスでマウントする必要があります。初期の NGINX 設定ファイルのコピーと、コンテナへのファイルのマウント方法に関する説明は、[Wallarm の NGINX ベースの Docker の説明書](installation-docker-en.ja.md#run-the-container-mounting-the-configuration-file)から取得できます。
2. NGINX コンテキスト `server` に、ディレクティブ `listen` にパラメーター `proxy_protocol` を追加します。
3. NGINX コンテキスト `location` またはいずれかの上位に、プロキシサーバーまたはロードバランサーの IP アドレスを指定したディレクティブ `set_real_ip_from` を追加します。プロキシサーバーまたはロードバランサーに複数の IP アドレスがある場合は、適切な数の別々のディレクティブを追加してください。例：
4. NGINX コンテキスト `location` またはいずれかの上位に、値 `proxy_protocol` を持つディレクティブ `real_ip_header` を追加します。

    すべてのディレクティブが追加された NGINX 設定ファイルの例：

    ```bash
    server {
        listen 80 proxy_protocol;
        server_name localhost;

        set_real_ip_from <IP_ADDRESS_OF_YOUR_PROXY>;
        real_ip_header proxy_protocol;

        ...
    }
    ```

    * NGINX は、ポート 80 での受信接続をリッスンします。
    * 受信リクエストでヘッダー `PROXY` が渡されない場合、NGINX はこのリクエストを無効とみなし、受け入れません。
    * アドレス `<IP_ADDRESS_OF_YOUR_PROXY>` からのリクエストについて、NGINX はヘッダー `PROXY` で渡されたソースアドレスを変数 `$remote_addr` に割り当てるため、Wallarm ノードはこの変数から元のクライアント IP アドレスを読み取ります。
5. NGINX を再起動します：

    --8<-- "../include/waf/restart-nginx-3.6.ja.md"
6. [設定をテストする](#testing-the-configuration)。

オリジナルのクライアント IP アドレスをログに含めるには、ディレクティブ `proxy_set_header` を追加し、NGINX の設定に記載されている [NGINX ロギングの手順](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#logging-the-original-ip-address) に従って、`log_format` ディレクティブ内の変数リストを編集する必要があります。

ヘッダー `PROXY` に基づいてオリジナルのクライアント IP アドレスを識別する詳細は、[NGINX のドキュメント](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#changing-the-load-balancers-ip-address-to-the-client-ip-address)で入手できます。

### 設定をテストする

1. 保護されたアプリケーションアドレスにテストアタックを送信します。

    === "cURL を使用"
        ```bash
        curl http://localhost/etc/passwd
        ```
    === "printf と Netcat を使用 (ヘッダー `PROXY` の場合)"
        ```bash
        printf "PROXY TCP4 <IP_ADDRESS_OF_YOUR_PROXY> <REAL_CLIENT_IP> 0 80\r\nGET /etc/passwd\r\n\r\n" | nc localhost 80
        ```
2. Wallarm コンソールを開いて、オリジナルのクライアント IP アドレスがアタックの詳細に表示されていることを確認します。

    ![!リクエストを開始した IP アドレス](../images/request-ip-address.png)

    NGINX がヘッダー `X-Forwarded-For`（`X-Real-IP` または同様のもの）からオリジナルのアドレスを読み取った場合、ヘッダーの値も生のアタックに表示されます。

    ![!ヘッダー X-Forwarded-For](../images/x-forwarded-for-header.png)

## 設定例

以下に、人気のあるロードバランサーを介してサーバーに接続するクライアントの発信元 IP アドレスを識別するために必要な NGINX 設定の例が示されています。

### Cloudflare CDN

Cloudflare CDN を使用している場合は、[NGINX モジュール **ngx_http_realip_module** を設定](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar)して、オリジナルのクライアント IP アドレスを識別できます。

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

* 設定を保存する前に、上記の設定で指定された Cloudflare IP アドレスが [Cloudflare のドキュメント](https://www.cloudflare.com/ips/) に記載されているものと一致していることを確認してください。
* `real_ip_header` ディレクティブの値には、`CF-Connecting-IP` または `X-Forwarded-For` のいずれかを指定できます。Cloudflare CDN は両方のヘッダーを追加するため、どちらのヘッダーを読み取るように NGINX を設定できます。詳細は [Cloudflare CDN での](https://support.cloudflare.com/hc/en-us/articles/200170786-Restoring-original-visitor-IPs) 。

### Fastly CDN

Fastly CDN を使用している場合は、[NGINX モジュール **ngx_http_realip_module** を設定](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar)して、オリジナルのクライアント IP アドレスを識別できます。

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

設定を保存する前に、Fastly IP アドレスが上記設定で指定されているものと、[Fastly のドキュメント](https://api.fastly.com/public-ip-list)に記載されているものが一致していることを確認してください。### HAProxy

HAProxyを使用する場合、HAProxyとWallarmノードの両方がオリジナルのクライアントIPアドレスを正しく識別できるように設定する必要があります：

* `/etc/haproxy/haproxy.cfg`設定ファイルで、`option forwardfor header X-Client-IP`行を、HAProxyをWallarmノードに接続するための`backend`ディレクティブブロックに挿入します。

	`option forwardfor`ディレクティブは、HAProxyバランサーに、クライアントのIPアドレスが記載されたヘッダーがリクエストに追加されるべきであることを指示します。[HAProxyドキュメントでの詳細](https://cbonte.github.io/haproxy-dconv/1.9/configuration.html#option%20forwardfor)

	設定例：

    ```
    ...
    # リクエストを受け取るためのパブリックIPアドレス
    frontend my_frontend
        bind <HAPROXY_IP>
        mode http
        default_backend my_backend

    # Wallarm node を含むバックエンド
    backend my_backend
        mode http
    option forwardfor header X-Client-IP
    server wallarm-node <WALLARM_NODE_IP>
    ...
    ```

    *   `<HAPROXY_IP>`は、クライアントのリクエストを受け取るHAProxyサーバーのIPアドレスです。
    *   `<WALLARM_NODE_IP>`は、HAProxyサーバーからのリクエストを受け取るWallarmノードのIPアドレスです。

* WallarmノードでインストールされたNGINXの設定ファイルで、[**ngx_http_realip_module** モジュール](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar) を以下のように設定します：

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

    *   `<APPLICATION_IP>`は、Wallarmノードからのリクエストに対する保護されたアプリケーションのIPアドレスです。
    *   `<HAPROXY_IP1>`および`<HAPROXY_IP2>`は、リクエストをWallarmノードに渡すHAProxyバランサーのIPアドレスです。