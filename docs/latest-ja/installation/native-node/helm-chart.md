# Helm Chart を使用したNative Nodeのデプロイ

[Wallarm Native Node](../nginx-native-node-internals.md)は、NGINXに依存せず動作し、一部のコネクタとのデプロイを目的としています。Helm Chartを使用することで、Native NodeをKubernetesクラスター内の個別サービスまたはロードバランサーとして実行できます。

## ユースケース

以下の場合に、Helm Chartを使用してNative Nodeをデプロイします：

* [MuleSoft](../connectors/mulesoft.md)、[Cloudflare](../connectors/cloudflare.md)、[Amazon CloudFront](../connectors/aws-lambda.md)、[Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md)、[Fastly](../connectors/fastly.md)向けのWallarmコネクタをデプロイし、ノードをセルフホストする必要がある場合。すでにOpenShift、Amazon EKS、Azure AKS、Google GKEなどのKubernetes管理プラットフォームをご利用の場合に最適で、ノードはパブリックIPを持つロードバランサーとして設定され、トラフィックルーティングが容易になります。
* [Kong API Gateway](../connectors/kong-api-gateway.md)または[Istio](../connectors/istio.md)向けのWallarmコネクタをデプロイする場合。ノードはパブリックIPを公開せず、内部トラフィック用のClusterIPタイプでデプロイされます。

## 要件

Helm Chartを使用してNative NodeをデプロイするKubernetesクラスターは、以下の条件を満たす必要があります：

