[nginx-process-time-limit-docs]: ../../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]: ../../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]: ../../user-guides/rules/configure-overlimit-res-detection.ja.md
[graylist-docs]: ../../user-guides/ip-lists/graylist.ja.md
[ip-list-docs]: ../../user-guides/ip-lists/overview.ja.md
[waf-mode-instr]: ../../admin-en/configure-wallarm-mode.ja.md

# EOL NGINX Ingressコントローラーと統合されたWallarmモジュールのアップグレード

これらの手順は、デプロイ済みの統合された 4.4 のWallarmノードを含む新しいバージョンにエンドオブライフのWallarm Ingress Controller（バージョン3.6およびそれ以前）をアップグレードする手順を説明しています。

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.ja.md"

!!! warning "Community Ingress NGINX Controllerのアップグレードバージョン"
    ノードをバージョン3.4以前からアップグレードする場合は、Wallarm Ingressコントローラが基づいているCommunity Ingress NGINX Controllerのバージョンが0.26.2から1.6.4にアップグレードされていることに注意してください。
    
    Community Ingress NGINX Controller 1.6.4の動作が大幅に変更されているため、Wallarm Ingressコントローラのアップグレード中に、これらの変更に合わせて設定を調整する必要があります。

    これらの指示には、おそらく変更が必要なCommunity Ingress NGINX Controllerの設定のリストが含まれています。しかし、[Community Ingress NGINX Controllerのリリースノート](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.ja.md)に基づいて、個別の設定移行プランを作成してください。

## 要件

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.ja.md"

## ステップ1: フィルタリングノードモジュールをアップグレードしていることをWallarmの技術サポートに通知する（ノード2.18以前をアップグレードする場合のみ）

ノード 2.18 以前をアップグレードする場合は、[Wallarm の技術サポート](mailto:support@wallarm.com)に連絡して、フィルタリングノードモジュールを 4.4 までアップデートしていることを通知し、Wallarm アカウントで新しい IP リストのロジックを有効にしてもらってください。

新しい IP リストのロジックが有効になったら、Wallarm Console を開いて、[**IP リスト**](../../user-guides/ip-lists/overview.ja.md)セクションが利用可能かどうかを確認してください。

## ステップ2: アクティブな脅威検証モジュールを無効にする（ノード2.16以前をアップグレードする場合のみ）

