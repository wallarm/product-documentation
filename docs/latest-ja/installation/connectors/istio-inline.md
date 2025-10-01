[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[custom-blocking-page-docs]:        ../../admin-en/configuration-guides/configure-block-page-and-code.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[multitenancy-overview]:            ../multi-tenant/overview.md
[applications-docs]:                ../../user-guides/settings/applications.md
[available-filtration-modes]:       ../../admin-en/configure-wallarm-mode.md#available-filtration-modes
[ui-filtration-mode]:              ../../admin-en/configure-wallarm-mode.md#general-filtration-mode
[self-hosted-connector-node-helm-conf]: ../native-node/helm-chart-conf.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Istio Ingress向けWallarmフィルター

WallarmはIstioが管理するAPIを保護するためのフィルターを提供し、トラフィックを[インライン](../inline/overview.md)または[アウトオブバンド](../oob/overview.md)で分析します。Wallarm nodeを外部にデプロイし、Envoyの設定にWallarm提供の構成を適用して、gRPCベースの外部処理フィルター経由でトラフィックをWallarm nodeにルーティングして分析します。

!!! info "OOBモード（ミラーリングされたトラフィック）"
    [こちら](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/ext_proc/v3/ext_proc.proto#envoy-v3-api-msg-extensions-filters-http-ext-proc-v3-externalprocessor)で説明されているEnvoyパラメータ`observability_mode`を設定することで、Istio向けWallarmフィルターを使用して[アウトオブバンド（OOB）](../oob/overview.md)でトラフィックを分析することもできます。

## ユースケース

Envoyプロキシで動作するIstioが管理するAPIをリアルタイムに保護するのに最適な選択です。

## 制限事項

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

## 要件

デプロイを進める前に、以下の要件を満たしていることを確認します。

* Istio技術の理解
* APIトラフィックを管理するEnvoyプロキシを備えたIstio

## デプロイ

### 1. Wallarm nodeをデプロイします

Wallarm nodeはWallarmプラットフォームの中核コンポーネントで、デプロイする必要があります。受信トラフィックを検査し、不正なアクティビティを検出し、脅威を軽減するように構成できます。

セルフホスト型nodeデプロイ用のアーティファクトを選択し、`envoy-external-filter`モード向けの手順に従います:

* [All-in-oneインストーラー](../native-node/all-in-one.md): ベアメタルまたはVM上のLinuxインフラストラクチャ向け
* [Docker image](../native-node/docker-image.md): コンテナ化デプロイを使用する環境向け
* [AWS AMI](../native-node/aws-ami.md): AWSインフラストラクチャ向け
* [Helm chart](../native-node/helm-chart.md): Kubernetesを利用するインフラストラクチャ向け

### 2. Envoyを構成してトラフィックをWallarm nodeへプロキシします

1. `envoy.yaml`→`http_filters`セクションで、解析のためにリクエストとレスポンスを外部のWallarm Nodeへ送信する外部処理フィルターを構成します。そのために、次のテンプレートを使用します:

    ```yaml
    ...

    http_filters:
    - name: ext_proc
      typed_config:
        "@type": type.googleapis.com/envoy.extensions.filters.http.ext_proc.v3.ExternalProcessor
        grpc_service:
          envoy_grpc:
            cluster_name: wallarm_cluster
        processing_mode:
          request_body_mode: STREAMED
          response_body_mode: STREAMED
        request_attributes: ["request.id", "request.time", "source.address"]
    ```
1. `envoy.yaml`→`clusters`セクションで、データをWallarm Nodeへ転送するために使用されるWallarmクラスターを構成します。そのために、次のテンプレートを使用します:

    ```yaml
    clusters:
    - ...
    - name: wallarm_cluster
      connect_timeout: 30s
      load_assignment:
        cluster_name: wallarm_cluster
        endpoints: # Wallarm Nodeのエンドポイント
        - lb_endpoints:
          - endpoint:
              address:
                socket_address:
                  address: 127.0.0.1
                  port_value: 5080
      http2_protocol_options: {} # http2を有効化するために設定が必要です
      transport_socket:
        name: envoy.transport_sockets.tls
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.UpstreamTlsContext
          common_tls_context:
            validation_context:
              trusted_ca:
                filename: /path/to/node-ca.pem # Nodeインスタンスで使用される証明書を発行したCA
    ```

!!! info "発生し得る500エラーの回避"
    外部フィルターに問題が発生した際の500エラーを回避するために、設定に[`failure_mode_allow`](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/ext_proc/v3/ext_proc.proto)パラメータを追加できます。

## テスト

デプロイしたフィルターの機能をテストするには、次の手順に従います。

1. テスト用の[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストをIstio Gatewayに送信します:

    ```
    curl https://<ISTIO_GATEWAY_IP>/etc/passwd
    ```
1. Wallarm Console→[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)のAttacksセクションを開き、攻撃が一覧に表示されていることを確認します。

    ![インターフェイスのAttacks][attacks-in-ui-image]