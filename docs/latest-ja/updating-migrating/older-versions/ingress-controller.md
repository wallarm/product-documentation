[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# 統合Wallarmモジュール付きのEOL NGINX Ingress Controllerのアップグレード

これらの手順は、展開済みのサポート終了となったWallarm Ingress Controller（バージョン3.6以下）をWallarm node 5.0搭載の新バージョンへアップグレードするための手順を説明します。

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! warning "アップグレード後のCommunity Ingress NGINX Controller"
    nodeをバージョン3.4以下からアップグレードする場合、Wallarm Ingress Controllerの基盤となるCommunity Ingress NGINX Controllerのバージョンが0.26.2から1.11.3にアップグレードされたことにご留意ください。
    
    Community Ingress NGINX Controller 1.11.3の動作が大幅に変更されているため、Wallarm Ingress Controllerアップグレード時にその構成をこれらの変更に合わせて調整する必要があります。

    これらの手順には、変更が必要になりそうなCommunity Ingress NGINX Controllerの設定項目の一覧が含まれています。とはいえ、[Community Ingress NGINX Controllerリリースノート](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md)を基に、構成移行の個別計画を策定してください。

## 要件

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## ステップ 1: Wallarmテクニカルサポートへ、フィルタリングnodeモジュールのアップグレードを実施する旨を通知する（node 2.18以下の場合のみ）

node 2.18以下からアップグレードする場合、[Wallarmテクニカルサポート](mailto:support@wallarm.com)へ、フィルタリングnodeモジュールを5.0まで更新していることを通知し、Wallarmアカウントに対して新しいIPリストロジックを有効にするよう依頼してください。

新しいIPリストロジックが有効化されると、Wallarm Consoleを開き、セクション[**IP lists**](../../user-guides/ip-lists/overview.md)が利用可能になっていることを確認してください。

## ステップ 2: Threat Replay Testingモジュールを無効化する（node 2.16以下の場合のみ）

Wallarm node 2.16以下からアップグレードする場合、Wallarm Console → **Vulnerabilities** → **Configure**で[Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)モジュールを無効化してください。

アップグレードプロセス中にモジュールが動作すると[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)が発生する可能性があるため、モジュールを無効化することでこのリスクを最小限に抑えます。

## ステップ 3: APIポートの更新

--8<-- "../include/waf/upgrade/api-port-443.md"

## ステップ 4: Wallarm Helmチャートリポジトリの更新

=== "Helmリポジトリを使用している場合"
    ```bash
    helm repo update wallarm
    ```
=== "クローン済みGitHubリポジトリを使用している場合"
    下記のコマンドを使用して、すべてのチャートバージョンを含む[Wallarm Helm repository](https://charts.wallarm.com/)を追加してください。今後のWallarm Ingress Controllerの操作にはHelmリポジトリをご利用ください。

    ```bash
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

## ステップ 5: `values.yaml`構成の更新

Wallarm Ingress Controller 5.0へ移行するため、`values.yaml`ファイルに指定された以下の構成を更新してください。

* Community Ingress NGINX Controllerの標準構成
* Wallarmモジュール構成

### Community Ingress NGINX Controllerの標準構成

1. [Community Ingress NGINX Controllerのリリースノート](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md)（バージョン0.27.0以上）を確認し、`values.yaml`ファイル内で変更すべき設定を定義します。
2. `values.yaml`ファイル内で定義された設定を更新します。

以下の設定変更が必要と考えられます:

* リクエストがWallarm Ingress Controllerに送信される前にロードバランサを通過している場合、[エンドユーザーのパブリックIPアドレスの適切な報告](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

    ```diff
    controller:
      config:
    -    use-forwarded-headers: "true"
    +    enable-real-ip: "true"
    +    forwarded-for-header: "X-Forwarded-For"
    ```
* [IngressClassesの構成](https://kubernetes.github.io/ingress-nginx/user-guide/multiple-ingress/)。新しいIngress Controllerでは使用するKubernetes APIのバージョンがアップグレードされ、IngressClassesは`.controller.ingressClass`、`.controller.ingressClassResource`、および`.controller.watchIngressWithoutClass`パラメータを介して構成する必要があります。

    ```diff
    controller:
    +  ingressClass: waf-ingress
    +  ingressClassResource:
    +    name: waf-ingress
    +    default: true
    +  watchIngressWithoutClass: true
    ```
* [ConfigMap（`.controller.config`）パラメータセット](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/)例:

    ```diff
    controller:
    config:
    +  allow-backend-server-header: "false"
      enable-brotli: "true"
      gzip-level: "3"
      hide-headers: Server
      server-snippet: |
        proxy_request_buffering on;
        wallarm_enable_libdetection on;
    ```
* 「admission webhook」による[Ingress構文の検証](https://kubernetes.github.io/ingress-nginx/how-it-works/#avoiding-outage-from-wrong-configuration)がデフォルトで有効化されます。

    ```diff
    controller:
    +  admissionWebhooks:
    +    enabled: true
    ```

    !!! warning "Ingress構文検証の無効化について"
        Ingressオブジェクトの動作が不安定になる場合を除き、Ingress構文検証は無効化しないことを推奨します。
* [ラベル](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)の形式。もし`values.yaml`ファイルがPodアフィニティルールを設定している場合、これらのルール内のラベル形式を変更してください。例:

    ```diff
    controller:
      affinity:
        podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
        - podAffinityTerm:
            labelSelector:
                matchExpressions:
    -            - key: app
    +            - key: app.kubernetes.io/name
                operator: In
                values:
                - waf-ingress
    -            - key: component
    +            - key: app.kubernetes.io/component
                operator: In
                values:
    -              - waf-ingress
    +              - controller
    -            - key: release
    +            - key: app.kubernetes.io/instance
                operator: In
                values:
                - waf-ingress-ingress
            topologyKey: kubernetes.io/hostname
            weight: 100
    ```

### Wallarmモジュール構成

`values.yaml`ファイルに設定されたWallarmモジュール構成を以下のように変更してください:

* バージョン2.18以下からアップグレードする場合、IPリスト構成を[移行](../migrate-ip-lists-to-node-3.md)してください。`values.yaml`から削除が必要なパラメータは以下の通りです:

    ```diff
    controller:
      wallarm:
        enabled: true
        - acl:
        -  enabled: true
        resources: {}
    ```

    Wallarm node 3.xでIPリストのコアロジックが大幅に変更されたため、IPリスト構成を適切に調整する必要があります。
* **Deploy**ロール用の[APIトークンを生成](../../user-guides/settings/api-tokens.md)し、その値を`controller.wallarm.token`パラメータに渡してください。
* 以下に記載された設定の期待される動作が、[`off`および`monitoring`フィルトレーションモード](what-is-new.md#filtration-modes)の変更されたロジックに対応していることを確認してください:
      
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Consoleで構成された一般フィルトレーションルール](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)
      * [Wallarm Consoleで構成されたエンドポイント対象フィルトレーションルール](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)

      期待される動作と変更後のフィルトレーションモードロジックが一致しない場合は、[Ingress annotations](../../admin-en/configure-kubernetes-en.md#ingress-annotations)や[その他の設定](../../admin-en/configure-wallarm-mode.md)を変更後の内容に合わせて調整してください。
* 明示的に設定された[モニタリングサービス構成](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)を削除してください。新しいWallarm Ingress Controllerバージョンでは、モニタリングサービスはデフォルトで有効化され、追加の構成は不要です。

    ```diff
    controller:
    wallarm:
      enabled: true
      tarantool:
        resources: {}
    -  metrics:
    -    enabled: true
    -    service:
    -      annotations: {}
    ```
* ConfigMap経由で設定された`&/usr/share/nginx/html/wallarm_blocked.html`ページがブロックされたリクエストに返される場合、[構成を調整](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)して変更内容に合わせてください。

    新しいnodeバージョンでは、Wallarmサンプルブロッキングページはロゴがなく、デフォルトで指定されたサポートメールもない更新されたUIになっています。
* もし[`wallarm_process_time_limit`][nginx-process-time-limit-docs]および[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINXディレクティブを使用して`overlimit_res`攻撃検出をカスタマイズしている場合は、これらの設定をルールへ[移行](#step-6-transfer-the-overlimit_res-attack-detection-configuration-from-directives-to-the-rule)し、`values.yaml`ファイルから削除してください。

## ステップ 6: directivesからルールへの`overlimit_res`攻撃検出構成の移行

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-ingress-controller.md"

## ステップ 7: 今後のK8sマニフェスト変更内容を確認する

予期せぬIngress Controllerの動作変更を避けるために、[Helm Diff Plugin](https://github.com/databus23/helm-diff)を使用して、展開済みIngress Controllerバージョンと新バージョンのK8sマニフェスト間の違いを確認してください。

プラグインのインストールおよび実行手順は以下の通りです:

1. プラグインのインストール:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインの実行:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress ControllerチャートのHelmリリース名
    * `<NAMESPACE>`: Ingress Controllerが展開されているnamespace
    * `<PATH_TO_VALUES>`: [Ingress Controller 5.0設定](#step-5-update-the-valuesyaml-configuration)を定義している`values.yaml`ファイルへのパス
3. 変更が実行中のサービスの安定性に影響を与えないことを確認し、stdoutからのエラー内容を十分に検証してください。

    stdoutが空の場合、`values.yaml`ファイルが有効であることを確認してください。

以下の構成変更にご留意ください:

* DeploymentやStatefulSetのselectorなどのイミュータブルフィールド
* Podラベル。変更によりNetworkPolicyの動作が停止する可能性があります。例:

    ```diff
    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    spec:
      egress:
      - to:
        - namespaceSelector:
            matchExpressions:
            - key: name
              operator: In
              values:
              - kube-system # ${NAMESPACE}
          podSelector:
            matchLabels: # RELEASE_NAME=waf-ingress
    -         app: waf-ingress
    +         app.kubernetes.io/component: "controller"
    +         app.kubernetes.io/instance: "waf-ingress"
    +         app.kubernetes.io/name: "waf-ingress"
    -         component: waf-ingress
    ```
* 新しいラベルを適用したPrometheusの構成例。例:

    ```diff
     - job_name: 'kubernetes-ingress'
       kubernetes_sd_configs:
       - role: pod
         namespaces:
           names:
             - kube-system # ${NAMESPACE}
       relabel_configs: # RELEASE_NAME=waf-ingress
         # セレクタ
    -    - source_labels: [__meta_kubernetes_pod_label_app]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_name]
           action: keep
           regex: waf-ingress
    -    - source_labels: [__meta_kubernetes_pod_label_release]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_instance]
           action: keep
           regex: waf-ingress
    -    - source_labels: [__meta_kubernetes_pod_label_component]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_component]
           action: keep
    -      regex: waf-ingress
    +      regex: controller
         - source_labels: [__meta_kubernetes_pod_container_port_number]
           action: keep
           regex: "10254|18080"
           # リプレイス処理
         - action: replace
           target_label: __metrics_path__
           regex: /metrics
         - action: labelmap
           regex: __meta_kubernetes_pod_label_(.+)
         - source_labels: [__meta_kubernetes_namespace]
           action: replace
           target_label: kubernetes_namespace
         - source_labels: [__meta_kubernetes_pod_name]
           action: replace
           target_label: kubernetes_pod_name
         - source_labels: [__meta_kubernetes_pod_name]
           regex: (.*)
           action: replace
           target_label: instance
           replacement: "$1"
    ```
* その他すべての変更内容についても検証してください。

## ステップ 8: Ingress Controllerのアップグレード

アップグレード方法は3通り用意されています。環境にロードバランサが展開されているかどうかに応じて、以下のアップグレード手法から選択してください:

* 一時的なIngress Controllerの展開
* 通常のIngress Controllerリリースの再作成
* ロードバランサに影響を与えないIngress Controllerリリースの再作成

!!! warning "staging environmentまたはminikubeを使用している場合"
    Wallarm Ingress Controllerがstaging environmentに展開されている場合、まずこちらでアップグレードを実施することを推奨します。すべてのサービスが正常に動作していることを確認後、本番環境でアップグレード手順を進めてください。

    minikube等の他のサービスを用いて、更新された構成で[Wallarm Ingress Controller 5.0をデプロイ](../../admin-en/installation-kubernetes-en.md)することも推奨されます。すべてのサービスが期待通りに動作していることを確認した後、本番環境でIngress Controllerのアップグレードを実施してください。

    この手法は本番環境でのサービスのダウンタイムを回避するのに役立ちます。

### 方法 1: 一時的なIngress Controllerの展開

この方法を使用すると、環境内にIngress Controller 5.0を追加のエンティティとして展開し、徐々にトラフィックを切り替えていくことが可能です。これにより、一時的なサービス停止を回避し、安全な移行が実現できます。

1. 以前のバージョンの`values.yaml`ファイルからIngressClassの構成を、Ingress Controller 5.0用の`values.yaml`ファイルへコピーしてください。

    この構成により、Ingress ControllerはIngressオブジェクトを認識しますが、そのトラフィックを処理しません。
2. Ingress Controller 5.0を展開します:

    ```bash
    helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress ControllerチャートのHelmリリース名
    * `<NAMESPACE>`: Ingress Controllerを展開するnamespace
    * `<PATH_TO_VALUES>`: [Ingress Controller 5.0設定](#step-5-update-the-valuesyaml-configuration)を定義している`values.yaml`ファイルへのパス
3. すべてのサービスが正常に動作していることを確認してください。
4. 新しいIngress Controllerへ徐々にトラフィックを切り替えてください。

### 方法 2: 通常のIngress Controllerリリースの再作成

**ロードバランサとIngress Controllerが同一Helmチャートで記述されていない場合**は、単にHelmリリースを再作成できます。この処理には数分かかり、その間Ingress Controllerは利用できなくなります。

!!! warning "Helmチャートでロードバランサの構成も設定されている場合"
    もしHelmチャートでIngress Controllerと合わせてロードバランサの構成が設定されている場合、リリースの再作成は長時間にわたるロードバランサのダウンタイムを引き起こす可能性があります（クラウドプロバイダーによります）。一定のIPアドレスが割り当てられていない場合、アップグレード後にロードバランサのIPアドレスが変更される可能性があります。

    この手法を使用する場合は、あらゆるリスクを十分に検証してください。

Ingress Controllerリリースを再作成するには:

=== "Helm CLI"
    1. 以前のリリースを削除します:

        ```bash
        helm delete <RELEASE_NAME> -n <NAMESPACE>
        ```

        * `<RELEASE_NAME>`: Ingress ControllerチャートのHelmリリース名

        * `<NAMESPACE>`: Ingress Controllerが展開されているnamespace

        コマンド実行時に`--wait`オプションは使用しないでください。アップグレード時間が延びる可能性があります。

    2. Ingress Controller 5.0で新たにリリースを作成します:

        ```bash
        helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.0 -f <PATH_TO_VALUES>
        ```

        * `<RELEASE_NAME>`: Ingress ControllerチャートのHelmリリース名
        * `<NAMESPACE>`: Ingress Controllerを展開するnamespace
        * `<PATH_TO_VALUES>`: [Ingress Controller 5.0設定](#step-5-update-the-valuesyaml-configuration)を定義している`values.yaml`ファイルへのパス
=== "Terraform CLI"
    1. アップグレード時間の短縮のため、Terraform構成で`wait = false`オプションを設定します:
        
        ```diff
        resource "helm_release" "release" {
          ...

        + wait = false

          ...
        }
        ```
    
    2. 以前のリリースを削除します:

        ```bash
        terraform taint helm_release.release
        ```
    
    3. Ingress Controller 5.0で新たにリリースを作成します:

        ```bash
        terraform apply -target=helm_release.release
        ```

### 方法 3: ロードバランサに影響を与えないIngress Controllerリリースの再作成

クラウドプロバイダーが設定したロードバランサを使用している場合、この方法でアップグレードすることを推奨します。ロードバランサには影響せず、リリースの再作成には数分かかり、その間Ingress Controllerは利用できなくなります。

1. 削除対象のオブジェクト（ロードバランサを除く）を取得します:

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | yq -r '. | select(.spec.type != "LoadBalancer") | .kind + "/" + .metadata.name' | tr 'A-Z' 'a-z' > objects-to-remove.txt
    ```

    ユーティリティ`yq`のインストールについては[こちらの手順](https://pypi.org/project/yq/)を参照してください。

    削除対象のオブジェクトは`objects-to-remove.txt`ファイルに出力されます。
2. リストされたオブジェクトを削除し、リリースを再作成します:

    ```bash
    cat objects-to-remove.txt | xargs kubectl delete --wait=false -n <NAMESPACE>    && \
    helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.0 -f `<PATH_TO_VALUES>`
    ```

    サービスのダウンタイムを短縮するため、コマンドを個別に実行しないことを推奨します。
3. すべてのオブジェクトが作成されていることを確認します:

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | kubectl create -f -
    ```

    出力に「すべてのオブジェクトは既に存在します」と表示されるはずです。

コマンド内で使用されるパラメータは以下の通りです:

* `<RELEASE_NAME>`: Ingress ControllerチャートのHelmリリース名
* `<NAMESPACE>`: Ingress Controllerが展開されているnamespace
* `<PATH_TO_VALUES>`: [Ingress Controller 5.0設定](#step-5-update-the-valuesyaml-configuration)を定義している`values.yaml`ファイルへのパス

## ステップ 9: アップグレードしたIngress Controllerのテスト

1. Helmチャートのバージョンが更新されているか確認してください:

    ```bash
    helm ls
    ```

    チャートバージョンは`wallarm-ingress-5.3.0`である必要があります。
2. `<INGRESS_CONTROLLER_NAME>`にWallarm Ingress Controllerの名前を指定して、Podリストを取得してください:
    
    ``` bash
    kubectl get pods -l release=<INGRESS_CONTROLLER_NAME>
    ```

    各Podのステータスは**STATUS: Running**または**READY: N/N**である必要があります。例:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

3. テスト用の[Path Traversal](../../attacks-vulns-list.md#path-traversal)攻撃をWallarm Ingress Controllerのアドレスに対して送信してください:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    フィルタリングnodeが`block`モードで動作している場合、リクエストに対して`403 Forbidden`コードが返され、攻撃がWallarm Console → **Attacks**に表示されます。

## ステップ 10: リリースされた変更内容に応じてIngress annotationsを調整する

以下のIngress annotationsをIngress Controller 5.0でリリースされた変更に合わせて調整してください:

1. バージョン2.18以下からアップグレードする場合、IPリスト構成を[移行](../migrate-ip-lists-to-node-3.md)してください。Wallarm node 3.xではIPリストのコアロジックが大幅に変更されたため、適用済みの場合はIngress annotationsを変更してIPリスト構成を適切に調整する必要があります。
1. 以下に記載の設定の期待動作が、[`off`および`monitoring`フィルトレーションモード](what-is-new.md#filtration-modes)の変更後のロジックと一致していることを確認してください:
      
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Consoleで構成された一般フィルトレーションルール](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)
      * [Wallarm Consoleで構成されたエンドポイント対象フィルトレーションルール](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)

      期待動作と一致しない場合は、[Ingress annotations](../../admin-en/configure-kubernetes-en.md#ingress-annotations)をリリースされた変更に合わせて調整してください。
1. Ingressに`nginx.ingress.kubernetes.io/wallarm-instance`がアノテートされている場合、このアノテーションの名前を`nginx.ingress.kubernetes.io/wallarm-application`に変更してください。

    アノテーションの名前のみが変更され、ロジックは同じです。旧名称のアノテーションはまもなく廃止されるため、早めに名称を変更することを推奨します。
1. Ingress annotationsで設定された`&/usr/share/nginx/html/wallarm_blocked.html`ページがブロックされたリクエストに返される場合、[構成を調整](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)してリリース内容に合わせてください。

    新しいnodeバージョンでは、Wallarmブロッキングページはロゴがなく、デフォルトで指定されたサポートメールもない更新されたUIになっています。

## ステップ 11: Threat Replay Testingモジュールを再有効化する（node 2.16以下の場合のみ）

[Threat Replay Testingモジュールの設定についての推奨事項](../../vulnerability-detection/threat-replay-testing/setup.md)を確認し、必要に応じて再度有効化してください。

しばらくして、モジュールの動作に誤検知が発生しないことを確認してください。もし誤検知が発生した場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)までご連絡ください。