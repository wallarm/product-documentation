# HTTPプロキシまたはロードバランサ（NGINX）を使用している場合の元のクライアントIPアドレスの特定方法

これらの指示は、HTTPプロキシまたはロードバランサを経由してサーバに接続するクライアントのIPアドレスを特定するために必要なNGINXの設定方法を説明しています。

* WallarmノードがDEB / RPMパッケージからインストールされた場合、AWS / GCPイメージ、またはNGINXベースのDockerイメージから、**現行の指示**を使用してください。
* WallarmノードがK8s Ingressコントローラとしてデプロイされた場合、 [指示](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md) をご覧ください。

## WallarmノードがリクエストのIPアドレスを特定する方法

Wallarmノードは、NGINX変数`$remote_addr`からリクエストソースのIPアドレスを読み取ります。リクエストがプロキシサーバやロードバランサを経由してノードに送信された場合、変数`$remote_addr`はプロキシサーバやロードバランサのIPアドレスを保持します。

![バランサの使用](../images/admin-guides/using-proxy-or-balancer/using-balancer-en.png)

Wallarmノードによって特定されたリクエストソースのIPアドレスは、Wallarmコンソールの[攻撃の詳細](../user-guides/events/check-attack.md#attacks)に表示されます。

## プロキシサーバまたはロードバランサのIPアドレスをリクエストソースアドレスとして使用する際の可能な問題点

WallarmノードがプロキシサーバまたはロードバランサのIPアドレスをリクエストソースのIPアドレスと見なす場合、以下のWallarmの機能が正しく動作しない場合があります：

* [IPアドレスによるアプリケーションへのアクセス制御](../user-guides/ip-lists/overview.md)    

  もしもオリジナルのクライアントIPアドレスがブラックリストに登録されていたとしても、WallarmノードはロードバランサのIPアドレスをリクエストソースのIPアドレスとみなすため、それらからのリクエストをブロックすることはありません。
* [ブルートフォース攻撃対策](configuration-guides/protecting-against-bruteforce.md) 

  例えば、ロードバランサ経由で送信されたリクエストにブルートフォース攻撃の兆候がある場合、WallarmはこのロードバランサのIPアドレスをブラックリストに登録することで、このロードバランサを通じて送信されるすべての後続のリクエストをブロックします。
* [アクティブな脅威検証](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) モジュールと[脆弱性スキャナ](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) 

  例えば、WallarmはロードバランサのIPアドレスを、アクティブな脅威検証モジュールと脆弱性スキャナによって生成される攻撃テストの[起源となるIPアドレス](scanner-addresses.md)とみなします。結果として、テスト攻撃はWallarmコンソール上でロードバランサのIPアドレスから発生した攻撃として表示され、Wallarmによってさらなるチェックが行われることでアプリケーションへの負荷が増加します。

Wallarmノードが[IPCソケット](https://en.wikipedia.org/wiki/Unix_domain_socket)経由で接続されている場合、`0.0.0.0`がリクエストのソースと見なされます。

## オリジナルのクライアントIPアドレス特定の設定方法

オリジナルのクライアントIPアドレスの特定の設定を行うために、[NGINXモジュール **ngx_http_realip_module**](https://nginx.org/en/docs/http/ngx_http_realip_module.html) を使用することができます。このモジュールを使用すると、WallarmノードがクライアントのIPアドレスを取得するために使用する`$remote_addr` [の値を再定義する](#how-wallarm-node-identifies-an-ip-address-of-a-request)ことが可能です。

以下のいずれかの方法でNGINXモジュール **ngx_http_realip_module** を使用することができます：

* プロキシサーバまたはロードバランサから加えられた特定のヘッダからオリジナルのクライアントIPアドレスを読み取る（通常は[`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)）。
* プロキシサーバまたはロードバランサが [PROXYプロトコル](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) をサポートする場合、ヘッダ`PROXY`からオリジナルのクライアントIPアドレスを読み取る。

### ヘッダ`X-Forwarded-For`（`X-Real-IP`または同様のもの）を読み取るためのNGINXの設定

ロードバランサまたはプロキシサーバがオリジナルのクライアントIPアドレスを含むヘッダ`X-Forwarded-For`（`X-Real-IP`または同様のもの）を付与する場合、次のようにNGINXモジュール **ngx_http_realip_module** を設定してこのヘッダを読み取るようにしてください:

1. Wallarmノードと共にインストールされたNGINXの以下の設定ファイルを開きます：

    * DEB / RPMパッケージからWallarmノードがインストールされた場合：`/etc/nginx/conf.d/default.conf`
    * AWS / GCPイメージからWallarmノードがデプロイされた場合：`/etc/nginx/nginx.conf`
    * NGINXベースのDockerイメージからWallarmノードがデプロイされた場合：ローカルでNGINXの設定ファイルを作成・編集し、Dockerコンテナのパス`/etc/nginx/sites-enabled/default`にそれをマウントします。初期設定ファイルのコピーと、ファイルをコンテナにマウントする方法については、[WallarmのNGINXベースのDockerの手順](installation-docker-en.md#run-the-container-mounting-the-configuration-file)をご覧ください。
2. NGINXの`location`コンテキストまたはそれ以上のレベルで、ディレクティブ`set_real_ip_from`にプロキシサーバまたはロードバランサのIPアドレスを指定します。もしこれらのサーバが複数のIPアドレスを持っている場合は、それぞれのIPアドレスについて別々のディレクティブを追加します。例：

    ```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
    }
    ...
    ```
3. 使用しているロードバランサのドキュメントで、このロードバランサがオリジナルのクライアントIPアドレスを伝達するために添付するヘッダ名を探します。最も一般的には`X-Forwarded-For`と呼ばれています。
4. NGINXの`location`コンテキストまたはそれ以上のレベルで、先述の手順で見つけたヘッダ名を持つ`real_ip_header`ディレクティブを追加します。例：

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

    --8<-- "../include-ja/waf/restart-nginx-3.6.md"

    NGINXは`real_ip_header`ディレクティブで指定されたヘッダの値を変数`$remote_addr`に割り当て、その結果、Wallarmノードがこの変数からオリジナルのクライアントIPアドレスを読み取ることが可能になります。
6. [設定をテスト](#設定のテスト)します。

### ヘッダ`PROXY`を読み取るためのNGINXの設定

ロードバランサまたはプロキシサーバが[PROXYプロトコル](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)をサポートしている場合は、次のようにNGINXモジュール **ngx_http_realip_module** をヘッダ `PROXY` を読み取るように設定することができます：

1. Wallarmノードと共にインストールされたNGINXの以下の設定ファイルを開きます：

    * DEB / RPMパッケージからWallarmノードがインストールされた場合：`/etc/nginx/conf.d/default.conf`
    * AWS / GCPイメージからWallarmノードがデプロイされた場合：`/etc/nginx/nginx.conf`
    * NGINXベースのDockerイメージからWallarmノードがデプロイされた場合：ローカルでNGINXの設定ファイルを作成・編集し、Dockerコンテナのパス`/etc/nginx/sites-enabled/default`にそれをマウントします。初期設定ファイルのコピーと、ファイルをコンテナにマウントする方法については、[WallarmのNGINXベースのDockerの手順](installation-docker-en.md#run-the-container-mounting-the-configuration-file)をご覧ください。
2. NGINXの`server`コンテキストで、`listen`ディレクティブにパラメータ `proxy_protocol`を追加します。
3. NGINXの`location`コンテキストまたはそれ以上のレベルで、ディレクティブ `set_real_ip_from` にプロキシサーバまたはロードバランサのIPアドレスを指定します。もしこれらのサーバが複数のIPアドレスを持っている場合は、それぞれのIPアドレスについて別々のディレクティブを追加します。例：
4. NGINXの`location`コンテキストまたはそれ以上のレベルで、`real_ip_header`ディレクティブに `proxy_protocol` の値を追加します。

    上記の指示に基づいたNGINX設定ファイルの例を下記に示します：

    ```bash
    server {
        listen 80 proxy_protocol;
        server_name localhost;

        set_real_ip_from <IP_ADDRESS_OF_YOUR_PROXY>;
        real_ip_header proxy_protocol;

        ...
    }
    ```

    * NGINXはポート80で着信接続をリスニングします。
    * ヘッダ`PROXY`が着信リクエストに含まれていない場合、NGINXはこのリクエストを受け入れません（有効とみなされません）。
    * アドレス`<IP_ADDRESS_OF_YOUR_PROXY>`から発生するリクエストについては、NGINXはヘッダ`PROXY`に含まれるソースアドレスを変数`$remote_addr`に割り当てるため、Wallarmノードはこの変数からオリジナルのクライアントIPアドレスを読み取ります。
5. NGINXを再起動します：

    --8<-- "../include-ja/waf/restart-nginx-3.6.md"
6. [設定をテスト](#設定のテスト)します。

オリジナルのクライアントIPアドレスをログに含めるためには、`proxy_set_header`ディレクティブを追加し、`log_format`ディレクティブの変数リストをNGINXの設定で編集する必要があります。詳細については、[NGINXのログ指示](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#logging-the-original-ip-address)をご覧ください。

`PROXY`ヘッダに基づいてオリジナルのクライアントIPアドレスを特定する詳細については、[NGINXのドキュメンテーション](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#changing-the-load-balancers-ip-address-to-the-client-ip-address)をご覧ください。

### 設定のテスト

1. 保護すべきアプリケーションのアドレスに対してテスト攻撃を送信します：

    === "cURLを使用"
        ```bash
        curl http://localhost/etc/passwd
        ```
    === "printfとNetcatを使用（ヘッダ `PROXY` ）"
        ```bash
        printf "PROXY TCP4 <IP_ADDRESS_OF_YOUR_PROXY> <REAL_CLIENT_IP> 0 80\r\nGET /etc/passwd\r\n\r\n" | nc localhost 80
        ```
2. Wallarmコンソールを開き、攻撃の詳細にオリジナルのクライアントIPアドレスが表示されていることを確認します：

    ![リクエストの発信者のIPアドレス](../images/request-ip-address.png)

    もしNGINXが元のアドレスをヘッダ`X-Forwarded-For`（`X-Real-IP`または同様のもの）から読み取った場合、このヘッダの値もraw攻撃で表示されます。

    ![ヘッダ X-Forwarded-For](../images/x-forwarded-for-header.png)

## 設定の例

以下に、人気のあるロードバランサを通じてサーバに接続するクライアントのIPアドレスを特定するために必要なNGINXの設定の例を示します。

### Cloudflare CDN

Cloudflare CDNを使用している場合、オリジナルのクライアントIPアドレスを特定するために[NGINXモジュール **ngx_http_realip_module** の設定](#設定のテスト)が可能です。

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

* 設定を保存する前に、上記の設定に記載されたCloudflare IPアドレスが[Cloudflareドキュメンテーション](https://www.cloudflare.com/ips/)のものと一致していることを確認してください。 
* `real_ip_header`ディレクティブの値としては、`CF-Connecting-IP`または`X-Forwarded-For`のいずれかを指定することができます。Cloudflare CDNはどちらもヘッダを追加し、ユーザーはNGINXがどちらを読み取るように設定できます。[Cloudflare CDNの詳細](https://support.cloudflare.com/hc/en-us/articles/200170786-Restoring-original-visitor-IPs)をご覧ください。

### Fastly CDN

Fastly CDNを使用している場合、オリジナルのクライアントIPアドレスを特定するために[NGINXモジュール **ngx_http_realip_module** の設定](#設定のテスト)が可能です。

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

設定を保存する前に、上記の設定に記載されたFastly IPアドレスが[Fastlyドキュメンテーション](https://api.fastly.com/public-ip-list)のものと一致していることを確認してください。 

### HAProxy

HAProxyを使用している場合、HAProxyとWallarmノード双方の設定を正しく行うことで、オリジナルのクライアントIPアドレスを特定することができます：

* `/etc/haproxy/haproxy.cfg`設定ファイルにおいて、`backend`ディレクティブブロックに`option forwardfor header X-Client-IP`の行を挿入します。このブロックはHAProxyをWallarmノードに接続するために使用されます。

    `option forwardfor`ディレクティブはリクエストにクライアントのIPアドレスを持つヘッダを加えるようにHAProxyバランサに指示します。[HAProxyのドキュメンテーションで詳細をご覧いただけます](https://cbonte.github.io/haproxy-dconv/1.9/configuration.html#option%20forwardfor)

    設定の例：

    ```
    ...
    # 公開IPアドレスでリクエストを受信
    frontend my_frontend
        bind <HAPROXY_IP>
        mode http
        default_backend my_backend

    # Wallarmノードとのバックエンド
    backend my_backend
        mode http
    option forwardfor header X-Client-IP
    server wallarm-node <WALLARM_NODE_IP>
    ...
    ```

*   `<HAPROXY_IP>` はクライアントリクエストを受け取るためのHAProxyサーバのIPアドレスです。
*   `<WALLARM_NODE_IP>` はHAProxyサーバからのリクエストを受け取るためのWallarmノードのIPアドレスです。

* WallarmノードにインストールされたNGINXの設定ファイルにおいて、ヘッダ`X-Forwarded-For`（`X-Real-IP`または同様のもの）を読み取るようにNGINXモジュール **ngx_http_realip_module** を設定すると[#設定のテスト]のようになります：
    
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

    *   `<APPLICATION_IP>` はWallarmノードからのリクエストが送信される保護対象のアプリケーションのIPアドレスです。
    *   `<HAPROXY_IP1>`と`<HAPROXY_IP2>`は、Wallarmノードにリクエストを送信するHAProxyバランサのIPアドレスです。