[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md

# マルチテナントノードのデプロイと設定

[マルチテナント](overview.md)ノードは、複数の独立した企業のインフラまたは分離された環境を同時に保護します。

## マルチテナントノードのデプロイオプション

ご利用のインフラおよび対応したい課題に基づいて、マルチテナントノードのデプロイ方法を選択します。

* 以下のように、1つのWallarmノードで全クライアントまたは分離環境のトラフィックをフィルタリングします。

    ![パートナーノードの構成図](../../images/partner-waf-node/partner-traffic-processing-4.0.png)

    * 1つのWallarmノードが複数テナント（Tenant 1、Tenant 2）のトラフィックを処理します。

        --8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"
        
    * Wallarmノードは、テナントの一意識別子（[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)）により、トラフィックの受信先テナントを識別します。
    * ドメイン`https://tenant1.com`および`https://tenant2.com`に対し、パートナーまたはクライアントのIPアドレス`225.130.128.241`を指すDNS Aレコードを設定します。これは一例であり、パートナー側およびテナント側で別の設定を使用できます。
    * パートナー側では、正当なリクエストをTenant 1のアドレス（`http://upstream1:8080`）およびTenant 2のアドレス（`http://upstream2:8080`）へプロキシするように設定します。これも一例であり、パートナー側およびテナント側で別の設定を使用できます。

* 以下のように、各テナント専用にトラフィックをフィルタリングする複数のWallarmノードをデプロイします。

    ![クライアントの複数ノード構成図](../../images/partner-waf-node/client-several-nodes.png)

    * 特定のテナントごとにトラフィックをフィルタリングする複数のWallarmノード（Tenant 1、Tenant 2）があります。
    * ドメインhttps://tenant1.comには、クライアントIPアドレス225.130.128.241を指すDNSレコードを設定します。
    * ドメインhttps://tenant2.comには、クライアントIPアドレス225.130.128.242を指すDNSレコードを設定します。
    * 各ノードは自テナントのアドレスに正当なリクエストをプロキシします。
        * ノード1はTenant 1へ（http://upstream1:8080）プロキシします。
        * ノード2はTenant 2へ（http://upstream2:8080）プロキシします。

## マルチテナントノードの特性

マルチテナントノードは次の特徴を持ちます。

* 通常のフィルタリングノードと同じ[プラットフォーム](../../installation/supported-deployment-options.md)に、同じ手順でインストールできますが、以下は除きます。
    * MuleSoft MuleおよびFlex Gatewayのコネクタ
    * Amazon CloudFrontコネクタ
    * Cloudflareコネクタ
    * Broadcom Layer7 API Gatewayコネクタ
    * Fastlyコネクタ
    * Kong API Gatewayコネクタ
    * Istioコネクタ
* テクニカルテナントまたはテナントレベルにインストールできます。テナントにWallarm Consoleへのアクセスを提供する場合は、フィルタリングノードを該当するテナントレベルにインストールする必要があります。
* 通常のフィルタリングノードと同じ手順で設定できます。
* ディレクティブ[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)は、テナントごとにトラフィックを分割するために使用します。
* ディレクティブ[`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)は、アプリケーションごとに設定を分割するために使用します。

## デプロイ要件

* [テナントアカウントの設定](configure-accounts.md)が完了していること
* [テクニカルテナントアカウント](overview.md#tenant-accounts)配下でGlobal administratorロールが付与されたユーザーが以降のコマンドを実行すること
* [フィルタリングノードインストール対象のサポートプラットフォーム](../../installation/supported-deployment-options.md)が用意されていること

## マルチテナントノードのデプロイに関する推奨事項

* テナントにWallarm Consoleへのアクセスが必要な場合は、適切なテナントアカウント内にフィルタリングノードを作成します。
* テナントのNGINX設定ファイル経由でフィルタリングノードを設定します。

## マルチテナントノードをデプロイする手順

1. Wallarm Console → Nodesで、Create nodeをクリックし、Wallarm nodeを選択します。

    !!! info "既存のWallarmノードをマルチテナントモードに切り替える"
        既存のWallarmノードをマルチテナントモードに切り替える場合は、Nodesセクションの該当ノードのメニューからMake it multi-tenantオプションを使用します。

        切り替えと確認が完了したら、4番目の手順に進みます。
1. Multi-tenant nodeオプションを選択します。

    ![マルチテナントノードの作成](../../images/user-guides/nodes/create-multi-tenant-node.png)
1. ノード名を設定し、Createをクリックします。
1. フィルタリングノードのトークンをコピーします。
1. フィルタリングノードのデプロイ形態に応じて、[該当する手順](../../installation/supported-deployment-options.md)を実行します。
1. 各テナントの一意識別子を使用してテナント間でトラフィックを分割します。

    === "NGINXおよびNGINX Plus"
        テナントのNGINX設定ファイルを開き、ディレクティブ[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)を使用してテナント間でトラフィックを分割します。以下の例を参照してください。
    === "NGINX Ingress Controller"
        各Ingressリソースに対してテナントUUIDを設定するには、Ingressの[アノテーション](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-partner-client-uuid`を使用します。1つのリソースは1つのテナントに対応します。

        ```
        kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-partner-client-uuid=VALUE
        ```
    === "Docker NGINXベースイメージ"
        1. NGINX設定ファイルを開き、ディレクティブ[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)を使用してテナント間でトラフィックを分割します。以下の例を参照してください。
        1. Dockerコンテナを[設定ファイルをマウントして実行](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)します。
    === "Kubernetes Sidecar"
        1. NGINX設定ファイルを開き、ディレクティブ[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)を使用してテナント間でトラフィックを分割します。
        1. NGINX設定ファイルを[Wallarm sidecarコンテナ](../../installation/kubernetes/sidecar-proxy/customization.md#using-custom-nginx-configuration)にマウントします。

    2つのクライアントのトラフィックを処理するフィルタリングノード向けNGINX設定ファイルの例：

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

    * テナント側では、パートナーIPアドレスを指すDNS Aレコードを設定します。
    * パートナー側では、テナントのアドレス（`wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111`のテナントは`http://upstream1:8080`、`wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`のテナントは`http://upstream2:8080`）にリクエストをプロキシするように設定します。
    * すべての受信リクエストはパートナーのアドレスで処理され、正当なリクエストは`wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111`のテナントには`http://upstream1:8080`へ、`wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`のテナントには`http://upstream2:8080`へプロキシされます。

1. 必要に応じて、ディレクティブ[`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)を使用してテナントのアプリケーションIDを指定します。

    例：

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

    テナント`11111111-1111-1111-1111-111111111111`には次の2つのアプリケーションが属します。
    
    * `tenant1.com/login`はアプリケーション`21`です
    * `tenant1.com/users`はアプリケーション`22`です

## マルチテナントノードの設定

フィルタリングノードの設定をカスタマイズするには、[利用可能なディレクティブ](../../admin-en/configure-parameters-en.md)を使用します。

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"