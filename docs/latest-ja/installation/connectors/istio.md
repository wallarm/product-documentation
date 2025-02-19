[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[custom-blocking-page-docs]:        ../../admin-en/configuration-guides/configure-block-page-and-code.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[multitenancy-overview]:            ../multi-tenant/overview.md
[applications-docs]:                ../../user-guides/settings/applications.md
[available-filtration-modes]:       ../../admin-en/configure-wallarm-mode.md#available-filtration-modes
[ui-filtration-mode]:              ../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console
[self-hosted-connector-node-helm-conf]: ../native-node/helm-chart-conf.md

# Istio Ingress向けWallarmコネクタ

Wallarmは、Istioで管理されているAPIを保護し、[アウトオブバンド (OOB)](../oob/overview.md)によりトラフィック解析を行うコネクタを提供します。Wallarmノードを[Istio](https://istio.io/)のEnvoyプロキシと併設で展開することにより、コネクタは受信トラフィックをミラーリングし、非同期で解析用に送信すると同時に、トラフィックが中断なく流れ続けることを可能にします。

本統合は、Envoyプロキシ内に展開されたLuaプラグインに依存し、トラフィックのミラーリングおよびWallarmノードとの通信を処理します。

![Wallarmプラグインを搭載したIstio](../../images/waf-installation/gateways/istio/traffic-flow-oob.png)

## ユースケース

このソリューションは、リアルタイムのトラフィック解析が不要であり、非同期解析で十分な場合に推奨します。

サポートされている[Wallarmの展開オプション](../supported-deployment-options.md)の中で、Kubernetes上でEnvoyプロキシを使用して実行されているIstio管理APIを保護するための最適な選択肢です。

## 制限事項

このセットアップでは、Wallarmの詳細な設定をWallarm Console UI経由でのみ行うことが可能です。ファイルベースの設定を必要とする一部のWallarm機能は、本実装ではサポートされません。例えば：

* [マルチテナンシー機能][multitenancy-overview]
* [アプリケーション設定][applications-docs]
* [カスタムブロッキングページとコードの設定][custom-blocking-page-docs]

## 要件

デプロイを進める前に、次の要件を満たしていることをご確認ください。

* Kubernetesクラスター内でAPIトラフィックを管理するEnvoyプロキシを搭載したIstio
* [Helm v3](https://helm.sh/)パッケージマネージャー
* `https://us1.api.wallarm.com`（US Wallarm Cloud）または`https://api.wallarm.com`（EU Wallarm Cloud）へのアクセス
* Wallarm Helmチャートを追加するための`https://charts.wallarm.com`へのアクセス
* Docker Hub上のWallarmリポジトリ `https://hub.docker.com/r/wallarm`へのアクセス
* 下記IPアドレスへのアクセス（攻撃検出ルールの更新ダウンロードおよび[allowlisted, denylisted, or graylisted](../../user-guides/ip-lists/overview.md)な国、地域、またはデータセンターの正確なIPの取得のため）

    --8<-- "../include/wallarm-cloud-ips.md"
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)用Wallarm Consoleへの**Administrator**アクセス

## デプロイ

IstioおよびEnvoyプロキシで管理されているAPIを保護するため、以下の手順に従ってください。

1. Kubernetesクラスター内にWallarmフィルタリングノードサービスを展開します。
1. Istio内のEnvoyプロキシを設定し、トラフィックをミラーリングしてWallarmノードにアウトオブバンド解析用として送信します。

### 1. Wallarm Nativeノードの展開

Kubernetesクラスター内にWallarmノードを別サービスとして展開するには、[手順](../native-node/helm-chart.md)に従ってください。

### 2. Envoyを設定してWallarmノードへトラフィックをミラーリング

1. [support@wallarm.com](mailto:support@wallarm.com)に連絡して、Istio用のWallarm Luaプラグインコードを入手してください。サポートチームから提供されたファイル名は、以下の手順で使用します。
1. Luaスクリプトを使用して、WallarmノードへトラフィックをミラーリングするためのEnvoyフィルターおよびクラスタ構成を適用します：

    ```
    kubectl apply -f wallarm-envoy-gw-http-filter.yaml
    kubectl apply -f wallarm-envoy-cluster-svc-endpoint.yaml
    ```
1. Istio Ingressコントローラの名前空間内にWallarmコネクタとそのLua依存性をマウントするためのConfigMapを作成します：

    ```
    kubectl -n <ISTIO_INGRESS_NS> apply -f wallarm-cm-lua-mpack-lib.yaml
    kubectl -n <ISTIO_INGRESS_NS> apply -f wallarm-cm-lua-rrasync.yaml
    ```
1. ConfigMapをマウントするため、Istio Ingress Gatewayのデプロイメントを更新します。Istioの管理方法（Helm、IstioOperator、またはカスタムデプロイメント）に応じて、適切に変更を適用してください。

    たとえば、IstioがIstioOperatorを使用してインストールされている場合は、`IstioOperator`リソースを更新することでConfigMapをマウントできます：

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

展開されたコネクタの機能をテストするには、以下の手順に従ってください。

1. Wallarmポッドが正常に稼働していることをご確認ください：

    ```
    kubectl -n wallarm-node get pods
    ```

    `wallarm-node`はWallarmノードサービスが展開されている名前空間です。

    各ポッドの状態は**STATUS: Running**または**READY: N/N**である必要があります。例：

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. Istio Gatewayに対してテスト用の[パストラバーサル][ptrav-attack-docs]攻撃リクエストを送信します：

    ```
    curl https://<ISTIO_GATEWAY_IP>/etc/passwd
    ```
1. Wallarm Consoleの**Attacks**セクションを[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)で開き、攻撃が一覧に表示されていることをご確認ください。

    ![インターフェース上の攻撃][attacks-in-ui-image]

    コネクタは[アウトオブバンド](../oob/overview.md)モードで動作し、悪意のあるリクエストをブロックしないため、Wallarmノードは攻撃をブロックせず登録するのみです。
1. 必要に応じて、別のコンソールウィンドウでWallarmログを監視してください：

    ```
    kubectl -n gonode logs native-processing-7c487bbdc6-4j6mz --tail 100 -f
    ```

## Wallarm Luaプラグインのアップグレード

展開されたWallarm Luaプラグインを[新しいバージョン](code-bundle-inventory.md#istio)にアップグレードするには：

1. [support@wallarm.com](mailto:support@wallarm.com)に連絡して、Istio Ingress用の更新されたWallarm Luaプラグインコードを入手してください。
1. [Step 2](#2-configure-envoy-to-mirror-traffic-to-the-wallarm-node)に記載されている手順に従い、更新されたプラグインを展開してください。

プラグインのアップグレードは、特にメジャーバージョンの更新の場合、Wallarmノードのアップグレードが必要になることがあります。リリースの更新やアップグレード手順については、[Wallarm Native Nodeの変更履歴](../../updating-migrating/native-node/node-artifact-versions.md)を参照してください。非推奨を回避し、将来のアップグレードを簡素化するために、定期的なノードの更新を推奨します。