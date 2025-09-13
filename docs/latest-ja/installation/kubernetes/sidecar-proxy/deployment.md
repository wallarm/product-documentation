# Wallarm Sidecarのデプロイ

KubernetesクラスターでPodとしてデプロイされたアプリケーションを保護するには、NGINXベースのWallarmノードをサイドカーコントローラーとしてアプリケーションの前段で実行できます。Wallarmサイドカーコントローラーは、正当なリクエストのみを許可し、不正なリクエストを軽減することで、アプリケーションPodへの受信トラフィックをフィルタリングします。

Wallarm Sidecarソリューションの**主な特長**:

* アプリケーションに近いデプロイ形式を提供することで、個々のマイクロサービスおよびそのレプリカやシャードの保護を容易にします
* あらゆるIngressコントローラーと完全な互換性があります
* サービスメッシュ方式で一般的な高負荷環境下でも安定して動作します
* アプリの保護に必要なサービス設定は最小限です。保護したいアプリケーションPodにいくつかのアノテーションとラベルを追加するだけです
* Wallarmコンテナのデプロイには2つのモードをサポートします。中程度の負荷向けにWallarmサービスを1つのコンテナで実行するモードと、高負荷向けにWallarmサービスを複数コンテナに分割するモードです
* Wallarm Sidecarソリューションのローカルデータ分析バックエンドであり、メモリ使用量の多くを占めるpostanalyticsモジュール向けに専用のエンティティを提供します

## ユースケース

サポートされている[Wallarmのデプロイオプション][deployment-platform-docs]の中でも、本ソリューションは次の**ユースケース**に推奨されます:

* 既存のIngressコントローラー（例: AWS ALB Ingress Controller）が稼働しているインフラに導入できるセキュリティソリューションを探しており、[Wallarm NGINXベースのIngress Controller][nginx-ing-controller-docs]や[Kong Ingress Controller向けWallarmコネクター][kong-ing-controller-docs]のデプロイができない場合
* 各マイクロサービス（内部APIを含む）をセキュリティソリューションで保護する必要があるゼロトラスト環境

## トラフィックフロー

Wallarm Sidecarにおけるトラフィックフロー:

![Wallarm Sidecarでのトラフィックフロー][traffic-flow-with-wallarm-sidecar-img]

## ソリューションアーキテクチャ

Wallarm Sidecarソリューションは、次のDeploymentオブジェクトで構成します:

* **Sidecar controller**（`wallarm-sidecar-controller`）は、Helmチャートの値およびPodのアノテーションに基づいてPodにWallarmのサイドカーリソースをインジェクトし、ノードコンポーネントをWallarm Cloudに接続する[Mutating Admission Webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)です。

    `wallarm-sidecar: enabled`というラベルが付いた新しいPodがKubernetesで起動すると、コントローラーは受信トラフィックをフィルタリングする追加コンテナを自動的にそのPodにインジェクトします。
* **Postanalyticsモジュール**（`wallarm-sidecar-postanalytics`）は、Wallarm Sidecarソリューションのローカルデータ分析バックエンドです。モジュールはインメモリストレージのwstoreと、攻撃エクスポートサービスなどの補助コンテナ群を使用します。

![Wallarmのデプロイオブジェクト][sidecar-deployment-objects-img]

Wallarm Sidecarのライフサイクルには標準で2つのステージがあります:

1. **初期**ステージでは、コントローラーがHelmチャートの値およびPodアノテーションに基づいてPodにWallarmのサイドカーリソースをインジェクトし、ノードコンポーネントをWallarm Cloudに接続します。
1. **実行時**ステージでは、ソリューションがリクエストを解析し、postanalyticsモジュールを介してプロキシ/転送します。

本ソリューションはAlpine Linuxをベースとし、Alpineが提供するNGINXバージョンを使用したDockerイメージを利用します。現在の最新イメージはAlpine Linux 3.22を使用しており、安定版NGINX 1.28.0が含まれます。

## 要件

--8<-- "../include/waf/installation/sidecar-proxy-reqs-latest.md"

## デプロイ

Wallarm Sidecarソリューションをデプロイするには:

1. フィルタリングノードトークンを生成します。
1. WallarmのHelmチャートをデプロイします。
1. アプリケーションPodにWallarm Sidecarをアタッチします。
1. Wallarm Sidecarの動作をテストします。

### ステップ1: フィルタリングノードトークンを生成する

Sidecar PodをWallarm Cloudに接続するため、[適切な種類][node-token-types]のフィルタリングノードトークンを生成します:

