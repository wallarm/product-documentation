# Wallarmサイドカーのデプロイ

KubernetesクラスターにPodとしてデプロイされたアプリケーションを保護するため、アプリケーションの前にNGINXベースのWallarmノードをサイドカーコントローラーとして実行できます。Wallarmサイドカーコントローラーは、正当なリクエストのみを許可し、不正なリクエストを緩和することで、アプリケーションPodへの着信トラフィックをフィルタリングします。

**Wallarmサイドカーソリューションの主な特徴**

* アプリケーションと同様のデプロイ形式を提供することで、個々のマイクロサービスとそのレプリカやシャードの保護を容易にします
* どのIngressコントローラーとも完全に互換性があります
* サービスメッシュアプローチで一般的な高負荷下でも安定して動作します
* アプリケーションを保護するための最小限のサービス構成で済みます。アプリケーションPodに適切な注釈とラベルを追加するだけです
* Wallarmコンテナのデプロイには、中程度の負荷向けにWallarmサービスを1つのコンテナで動作させるモードと、高負荷向けにWallarmサービスを複数のコンテナに分割するモードの2種類をサポートします
* Wallarmサイドカーソリューションのローカルデータ解析バックエンドとして、多くのメモリを消費するpostanalyticsモジュール専用のエンティティを提供します

## ユースケース

すべての[Wallarmデプロイメントオプション][deployment-platform-docs]の中でも、このソリューションは以下の**ユースケース**に推奨されます:

* 既存のIngressコントローラー（例：AWS ALB Ingress Controller）を使用しているため、[Wallarm NGINXベース][nginx-ing-controller-docs]や[Wallarm KongベースのIngressコントローラー][kong-ing-controller-docs]のいずれかをデプロイできない場合
* ゼロトラスト環境で、各マイクロサービス（内部APIを含む）をセキュリティソリューションで保護する必要がある場合

## トラフィックフロー

Wallarmサイドカーによるトラフィックフロー:

![Wallarmサイドカーによるトラフィックフロー][traffic-flow-with-wallarm-sidecar-img]

## ソリューションアーキテクチャ

Wallarmサイドカーソリューションは、以下のDeploymentオブジェクトによって構成されます:

* **サイドカーコントローラー** (`wallarm-sidecar-controller`) は、Helmチャートの値とPodの注釈に基づいてPodにWallarmサイドカーリソースを注入し、ノードコンポーネントをWallarm Cloudに接続する[変異的アドミッションウェブフック](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)です。

    Kubernetesで`wallarm-sidecar: enabled`ラベルが付与された新しいPodが起動すると、コントローラーは自動的に着信トラフィックをフィルタリングする追加のコンテナをPodに注入します。
* **Postanalyticsモジュール** (`wallarm-sidecar-postanalytics`) は、Wallarmサイドカーソリューションのローカルデータ解析バックエンドです。このモジュールはインメモリストレージのTarantoolと、collectdやattack export servicesなどのヘルパーコンテナセットを使用します。

![Wallarmデプロイメントオブジェクト][sidecar-deployment-objects-img]

Wallarmサイドカーには、ライフサイクル上で2つの標準ステージがあります:

1. **初期**ステージでは、コントローラーがHelmチャートの値とPodの注釈に基づいてPodにWallarmサイドカーリソースを注入し、ノードコンポーネントをWallarm Cloudに接続します。
1. **実行時**ステージでは、postanalyticsモジュールを含むリクエストの解析とプロキシ/転送を行います。

このソリューションは、Alpine LinuxベースかつAlpineが提供するNGINXバージョンのDockerイメージを使用します。現在、最新のイメージはAlpine Linuxバージョン3.20を使用しており、NGINXの安定版1.26.1が含まれています。

## 必要条件

--8<-- "../include/waf/installation/sidecar-proxy-reqs-latest.md"

## デプロイメント

Wallarmサイドカーソリューションをデプロイするには:

1. フィルタリングノードトークンを生成します。
1. Wallarm Helmチャートをデプロイします。
1. アプリケーションPodにWallarmサイドカーをアタッチします。
1. Wallarmサイドカーの動作をテストします。

### ステップ1: フィルタリングノードトークンの生成

Wallarm Cloudにサイドカーポッドを接続するため、[適切なタイプ][node-token-types]のフィルタリングノードトークンを生成します:

=== "API token"
    1. Wallarm Console → **Settings** → **API tokens**を[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます。
    1. `Deploy`ソースロールのAPIトークンを探すか作成します。
    1. このトークンをコピーします。
=== "Node token"
    1. Wallarm Console → **Nodes**を[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で開きます。
    1. **Wallarm node**タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。
        
      ![Wallarmノードの作成][create-wallarm-node-img]

### ステップ2: Wallarm Helmチャートのデプロイ

1. [Wallarmチャートリポジトリ](https://charts.wallarm.com/)を追加します:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. [Wallarmサイドカーの構成](customization.md)を使用して`values.yaml`ファイルを作成します。最小限の構成例は以下の通りです。

    APIトークンを使用する場合、`nodeGroup`パラメータにノードグループ名を指定します。サイドカーポッド用に作成されたノードは、このグループに割り当てられ、Wallarm Consoleの**Nodes**セクションに表示されます。デフォルトのグループ名は`defaultSidecarGroup`です。必要に応じて、後で[`sidecar.wallarm.io/wallarm-node-group`](pod-annotations.md#wallarm-node-group)注釈を使用して、保護するアプリケーションのPodごとにフィルタリングノードグループ名を個別に設定できます。

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
    
    `<NODE_TOKEN>`は、Kubernetesで実行するWallarmノードのトークンです。

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Wallarm Helmチャートをデプロイします:

    ``` bash
    helm install --version 5.3.0 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`はWallarmサイドカーチャートのHelmリリース名です
    * `wallarm-sidecar`はWallarmサイドカーチャートのHelmリリースをデプロイする新しいnamespaceであり、別のnamespaceにデプロイすることを推奨します
    * `<PATH_TO_VALUES>`は`values.yaml`ファイルへのパスです

### ステップ3: アプリケーションPodにWallarmサイドカーをアタッチ

Wallarmがアプリケーショントラフィックをフィルタリングするため、該当するアプリケーションPodに`wallarm-sidecar: enabled`ラベルを追加します:

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

* もし、アプリケーションPodの`wallarm-sidecar`ラベルが`disabled`に設定されているか明示的に指定されていない場合、WallarmサイドカーコンテナはPodに注入されず、そのためWallarmはトラフィックをフィルタリングしません。
* アプリケーションPodの`wallarm-sidecar`ラベルが`enabled`に設定されていれば、WallarmサイドカーコンテナがPodに注入され、着信トラフィックがWallarmによってフィルタリングされます。

### ステップ4: Wallarmサイドカーの動作確認

Wallarmサイドカーが正しく動作しているかテストするには:

1. Wallarmコントロールプレーンの詳細を取得し、正常に起動しているか確認します:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    各Podは、例のように**READY: N/N**および**STATUS: Running**を表示する必要があります:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. アプリケーションPodの詳細を取得し、Wallarmサイドカーコンテナが正常に注入されているか確認します:

    ```bash
    kubectl get pods -n <APPLICATION_NAMESPACE> --selector app=<APP_LABEL_VALUE>
    ```

    出力は、サイドカーコンテナの注入成功を示す**READY: 2/2**と、Wallarm Cloudへの接続成功を示す**STATUS: Running**を表示するはずです:

    ```
    NAME                     READY   STATUS    RESTARTS   AGE
    myapp-5c48c97b66-lzkwf   2/2     Running   0          3h4m
    ```
1. Wallarmがトラフィックをフィルタリングできるように、アプリケーションクラスターアドレスに対してテストの[Path Traversal][ptrav-attack-docs]攻撃を送信します:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    Wallarmプロキシはデフォルトで**monitoring**[filtration mode][filtration-mode-docs]で動作するため、Wallarmノードは攻撃をブロックすることはなく、記録します。

    攻撃が記録されたことを確認するには、Wallarm Console → **Attacks**に進んでください:

    ![インターフェース上の攻撃][attacks-in-ui-image]

## ARM64デプロイメント

SidecarプロキシのHelmチャートバージョン4.10.2から、ARM64プロセッサとの互換性が導入されました。初期はx86アーキテクチャ向けに設定されていましたが、ARM64ノード上でのデプロイにはHelmチャートのパラメータ変更が必要です。

ARM64環境では、Kubernetesノードに`arm64`ラベルが付与されている場合が多いです。KubernetesスケジューラーがWallarmのワークロードを適切なノードに割り当てるために、Helmチャートの構成内で`nodeSelector`、`tolerations`、またはアフィニティルールを参照して、このラベルを指定します。

以下は、Google Kubernetes Engine (GKE)向けのWallarm Helmチャートの例です。ここでは、関連するノードに対して`kubernetes.io/arch: arm64`ラベルを使用しています。このテンプレートは、他のクラウド環境に合わせたARM64ラベリングの規約に応じて修正可能です。

=== "nodeSelector"
    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          # If using an API token, uncomment the following line and specify your node group name
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
          # If using an API token, uncomment the following line and specify your node group name
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

## OpenShiftにおけるSecurity Context Constraints (SCC)

OpenShiftプラットフォームにSidecarソリューションをインストールする際、プラットフォームのセキュリティ要件に合わせたカスタムSecurity Context Constraint (SCC) を定義する必要があります。デフォルトの制約ではWallarmソリューションにとって不十分となり、エラーが発生する可能性があります。

以下は、OpenShift向けに調整されたWallarmサイドカーソリューション推奨のカスタムSCCです。この構成は、特権モードを使用せず、iptablesを利用しない状態でソリューションを実行するために設計されています。

!!! warning "SCCをデプロイ前に適用してください"
    Wallarmサイドカーソリューションをデプロイする前に、必ずSCCを適用してください。

1. `wallarm-scc.yaml`ファイルにカスタムSCCを以下のように定義します:

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
      type: MustRunAs
      uid: 101
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
1. WallarmサイドカーソリューションがこのSCCポリシーを使用できるようにします:
    
    ```
    oc adm policy add-scc-to-user wallarm-sidecar-deployment system:serviceaccount:<WALLARM_SIDECAR_NAMESPACE>:<POSTANALYTICS_POD_SERVICE_ACCOUNT_NAME>
    ```

    * `<WALLARM_SIDECAR_NAMESPACE>`はWallarmサイドカーソリューションをデプロイするnamespaceです。
    * `<POSTANALYTICS_POD_SERVICE_ACCOUNT_NAME>`は自動生成され、通常は`<RELEASE_NAME>-wallarm-sidecar-postanalytics`という形式になります。ここで、`<RELEASE_NAME>`は`helm install`時に割り当てるHelmリリース名です。

    例として、namespace名が`wallarm-sidecar`でHelmリリース名が`wlrm-sidecar`の場合、コマンドは以下のようになります:
    
    ```
    oc adm policy add-scc-to-user wallarm-sidecar-deployment system:serviceaccount:wallarm-sidecar:wlrm-sidecar-wallarm-sidecar-postanalytics
    ```
1. [デプロイメント](#deployment)に進み、前述のnamespaceとHelmリリース名を引き続き使用してSidecarソリューションをデプロイします。
1. 特権のiptablesコンテナが不要となるように、iptablesの使用を[無効化](customization.md#capturing-incoming-traffic-port-forwarding)します。これは、`values.yaml`ファイルをグローバルに変更するか、またはPodごとに設定することで実現できます.
    
    === "Disabling iptables via the `values.yaml`"
        1. `values.yaml`で、`config.injectionStrategy.iptablesEnable`を`false`に設定します.

            ```yaml
            config:
              injectionStrategy:
                iptablesEnable: false
              wallarm:
                api:
                  ...
            ```
        1. Serviceマニフェストの`spec.ports.targetPort`設定を`proxy`ポートに向けて更新します。iptablesベースのトラフィックキャプチャが無効の場合、Wallarmサイドカーコンテナは`proxy`という名前のポートを公開します.
    === "Disabling iptables via the pod annotation"
        1. Podの注釈`sidecar.wallarm.io/sidecar-injection-iptables-enable`を`"false"`に設定して、Podごとにiptablesを無効化します.
        1. Serviceマニフェストの`spec.ports.targetPort`設定を`proxy`ポートに向けて更新します。iptablesベースのトラフィックキャプチャが無効の場合、Wallarmサイドカーコンテナは`proxy`という名前のポートを公開します.

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
1. 直前の手順で適用されたpostanalytics PodへのSCCが正しく適用されていることを、以下のコマンドで確認します:

    ```
    WALLARM_SIDECAR_NAMESPACE="wallarm-sidecar"
    POD=$(kubectl -n ${WALLARM_SIDECAR_NAMESPACE} get pods -o name -l "app.kubernetes.io/component=postanalytics" | cut -d '/' -f 2)
    kubectl -n ${WALLARM_SIDECAR_NAMESPACE}  get pod ${POD} -o jsonpath='{.metadata.annotations.openshift\.io\/scc}{"\n"}'
    ```

    期待される出力は`wallarm-sidecar-deployment`です.
1. 初期の`wallarm-sidecar-deployment`ポリシーでUID 101の許可が指定されているため、アプリケーションPodにも同様のSCCを適用するよう更新します。これは、デプロイ時に注入されるWallarmサイドカーコンテナがUID 101で動作し、特定の権限を必要とするため非常に重要です.

    以下のコマンドを使用して、以前作成した`wallarm-sidecar-deployment`ポリシーをアプリケーションPodに適用します。通常、アプリケーションとWallarmの要件に合わせたカスタムポリシーを作成します.

    ```
    oc adm policy add-scc-to-user wallarm-sidecar-deployment system:<APP_NAMESPACE>:<APP_POD_SERVICE_ACCOUNT_NAME>
    ```
1. 更新したSCCを適用してアプリケーションをデプロイします。例:

    ```
    kubectl -n <APP_NAMESPACE> apply -f <MANIFEST_FILE>
    ```

## カスタマイズ

Wallarmポッドは、[デフォルトの`values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml)と、デプロイメント時に指定したカスタム構成に基づいて注入されています。

Wallarmソリューションを最大限に活用するために、グローバルおよびPodごとにWallarmプロキシの動作をさらにカスタマイズすることが可能です。

[Wallarmプロキシソリューションのカスタマイズガイド](customization.md)に進んでください。