* [Helm v3](https://helm.sh/)のパッケージマネージャーがインストールされていること。
* APIが稼働しているAPIゲートウェイまたはCDNからのインバウンドアクセスが可能であること。
* アウトバウンドアクセスが以下に対して可能であること：
    * Wallarm Helm Chartをダウンロードするため https://charts.wallarm.com
    * デプロイに必要なDockerイメージをダウンロードするため https://hub.docker.com/r/wallarm
    * US/EU Wallarm Cloud用 https://us1.api.wallarm.com または https://api.wallarm.com
    * 攻撃検出ルールおよび[API仕様][api-spec-enforcement-docs]の更新のダウンロード、ならびに[ホワイトリスト、ブラックリスト、またはグレイリスト][ip-list-docs]に登録された国、地域、データセンターの正確なIP取得のために、以下のIPアドレスへのアクセス  
      
        --8<-- "../include/wallarm-cloud-ips.md"
* LoadBalancerタイプでデプロイする場合は、ドメインおよび信頼されたSSL/TLS証明書が必要です。
* 加えて、Wallarm Consoleにて**Administrator**ロールが割り当てられている必要があります。

## 制限事項

* WallarmサービスをLoadBalancerタイプでデプロイする場合、ドメインに対して**trusted**なSSL/TLS証明書が必要です。自己署名証明書はまだサポートされていません。
* [カスタムブロッキングページおよびブロッキングコード](../../admin-en/configure-wallarm-mode.md)の設定はまだサポートされていません。
* Wallarmルールによる[Rate limiting](../../user-guides/rules/rate-limiting.md)はサポートされていません。
* [Multitenancy](../multi-tenant/overview.md)はまだサポートされていません。

## デプロイ手順

### 1. Wallarm tokenの準備

ノードをインストールするには、Wallarm Cloudにノードを登録するためのtokenが必要です。tokenの準備方法は以下の通りです：

1. Wallarm Console の【Settings】→【API tokens】を[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開いてください。
1. `Deploy`ソースロールのAPI tokenを探すか作成してください。
1. このtokenをコピーしてください。

### 2. Wallarm Helm Chartリポジトリの追加

```
helm repo add wallarm https://charts.wallarm.com
helm repo update wallarm
```

### 3. 設定ファイルの準備

=== "ロードバランサー"
    パブリックIPを持つロードバランサーとしてnative Wallarm nodeをデプロイすることで、MuleSoft、Cloudflare、Amazon CloudFront、Broadcom Layer7 API Gateway、FastlyからこのIPへのトラフィックをセキュリティ解析およびフィルトレーションのためにルーティングできます。

    1. ロードバランサー用のドメインを登録してください。
    1. **trusted**なSSL/TLS証明書を取得してください。
    1. 以下の最小限の設定を使用して、`values.yaml`設定ファイルを作成してください。証明書の適用方法について、該当するタブを選択してください：
    
        === "cert-manager"
            クラスタ内で[`cert-manager`](https://cert-manager.io/)を使用している場合、これを使用してSSL/TLS証明書を生成できます。

            ```yaml
            config:
              connector:
                certificate:
                  enabled: true
                  certManager:
                    enabled: true
                    issuerRef:
                      # cert-managerのIssuerまたはClusterIssuerの名前
                      name: letsencrypt-prod
                      # これがIssuer（namespaceスコープ）かClusterIssuer（クラスター全体）か
                      kind: ClusterIssuer
            processing:
              service:
                type: LoadBalancer
            ```
        === "existingSecret"
            同一ネームスペース内にある既存のKubernetesシークレットからSSL/TLS証明書を取得できます。

            ```yaml
            config:
              connector:
                certificate:
                  enabled: true
                  existingSecret:
                    enabled: true
                    # 証明書と秘密鍵を含むKubernetesシークレットの名前
                    name: my-secret-name
            processing:
              service:
                type: LoadBalancer
            ```
        === "customSecret"
            `customSecret`設定により、証明書をbase64エンコードされた値として直接定義できます。

            ```yaml
            config:
              connector:
                certificate:
                  enabled: true
                  customSecret:
                    enabled: true
                    ca: LS0...  # Base64エンコードされたCA
                    crt: LS0... # Base64エンコードされた証明書
                    key: LS0... # Base64エンコードされた秘密鍵
            processing:
              service:
                type: LoadBalancer
            ```
=== "ClusterIP"
    Kong API GatewayまたはIstio用のWallarmコネクタとしてデプロイする場合、パブリックIPを公開せず、内部トラフィック用のClusterIPタイプでNative Nodeをデプロイします。

    以下の最小限の設定を使用して、`values.yaml`設定ファイルを作成してください：

    ```yaml
    processing:
      service:
        type: ClusterIP
    ```

[すべての設定パラメータ](helm-chart-conf.md)

### 4. Wallarmサービスのデプロイ

=== "US Cloud"
    ```
    helm upgrade --install --version 0.11.0 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=us1.api.wallarm.com
    ```
=== "EU Cloud"
    ```
    helm upgrade --install --version 0.11.0 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=api.wallarm.com
    ```

### 5. Wallarmロードバランサーの取得

LoadBalancerタイプでデプロイする場合：

1. Wallarmロードバランサーの外部IPを取得してください：

    ```
    kubectl get svc -n wallarm-node
    ```

    `native-processing`サービスの外部IPを確認してください。
1. DNSプロバイダーでAレコードを作成し、ドメインを外部IPにポイントしてください。

    DNSが伝播した後、ドメイン名を介してサービスにアクセスできます。

### 6. API管理サービスへのWallarmコードの適用

ノードをデプロイした後、次のステップとして、デプロイしたノードへトラフィックをルーティングするために、API管理プラットフォームまたはサービスへWallarmコードを適用します。

1. コネクタ用のWallarmコードバンドルを取得するため、sales@wallarm.comにお問い合わせください。
1. プラットフォーム固有の手順に従い、API管理プラットフォーム上でバンドルを適用してください：

    * [MuleSoft](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
    * [Kong API Gateway](../connectors/kong-api-gateway.md#2-obtain-and-deploy-the-wallarm-lua-plugin)
    * [Istio](../connectors/istio.md#2-configure-envoy-to-mirror-traffic-to-the-wallarm-node)

## アップグレード

ノードをアップグレードするには、[こちらの手順](../../updating-migrating/native-node/helm-chart.md)に従ってください。