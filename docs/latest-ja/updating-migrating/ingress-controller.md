[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[ip-list-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../api-specification-enforcement/overview.md

# 統合Wallarmモジュール付きNGINX Ingress controllerのアップグレード

本手順では、デプロイ済みのWallarm NGINXベースのIngress Controllerを最新の6.xにアップグレードする手順を説明します。

サポート終了ノード(3.6以下)をアップグレードする場合は、[別の手順](older-versions/ingress-controller.md)を使用してください。

!!! warning
    The Kubernetes community will [retire the Community Ingress NGINX in March 2026](https://blog.nginx.org/blog/the-ingress-nginx-alternative-open-source-nginx-ingress-controller-for-the-long-term). The Wallarm NGINX Ingress Controller based on this project will be supported through the same date. You can continue using it until then, and it will remain fully functional during the support window.

    Wallarm will provide alternative deployment options and migration guidance as they become available. [Details](../updating-migrating/nginx-ingress-retirement.md)

    An [Envoy/Istio-based connector](../installation/connectors/istio.md) is also available today for environments already using Envoy.

## 要件

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## 手順1：Wallarm Helmチャートリポジトリを更新します

```bash
helm repo update wallarm
```

## 手順2：今後のK8sマニフェストの変更点を確認します

Ingress controllerの動作が予期せず変わることを避けるため、[Helm Diff Plugin](https://github.com/databus23/helm-diff)を使用して、適用予定のK8sマニフェストの変更をすべて確認します。このプラグインは、稼働中のIngress controllerバージョンと新バージョンのK8sマニフェストの差分を出力します。

プラグインをインストールして実行するには：

1. プラグインをインストールします：

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインを実行します：

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 6.4.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress controllerチャートを含むHelmリリース名です。
    * `<NAMESPACE>`: Ingress controllerがデプロイされているNamespaceです。
    * `<PATH_TO_VALUES>`: Ingress Controller 6.xの設定を含む`values.yaml`ファイルへのパスです。以前のバージョンのファイルを流用し、[Tarantoolからwstoreへの移行](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)に合わせて更新できます。

        Helmの値名が変更されました：`controller.wallarm.tarantool` → `controller.wallarm.postanalytics`。postanalyticsメモリを明示的に[割り当てている](../admin-en/configuration-guides/allocate-resources-for-node.md)場合は、`values.yaml`にこの変更を適用してください。

3. 稼働中のサービスの安定性に影響する変更がないことを確認し、stdoutに出力されたエラーを注意深く確認します。

    stdoutが空の場合は、`values.yaml`ファイルが正しいことを確認します。

## 手順3：Ingress controllerをアップグレードします

!!! info ""
    本番環境へデプロイする前に、ステージングのKubernetes環境でNGINX Ingress Controllerを先にアップグレードし、変更内容を検証することを推奨します。

デプロイ済みのNGINX Ingress controllerをアップグレードします：

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 6.4.0 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: Ingress controllerチャートを含むHelmリリース名です。
* `<NAMESPACE>`: Ingress controllerがデプロイされているNamespaceです。
* `<PATH_TO_VALUES>`: Ingress Controller 6.xの設定を含む`values.yaml`ファイルへのパスです。以前のバージョンのファイルを流用し、[Tarantoolからwstoreへの移行](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)に合わせて更新できます。
    
    Helmの値名が変更されました：`controller.wallarm.tarantool` → `controller.wallarm.postanalytics`。postanalyticsメモリを明示的に[割り当てている](../admin-en/configuration-guides/allocate-resources-for-node.md)場合は、`values.yaml`にこの変更を適用してください。

## 手順4：アップグレードしたIngress controllerをテストします

1. Helmチャートのバージョンがアップグレードされたことを確認します：

    ```bash
    helm list -n <NAMESPACE>
    ```

    ここで、`<NAMESPACE>`はIngress controllerを含むHelmチャートがデプロイされているNamespaceです。

    チャートのバージョンは`wallarm-ingress-6.4.0`である必要があります。
1. WallarmのPodを取得します：
    
    ``` bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    Podのステータスは**STATUS: Running**かつ**READY: N/N**である必要があります：

    ```
    NAME                                                                  READY   STATUS    RESTARTS   AGE
    ingress-controller-wallarm-ingress-controller-6d659bd79b-952gl        3/3     Running   0          8m7s
    ingress-controller-wallarm-ingress-controller-wallarm-wstore-7ddmgbfm 3/3     Running   0          8m7s
    ```

    バージョン5.x以下からアップグレードする場合、Tarantoolの個別Podがなくなり、wstoreはメインの`<CHART_NAME>-wallarm-ingress-controller-xxx`Pod内で動作することに気付くはずです。
1. テスト用の[パストラバーサル](../attacks-vulns-list.md#path-traversal)攻撃をWallarm Ingress controllerのアドレスに送信します：

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    新しいバージョンのソリューションが、前のバージョンと同様に不正リクエストを処理することを確認します。

ステージング環境でアップグレードが正常に検証できたら、本番環境のアップグレードに進みます。