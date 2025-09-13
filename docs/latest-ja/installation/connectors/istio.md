[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[custom-blocking-page-docs]:        ../../admin-en/configuration-guides/configure-block-page-and-code.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[multitenancy-overview]:            ../multi-tenant/overview.md
[applications-docs]:                ../../user-guides/settings/applications.md
[available-filtration-modes]:       ../../admin-en/configure-wallarm-mode.md#available-filtration-modes
[ui-filtration-mode]:              ../../admin-en/configure-wallarm-mode.md#general-filtration-mode
[self-hosted-connector-node-helm-conf]: ../native-node/helm-chart-conf.md

# Istio Ingress向けWallarmコネクタ（アウトオブバンド）

Wallarmは、Istioで管理されるAPIを[アウトオブバンド（OOB）](../oob/overview.md)で保護するコネクタを提供します。[Istio](https://istio.io/)のEnvoyプロキシの横にWallarmノードをデプロイすることで、コネクタは受信トラフィックをミラーリングし、トラフィックの流れを途切れさせずに非同期で解析へ送信します。

この連携は、Envoyプロキシ内にデプロイされるLuaプラグインに依存し、トラフィックのミラーリングとWallarmノードとの通信を処理します。

![Wallarmプラグインを使用したIstio](../../images/waf-installation/gateways/istio/traffic-flow-oob.png)

## ユースケース

リアルタイムのトラフィック解析が不要で、非同期解析で十分な場合にこのソリューションを推奨します。

Kubernetes上でEnvoyプロキシとともに動作するIstioが管理するAPIを保護する場合の最適な選択です。

## 制限事項

このセットアップでは、Wallarmの詳細な調整はWallarm ConsoleのUI経由でのみ可能です。ファイルベースの設定を必要とする一部のWallarm機能は、この実装ではサポートされません。例えば次の機能です：

* [マルチテナンシー機能][multitenancy-overview]
* [アプリケーション設定][applications-docs]
* [カスタムブロックページおよびコードの設定][custom-blocking-page-docs]

## 要件

デプロイを進めるには、次の要件を満たしていることを確認してください。

* KubernetesクラスターでAPIトラフィックを管理するEnvoyプロキシ付きのIstio
* パッケージマネージャー[Helm v3](https://helm.sh/)
* `https://us1.api.wallarm.com`（US Wallarm Cloud）または`https://api.wallarm.com`（EU Wallarm Cloud）へのアクセス
* Wallarm Helmチャートを追加するための`https://charts.wallarm.com`へのアクセス
* Docker Hub上のWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセス
* 攻撃検知ルールの更新をダウンロードするため、また[許可リスト、拒否リスト、グレーリスト](../../user-guides/ip-lists/overview.md)に登録した国、地域、またはデータセンターの正確なIPを取得するため、以下のIPアドレスへのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleへの**Administrator**アクセス

## デプロイ

IstioとEnvoyプロキシが管理するAPIを保護するには、次の手順に従ってください。

1. KubernetesクラスターにWallarmフィルタリングノードのサービスをデプロイします。
1. IstioのEnvoyプロキシを構成してトラフィックをミラーリングし、アウトオブバンド解析のためにWallarmノードへ送信します。

### 1. Wallarm Native Nodeをデプロイする

WallarmノードをKubernetesクラスター内の独立したサービスとしてデプロイするには、[手順](../native-node/helm-chart.md)に従ってください。

### 2. Envoyを構成してトラフィックをWallarmノードへミラーリングする

1. Istio用のWallarm Luaプラグインコードを入手するため、[support@wallarm.com](mailto:support@wallarm.com)に連絡してください。サポートチームから提供されるファイル名は、以下の手順で使用します。
1. Luaスクリプトを使用してトラフィックをWallarmノードへミラーリングするため、Envoyのフィルターおよびクラスタ設定を適用します：

    ```
    kubectl apply -f wallarm-envoy-gw-http-filter.yaml
    kubectl apply -f wallarm-envoy-cluster-svc-endpoint.yaml
    ```
1. Istio Ingressコントローラのネームスペース内にWallarmコネクタとそのLua依存関係をマウントするため、ConfigMapを作成します：

    ```
    kubectl -n <ISTIO_INGRESS_NS> apply -f wallarm-cm-lua-mpack-lib.yaml
    kubectl -n <ISTIO_INGRESS_NS> apply -f wallarm-cm-lua-rrasync.yaml
    ```
1. ConfigMapをマウントするには、Istio Ingress Gatewayのデプロイメントを更新します。Istioの管理方法（Helm、IstioOperator、カスタムデプロイメント）に応じて、適切に変更を適用してください。

    例えば、IstioをIstioOperatorでインストールした場合は、`IstioOperator`リソースを更新してConfigMapをマウントできます：

    ```yaml
    apiVersion: install.istio.io/v1alpha1
    kind: IstioOperator
    spec:
      components:
        ingressGateways:
          - name: istio-ingressgateway
            enabled: true
            k8s:
              volumes:
                - name: lua-mpack
                  configMap:
                    name: lua-msgpack-lib
                - name: lua-rrasync
                  configMap:
                    name: rr-async-packed
              volumeMounts:
                - name: lua-mpack
                  mountPath: /usr/local/share/lua/5.1/msgpack
                  container: istio-proxy
                - name: lua-rrasync
                  mountPath: /usr/local/share/lua/5.1/rrasync
                  container: istio-proxy
    ```

    ```
    kubectl apply -f istio-operator.yaml
    ```

## テスト

デプロイしたコネクタの動作をテストするには、次の手順に従ってください。

1. WallarmのPodが起動して稼働していることを確認します：

    ```
    kubectl -n wallarm-node get pods
    ```

    `wallarm-node`はWallarmノードのサービスがデプロイされているネームスペースです。

    各Podのステータスは**STATUS: Running**または**READY: N/N**である必要があります。例：

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. テスト用の[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストをIstio Gatewayに送信します：

    ```
    curl https://<ISTIO_GATEWAY_IP>/etc/passwd
    ```
1. [US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)のWallarm Console → Attacksセクションを開き、攻撃が一覧に表示されていることを確認します。

    ![インターフェイスのAttacks][attacks-in-ui-image]

    このコネクタは[アウトオブバンド](../oob/overview.md)モードで動作し、悪意のあるリクエストをブロックしないため、Wallarmノードは攻撃をブロックせずに登録します。
1. 必要に応じて、別のコンソールウィンドウでWallarmのログを監視します：

    ```
    kubectl -n gonode logs native-processing-7c487bbdc6-4j6mz --tail 100 -f
    ```

## Wallarm Luaプラグインのアップグレード

デプロイ済みのWallarm Luaプラグインを[新しいバージョン](code-bundle-inventory.md#istio)にアップグレードするには：

1. Istio Ingress用の更新済みWallarm Luaプラグインコードを入手するため、support@wallarm.comに連絡してください。
1. [ステップ2](#2-configure-envoy-to-mirror-traffic-to-the-wallarm-node)に記載のとおりに更新プラグインをデプロイします。

プラグインのアップグレードには、特にメジャーバージョン更新時に、Wallarmノードのアップグレードが必要な場合があります。リリースの更新情報とアップグレード手順については、[Wallarm Native Nodeの変更履歴](../../updating-migrating/native-node/node-artifact-versions.md)を参照してください。将来のアップグレードを容易にし非推奨を回避するため、ノードの定期的な更新を推奨します。