Wallarmノード2.16以前をアップグレードする場合は、Wallarm Console→**Scanner**→**Settings**で、[アクティブな脅威検証](../../about-wallarm/detecting-vulnerabilities.ja.md#active-threat-verification)モジュールを無効にしてください。

モジュールの操作は、アップグレードプロセス中に[誤検知](../../about-wallarm/protecting-against-attacks.ja.md#false-positives)が発生する可能性があります。モジュールを無効にすることで、このリスクを最小限に抑えることができます。

## ステップ3: APIポートを更新する

--8<-- "../include/waf/upgrade/api-port-443.ja.md"

## ステップ4: Wallarm Helmチャートリポジトリを更新する

=== "Helmリポジトリを使用している場合"
    ```bash
    helm repo update wallarm
    ```
=== "GitHubリポジトリをクローンして使用している場合"
    以下のコマンドを使用して、すべてのチャートバージョンが含まれる[Wallarm Helmリポジトリ](https://charts.wallarm.com/)を追加してください。HelmリポジトリはWallarm Ingressコントローラーでのさらなる作業に使用してください。

    ```bash
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

## ステップ5: `values.yaml`設定を更新する

Wallarm Ingressコントローラー4.4に移行するために、`values.yaml`ファイルで指定された以下の設定を更新してください。

* Community Ingress NGINX Controllerの標準設定
* Wallarmモジュールの設定

### Community Ingress NGINX Controllerの標準設定

1. [Community Ingress NGINX Controllerのリリースノート](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.ja.md) 0.27.0以降を確認し、`values.yaml`ファイルで変更する必要がある設定を特定します。
2. `values.yaml`ファイルで定義された設定を更新します。

以下は、おそらく変更が必要な設定です。

* リクエストが Wallarm Ingress コントローラに送信される前にロードバランサを経由して送信される場合の、[エンドユーザーのパブリック IP アドレスの適切な報告](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.ja.md)。

    ```diff
    controller:
      config:
    -    use-forwarded-headers: "true"
    +    enable-real-ip: "true"
    +    forwarded-for-header: "X-Forwarded-For"
    ```
* [IngressClasses設定](https://kubernetes.github.io/ingress-nginx/user-guide/multiple-ingress/)。新しい Ingressコントローラで使用されている Kubernetes API のバージョンが アップグレードされており、IngressClasses を `.controller.ingressClass`、`.controller.ingressClassResource`、`.controller.watchIngressWithoutClass` パラメータを使って設定する必要があります。

    ```diff
    controller:
    +  ingressClass: waf-ingress
    +  ingressClassResource:
    +    name: waf-ingress
    +    default: true
    +  watchIngressWithoutClass: true
    ```
* [ConfigMap (`.controller.config`)パラメータセット](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/)、例えば：

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
* ["admission webhook"でのIngress構文の検証](https://kubernetes.github.io/ingress-nginx/how-it-works/#avoiding-outage-from-wrong-configuration)は、デフォルトで有効になっています。

    ```diff
    controller:
    +  admissionWebhooks:
    +    enabled: true
    ```

    !!! warning "Ingress構文検証の無効化"
        Ingressオブジェクトの動作が不安定になる場合にのみ、Ingress構文検証を無効にすることをお勧めします。
* [ラベル](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)形式。`values.yaml`ファイルに Pod アフィニティルールが設定されている場合、これらのルールに関するラベル形式を変更してください。例：

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
    ```### Wallarmモジュールの設定

`values.yaml`ファイル内のWallarmモジュールの設定を次のように変更してください。

* バージョン2.18以前からアップグレードする場合、IPリスト設定を[移行](../migrate-ip-lists-to-node-3.ja.md)してください。 `values.yaml`から削除される可能性があるパラメータは次のとおりです。

    ```diff
    controller:
      wallarm:
        enabled: true
        - acl:
        -  enabled: true
        resources: {}
    ```

    Wallarmノード3.xでIPリストのコアロジックが大幅に変更されたため、IPリスト設定を適切に調整する必要があります。
* 以下の設定の予想される動作が、[`off`および`monitoring`フィルタリングモード](what-is-new.ja.md#filtration-modes)の変更されたロジックに対応していることを確認してください。

      * [ディレクティブ `wallarm_mode`](../../admin-en/configure-parameters-en.ja.md#wallarm_mode)
      * [Wallarmコンソールで設定された一般的なフィルタリングルール](../../user-guides/settings/general.ja.md)
      * [Wallarmコンソールで設定された低レベルのフィルタリングルール](../../user-guides/rules/wallarm-mode-rule.ja.md)

      期待される動作が変更されたフィルタリングモードロジックに対応していない場合は、[Ingressアノテーション](../../admin-en/configure-kubernetes-en.ja.md#ingress-annotations)および[その他の設定](../../admin-en/configure-wallarm-mode.ja.md)をリリースされた変更に合わせて調整してください。
* 明示的な[監視サービス設定](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.ja.md)を削除してください。 新しいWallarm Ingressコントローラのバージョンでは、監視サービスはデフォルトで有効になっており、追加の設定は必要ありません。

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
* ConfigMapを介して設定された`&/usr/share/nginx/html/wallarm_blocked.html`ページがブロックされたリクエストに返された場合は、[リリースされた変更に合わせてその設定を調整](../../admin-en/configuration-guides/configure-block-page-and-code.ja.md#customizing-sample-blocking-page)してください。

    新しいノードバージョンでは、Wallarmのサンプルブロックページ[に](what-is-new.ja.md#new-blocking-page)デフォルトでロゴとサポートメールが指定されていない更新されたUIがあります。
* `overlimit_res`攻撃検出を[`wallarm_process_time_limit`][nginx-process-time-limit-docs]および[`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINXディレクティブを通じてカスタマイズしていた場合は、この設定をルールに[移行](#step-6-transfer-the-overlimit_res-attack-detection-configuration-from-directives-to-the-rule)して、`values.yaml`ファイルから削除してください。

## ステップ6：`overlimit_res`攻撃検出設定をディレクティブからルールに移行

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-ingress-controller.ja.md"

## ステップ7：すべての来るK8sマニフェスト変更をチェックアウトする

Ingressコントローラの動作が予期せず変更されないように、[Helm Diffプラグイン](https://github.com/databus23/helm-diff)を使用して、すべての来るK8sマニフェスト変更をチェックアウトしてください。 このプラグインは、デプロイされたIngressコントローラのバージョンと新しいバージョンのK8sマニフェストの差分を出力します。

プラグインをインストールして実行するには：

1. プラグインをインストールします。

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインを実行します。

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.4.8 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`：Ingressコントローラチャートを含むHelmリリースの名前
    * `<NAMESPACE>`：Ingressコントローラがデプロイされている名前空間
    * `<PATH_TO_VALUES>`：[Ingressコントローラ 4.4の設定](#step-5-update-the-valuesyaml-configuration)を定義する`values.yaml`ファイルへのパス
3. 実行中のサービスの安定性に影響を与える変更がないことを確認し、stdoutからのエラーを注意深く調べます。

    stdoutが空の場合は、`values.yaml`ファイルが有効であることを確認してください。

次の構成の変更に注意してください。

* 不変フィールド。 例：Deploymentおよび/またはStatefulSetセレクタ。
* Podラベル。 変更により、NetworkPolicyの操作が終了する可能性があります。 例：

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
* 新しいラベルでのPrometheusの設定。例：

    ```diff
     - job_name: 'kubernetes-ingress'
       kubernetes_sd_configs:
       - role: pod
         namespaces:
           names:
             - kube-system # ${NAMESPACE}
       relabel_configs: # RELEASE_NAME=waf-ingress
         # Selectors
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
           # Replacers
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
* 他のすべての変更を分析します。

## ステップ8：Ingressコントローラのアップグレード

Wallarm Ingressコントローラをアップグレードする方法は3つあります。 環境にロードバランサがデプロイされているかどうかに応じて、アップグレード方法を選択してください。

* 一時的なIngressコントローラのデプロイメント
* Ingressコントローラリリースの定期的な再作成
* ロードバランサに影響を与えないIngressコントローラリリースの再作成

!!! warning "ステージング環境またはminikubeの使用"
    Wallarm Ingressコントローラがステージング環境にデプロイされている場合は、まずそれをアップグレードすることをお勧めします。 すべてのサービスがステージング環境で正しく稼働すると、本番環境でのアップグレード手順に進むことができます。

    それ以外の場合は、minikubeまたは他のサービスを使用して更新された設定で[Wallarm Ingressコントローラ4.4をデプロイ](../../admin-en/installation-kubernetes-en.ja.md)してください。 すべてのサービスが予想通りの動作をすることを確認した後、本番環境でIngressコントローラをアップグレードしてください。

    このアプローチは、本番環境でのサービスのダウンタイムを回避するのに役立ちます。### 方法1：一時的なIngressコントローラーのデプロイメント

この方法を使用すると、Ingress Controller 4.4を環境内の追加エンティティとしてデプロイし、徐々にトラフィックを切り替えることができます。これにより、サービスの一時的なダウンタイムを防ぐことができ、安全な移行が保証されます。

1. `values.yaml`ファイルの以前のバージョンからIngressClass設定をコピーし、Ingress controller 4.4用の`values.yaml`ファイルに貼り付けます。

    この設定を使用すると、IngressコントローラはIngressオブジェクトを識別しますが、トラフィックは処理されません。
2. Ingressコントローラー4.4をデプロイします：

    ```bash
    helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.4.8 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: IngressコントローラチャートのHelmリリースの名前
    * `<NAMESPACE>`: Ingressコントローラをデプロイするネームスペース
    * `<PATH_TO_VALUES>`: [Ingress controller 4.4の設定](#step-5-update-the-valuesyaml-configuration)を定義する`values.yaml`ファイルへのパス
3. すべてのサービスが正常に動作することを確認します。
4. 新しいIngressコントローラに徐々に負荷を切り替えます。

### 方法2：Ingressコントローラーリリースの定期的な再作成

**ロードバランサとIngressコントローラが同じHelmチャートで記述されていない場合**、Helmリリースを再作成するだけで済みます。これには数分かかり、その間Ingressコントローラは利用できません。

!!!警告 "Helmチャートがロードバランサの設定を設定する場合"
    HelmチャートがIngressコントローラとともにロードバランサの設定を設定する場合、リリースの再作成はロードバランサのダウンタイムが長くなる可能性があります(クラウドプロバイダによります)。定数アドレスが割り当てられていなかった場合、アップグレード後にロードバランサのIPアドレスが変更される可能性があります。

    この方法を使用する場合は、すべてのリスクを分析してください。

Ingressコントローラリリースを再作成するには：

=== "Helm CLI"
    1. 前のリリースを削除します：

        ```bash
        helm delete <RELEASE_NAME> -n <NAMESPACE>
        ```

        * `<RELEASE_NAME>`: IngressコントローラチャートのHelmリリースの名前

        * `<NAMESPACE>`: Ingressコントローラがデプロイされているネームスペース

        コマンドを実行する際に`--wait`オプションを使用しないでください。アップグレード時間が長くなることがあります。

    2. Ingressコントローラ4.4を含む新しいリリースを作成します：

        ```bash
        helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.4.8 -f <PATH_TO_VALUES>
        ```

        * `<RELEASE_NAME>`: IngressコントローラチャートのHelmリリースの名前

        * `<NAMESPACE>`: Ingressコントローラをデプロイするネームスペース

        * `<PATH_TO_VALUES>`: [Ingress controller 4.4の設定](#step-5-update-the-valuesyaml-configuration)を定義する`values.yaml`ファイルへのパス
=== "Terraform CLI"
    1. Terraform設定で`wait = false`オプションを設定し、アップグレード時間を短縮します：
        
        ```diff
        resource "helm_release" "release" {
          ...

        + wait = false

          ...
        }
        ```
    
    2. 前のリリースを削除します：

        ```bash
        terraform taint helm_release.release
        ```
    
    3. Ingressコントローラ4.4を含む新しいリリースを作成します：

        ```bash
        terraform apply -target=helm_release.release
        ```

### 方法3：ロードバランサの影響を受けないIngressコントローラリリースの再作成

クラウドプロバイダによって設定されたロードバランサを使用している場合、ロードバランサに影響を与えないこの方法でIngressコントローラをアップグレードすることが推奨されます。

リリースの再作成には数分かかりますが、その間Ingressコントローラは利用できません。

1. 削除するオブジェクトを取得しますがロードバランサは除外します。

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | yq -r '. | select(.spec.type != "LoadBalancer") | .kind + "/" + .metadata.name' | tr 'A-Z' 'a-z' > objects-to-remove.txt
    ```

    ユーティリティ`yq`をインストールするには、[instructions](https://pypi.org/project/yq/)に従ってください。

    削除されるオブジェクトは`objects-to-remove.txt`ファイルに出力されます。
2. リストされたオブジェクトを削除し、リリースを再作成します：

    ```bash
    cat objects-to-remove.txt | xargs kubectl delete --wait=false -n <NAMESPACE>    && \
    helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.4.8 -f `<PATH_TO_VALUES>`
    ```

    サービスのダウンタイムを短縮するため、コマンドを別々に実行することはお勧めしません。
3. すべてのオブジェクトが作成されたことを確認します：

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | kubectl create -f -
    ```

    出力では、すべてのオブジェクトが既に存在することが示されます。

コマンドで渡されるパラメータは以下の通りです：

* `<RELEASE_NAME>`: IngressコントローラチャートのHelmリリースの名前
* `<NAMESPACE>`: Ingressコントローラがデプロイされているネームスペース
* `<PATH_TO_VALUES>`: [Ingress controller 4.4の設定](#step-5-update-the-valuesyaml-configuration)を定義する`values.yaml`ファイルへのパス

## ステップ9：アップグレードされたIngressコントローラのテスト

1. Helmチャートのバージョンが更新されたことを確認します：

    ```bash
    helm ls
    ```

    チャートのバージョンは`wallarm-ingress-4.4.8`に対応している必要があります。
2. Wallarm Ingressコントローラの名前を`<INGRESS_CONTROLLER_NAME>`で指定して、ポッドのリストを取得します。
    
    ``` bash
    kubectl get pods -l release=<INGRESS_CONTROLLER_NAME>
    ```

    各ポッドのステータスは**STATUS: Running**または**READY: N/N**である必要があります。たとえば：

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      4/4       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

3. テスト[Path Traversal](../../attacks-vulns-list.ja.md#path-traversal)攻撃を含むリクエストを、Wallarm Ingressコントローラのアドレスに送信します：

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    フィルタリングノードが`block`モードで動作している場合、リクエストに対して`403 Forbidden`コードが応答として返され、攻撃がWallarm Console → **Events**に表示されます。## ステップ 10: Ingress のアノテーションをリリースされた変更に合わせて調整する

Ingress コントローラ 4.4 でリリースされた変更に従って、以下の Ingress アノテーションを調整してください。

1. バージョン 2.18 以前からアップグレードする場合は、[IP リストの設定を移行](../migrate-ip-lists-to-node-3.ja.md)してください。 Wallarm ノード 3.x で IP リストのコアロジックが大幅に変更されたため、Ingress アノテーション（適用されている場合）を変更して、適切に IP リストの設定を調整する必要があります。
1. 以下にリストされている設定の予想される動作が、[`off`および`monitoring` フィルタリングモードの変更されたロジック](what-is-new.ja.md#filtration-modes)に対応していることを確認してください。
      
      * [ディレクティブ `wallarm_mode`](../../admin-en/configure-parameters-en.ja.md#wallarm_mode)
      * [Wallarm コンソールで設定された一般的なフィルタリングルール](../../user-guides/settings/general.ja.md)
      * [Wallarm コンソールで設定された低レベルのフィルタリングルール](../../user-guides/rules/wallarm-mode-rule.ja.md)

      予想される動作が変更されたフィルタリングモードのロジックに対応していない場合は、[Ingress のアノテーション](../../admin-en/configure-kubernetes-en.ja.md#ingress-annotations)をリリースされた変更に合わせて調整してください。
1. Ingress が `nginx.ingress.kubernetes.io/wallarm-instance` と注釈されている場合、このアノテーションを `nginx.ingress.kubernetes.io/wallarm-application` に変更してください。

    アノテーション名のみが変更され、そのロジックは変更されていません。旧名のアノテーションは近いうちに廃止されるため、事前に変更することをお勧めします。
1. Ingress のアノテーション経由で設定されたブロックされたリクエストに対して返されるページ`&/usr/share/nginx/html/wallarm_blocked.html`を、リリースされた変更に合わせて[設定を調整](../../admin-en/configuration-guides/configure-block-page-and-code.ja.md#customizing-sample-blocking-page)してください。
      
    新しいノードバージョンでは、Wallarm のブロックページにはデフォルトでロゴやサポートメールが指定されていない[更新された UI](what-is-new.ja.md#new-blocking-page) があります。

## ステップ 11: アクティブな脅威検証モジュールを再度有効にする（ノード 2.16 以前をアップグレードする場合のみ）

[アクティブな脅威検証モジュールのセットアップに関する推奨事項](../../admin-en/attack-rechecker-best-practices.ja.md)を確認し、必要に応じて再度有効にしてください。

しばらくして、モジュールの動作が誤検知を引き起こさないことを確認してください。誤検知が発見された場合は、[Wallarm の技術サポート](mailto:support@wallarm.com)に連絡してください。