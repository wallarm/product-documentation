[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md

# マルチテナント・ノードの展開と設定

[マルチテナント](overview.md)ノードは、いくつかの独立した企業のインフラストラクチャまたは隔離された環境を同時に保護します。

## マルチテナント・ノードの展開オプション

インフラストラクチャと対処する問題に基づいて、マルチテナントノードの展開オプションを選択してください。

* すべてのクライアントや隔離された環境のトラフィックをフィルタリングするために1つのWallarmノードを展開する:

    ![!パートナーノードスキーム](../../images/partner-waf-node/partner-traffic-processing-4.0.png)

    * 1つのWallarmノードが複数のテナントのトラフィック（テナント1、テナント2）を処理します。
        
        --8<-- "../include-ja/waf/features/multi-tenancy/partner-client-term.md"
        
    * Wallarmノードは、テナントの一意の識別子（[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) またはEnvoyインストール時の [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#configuration-options-for-the-envoy‑based-wallarm-node)）によって、トラフィックを受信するテナントを識別します。
    * `https://tenant1.com` および `https://tenant2.com` のドメインには、パートナーまたはクライアントのIPアドレス `225.130.128.241` を持つDNS Aレコードが設定されています。この設定は例として示されており、パートナーとテナントの両方で異なる設定が使用されている場合があります。
    * パートナー側には、テナント1（`http://upstream1:8080`）およびテナント2（`http://upstream2:8080`）のアドレスへの正当な要求のプロキシが設定されています。この設定は例として示されており、パートナーとテナントの両方で異なる設定が使用されている場合があります。

    !!! warning "WallarmノードがCDNタイプの場合"
        [`wallarm_application`](../cdn-node.md) 設定がWallarm CDNノードによってサポートされていないため、この展開オプションはCDNノードタイプでもサポートされていません。使用されているノードタイプがCDNの場合、特定のテナントのトラフィックをフィルタリングするいくつかのノードを展開してください。
* 各テナントのトラフィックをフィルタリングするいくつかのWallarmノードを展開する。

    テナントのトラフィックは、上記のオプションと同様に、パートナーまたはテナントの複数のサーバー上で処理されます。

## マルチテナント・ノードの特徴

マルチテナント・ノードは：

* 通常のフィルタリングノードと同じ[プラットフォーム](../../installation/supported-deployment-options.md) にインストールでき、同じ手順に従ってインストールできます。
* **技術テナント**または**テナント**レベルにインストールできます。テナントにWallarm Consoleへのアクセス権を提供したい場合、フィルタリングノードは対応するテナントレベルにインストールする必要があります。
* 通常のフィルタリングノードと同じ手順で設定できます。
* テナントごとにトラフィックを分割するために、ディレクティブ [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)が使用されます。
* アプリケーションごとに設定を分割するために、ディレクティブ [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) が使用されます。

## 展開要件

* [テナントアカウントの設定](configure-accounts.md)
* [技術テナントアカウント](configure-accounts.md#tenant-account-structure)の下で追加された**グローバル管理者**ロールを持つユーザーによるさらなるコマンドの実行
* [フィルタリングノードのインストールに対応するプラットフォーム](../../installation/supported-deployment-options.md)

## マルチテナント・ノードの展開に関する推奨事項

* テナントがWallarm Consoleにアクセスする必要がある場合は、適切なテナントアカウント内でフィルタリングノードを作成してください。
* テナントのNGINX設定ファイルを使用してフィルタリングノードを設定してください。マルチテナントノードの展開手順

1. Wallarm Console → **ノード**で、**ノードを作成**をクリックし、**Wallarmノード**を選択します。

    !!! info "既存のWallarmノードをマルチテナントモードに切り替える"
        既存のWallarmノードをマルチテナントモードに切り替えたい場合は、**Nodes**セクションで必要なノードメニューから**マルチテナントにする**オプションを使ってください。

        切り替わって確認されたら、4つ目の手順に進んでください。
1. **マルチテナントノード**オプションを選択します。

    ![!マルチテナントノード作成](../../images/user-guides/nodes/create-multi-tenant-node.png)
1. ノード名を設定し、**作成**をクリックします。
1. フィルタリングノードトークンをコピーします。
1. フィルタリングノードの展開形式に応じて、[適切な手順](../../installation/supported-deployment-options.md)を実行します。
1. 一意の識別子を使用して、テナント間のトラフィックを分割します。

    === "NGINXおよびNGINX Plus"
        テナントのNGINX設定ファイルを開き、[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)ディレクティブを使用してテナント間のトラフィックを分割します。下記の例を参照してください。
    === "NGINX Ingress Controller"
        各IngressリソースについてテナントUUIDを設定するために、Ingress[アノテーション](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-partner-client-uuid`を使います。1つのリソースが1つのテナントに関連付けられています：

        ```
        kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-partner-client-uuid=VALUE
        ```
    === "Docker NGINXベースのイメージ"
        1. NGINX設定ファイルを開き、[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)ディレクティブを使用してテナント間のトラフィックを分割します。下記の例を参照してください。
        1. 設定ファイルを[マウントしてDockerコンテナを実行します](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)。
    === "Docker Envoyベースのイメージ"
        1.`envoy.yaml` 設定ファイルを開き、[`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param)パラメータを使用してテナント間のトラフィックを分割します。
        1. 準備された `envoy.yaml` をマウントして[Dockerコンテナを実行します](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)。
    === "Kubernetes Sidecarプロキシ"
        1. NGINX設定ファイルを開くおよび[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)ディレクティブを使用してテナント間のトラフィックを分割します。
        1. NGINX設定ファイルを[Wallarm sidecar コンテナにマウントします](../../installation/kubernetes/sidecar-proxy/customization.md#using-custom-nginx-configuration)。

    2つのクライアントのトラフィックを処理するフィルタリングノードのためのNGINX設定ファイルの例：

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

    * テナント側では、パートナーIPアドレスを持つDNS Aレコードが設定されています
    * パートナー側では、テナントのアドレスへのリクエストのプロキシ(`wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111`を持つテナント用の`http://upstream1:8080`と、`wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`を持つテナント用の`http://upstream2:8080`)が設定されています
    * すべての受信リクエストはパートナーアドレスで処理され、正当なリクエストは`wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111`を持つテナント用の`http://upstream1:8080`および`wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`を持つテナント用の`http://upstream2:8080`にプロキシされます

1. 必要に応じて、[`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)ディレクティブを使用して、テナントのアプリケーションIDを指定します。

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

    テナント `11111111-1111-1111-1111-111111111111` に属する2つのアプリケーション：
    
    * `tenant1.com/login` はアプリケーション `21`
    * `tenant1.com/users` はアプリケーション `22`

## マルチテナントノードの設定

フィルタリングノードの設定をカスタマイズするには、[利用可能なディレクティブ](../../admin-en/configure-parameters-en.md)を使用してください。

--8<-- "../include-ja/waf/installation/common-customization-options-nginx-4.4.md"