# Wallarm SidecarがサポートするPodのアノテーション

[Wallarm Sidecarソリューション](deployment.md)は、Pod単位のアノテーションによって設定できます。本ドキュメントでは、本ソリューションでサポートされるアノテーションの一覧を説明します。

!!! info "グローバル設定とPod単位設定の優先順位"
    Pod単位のアノテーションは、Helmチャートの値よりも[優先されます](customization.md#configuration-area)。

## アノテーション一覧

| アノテーションと対応するチャート値                          | 説明                                                      | 
|-------------------------------------|------------------------------------------------------------------|
| **アノテーション:** `sidecar.wallarm.io/sidecar-injection-schema`<br><br>`config.injectionStrategy.schema` | [Wallarmコンテナのデプロイパターン](customization.md#single-and-split-deployment-of-containers): `single`（デフォルト）または`split`。 |
| **アノテーション:** `sidecar.wallarm.io/sidecar-injection-iptables-enable`<br><br>`config.injectionStrategy.iptablesEnable` | [`iptables`のinitコンテナを起動するかどうか](customization.md#capturing-incoming-traffic-port-forwarding): `true`（デフォルト）または`false`。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-application`<br><br>対応するチャート値なし      | [WallarmアプリケーションID][applications-docs]。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-block-page`<br><br>対応するチャート値なし | ブロックされたリクエストに返す[ブロッキングページとエラーコード][custom-blocking-page-docs]。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-enable-libdetection`<br><br>`config.wallarm.enableLibDetection`                         | libdetectionライブラリを使用してSQLインジェクション攻撃を追加検証するかどうか: `on`（デフォルト）または`off`。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-fallback`<br><br>`config.wallarm.fallback`                                          | [Wallarmのフォールバックモード][fallback-mode-docs]: `on`（デフォルト）または`off`。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-mode`<br><br>`config.wallarm.mode`                                              | [トラフィックフィルタリングモード][wallarm-modes-docs]: `monitoring`（デフォルト）、`safe_blocking`、`block`、または`off`。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-mode-allow-override`<br><br>`config.wallarm.modeAllowOverride`                                 | Cloudの設定で`wallarm_mode`の値を上書きできる[可否を管理します][filtration-mode-priorities-docs]: `on`（デフォルト）、`off`、または`strict`。 |
| <a name="wallarm-node-group"></a>**アノテーション:** `sidecar.wallarm.io/wallarm-node-group`<br><br>`config.wallarm.api.nodeGroup`                                 | 新しくデプロイするノードを追加したいフィルタリングノードグループの名前を指定します。この方法でのノードのグルーピングは、使用タイプが**Node deployment/Deployment**のAPIトークンを使用してCloudにノードを作成・接続する場合にのみ利用できます（値は`config.wallarm.api.token`パラメーターに渡します）。<br>この値はpostanalyticsポッドには適用されません。postanalytics用のノードは常に、`config.wallarm.api.nodeGroup`のHelmチャート値で指定されたノードグループにリンクされます。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-parser-disable`<br><br>対応するチャート値なし                                                               | [パーサー][parsers-docs]の無効化を許可します。ディレクティブの値は無効化するパーサー名に対応します（例: `json`）。複数のパーサーを指定する場合はセミコロン区切りにします（例: `json;base64`）。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-parse-response`<br><br>`config.wallarm.parseResponse`                                     | アプリケーションのレスポンスを攻撃解析するかどうか: `on`（デフォルト）または`off`。[パッシブ検出][passive-detection-docs]や[脅威リプレイテスト][active-threat-verification-docs]による脆弱性検出にレスポンス解析が必要です。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-acl-export-enable`<br><br>`config.wallarm.aclExportEnable`                                     | ノードからCloudへ、[denylistに登録された][denylist-docs]IPからのリクエストに関する統計情報の送信を`on`で有効化／`off`で無効化します。<ul><li>`"on"`（デフォルト）の場合、denylistに登録されたIPからのリクエストの統計は**Attacks**セクションに[表示されます][denylist-view-events-docs]。</li><li>`"off"`の場合、denylistに登録されたIPからのリクエストの統計は表示されません。</li></ul> |
| **アノテーション:** `sidecar.wallarm.io/wallarm-parse-websocket`<br><br>`config.wallarm.parseWebsocket`                                    | WallarmはWebSocketsを完全にサポートしています。デフォルトでは、WebSocketsのメッセージは攻撃解析されません。この機能を有効にするには、API Securityの[サブスクリプションプラン][subscriptions-docs]を有効化し、このアノテーションを使用します: `on`または`off`（デフォルト）。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-unpack-response`<br><br>`config.wallarm.unpackResponse`                                    | アプリケーションのレスポンスで返される圧縮データを展開するかどうか: `on`（デフォルト）または`off`。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-upstream-connect-attempts`<br><br>`config.wallarm.upstream.connectAttempts`                          | postanalyticsまたはWallarm APIへの即時再接続の試行回数を定義します。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-upstream-reconnect-interval`<br><br>`config.wallarm.upstream.reconnectInterval`                        | 即時再接続の試行回数のしきい値を超えた後に、postanalyticsまたはWallarm APIへ再接続を試みる間隔を定義します。 |
| **アノテーション:** `sidecar.wallarm.io/application-port`<br><br>`config.nginx.applicationPort`                                     | 公開されているアプリケーションPodのポートが[見つからない場合](customization.md#application-container-port-auto-discovery)、Wallarmコンテナはこのポート宛の受信リクエストを待ち受けます。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-listen-port`<br><br>`config.nginx.listenPort`                                          | Wallarmコンテナが待ち受けるポートです。このポートはWallarm Sidecarソリューションで使用するために予約されており、`application-port`と同じにはできません。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-http-include`<br><br>対応するチャート値なし                                                               | NGINX設定の`http`レベルに[インクルードすべき](customization.md#using-custom-nginx-configuration)NGINX設定ファイルへのパスの配列です。ファイルはコンテナにマウントされている必要があり、このパスはコンテナ内のそのファイルを指している必要があります。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-http-snippet`<br><br>対応するチャート値なし                                                               | NGINX設定の`http`レベルに含める[追加のインライン設定](customization.md#using-custom-nginx-configuration)です。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-server-include`<br><br>対応するチャート値なし                                                               | NGINX設定の`server`レベルに[インクルードすべき](customization.md#using-custom-nginx-configuration)NGINX設定ファイルへのパスの配列です。ファイルはコンテナにマウントされている必要があり、このパスはコンテナ内のそのファイルを指している必要があります。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-server-snippet`<br><br>対応するチャート値なし                                                               | NGINX設定の`server`レベルに含める[追加のインライン設定](customization.md#using-custom-nginx-configuration)です。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-location-include`<br><br>対応するチャート値なし                                                               | NGINX設定の`location`レベルに[インクルードすべき](customization.md#using-custom-nginx-configuration)NGINX設定ファイルへのパスの配列です。ファイルはコンテナにマウントされている必要があり、このパスはコンテナ内のそのファイルを指している必要があります。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-location-snippet`<br><br>対応するチャート値なし                                                               | NGINX設定の`location`レベルに含める[追加のインライン設定](customization.md#using-custom-nginx-configuration)です。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-extra-modules`<br><br>対応するチャート値なし                                                               | 有効化する[追加のNGINXモジュール](customization.md#enabling-additional-nginx-modules)の配列です。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-worker-connections`<br><br>`config.nginx.workerConnections`                                                   | NGINXワーカープロセスが開くことのできる[同時接続の最大数](http://nginx.org/en/docs/ngx_core_module.html#worker_connections)です。デフォルトではチャート値は`4096`に設定されています。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-worker-processes`<br><br>`config.nginx.workerProcesses`                                                   | [NGINXのワーカープロセス数](http://nginx.org/en/docs/ngx_core_module.html#worker_processes)です。デフォルトではチャート値は`auto`に設定され、ワーカー数はCPUコア数に設定されます。 |
| **アノテーション:** `sidecar.wallarm.io/proxy-extra-volumes`<br><br>対応するチャート値なし                                                               | Podに追加する[カスタムボリューム](customization.md#include)（配列）です。アノテーション値は単一引用符`''`で囲む必要があります。 |
| **アノテーション:** `sidecar.wallarm.io/proxy-extra-volume-mounts`<br><br>対応するチャート値なし                                                               | `sidecar-proxy`コンテナに追加する[カスタムボリュームマウント](customization.md#include)（JSONオブジェクト）です。アノテーション値は単一引用符`''`で囲む必要があります。 |
| **アノテーション:** `sidecar.wallarm.io/proxy-cpu`<br><br>`config.sidecar.containers.proxy.resources.requests.cpu`           | `sidecar-proxy`コンテナの[要求CPU](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/proxy-memory`<br><br>`config.sidecar.containers.proxy.resources.requests.memory`        | `sidecar-proxy`コンテナの[要求メモリ](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/proxy-cpu-limit`<br><br>`config.sidecar.containers.proxy.resources.limits.cpu`             | `sidecar-proxy`コンテナの[CPU制限](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/proxy-memory-limit`<br><br>`config.sidecar.containers.proxy.resources.limits.memory`          | `sidecar-proxy`コンテナの[メモリ制限](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/helper-cpu`<br><br>`config.sidecar.containers.helper.resources.requests.cpu`          | `sidecar-helper`コンテナの[要求CPU](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/helper-memory`<br><br>`config.sidecar.containers.helper.resources.requests.memory`       | `sidecar-helper`コンテナの[要求メモリ](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/helper-cpu-limit`<br><br>`config.sidecar.containers.helper.resources.limits.cpu`            | `sidecar-helper`コンテナの[CPU制限](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/helper-memory-limit`<br><br>`config.sidecar.containers.helper.resources.limits.memory`         | `sidecar-helper`コンテナの[メモリ制限](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/init-iptables-cpu`<br><br>`config.sidecar.initContainers.iptables.resources.requests.cpu`    | `sidecar-init-iptables`コンテナの[要求CPU](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/init-iptables-memory`<br><br>`config.sidecar.initContainers.iptables.resources.requests.memory` | `sidecar-init-iptables`コンテナの[要求メモリ](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/init-iptables-cpu-limit`<br><br>`config.sidecar.initContainers.iptables.resources.limits.cpu`      | `sidecar-init-iptables`コンテナの[CPU制限](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/init-iptables-memory-limit`<br><br>`config.sidecar.initContainers.iptables.resources.limits.memory`   | `sidecar-init-iptables`コンテナの[メモリ制限](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/init-helper-cpu`<br><br>`config.sidecar.initContainers.helper.resources.requests.cpu`      | `sidecar-init-helper`コンテナの[要求CPU](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/init-helper-memory`<br><br>`config.sidecar.initContainers.helper.resources.requests.memory`   | `sidecar-init-helper`コンテナの[要求メモリ](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/init-helper-cpu-limit`<br><br>`config.sidecar.initContainers.helper.resources.limits.cpu`        | `sidecar-init-helper`コンテナの[CPU制限](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/init-helper-memory-limit`<br><br>`config.sidecar.initContainers.helper.resources.limits.memory`     | `sidecar-init-helper`コンテナの[メモリ制限](customization.md#per-pod-settings)です。 |
| **アノテーション:** `sidecar.wallarm.io/profile`<br><br>対応するチャート値なし | [TLS/SSL終端](customization.md#ssltls-termination)のためにアプリケーションPodに特定のTLSプロファイルを割り当てるために使用します。<br><br>このアノテーションとTLS/SSL終端はHelmチャート4.6.1以降でサポートされます。 |

直接のアノテーションで網羅されていないものの、Wallarmがサポートする[NGINXディレクティブ][nginx-directives-docs]は他にもあります。とはいえ、[`nginx-*-snippet`および`nginx-*-include`アノテーション](customization.md#using-custom-nginx-configuration)を使用すれば、それらも設定できます。

## アノテーションの使用方法

Podにアノテーションを適用するには、対象アプリケーション設定の`Deployment`オブジェクトの設定に指定します。例:


```bash
kubectl edit deployment -n <APPLICATION_NAMESPACE> <APP_LABEL_VALUE>
```

```yaml hl_lines="17"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/wallarm-mode: block
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```