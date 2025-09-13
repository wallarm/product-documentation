[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md
[ptrav-attack-docs]:                     ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:                   ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:                  ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:                ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md
[api-token]:                             ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[self-hosted-connector-node-helm-conf]:  ../connectors/self-hosted-node-conf/helm-chart.md

# HelmチャートでNative Nodeをデプロイする

NGINXに依存せず動作する[Wallarm Native Node](../nginx-native-node-internals.md)は、いくつかのコネクタと併用してデプロイするよう設計されています。Helmチャートを使用して、Kubernetesクラスター内でNative Nodeを独立したサービスまたはロードバランサーとして実行できます。

## ユースケース

以下のケースでHelmチャートを用いてNative Nodeをデプロイします。

* MuleSoftの[Mule](../connectors/mulesoft.md)または[Flex](../connectors/mulesoft-flex.md) Gateway、[Akamai](../connectors/akamai-edgeworkers.md)、[Cloudflare](../connectors/cloudflare.md)、[Amazon CloudFront](../connectors/aws-lambda.md)、[Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md)、[Fastly](../connectors/fastly.md)、[IBM DataPower](../connectors/ibm-api-connect.md)向けのWallarmコネクタをデプロイし、ノードをセルフホストする必要がある場合。すでにOpenShift、Amazon EKS、Azure AKS、Google GKEなどのKubernetes管理プラットフォームを使用している場合に最適です。ノードはパブリックIPを持つロードバランサーとして構成され、容易にトラフィックをルーティングできます。

    この場合はNodeを`connector-server`モードで使用します。
* Istioで管理されるAPI向けにインラインの[gRPCベースの外部処理フィルター](../connectors/istio.md)が必要な場合。ノードはパブリックIPを持つロードバランサーとして構成され、容易にトラフィックをルーティングできます。
    
    この場合はNodeを`envoy-external-filter`モードで使用します。
* [Kong API Gateway](../connectors/kong-api-gateway.md)向けのWallarmコネクタをデプロイする場合。ノードはパブリックIPを公開せず、内部トラフィック向けにClusterIPタイプでデプロイされます。
    
    この場合はNodeを`connector-server`モードで使用します。

## 要件

HelmチャートでNative NodeをデプロイするKubernetesクラスターは、以下の条件を満たす必要があります。

* [Helm v3](https://helm.sh/)パッケージマネージャーがインストールされていること。
* APIが稼働するAPIゲートウェイまたはCDNからのインバウンドアクセス。
* 以下へのアウトバウンドアクセス:

    * `https://charts.wallarm.com` からWallarmのHelmチャートをダウンロード
    * `https://hub.docker.com/r/wallarm` からデプロイに必要なDockerイメージをダウンロード
    * US/EUのWallarm Cloud用に `https://us1.api.wallarm.com` または `https://api.wallarm.com`
    * 攻撃検知ルールや[API仕様][api-spec-enforcement-docs]の更新ダウンロード、ならびに[許可リスト、拒否リスト、グレーリスト][ip-list-docs]に登録された国・地域・データセンターの正確なIP取得のために、以下のIPアドレス

        --8<-- "../include/wallarm-cloud-ips.md"
* `LoadBalancer`タイプでデプロイする場合、ドメインと信頼されたSSL/TLS証明書が必要です。
* さらに、Wallarm Consoleで**Administrator**ロールが割り当てられている必要があります。

## 制限事項

* `LoadBalancer`タイプでWallarmサービスをデプロイする場合、Nodeインスタンスのドメインに対して**信頼された**SSL/TLS証明書が必要です。自己署名証明書はまだサポートされていません。
* [カスタムブロックページとブロックコード](../../admin-en/configuration-guides/configure-block-page-and-code.md)の設定はまだサポートされていません。
* Wallarmルールによる[レート制限](../../user-guides/rules/rate-limiting.md)はサポートしていません。
* [マルチテナンシー](../multi-tenant/overview.md)はまだサポートしていません。

## デプロイ

### 1. Wallarmトークンを準備する

Nodeをインストールするには、Wallarm CloudにNodeを登録するためのトークンが必要です。トークンを準備するには:

1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)のWallarm Console → **Settings** → **API tokens**を開きます。
1. 使用タイプが`Node deployment/Deployment`のAPI tokenを見つけるか作成します。
1. そのトークンをコピーします。

### 2. WallarmのHelmチャートリポジトリを追加する

```
helm repo add wallarm https://charts.wallarm.com
helm repo update wallarm
```

### 3. 設定ファイルを準備する

=== "LoadBalancer (connector-server)"
    パブリックIPを持つLoadBalancerとしてネイティブなWallarmノードをデプロイすると、MuleSoft、Cloudflare、Amazon CloudFront、Broadcom Layer7 API Gateway、FastlyからこのIPへトラフィックをルーティングし、セキュリティ分析とフィルタリングを実施できます。

    1. ロードバランサー用のドメインを登録します。
    1. **信頼された**SSL/TLS証明書を取得します。
    1. 以下の最小構成で`values.yaml`設定ファイルを作成します。証明書の適用方法として希望するタブを選択してください:
    
        === "cert-manager"
            クラスター内で[`cert-manager`](https://cert-manager.io/)を使用している場合、これでSSL/TLS証明書を発行できます。

            ```yaml
            config:
              connector:
                mode: connector-server
                certificate:
                  enabled: true
                  certManager:
                    enabled: true
                    issuerRef:
                      # cert-managerのIssuerまたはClusterIssuerの名前
                      name: letsencrypt-prod
                      # Issuer（Namespaceスコープ）かClusterIssuer（クラスター全体）か
                      kind: ClusterIssuer
            processing:
              service:
                type: LoadBalancer
            ```
        === "existingSecret"
            同一Namespace内の既存のKubernetes SecretからSSL/TLS証明書を取り込めます。

            ```yaml
            config:
              connector:
                mode: connector-server
                certificate:
                  enabled: true
                  existingSecret:
                    enabled: true
                    # 証明書と秘密鍵を含むKubernetes Secretの名前
                    name: my-secret-name
            processing:
              service:
                type: LoadBalancer
            ```
        === "customSecret"
            `customSecret`構成では、証明書をbase64エンコード値として直接定義できます。

            ```yaml
            config:
              connector:
                mode: connector-server
                certificate:
                  enabled: true
                  customSecret:
                    enabled: true
                    ca: LS0...  # Base64でエンコードされたCA
                    crt: LS0... # Base64でエンコードされた証明書
                    key: LS0... # Base64でエンコードされた秘密鍵
            processing:
              service:
                type: LoadBalancer
            ```
=== "LoadBalancer (envoy-external-filter)"
    パブリックIPを持つLoadBalancerとしてネイティブなWallarmノードをデプロイすると、MuleSoft、Cloudflare、Amazon CloudFront、Broadcom Layer7 API Gateway、FastlyからこのIPへトラフィックをルーティングし、セキュリティ分析とフィルタリングを実施できます。

    1. ロードバランサー用のドメインを登録します。
    1. **信頼された**SSL/TLS証明書を取得します。
    1. 以下の最小構成で`values.yaml`設定ファイルを作成します。証明書の適用方法として希望するタブを選択してください:
    
        === "cert-manager"
            クラスター内で[`cert-manager`](https://cert-manager.io/)を使用している場合、これでSSL/TLS証明書を発行できます。

            ```yaml
            config:
              connector:
                mode: envoy-external-filter
                certificate:
                  enabled: true
                  certManager:
                    enabled: true
                    issuerRef:
                      # cert-managerのIssuerまたはClusterIssuerの名前
                      name: letsencrypt-prod
                      # Issuer（Namespaceスコープ）かClusterIssuer（クラスター全体）か
                      kind: ClusterIssuer
            processing:
              service:
                type: LoadBalancer
            ```
        === "existingSecret"
            同一Namespace内の既存のKubernetes SecretからSSL/TLS証明書を取り込めます。

            ```yaml
            config:
              connector:
                mode: envoy-external-filter
                certificate:
                  enabled: true
                  existingSecret:
                    enabled: true
                    # 証明書と秘密鍵を含むKubernetes Secretの名前
                    name: my-secret-name
            processing:
              service:
                type: LoadBalancer
            ```
        === "customSecret"
            `customSecret`構成では、証明書をbase64エンコード値として直接定義できます。

            ```yaml
            config:
              connector:
                mode: envoy-external-filter
                certificate:
                  enabled: true
                  customSecret:
                    enabled: true
                    ca: LS0...  # Base64でエンコードされたCA
                    crt: LS0... # Base64でエンコードされた証明書
                    key: LS0... # Base64でエンコードされた秘密鍵
            processing:
              service:
                type: LoadBalancer
            ```
=== "ClusterIP"
    WallarmをKong API GatewayまたはIstioのコネクタとしてデプロイする場合、パブリックIPを公開せず、内部トラフィック向けにこのコネクタ用のNative NodeをClusterIPタイプでデプロイします。

    以下の最小構成で`values.yaml`設定ファイルを作成します。

    ```yaml
    processing:
      service:
        type: ClusterIP
    ```

[すべての設定パラメータ](helm-chart-conf.md)

### 4. Wallarmサービスをデプロイする

=== "US Cloud"
    ```
    helm upgrade --install --version 0.17.1 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=us1.api.wallarm.com
    ```
=== "EU Cloud"
    ```
    helm upgrade --install --version 0.17.1 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=api.wallarm.com
    ```

### 5. Wallarmロードバランサーを取得する

`LoadBalancer`タイプでデプロイした場合:

1. Wallarmロードバランサーの外部IPを取得します。

    ```
    kubectl get svc -n wallarm-node
    ```

    `native-processing`サービスの外部IPを確認します。
1. DNSプロバイダーでAレコードを作成し、ドメインを外部IPに向けます。

    DNSが伝播したら、ドメイン名でサービスにアクセスできます。

### 6. API管理サービスへWallarmコードを適用する

ノードをデプロイしたら、次のステップとして、トラフィックをデプロイ済みノードにルーティングするためにWallarmコードをAPI管理プラットフォームまたはサービスに適用します。

1. コネクタ向けのWallarmコードバンドルを入手するため、sales@wallarm.comに連絡してください。
1. プラットフォーム固有の手順に従って、API管理プラットフォームにバンドルを適用します。

    * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [MuleSoft Flex Gateway](../connectors/mulesoft-flex.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [Akamai](../connectors/akamai-edgeworkers.md#2-obtain-the-wallarm-code-bundle-and-create-edgeworkers)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
    * [IBM DataPower](../connectors/ibm-api-connect.md#2-obtain-and-apply-the-wallarm-policies-to-apis-in-ibm-api-connect)
    * [Kong API Gateway](../connectors/kong-api-gateway.md#2-obtain-and-deploy-the-wallarm-lua-plugin)
    * [Istio](../connectors/istio.md)

## アップグレード

Nodeをアップグレードするには、[手順](../../updating-migrating/native-node/helm-chart.md)に従ってください。