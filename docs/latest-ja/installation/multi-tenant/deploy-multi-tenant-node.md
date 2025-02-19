# マルチテナントノードのデプロイおよび設定

[multi-tenant](overview.md)ノードは、複数の独立した企業インフラまたは分離された環境を同時に保護します。

## マルチテナントノードのデプロイオプション

インフラおよび解決する問題に基づき、マルチテナントノードのデプロイオプションを選択してください。

* 以下のように、全クライアントまたは隔離環境のトラフィックをフィルタリングするために１つのWallarmノードをデプロイします:

    ![Partner node scheme](../../images/partner-waf-node/partner-traffic-processing-4.0.png)

    * １つのWallarmノードが複数のテナント（Tenant 1、Tenant 2）のトラフィックを処理します。

        --8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"
        
    * Wallarmノードは、Envoyインストールの場合、テナントの一意の識別子（[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)または[`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md)）を用いて、トラフィックを受信するテナントを識別します。
    * ドメイン`https://tenant1.com`および`https://tenant2.com`に対して、パートナーまたはクライアントのIPアドレス`225.130.128.241`を含むDNS Aレコードが設定されます。これは一例として示しており、パートナー側とテナント側で異なる設定を使用することができます。
    * パートナー側では、正当なリクエストをテナントTenant 1（`http://upstream1:8080`）およびTenant 2（`http://upstream2:8080`）のアドレスにプロキシする設定が行われます。これは一例として示しており、パートナー側とテナント側で異なる設定を使用することができます。

* 以下のように、各テナントのトラフィックをそれぞれフィルタリングする複数のWallarmノードをデプロイします:

    ![Client several nodes scheme](../../images/partner-waf-node/client-several-nodes.png)

    * 各テナント（Tenant 1、Tenant 2）のトラフィックをフィルタリングする複数のWallarmノード。
    * ドメインhttps://tenant1.comに対して、クライアントIPアドレス225.130.128.241を含むDNSレコードが設定されます。
    * ドメインhttps://tenant2.comに対して、クライアントIPアドレス225.130.128.242を含むDNSレコードが設定されます。
    * 各ノードが、そのテナントのアドレスに正当なリクエストをプロキシします:
        * ノード1はTenant 1へ（http://upstream1:8080）。
        * ノード2はTenant 2へ（http://upstream2:8080）。

## マルチテナントノードの特徴

マルチテナントノードは:

* 通常のフィルタリングノードと同じ[プラットフォーム](../../installation/supported-deployment-options.md)および同じ手順でインストールが可能ですが、**以下の場合を除きます**:
    * MuleSoftコネクタ
    * Amazon CloudFrontコネクタ
    * Cloudflareコネクタ
    * Broadcom Layer7 API Gatewayコネクタ
    * Fastlyコネクタ
    * Kong API Gatewayコネクタ
    * Istioコネクタ
* **technical tenant**または**tenant**レベルにインストールできます。テナントにWallarm Consoleへのアクセスを提供する場合、そのフィルタリングノードは該当するテナントレベルにインストールする必要があります。
* 通常のフィルタリングノードと同じ手順で設定が可能です。
* ディレクティブ[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)は、テナント毎にトラフィックを分割するために使用されます。
* ディレクティブ[`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)は、アプリケーション毎に設定を分割するために使用されます。

## デプロイ要件

* [設定済みテナントアカウント](configure-accounts.md)
* ユーザーが[technical tenant account](overview.md#tenant-accounts)に追加された**Global administrator**ロールで追加のコマンドを実行できることが必要です。
* [フィルタリングノードのインストールに対応したプラットフォーム](../../installation/supported-deployment-options.md)

## マルチテナントノードデプロイの推奨事項

* テナントがWallarm Consoleにアクセスする必要がある場合、適切なテナントアカウント内でフィルタリングノードを作成してください。
* テナントのNGINX設定ファイルを使用してフィルタリングノードを設定してください。

## マルチテナントノードデプロイの手順

1. Wallarm Console → **Nodes**で**Create node**をクリックし、**Wallarm node**を選択します。

    !!! info "既存のWallarmノードをマルチテナントモードに切り替える"
        既存のWallarmノードをマルチテナントモードに切り替えたい場合は、**Nodes**セクションの対象ノードメニューから**Make it multi-tenant**オプションを使用してください。

        切り替えと確認が済んだら、4番目のステップに進んでください。
1. **Multi-tenant node**オプションを選択します。

    ![Multi-tenant node creation](../../images/user-guides/nodes/create-multi-tenant-node.png)
1. ノード名を設定し、**Create**をクリックします。
1. フィルタリングノードトークンをコピーします。
1. フィルタリングノードのデプロイ形態に応じて、[該当する手順](../../installation/supported-deployment-options.md)に従ってください。
1. 各テナントの一意の識別子を使用してトラフィックを分割します.

    === "NGINXおよびNGINX Plus"
        テナントのNGINX設定ファイルを開き、[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)ディレクティブを使用して各テナント間のトラフィックを分割します。以下の例をご確認ください。
    === "NGINX Ingressコントローラー"
        各IngressリソースにテナントUUIDを設定するために、Ingressの[annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations)で`nginx.ingress.kubernetes.io/wallarm-partner-client-uuid`を使用します。1つのリソースは1つのテナントに関連しています:

        ```
        kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-partner-client-uuid=VALUE
        ```
    === "Docker NGINXベースのイメージ"
        1. NGINX設定ファイルを開き、[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)ディレクティブを使用して各テナント間のトラフィックを分割します。以下の例をご確認ください。
        2. Dockerコンテナを実行します[設定ファイルのマウント](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file).
    === "Docker Envoyベースのイメージ"
        1. `envoy.yaml`設定ファイルを開き、[`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param)パラメーターを使用して各テナント間のトラフィックを分割します。
        2. Dockerコンテナを実行します[準備済み`envoy.yaml`のマウント](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml).
    === "Kubernetesサイドカー"
        1. NGINX設定ファイルを開き、[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)ディレクティブを使用して各テナント間のトラフィックを分割します。
        2. NGINX設定ファイルを[Wallarmサイドカーコンテナ](../../installation/kubernetes/sidecar-proxy/customization.md#using-custom-nginx-configuration)にマウントします。

    以下は、2つのクライアントのトラフィックを処理するフィルタリングノード向けのNGINX設定ファイルの例です:

    ```
    server {
        listen       80;
        server_name  tenant1.com;
        wallarm_mode block;
        wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
        
        location / {
            proxy_pass      http://upstream1:8080;
        }
    }
    
    server {
        listen       80;
        server_name  tenant2.com;
        wallarm_mode monitoring;
        wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
        
        location / {
            proxy_pass      http://upstream2:8080;
        }
    }
    ```

    * テナント側では、パートナーIPアドレスを含むDNS Aレコードが設定されます。
    * パートナー側では、テナント（`wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111`のテナントの場合は`http://upstream1:8080`、`wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`のテナントの場合は`http://upstream2:8080`）のアドレスにリクエストをプロキシする設定が行われます。
    * すべての着信リクエストはパートナーのアドレスで処理され、正当なリクエストは`wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111`のテナントの場合は`http://upstream1:8080`へ、`wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`のテナントの場合は`http://upstream2:8080`へプロキシされます。

1. 必要に応じて、[`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)ディレクティブを使用してテナントのアプリケーションのIDを指定します。

    例:

    ```
    server {
        listen       80;
        server_name  tenant1.com;
        wallarm_mode block;
        wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
        
        location / {
            proxy_pass      http://upstream1:8080;
        }

        location /login {
            wallarm_application 21;
            ...
        }
        location /users {
            wallarm_application 22;
            ...
        }
    }
    ```

    テナント`11111111-1111-1111-1111-111111111111`に属する2つのアプリケーション:
    
    * `tenant1.com/login`はアプリケーション`21`です。
    * `tenant1.com/users`はアプリケーション`22`です。

## マルチテナントノードの設定

フィルタリングノードの設定をカスタマイズするには、[利用可能なディレクティブ](../../admin-en/configure-parameters-en.md)を使用してください。

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"