=== "APIトークン"
    1. Wallarm Console → **Settings** → **API tokens**を[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます。
    1. 使用タイプが`Node deployment/Deployment`のAPIトークンを見つけるか作成します。
    1. このトークンをコピーします。
=== "ノードトークン"
    1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)のいずれかで、Wallarm Console → **Nodes**を開きます。
    1. **Wallarm node**タイプでフィルタリングノードを作成し、生成されたトークンをコピーします。
        
      ![Wallarmノードの作成][create-wallarm-node-img]

### ステップ2: WallarmのHelmチャートをデプロイする

1. [Wallarmチャートリポジトリ](https://charts.wallarm.com/)を追加します:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. Wallarm Sidecarの設定を含む`values.yaml`ファイルを作成します。最小構成の例を以下に示します。

    APIトークンを使用する場合は、`nodeGroup`パラメータにノードグループ名を指定します。Sidecar Pod用に作成されたノードはこのグループに割り当てられ、Wallarm Consoleの**Nodes**セクションに表示されます。デフォルトのグループ名は`defaultSidecarGroup`です。必要に応じて、保護対象アプリケーションごとにPod単位で後からフィルタリングノードのグループ名を設定できます。この場合は、[`sidecar.wallarm.io/wallarm-node-group`](pod-annotations.md#wallarm-node-group)アノテーションを使用します。

    === "US Cloud"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              host: "us1.api.wallarm.com"
              # nodeGroup: "defaultSidecarGroup"
        ```
    === "EU Cloud"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              # nodeGroup: "defaultSidecarGroup"
        ```    
    
    `<NODE_TOKEN>`はKubernetesで実行するWallarmノードのトークンです。

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. WallarmのHelmチャートをデプロイします:

    ``` bash
    helm install --version 6.4.0 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`はWallarm SidecarチャートのHelmリリース名です。
    * `wallarm-sidecar`はWallarm SidecarチャートのHelmリリースをデプロイする新しいNamespaceであり、専用のNamespaceにデプロイすることを推奨します。
    * `<PATH_TO_VALUES>`は`values.yaml`ファイルへのパスです。

### ステップ3: アプリケーションPodにWallarm Sidecarをアタッチする

Wallarmがアプリケーショントラフィックをフィルタリングできるようにするには、対象のアプリケーションPodに`wallarm-sidecar: enabled`ラベルを追加します:

```bash
kubectl edit deployment -n <APPLICATION_NAMESPACE> <APP_LABEL_VALUE>
```

```yaml hl_lines="15"
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
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

* アプリケーションPodの`wallarm-sidecar`ラベルが`disabled`に設定されている、または明示的に指定されていない場合、Wallarm SidecarコンテナはPodにインジェクトされないため、Wallarmはトラフィックをフィルタリングしません。
* アプリケーションPodの`wallarm-sidecar`ラベルが`enabled`に設定されている場合、Wallarm SidecarコンテナがPodにインジェクトされ、Wallarmが受信トラフィックをフィルタリングします。

### ステップ4: Wallarm Sidecarの動作をテストする

Wallarm Sidecarが正しく動作していることを確認するには:

1. Wallarmのコントロールプレーンが正常に起動しているか確認するため、その詳細を取得します:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    各Podの表示は次のとおりである必要があります: **READY: N/N** および **STATUS: Running**。例:

    ```
    NAME                                             READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   3/3     Running   0          91m
    ```
1. アプリケーションPodの詳細を取得し、Wallarmサイドカーコンテナが正常にインジェクトされたことを確認します:

    ```bash
    kubectl get pods -n <APPLICATION_NAMESPACE> --selector app=<APP_LABEL_VALUE>
    ```

    出力に**READY: 2/2**（サイドカーコンテナのインジェクション成功を示す）および**STATUS: Running**（Wallarm Cloudへの接続成功を示す）が表示されるはずです:

    ```
    NAME                     READY   STATUS    RESTARTS   AGE
    myapp-5c48c97b66-lzkwf   2/2     Running   0          3h4m
    ```
1. Wallarmがトラフィックをフィルタリングするよう有効化されているアプリケーションクラスターのアドレスに、テスト用の[パストラバーサル][ptrav-attack-docs]攻撃を送信します:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    Wallarmプロキシはデフォルトで**monitoring**の[フィルタリングモード][filtration-mode-docs]で動作するため、Wallarmノードは攻撃をブロックせず、検知して記録します。

    攻撃が記録されたことを確認するには、Wallarm Console → **Attacks**に進みます:

    ![インターフェースのAttacks][attacks-in-ui-image]

## ARM64デプロイ

SidecarプロキシのHelmチャートバージョン4.10.2から、ARM64プロセッサーに対応しました。初期設定はx86アーキテクチャ向けのため、ARM64ノードへデプロイするにはHelmチャートのパラメータを変更します。

ARM64の構成では、Kubernetesノードに`arm64`ラベルが付与されていることがよくあります。KubernetesスケジューラーがWallarmワークロードを適切なノード種別に割り当てられるよう、このラベルをWallarmのHelmチャート設定で`nodeSelector`、`tolerations`、またはアフィニティルールで参照してください。

以下はGoogle Kubernetes Engine（GKE）向けのWallarm Helmチャートの例で、該当ノードに`kubernetes.io/arch: arm64`ラベルを使用します。各クラウドのARM64ラベリング規則に合わせて、このテンプレートは他のクラウド構成にも調整できます。

=== "nodeSelector"
    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          # APIトークンを使用する場合は、次の行のコメントを解除し、ノードグループ名を指定してください
          # nodeGroup: "defaultSidecarGroup"
      postanalytics:
        nodeSelector:
          kubernetes.io/arch: arm64
      controller:
        nodeSelector:
          kubernetes.io/arch: arm64
    ```
=== "tolerations"
    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          # APIトークンを使用する場合は、次の行のコメントを解除し、ノードグループ名を指定してください
          # nodeGroup: "defaultSidecarGroup"
      postanalytics:
        tolerations:
          - key: kubernetes.io/arch
            operator: Equal
            value: arm64
            effect: NoSchedule
      controller:
        tolerations:
          - key: kubernetes.io/arch
            operator: Equal
            value: arm64
            effect: NoSchedule
    ```

## OpenShiftにおけるSecurity Context Constraints（SCC）

OpenShiftにSidecarソリューションをデプロイする際は、プラットフォームのセキュリティ要件に合わせたカスタムSecurity Context Constraint（SCC）を定義する必要があります。デフォルトの制約ではWallarmソリューションに不十分な場合があり、エラーの原因となる可能性があります。

以下は、OpenShift向けに調整されたWallarm Sidecarソリューション推奨のカスタムSCCです。本構成は、[iptables](customization.md#capturing-incoming-traffic-port-forwarding)を使用せず、非特権モードでソリューションを実行することを想定しています。

!!! warning "Sidecarをデプロイする前にSCCを適用してください"
    Wallarm Sidecarソリューションをデプロイする前に、必ずSCCを適用してください。

1. 次の内容で`wallarm-scc.yaml`ファイルにカスタムSCCを定義します:

    ```yaml
    allowHostDirVolumePlugin: false
    allowHostIPC: false
    allowHostNetwork: false
    allowHostPID: false
    allowHostPorts: false
    allowPrivilegeEscalation: false
    allowPrivilegedContainer: false
    allowedCapabilities:
    - NET_BIND_SERVICE
    apiVersion: security.openshift.io/v1
    defaultAddCapabilities: null
    fsGroup:
      type: MustRunAs
    groups: []
    kind: SecurityContextConstraints
    metadata:
      annotations:
        kubernetes.io/description: wallarm-sidecar-deployment
      name: wallarm-sidecar-deployment
    priority: null
    readOnlyRootFilesystem: false
    requiredDropCapabilities:
    - ALL
    runAsUser:
      type: MustRunAsRange
      uidRangeMin: 101
      uidRangeMax: 65532
    seLinuxContext:
      type: MustRunAs
    seccompProfiles:
    - runtime/default
    supplementalGroups:
      type: RunAsAny
    users: []
    volumes:
    - configMap
    - emptyDir
    - secret
    ```
1. このポリシーをクラスターに適用します:

    ```
    kubectl apply -f wallarm-scc.yaml
    ```
1. SidecarをデプロイするKubernetesのNamespaceを作成します（例）:

    ```bash
    kubectl create namespace wallarm-sidecar
    ```
1. Wallarm SidecarのワークロードがSCCポリシーを使用できるように許可します:

    ```bash    
    oc adm policy add-scc-to-user wallarm-sidecar-deployment \
      -z <RELEASE_NAME>-wallarm-sidecar-postanalytics -n wallarm-sidecar
    
    oc adm policy add-scc-to-user wallarm-sidecar-deployment \
      -z <RELEASE_NAME>-wallarm-sidecar-admission -n wallarm-sidecar
    ```

    * `<RELEASE_NAME>`: `helm install`時に使用するHelmリリース名です。

        !!! warning "`wallarm-sidecar`をリリース名に含める場合"
            リリース名に`wallarm-sidecar`が含まれるときは、サービスアカウント名からそれを省きます。
            
            アカウント名は`wallarm-sidecar-postanalytics`および`wallarm-sidecar-admission`になります。
    
    * `-n wallarm-sidecar`: 上で作成した、SidecarをデプロイするNamespaceです。

    例: Namespaceが`wallarm-sidecar`、Helmリリース名が`wlrm-sidecar`の場合:
    
    ```bash    
    oc adm policy add-scc-to-user wallarm-sidecar-deployment \
      -z wlrm-sidecar-wallarm-sidecar-postanalytics -n wallarm-sidecar
    
    oc adm policy add-scc-to-user wallarm-sidecar-deployment \
      -z wlrm-sidecar-wallarm-sidecar-admission -n wallarm-sidecar
    ```
1. 上記と同じNamespaceおよびHelmリリース名を使用して、[Wallarm Sidecarをデプロイ](#deployment)します。
1. 特権のiptablesコンテナの実行を避けるため、[iptablesの使用を無効化](customization.md#capturing-incoming-traffic-port-forwarding)します。これは`values.yaml`でグローバルに、またはPod単位でアノテーションにより実施できます。

    === "`values.yaml`でiptablesを無効化する"
        1. `values.yaml`で`config.injectionStrategy.iptablesEnable`を`false`に設定します。

            ```yaml
            config:
              injectionStrategy:
                iptablesEnable: false
              wallarm:
                api:
                  ...
            ```
        1. アプリケーションのServiceマニフェストで、`spec.ports.targetPort`を`proxy`に設定します。iptablesを無効化すると、Sidecarはこのポートを公開します。

            ```yaml hl_lines="9"
            apiVersion: v1
            kind: Service
            metadata:
              name: myapp-svc
              namespace: default
            spec:
              ports:
                - port: 80
                  targetPort: proxy
                  protocol: TCP
                  name: http
              selector:
                app: myapp
            ```

            OpenShiftのRoute経由でアプリケーションを公開する場合は、`spec.ports.targetPort`を`26001`に設定します。
    === "Podアノテーションでiptablesを無効化する"
        1. Podのアノテーション`sidecar.wallarm.io/sidecar-injection-iptables-enable`を`"false"`に設定して、Pod単位でiptablesを無効化します。
        1. アプリケーションのServiceマニフェストで、`spec.ports.targetPort`を`proxy`に設定します。iptablesを無効化すると、Sidecarはこのポートを公開します。

        ```yaml hl_lines="16-17 34"
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
                sidecar.wallarm.io/sidecar-injection-iptables-enable: "false"
            spec:
              containers:
                - name: application
                  image: kennethreitz/httpbin
                  ports:
                    - name: http
                      containerPort: 80
        ---
        apiVersion: v1
        kind: Service
        metadata:
          name: myapp-svc
          namespace: default
        spec:
          ports:
            - port: 80
              targetPort: proxy
              protocol: TCP
              name: http
          selector:
            app: myapp
        ```

        OpenShiftのRoute経由でアプリケーションを公開する場合は、`spec.ports.targetPort`を`26001`に設定します。
1. 更新した構成でアプリケーションをデプロイします:

    ```bash
    kubectl -n <APP_NAMESPACE> apply -f <MANIFEST_FILE>
    ```
1. WallarmのPodに正しいSCCが適用されていることを確認します:

    ```bash
    WALLARM_SIDECAR_NAMESPACE="wallarm-sidecar"
    POD=$(kubectl -n ${WALLARM_SIDECAR_NAMESPACE} get pods -o name -l "app.kubernetes.io/component=postanalytics" | cut -d '/' -f 2)
    kubectl -n ${WALLARM_SIDECAR_NAMESPACE}  get pod ${POD} -o jsonpath='{.metadata.annotations.openshift\.io\/scc}{"\n"}'
    ```

    期待される出力は`wallarm-sidecar-deployment`です。
1. アプリケーションのPodに`wallarm-sidecar-deployment`と同じSCCを付与し、必要なUID範囲が許可されていることを確認します。インジェクトされるSidecarコンテナはこのUID範囲で実行されるため、必要です。

    次のコマンドで`wallarm-sidecar-deployment`ポリシーを付与します:

    ```bash
    APP_NAMESPACE=<APP_NAMESPACE>
    POD_NAME=<POD_NAME>
    APP_POD_SERVICE_ACCOUNT_NAME=$(oc get pod $POD_NAME -n $APP_NAMESPACE -o jsonpath='{.spec.serviceAccountName}')
    oc adm policy add-scc-to-user wallarm-sidecar-deployment \
      system:serviceaccount:$APP_NAMESPACE:$APP_POD_SERVICE_ACCOUNT_NAME
    ```

    本番環境では、アプリケーションおよびWallarmの要件に合わせたカスタムSCCを作成してください。

## カスタマイズ

WallarmのPodは、[デフォルトの`values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml)と、デプロイ手順の2番目で指定したカスタム設定に基づいてインジェクトされています。

グローバルおよびPod単位の両方でWallarmプロキシの挙動をさらにカスタマイズし、貴社のニーズに最適化できます。

[Wallarmプロキシソリューションのカスタマイズガイド](customization.md)をご覧ください。