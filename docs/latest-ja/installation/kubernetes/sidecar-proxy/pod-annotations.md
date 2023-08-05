# Wallarm Sidecar ProxyでサポートされるPodの注釈

[Wallarm Sidecarプロキシソリューション](deployment.md)は、Podごとのアノテーションを介して設定することができます。このソリューションでサポートされているアノテーションのリストは、この文書で説明しています。

!!! info "グローバル設定とPodごとの設定の優先順位"
    Podごとの注釈は、Helm chartの値よりも[優先されます](customization.md#configuration-area)。

## アノテーションリスト

| アノテーションと対応するチャート値                                                      | 説明                                                                                            |
|-----------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| **アノテーション:** `sidecar.wallarm.io/sidecar-injection-schema`<br><br>`config.injectionStrategy.schema` | [Wallarm containerのデプロイメントパターン](customization.md#single-and-split-deployment-of-containers): `single` (デフォルト)または`split`. |
| **アノテーション:** `sidecar.wallarm.io/sidecar-injection-iptables-enable`<br><br>`config.injectionStrategy.iptablesEnable` | [`iptables` initコンテナの起動の有無](customization.md#incoming-traffic-interception-port-forwarding): `true` (デフォルト)または`false`. |
| **アノテーション:** `sidecar.wallarm.io/wallarm-application`<br><br>チャート値なし               | [Wallarm application ID][applications-docs]. |
| **アノテーション:** `sidecar.wallarm.io/wallarm-block-page`<br><br>チャート値なし               | ブロックされたリクエストに返す[ブロックページとエラーコード][custom-blocking-page-docs]. |
| **アノテーション:** `sidecar.wallarm.io/wallarm-enable-libdetection`<br><br>`config.wallarm.enableLibDetection` | [libdetection][libdetection-docs]ライブラリを使用してSQLインジェクション攻撃の追加検証をするかどうか: `on` (デフォルト)または`off`. |
| **アノテーション:** `sidecar.wallarm.io/wallarm-fallback`<br><br>`config.wallarm.fallback`                                           | [Wallarmのフォールバックモード][fallback-mode-docs]: `on` (デフォルト)または`off`. |
| **アノテーション:** `sidecar.wallarm.io/wallarm-mode`<br><br>`config.wallarm.mode`                                               | [トラフィックフィルタリングモード][wallarm-modes-docs]: `monitoring` (デフォルト)、`safe_blocking`、`block`、または`off`. |
| **アノテーション:** `sidecar.wallarm.io/wallarm-mode-allow-override`<br><br>`config.wallarm.modeAllowOverride`                                 | クラウドの設定による`wallarm_mode`値の上書きを管理します[フィルタリングモードの優先度][filtration-mode-priorities-docs]: `on` (default), `off` または`strict`. |
| **アノテーション:** `sidecar.wallarm.io/wallarm-parser-disable`<br><br>チャート値なし                                                                 | [パーサー][parsers-docs]を無効にすることを許可します。このディレクティブの値は、無効にするパーサーの名前に対応します。例: `json`. 複数のパーサーを指定することができ、セミコロンで区切ります。例: `json;base64`. |
| **アノテーション:** `sidecar.wallarm.io/wallarm-parse-response`<br><br>`config.wallarm.parseResponse`                                         | アプリケーションのレスポンスを攻撃のために分析するかどうか: `on` (デフォルト)または`off`. レスポンスの分析は、[パッシブ検出][passive-detection-docs]と[能動的な脅威の検証][active-threat-verification-docs]時に脆弱性の検出に必要です。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-parse-websocket`<br><br>`config.wallarm.parseWebsocket`                                        | Wallarm は、完全な WebSockets をサポートしています。デフォルトでは、WebSockets のメッセージは攻撃のために分析されません。この機能を強制するには、API セキュリティ[サブスクリプションプラン][subscriptions-docs]を有効にし、このアノテーションを使用します: `on` または`off` (デフォルト). |
| **アノテーション:** `sidecar.wallarm.io/wallarm-unpack-response`<br><br>`config.wallarm.unpackResponse`                                        | アプリケーションのレスポンスで返された圧縮データを解凍するかどうか: `on` (デフォルト)または`off`. |
| **アノテーション:** `sidecar.wallarm.io/wallarm-upstream-connect-attempts`<br><br>`config.wallarm.upstream.connectAttempts`                                 | TarantoolまたはWallarm APIに再び接続する試行の回数を定義します。 |
| **アノテーション:** `sidecar.wallarm.io/wallarm-upstream-reconnect-interval`<br><br>`config.wallarm.upstream.reconnectInterval`                       | 即時再接続の数のしきい値を超えた後、TarantoolまたはWallarm APIに再接続する試行の間隔を定義します。 |
| **アノテーション:** `sidecar.wallarm.io/application-port`<br><br>`config.nginx.applicationPort`                                         | [公開されたアプリケーションのポッドポートが見つからなかった場合](customization.md#application-container-port-auto-discovery)、このポートに来るリクエストを待つためのWallarmコンテナ。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-listen-port`<br><br>`config.nginx.listenPort`                                              | Wallarmコンテナがリッスンするポート。このポートはWallarmサイドカーソリューションで使用されるため、`application-port`と同じにはできません。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-http-include`<br><br>チャート値なし                                                               | NGINXの設定の`http`レベルに[カスタムNGINX設定を使用する](customization.md#using-custom-nginx-configuration)ためにインクルードするべきNGINX設定ファイルへのパスの配列。このファイルはコンテナにマウントする必要があり、このパスはコンテナ内のファイルを指す必要があります。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-http-snippet`<br><br>チャート値なし                                                             | NGINXの設定の`http`レベルにインクルードすべき[追加のインライン設定](customization.md#using-custom-nginx-configuration). |
| **アノテーション:** `sidecar.wallarm.io/nginx-server-include`<br><br>チャート値なし                                                             | NGINXの設定の`server`レベルに[カスタムNGINX設定を使用する](customization.md#using-custom-nginx-configuration)ためにインクルードするべきNGINX設定ファイルへのパスの配列。このファイルはコンテナにマウントする必要があり、このパスはコンテナ内のファイルを指す必要があります。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-server-snippet`<br><br>チャート値なし                                                           | NGINXの設定の`server`レベルにインクルードすべき[追加のインライン設定](customization.md#using-custom-nginx-configuration). |
| **アノテーション:** `sidecar.wallarm.io/nginx-location-include`<br><br>チャート値なし                                                             | NGINXの設定の`location`レベルに[カスタムNGINX設定を使用する](customization.md#using-custom-nginx-configuration)ためにインクルードするべきNGINX設定ファイルへのパスの配列。このファイルはコンテナにマウントする必要があり、このパスはコンテナ内のファイルを指す必要があります。 |
| **アノテーション:** `sidecar.wallarm.io/nginx-location-snippet`<br><br>チャート値なし                                                           | NGINXの設定の`location`レベルにインクルードすべき[追加のインライン設定](customization.md#using-custom-nginx-configuration). |
| **アノテーション:** `sidecar.wallarm.io/nginx-extra-modules`<br><br>チャート値なし                                                             | 有効化すべき[追加のNGINXモジュール](customization.md#enabling-additional-nginx-modules)の配列。 |
| **アノテーション:** `sidecar.wallarm.io/proxy-extra-volumes`<br><br>チャート値なし                                                             | Podに追加すべき[カスタムボリューム](customization.md#include) (配列). |
| **アノテーション:** `sidecar.wallarm.io/proxy-extra-volume-mounts`<br><br>チャート値なし                                                         | `sidecar-proxy`コンテナに追加すべき[カスタムボリュームマウント](customization.md#include) (JSONオブジェクト). |
| **アノテーション:** `sidecar.wallarm.io/proxy-cpu`<br><br>`config.sidecar.containers.proxy.resources.requests.cpu`                 | `sidecar-proxy`コンテナのための[要求されたCPU](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/proxy-memory`<br><br>`config.sidecar.containers.proxy.resources.requests.memory`              | `sidecar-proxy`コンテナのための[要求されたメモリ](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/proxy-cpu-limit`<br><br>`config.sidecar.containers.proxy.resources.limits.cpu`               | `sidecar-proxy`コンテナのための[CPUの上限](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/proxy-memory-limit`<br><br>`config.sidecar.containers.proxy.resources.limits.memory`            | `sidecar-proxy`コンテナのための[メモリの上限](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/helper-cpu`<br><br>`config.sidecar.containers.helper.resources.requests.cpu`                | `sidecar-helper`コンテナのための[要求されたCPU](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/helper-memory`<br><br>`config.sidecar.containers.helper.resources.requests.memory`             | `sidecar-helper`コンテナのための[要求されたメモリ](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/helper-cpu-limit`<br><br>`config.sidecar.containers.helper.resources.limits.cpu`              | `sidecar-helper`コンテナのための[CPUの上限](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/helper-memory-limit`<br><br>`config.sidecar.containers.helper.resources.limits.memory`           | `sidecar-helper`コンテナのための[メモリの上限](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/init-iptables-cpu`<br><br>`config.sidecar.initContainers.iptables.resources.requests.cpu`      | `sidecar-init-iptables`コンテナのための[要求されたCPU](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/init-iptables-memory`<br><br>`config.sidecar.initContainers.iptables.resources.requests.memory`   | `sidecar-init-iptables`コンテナのための[要求されたメモリ](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/init-iptables-cpu-limit`<br><br>`config.sidecar.initContainers.iptables.resources.limits.cpu`    | `sidecar-init-iptables`コンテナのための[CPUの上限](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/init-iptables-memory-limit`<br><br>`config.sidecar.initContainers.iptables.resources.limits.memory` | `sidecar-init-iptables`コンテナのための[メモリの上限](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/init-helper-cpu`<br><br>`config.sidecar.initContainers.helper.resources.requests.cpu`        | `sidecar-init-helper`コンテナのための[要求されたCPU](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/init-helper-memory`<br><br>`config.sidecar.initContainers.helper.resources.requests.memory`     | `sidecar-init-helper`コンテナのための[要求されたメモリ](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/init-helper-cpu-limit`<br><br>`config.sidecar.initContainers.helper.resources.limits.cpu`      | `sidecar-init-helper`コンテナのための[CPUの上限](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/init-helper-memory-limit`<br><br>`config.sidecar.initContainers.helper.resources.limits.memory`   | `sidecar-init-helper`コンテナのための[メモリの上限](customization.md#per-pod-basis-allocation-via-pods-annotations). |
| **アノテーション:** `sidecar.wallarm.io/profile`<br><br>チャート値なし | このアノテーションは、[TLS/SSLの終了](customization.md#ssltls-termination)のための特定のTLSプロフィールをアプリケーションPodに割り当てるために使用されます。<br><br>このアノテーションとTLS/SSLの終了は、Helmチャート4.6.1からサポートされています。 |

Wallarmがサポートしている[NGINXディレクティブ][nginx-directives-docs]には、直接的な注釈でカバーされていないものもあります。しかし、[`nginx-*-snippet`と`nginx-*-include`の注釈](customization.md#using-custom-nginx-configuration)を使用して、それらも設定することができます。

## アノテーションの使用方法

Podに注釈を適用するには、適切なアプリケーション設定の`Deployment`オブジェクトの設定でそれを指定します。たとえば:

```bash
kubectl edit deployment -n <KUBERNETES_NAMESPACE> <APP_LABEL_VALUE>
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