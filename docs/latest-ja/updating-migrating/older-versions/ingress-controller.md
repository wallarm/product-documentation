[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Wallarmモジュールを統合したEOLのNGINX Ingress controllerのアップグレード

本書では、サポート終了（EOL）のWallarm Ingress Controller（バージョン3.6以下）を、Wallarmノード6.xを搭載した新バージョンへアップグレードする手順を説明します。

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! warning "アップグレードされるCommunity Ingress NGINX Controllerのバージョン"
    ノードを3.4以下からアップグレードする場合、Wallarm Ingress controllerのベースとなるCommunity Ingress NGINX Controllerのバージョンが0.26.2から1.11.5に更新されている点にご注意ください。
    
    Community Ingress NGINX Controller 1.11.5では動作が大きく変更されているため、Wallarm Ingress controllerのアップグレード時に、これらの変更に合わせて構成を調整する必要があります。

    本書には、変更が必要となる可能性が高いCommunity Ingress NGINX Controllerの設定の一覧が含まれます。ただし、[Community Ingress NGINX Controllerのリリースノート](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md)に基づき、構成移行の個別計画を必ず策定してください。 

## 要件

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## 手順1: フィルタリングノードモジュールをアップグレードすることをWallarmテクニカルサポートに通知します（ノード2.18以下のアップグレード時のみ）

ノード2.18以下からアップグレードする場合、[Wallarmテクニカルサポート](mailto:support@wallarm.com)にフィルタリングノードモジュールを6.xまで更新する旨を連絡し、Wallarmアカウントに対して新しいIPリストロジックの有効化を依頼してください。

新しいIPリストロジックが有効化されたら、Wallarm Consoleを開き、[**IP lists**](../../user-guides/ip-lists/overview.md)セクションが利用可能であることを確認してください。

## 手順2: Threat Replay Testingモジュールを無効化します（ノード2.16以下のアップグレード時のみ）

Wallarmノード2.16以下からアップグレードする場合、Wallarm Console → **Vulnerabilities** → **Configure**で[Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)モジュールを無効化してください。

アップグレード中のモジュール動作により[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)が発生する可能性があります。モジュールを無効化することで、このリスクを最小限に抑えられます。

## 手順3: APIポートを更新する

--8<-- "../include/waf/upgrade/api-port-443.md"

## 手順4: Wallarm Helmチャートリポジトリを更新する

=== "Helmリポジトリを使用する場合"
    ```bash
    helm repo update wallarm
    ```
=== "クローンしたGitHubリポジトリを使用する場合"
    すべてのチャートバージョンを含む[Wallarm Helmリポジトリ](https://charts.wallarm.com/)を以下のコマンドで追加してください。以降のWallarm Ingress controllerの操作には、Helmリポジトリを使用してください。

    ```bash
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

## 手順5: `values.yaml`設定を更新する

Wallarm Ingress controller 6.xへ移行するには、`values.yaml`ファイルで指定している以下の構成を更新します。

* Community Ingress NGINX Controllerの標準構成
* Wallarmモジュールの構成

### Community Ingress NGINX Controllerの標準構成

1. [Community Ingress NGINX Controllerのリリースノート](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md)（0.27.0以上）を確認し、`values.yaml`で変更が必要な設定を特定します。
2. 特定した設定を`values.yaml`で更新します。

変更が必要となる可能性がある設定は次のとおりです。

* リクエストがロードバランサを経由してWallarm Ingress controllerに送信される場合の、[エンドユーザ公開IPアドレスの正確な報告](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)。

    ```diff
    controller:
      config:
    -    use-forwarded-headers: "true"
    +    enable-real-ip: "true"
    +    forwarded-for-header: "X-Forwarded-For"
    ```
* [IngressClassの構成](https://kubernetes.github.io/ingress-nginx/user-guide/multiple-ingress/)。新しいIngress controllerでは使用するKubernetes APIのバージョンが更新されており、`.controller.ingressClass`、`.controller.ingressClassResource`、`.controller.watchIngressWithoutClass`パラメータでIngressClassを構成する必要があります。

    ```diff
    controller:
    +  ingressClass: waf-ingress
    +  ingressClassResource:
    +    name: waf-ingress
    +    default: true
    +  watchIngressWithoutClass: true
    ```
* [ConfigMap（`.controller.config`）のパラメータセット](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/)。例:

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
* ["admission webhook"によるIngress構文の検証](https://kubernetes.github.io/ingress-nginx/how-it-works/#avoiding-outage-from-wrong-configuration)がデフォルトで有効になりました。

    ```diff
    controller:
    +  admissionWebhooks:
    +    enabled: true
    ```

    !!! warning "Ingress構文検証の無効化"
        Ingressオブジェクトの動作を不安定にする場合に限り、Ingress構文検証を無効化することを推奨します。 
* [ラベル](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)形式。`values.yaml`でPodアフィニティルールを設定している場合、以下のようにラベル形式を変更してください。

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

### Wallarmモジュールの構成

`values.yaml`で設定しているWallarmモジュールの構成を次のとおり変更します。

* バージョン2.18以下からアップグレードする場合、IPリスト構成を[移行](../migrate-ip-lists-to-node-3.md)してください。`values.yaml`から削除される可能性があるパラメータは次のとおりです。

    ```diff
    controller:
      wallarm:
        enabled: true
        - acl:
        -  enabled: true
        resources: {}
    ```

    Wallarmノード3.xではIPリストの中核ロジックが大幅に変更されているため、IPリスト構成をそれに合わせて調整する必要があります。
* [Tarantoolからwstoreへの移行](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)に伴い、Helmの値名が`controller.wallarm.tarantool` → `controller.wallarm.postanalytics`に変更されました。ポストアナリティクス用メモリを明示的に[割り当て](../../admin-en/configuration-guides/allocate-resources-for-node.md)ている場合は、`values.yaml`にこの変更を適用してください。
* [**Node deployment/Deployment**用途のAPIトークンを生成](../../user-guides/settings/api-tokens.md)し、その値を`controller.wallarm.token`パラメータに設定してください。
* 以下の設定で期待する挙動が、[`off`および`monitoring`フィルタリングモードの変更後のロジック](what-is-new.md#filtration-modes)と一致していることを確認してください。
      
      * [ディレクティブ`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Consoleで構成する全体フィルタリングルール](../../admin-en/configure-wallarm-mode.md#general-filtration-mode)
      * [Wallarm Consoleで構成するエンドポイント単位のフィルタリングルール](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)

      期待する挙動が変更後のフィルタリングモードロジックと一致しない場合は、[Ingressアノテーション](../../admin-en/configure-kubernetes-en.md#ingress-annotations)や[その他の設定](../../admin-en/configure-wallarm-mode.md)を変更点に合わせて調整してください。
* 明示的な[監視サービスの構成](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)は不要です。新しいWallarm Ingress controllerでは監視サービスがデフォルトで有効化され、追加設定は不要です。

    ```diff
    controller:
    wallarm:
      enabled: true
    -  tarantool:
    +  wstore:
        resources: {}
    -  metrics:
    -    enabled: true
    -    service:
    -      annotations: {}
    ```
* ConfigMapで設定したページ`&/usr/share/nginx/html/wallarm_blocked.html`がブロック時のレスポンスとして返される場合、提供された変更に合わせて[設定を調整](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)してください。

    新しいノードバージョンでは、Wallarmのサンプルブロッキングページは[新しいブロッキングページ](what-is-new.md#new-blocking-page)に示すとおり、デフォルトでロゴとサポートメールが表示されない更新UIになりました。
* [`wallarm_process_time_limit`][nginx-process-time-limit-docs]および[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs]というNGINXディレクティブで`overlimit_res`攻撃検出をカスタマイズしている場合は、この設定を[ルールへ移行](#step-6-transfer-the-overlimit_res-attack-detection-configuration-from-directives-to-the-rule)し、`values.yaml`から削除してください。

## 手順6: `overlimit_res`攻撃検出の設定をディレクティブからルールへ移行する

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-ingress-controller.md"

## 手順7: 反映されるK8sマニフェストの変更をすべて確認する

Ingress controllerの挙動が予期せず変化しないよう、[Helm Diff Plugin](https://github.com/databus23/helm-diff)を使用して、反映予定のK8sマニフェスト差分を確認してください。このプラグインは、現在デプロイ中のIngress controllerバージョンと新バージョンのK8sマニフェストの差分を出力します。

プラグインのインストールと実行:

1. プラグインをインストールします。

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインを実行します。

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 6.4.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress controllerチャートのHelmリリース名
    * `<NAMESPACE>`: Ingress controllerをデプロイしているNamespace
    * `<PATH_TO_VALUES>`: [Ingress controller 6.xの設定](#step-5-update-the-valuesyaml-configuration)を定義する`values.yaml`ファイルのパス
3. 変更が稼働中サービスの安定性に影響しないことを確認し、stdoutに出力されたエラーを慎重に確認してください。

    stdoutが空の場合は、`values.yaml`が正しいことを確認してください。

以下の構成の変更に注意してください。

* 変更不可能なフィールド（例: DeploymentやStatefulSetのセレクタ）。
* Podラベル。以下のような変更により、NetworkPolicyの動作が停止する可能性があります。

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
* Prometheusの新しいラベルでの構成。例:

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
           # 置換
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
* その他の変更も分析してください。

## 手順8: Ingress controllerをアップグレードする

Wallarm Ingress controllerのアップグレード方法は3通りあります。環境にロードバランサがあるかどうかに応じて、以下から選択してください。

* 一時的なIngress controllerのデプロイ
* Ingress controllerリリースの通常の再作成
* ロードバランサに影響を与えないIngress controllerリリースの再作成

!!! warning "ステージング環境またはminikubeの利用"
    Wallarm Ingress controllerがステージング環境にデプロイされている場合は、まずステージングをアップグレードすることを推奨します。ステージング環境で全サービスが正しく動作することを確認できたら、本番環境のアップグレードに進んでください。

    そうでなければ、先にminikubeや他のサービスを用いて、更新済み構成で[Wallarm Ingress controller 6.xをデプロイ](../../admin-en/installation-kubernetes-en.md)することを推奨します。すべてのサービスが期待どおり動作することを確認してから、本番環境のIngress controllerをアップグレードしてください。

    このアプローチにより、本番環境のダウンタイムを回避しやすくなります。

### 方法1: 一時的なIngress controllerのデプロイ

この方法では、環境にIngress Controller 6.xを追加でデプロイし、トラフィックを段階的に切り替えられます。サービスの一時的な停止も避けられ、安全に移行できます。

1. 旧バージョンの`values.yaml`からIngressClassの構成を、Ingress controller 6.x用の`values.yaml`にコピーします。

    この構成により、Ingress controllerはIngressオブジェクトを認識しますが、そのトラフィックは処理しません。
2. Ingress controller 6.xをデプロイします。

    ```bash
    helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 6.4.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress controllerチャートのHelmリリース名
    * `<NAMESPACE>`: Ingress controllerをデプロイするNamespace
    * `<PATH_TO_VALUES>`: [Ingress controller 6.xの設定](#step-5-update-the-valuesyaml-configuration)を定義する`values.yaml`ファイルのパス
3. すべてのサービスが正しく動作することを確認します。
4. 新しいIngress controllerへ段階的に負荷を切り替えます。

### 方法2: Ingress controllerリリースの通常の再作成

**ロードバランサとIngress controllerが同一のHelmチャートで定義されていない場合**は、Helmリリースを再作成するだけで構いません。数分かかり、その間Ingress controllerは利用できません。

!!! warning "Helmチャートでロードバランサの構成も設定している場合"
    HelmチャートでロードバランサとIngress controllerを併せて構成している場合、リリースの再作成によりロードバランサが長時間ダウンする可能性があります（クラウドプロバイダに依存）。固定アドレスを割り当てていない場合、アップグレード後にロードバランサのIPアドレスが変更される可能性もあります。

    この方法を選択する場合は、想定される全リスクを分析してください。

Ingress controllerリリースを再作成するには:

=== "Helm CLI"
    1. 旧リリースを削除します。

        ```bash
        helm delete <RELEASE_NAME> -n <NAMESPACE>
        ```

        * `<RELEASE_NAME>`: Ingress controllerチャートのHelmリリース名

        * `<NAMESPACE>`: Ingress controllerをデプロイしているNamespace

        実行時に`--wait`オプションは使用しないでください。アップグレード時間が延びる可能性があります。

    2. Ingress controller 6.xで新しいリリースを作成します。

        ```bash
        helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 6.4.0 -f <PATH_TO_VALUES>
        ```

        * `<RELEASE_NAME>`: Ingress controllerチャートのHelmリリース名

        * `<NAMESPACE>`: Ingress controllerをデプロイするNamespace

        * `<PATH_TO_VALUES>`: [Ingress controller 6.xの設定](#step-5-update-the-valuesyaml-configuration)を定義する`values.yaml`ファイルのパス
=== "Terraform CLI"
    1. アップグレード時間を短縮するため、Terraform構成で`wait = false`オプションを設定します。
        
        ```diff
        resource "helm_release" "release" {
          ...

        + wait = false

          ...
        }
        ```
    
    2. 旧リリースを削除します。

        ```bash
        terraform taint helm_release.release
        ```
    
    3. Ingress controller 6.xで新しいリリースを作成します。

        ```bash
        terraform apply -target=helm_release.release
        ```

### 方法3: ロードバランサに影響を与えないIngress controllerリリースの再作成

クラウドプロバイダが構成したロードバランサを使用している場合は、ロードバランサに影響を与えないこの方法でIngress controllerをアップグレードすることを推奨します。

リリースの再作成には数分かかり、その間Ingress controllerは利用できません。

1. （ロードバランサを除く）削除対象のオブジェクトを取得します。

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | yq -r '. | select(.spec.type != "LoadBalancer") | .kind + "/" + .metadata.name' | tr 'A-Z' 'a-z' > objects-to-remove.txt
    ```

    ユーティリティ`yq`のインストールは、[こちらの手順](https://pypi.org/project/yq/)を参照してください。

    削除対象オブジェクトは`objects-to-remove.txt`ファイルに出力されます。
2. 列挙したオブジェクトを削除し、リリースを再作成します。

    ```bash
    cat objects-to-remove.txt | xargs kubectl delete --wait=false -n <NAMESPACE>    && \
    helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 6.4.0 -f `<PATH_TO_VALUES>`
    ```

    サービスのダウンタイムを短縮するため、コマンドは別々に実行しないことを推奨します。
3. すべてのオブジェクトが作成されたことを確認します。

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | kubectl create -f -
    ```

    すべてのオブジェクトが既に存在する旨の出力が表示されるはずです。

上記のコマンドで使用するパラメータは次のとおりです。

* `<RELEASE_NAME>`: Ingress controllerチャートのHelmリリース名
* `<NAMESPACE>`: Ingress controllerをデプロイしているNamespace
* `<PATH_TO_VALUES>`: [Ingress controller 6.xの設定](#step-5-update-the-valuesyaml-configuration)を定義する`values.yaml`ファイルのパス

## 手順9: アップグレード済みIngress controllerをテストする

1. Helmチャートのバージョンが更新されたことを確認します。

    ```bash
    helm ls
    ```

    チャートバージョンは`wallarm-ingress-6.4.0`である必要があります。
1. WallarmのPodを取得します。
    
    ``` bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    Podのステータスは**STATUS: Running**で、**READY: N/N**である必要があります。

    ```
    NAME                                                                  READY   STATUS    RESTARTS   AGE
    ingress-controller-wallarm-ingress-controller-6d659bd79b-952gl        3/3     Running   0          8m7s
    ingress-controller-wallarm-ingress-controller-wallarm-wstore-7ddmgbfm 3/3     Running   0          8m7s
    ```

3. テスト用の[Path Traversal](../../attacks-vulns-list.md#path-traversal)攻撃をWallarm Ingress controllerのアドレスに送信します。

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    フィルタリングノードが`block`モードで動作している場合、レスポンスとして`403 Forbidden`コードが返り、攻撃はWallarm Console → **Attacks**に表示されます。

## 手順10: リリースされた変更に合わせてIngressアノテーションを調整する

Ingress controller 6.xでリリースされた変更に合わせ、以下のIngressアノテーションを調整してください。

1. バージョン2.18以下からアップグレードする場合、IPリスト構成を[移行](../migrate-ip-lists-to-node-3.md)してください。Wallarmノード3.xではIPリストの中核ロジックが大幅に変更されているため、（適用している場合は）Ingressアノテーションの変更により、IPリスト構成を適切に調整する必要があります。
1. 以下の設定で期待する挙動が、[`off`および`monitoring`フィルタリングモードの変更後のロジック](what-is-new.md#filtration-modes)と一致していることを確認してください。
      
      * [ディレクティブ`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Consoleで構成する全体フィルタリングルール](../../admin-en/configure-wallarm-mode.md#general-filtration-mode)
      * [Wallarm Consoleで構成するエンドポイント単位のフィルタリングルール](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)

      期待する挙動が変更後のフィルタリングモードロジックと一致しない場合は、[Ingressアノテーション](../../admin-en/configure-kubernetes-en.md#ingress-annotations)を変更点に合わせて調整してください。
1. Ingressに`nginx.ingress.kubernetes.io/wallarm-instance`アノテーションを付与している場合は、このアノテーション名を`nginx.ingress.kubernetes.io/wallarm-application`に変更してください。

    変更されたのはアノテーション名のみで、ロジックは同じです。旧名のアノテーションはまもなく非推奨となるため、事前に名称を変更することを推奨します。
1. Ingressアノテーションで設定したページ`&/usr/share/nginx/html/wallarm_blocked.html`がブロック時のレスポンスとして返される場合、提供された変更に合わせて[設定を調整](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)してください。

    新しいノードバージョンでは、Wallarmのブロッキングページは[新しいブロッキングページ](what-is-new.md#new-blocking-page)に示すとおり、デフォルトでロゴとサポートメールが表示されない更新UIになりました。

## 手順11: Threat Replay Testingモジュールを再有効化します（ノード2.16以下のアップグレード時のみ）

[Threat Replay Testingモジュールのセットアップに関する推奨事項](../../vulnerability-detection/threat-replay-testing/setup.md)を確認し、必要に応じて再有効化してください。

しばらくしてから、モジュールの動作が誤検知を引き起こしていないことを確認してください。誤検知が発生する場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)までご連絡ください。