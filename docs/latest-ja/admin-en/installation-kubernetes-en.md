# Wallarmサービス統合版NGINX Ingress Controllerのデプロイ

本手順では、WallarmのNGINXベースIngress controllerをK8sクラスターにデプロイする手順を説明します。ソリューションはWallarmのHelmチャートからデプロイします。

本ソリューションは、Wallarmサービスを統合した[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)上に構築されています。最新バージョンはCommunity Ingress NGINX Controller 1.11.5およびNGINX stable 1.25.5を使用します。

!!! warning
    The Kubernetes community will [retire the Community Ingress NGINX in March 2026](https://blog.nginx.org/blog/the-ingress-nginx-alternative-open-source-nginx-ingress-controller-for-the-long-term). The Wallarm NGINX Ingress Controller based on this project will be supported through the same date. You can continue using it until then, and it will remain fully functional during the support window.

    Wallarm will provide alternative deployment options and migration guidance as they become available. [Details](../updating-migrating/nginx-ingress-retirement.md)

    An [Envoy/Istio-based connector](../installation/connectors/istio.md) is also available today for environments already using Envoy.

アーキテクチャは次のとおりです:

![ソリューションのアーキテクチャ][nginx-ing-image]

## ユースケース

サポートされる[Wallarmのデプロイオプション][deployment-platform-docs]の中でも、本ソリューションは以下のユースケースに推奨されます:

* Ingress controllerが存在せず、[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)と互換性のあるIngressリソースへトラフィックをルーティングするセキュリティレイヤーもない場合。
* 現在Community Ingress NGINX Controllerを使用しており、標準のコントローラー機能に加えて強化されたセキュリティ機能を提供するセキュリティソリューションを探している場合。この場合は、本手順で説明しているWallarm-NGINX Ingress Controllerへ容易に切り替えできます。既存の構成を新しいデプロイに移行するだけで置き換えが完了します。

    既存のIngress controllerとWallarm controllerを同時に使用するには、[Ingress Controllerのチェイニングガイド][chaining-doc]の設定情報を参照してください。

## 要件

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

!!! info "関連情報"
    * [Ingressとは？](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Helmのインストール](https://helm.sh/docs/intro/install/)

## 既知の制限

* postanalyticsモジュールなしでの稼働はサポートしていません。 
* postanalyticsモジュールをスケールダウンすると、攻撃データの一部が失われる可能性があります。

## インストール

1. [インストール](#step-1-installing-the-wallarm-ingress-controller): Wallarm Ingress controllerをインストールします。
2. [有効化](#step-2-enabling-traffic-analysis-for-your-ingress): Ingressのトラフィック解析を有効化します。
3. [確認](#step-3-checking-the-wallarm-ingress-controller-operation): Wallarm Ingress controllerの動作を確認します。

### 手順1: Wallarm Ingress Controllerのインストール

Wallarm Ingress Controllerをインストールするには:

1. [適切な種類][node-token-types]のフィルタリングノードトークンを生成します:

    === "API token（Helm chart 4.6.8以降）"
        1. Wallarm Console → **Settings** → **API tokens**を[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます。
        1. 使用タイプが`Node deployment/Deployment`のAPI tokenを探すか作成します。
        1. このトークンをコピーします。
    === "Node token"
        1. Wallarm Console → **Nodes**を[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)のいずれかで開きます。
        1. **Wallarm node**タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。
            
            ![Wallarmノードの作成][nginx-ing-create-node-img]
1. Wallarm Ingress controllerのHelmチャートをデプロイするためのKubernetesのNamespaceを作成します:

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```
1. [Wallarmのチャートリポジトリ](https://charts.wallarm.com/)を追加します:
    
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

1. [Wallarmの設定][configure-nginx-ing-controller-docs]を含む`values.yaml`ファイルを作成します。最小構成の例は以下のとおりです。

    API tokenを使用する場合は、`nodeGroup`パラメーターにノードグループ名を指定します。ノードはWallarm Consoleの**Nodes**セクションに表示されるこのグループに割り当てられます。既定のグループ名は`defaultIngressGroup`です。

    === "US Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            apiHost: "us1.api.wallarm.com"
            # nodeGroup: defaultIngressGroup
        ```
    === "EU Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            # nodeGroup: defaultIngressGroup
        ```
    
    WallarmノードトークンをKubernetesのSecretに保存し、Helmチャートで参照することもできます。[詳細はこちら][controllerwallarmexistingsecret-docs]

    !!! info "独自のレジストリからのデプロイ"    
        `values.yaml`の要素を上書きし、[独自のレジストリに保存されたイメージ](#deployment-from-your-own-registries)からWallarm Ingress controllerをインストールできます。

1. Wallarmパッケージをインストールします:

    ``` bash
    helm install --version 6.4.0 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`はIngress controllerチャートのHelmリリース名です
    * `<KUBERNETES_NAMESPACE>`はWallarm Ingress controllerのHelmチャート用に作成したKubernetesのNamespaceです
    * `<PATH_TO_VALUES>`は`values.yaml`ファイルへのパスです

### 手順2: Ingressのトラフィック解析を有効化する

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-application="<APPLICATION_ID>"
```
* `<YOUR_INGRESS_NAME>`は対象のIngress名です
* `<YOUR_INGRESS_NAMESPACE>`は対象のIngressのNamespaceです
* `<APPLICATION_ID>`は[各アプリケーションまたはアプリケーショングループ][application-docs]に固有の正の数値です。これにより、個別の統計を取得し、対応するアプリケーションを狙った攻撃を区別できます

### 手順3: Wallarm Ingress Controllerの動作確認

1. Podの一覧を取得します:
    ```
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    WallarmのPodのステータスは**STATUS: Running**、かつ**READY: N/N**である必要があります:

    ```
    NAME                                                                  READY   STATUS    RESTARTS   AGE
    ingress-controller-wallarm-ingress-controller-6d659bd79b-952gl        3/3     Running   0          8m7s
    ingress-controller-wallarm-ingress-controller-wallarm-wstore-7ddmgbfm 3/3     Running   0          8m7s
    ```
2. Ingress ControllerのServiceにテスト用の[パストラバーサル][ptrav-attack-docs]攻撃リクエストを送信します:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    フィルタリングノードが`block`モードで動作している場合、レスポンスは`403 Forbidden`となり、攻撃はWallarm Console → **Attacks**に表示されます。

## ARM64デプロイ

NGINX Ingress controllerのHelmチャートバージョン4.8.2から、ARM64プロセッサに対応しています。初期設定はx86アーキテクチャ向けのため、ARM64ノードにデプロイする場合はHelmチャートのパラメーターを調整します。

ARM64環境では、Kubernetesノードに`arm64`ラベルが付与されていることがよくあります。KubernetesスケジューラーがWallarmのワークロードを適切なノードタイプに割り当てられるよう、WallarmのHelmチャート設定で`nodeSelector`、`tolerations`、またはaffinityルールを使用してこのラベルを参照します。

以下はGoogle Kubernetes Engine（GKE）向けのWallarm Helmチャート例で、対象ノードに`kubernetes.io/arch: arm64`ラベルを利用します。他のクラウド環境でも、それぞれのARM64ラベリング規約に合わせて調整できます。

=== "nodeSelector"
    ```yaml
    controller:
      nodeSelector:
        kubernetes.io/arch: arm64
      admissionWebhooks:
        nodeSelector:
          kubernetes.io/arch: arm64
        patch:
          nodeSelector:
            kubernetes.io/arch: arm64
      wallarm:
        postanalytics:
          nodeSelector:
            kubernetes.io/arch: arm64
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com" # EU Cloudを使用する場合は、この行をコメントアウトしてください
        # API tokenを使用する場合は、次の行のコメントを外し、ノードグループ名を指定してください
        # nodeGroup: defaultIngressGroup
    ```
=== "tolerations"
    ```yaml
    controller:
      tolerations:
        - key: kubernetes.io/arch
          operator: Equal
          value: arm64
          effect: NoSchedule
      admissionWebhooks:
        patch:
          tolerations:
            - key: kubernetes.io/arch
              operator: Equal
              value: arm64
              effect: NoSchedule
      wallarm:
        postanalytics:
          tolerations:
            - key: kubernetes.io/arch
              operator: Equal
              value: arm64
              effect: NoSchedule
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com" # EU Cloudを使用する場合は、この行をコメントアウトしてください
        # API tokenを使用する場合は、次の行のコメントを外し、ノードグループ名を指定してください
        # nodeGroup: defaultIngressGroup
    ```

## 独自のレジストリからのデプロイ

たとえば貴社のセキュリティポリシーで外部リソースの使用が制限されているなどの理由により、WallarmのパブリックリポジトリからDockerイメージをpullできない場合は、代わりに次を実施できます:

1. それらのイメージをプライベートレジストリへ複製します。
1. それらを使用してWallarmのNGINXベースIngress controllerをインストールします。

NGINXベースIngress Controllerのデプロイで、Helmチャートは以下のDockerイメージを使用します:

* [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
* [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)

レジストリに保存したイメージを使用してWallarmのNGINXベースIngress controllerをインストールするには、Wallarm Ingress controllerのHelmチャートの`values.yaml`を上書きします:

```yaml
controller:
  image:
    ## Wallarm NGINX Ingress Controller用のイメージとタグ
    ##
    registry: <YOUR_REGISTRY>
    image: wallarm/ingress-controller
    tag: <IMAGE_TAG>
  wallarm:
    helpers:
      ## ヘルパー用イメージとタグ
      ##
      image: <YOUR_REGISTRY>/wallarm/node-helpers
      tag: <IMAGE_TAG>
```

その後、変更した`values.yaml`を使用してインストールを実行します。

## OpenShiftにおけるSecurity Context Constraints（SCC）

OpenShiftにNGINX Ingress Controllerをデプロイする際は、プラットフォームのセキュリティ要件に適合するカスタムSecurity Context Constraint（SCC）を定義する必要があります。既定の制約ではWallarmの要件を満たさず、エラーになる可能性があります。

以下はWallarm NGINX Ingress Controller向けの推奨カスタムSCCです。

!!! warning "コントローラーをデプロイする前にSCCを適用してください"
    Wallarm NGINX Ingress controllerをデプロイする前に、必ずSCCを適用してください。

1. `wallarm-scc.yaml`ファイルに以下のとおりカスタムSCCを定義します:

    ```yaml
    ---
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
        kubernetes.io/description: wallarm-ingress-admission provides features similar to restricted-v2 SCC
          but pins user id to 65532 and is more restrictive for volumes
      name: wallarm-ingress-admission
    priority: null
    readOnlyRootFilesystem: false
    requiredDropCapabilities:
    - ALL
    runAsUser:
      type: MustRunAs
      uid: 65532
    seLinuxContext:
      type: MustRunAs
    seccompProfiles:
    - runtime/default
    supplementalGroups:
      type: RunAsAny
    users: []
    volumes:
    - projected
    ---
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
        kubernetes.io/description: wallarm-ingress-controller provides features similar to restricted-v2 SCC
          but pins user id to 101 and is a little more restrictive for volumes
      name: wallarm-ingress-controller
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
    - secret
    - emptyDir
    ```
1. このポリシーをクラスターに適用します:

    ```
    kubectl apply -f wallarm-scc.yaml
    ```
1. NGINX Ingress controllerをデプロイするKubernetesのNamespaceを作成します（例）:

    ```bash
    kubectl create namespace wallarm-ingress
    ```
1. Wallarm Ingress controllerのワークロードにこのSCCポリシーの使用を許可します:

    ```bash
    oc adm policy add-scc-to-user wallarm-ingress-admission \
      -z <RELEASE_NAME>-wallarm-ingress-admission -n wallarm-ingress

    oc adm policy add-scc-to-user wallarm-ingress-controller \
      -z <RELEASE_NAME>-wallarm-ingress -n wallarm-ingress

    oc adm policy add-scc-to-user wallarm-ingress-controller \
      -z default -n wallarm-ingress
    ```

    * `<RELEASE_NAME>`: `helm install`で使用するHelmリリース名
    * `-n wallarm-ingress`: NGINX Ingress controllerをデプロイするNamespace（上で作成）

    例: Namespaceが`wallarm-ingress`、Helmリリース名が`wlrm-ingress`の場合:
    
    ```bash
    oc adm policy add-scc-to-user wallarm-ingress-admission \
      -z wlrm-ingress-wallarm-ingress-admission -n wallarm-ingress

    oc adm policy add-scc-to-user wallarm-ingress-controller \
      -z wlrm-ingress-wallarm-ingress -n wallarm-ingress

    oc adm policy add-scc-to-user wallarm-ingress-controller \
      -z default -n wallarm-ingress
    ```
1. 上記と同じNamespaceとHelmリリース名を指定して[Wallarm NGINX Ingress controllerをデプロイ](#installation)します。
1. WallarmのPodに正しいSCCが適用されていることを確認します:

    ```bash
    WALLARM_INGRESS_NAMESPACE="<WALLARM_INGRESS_NAMESPACE>"
    POD=$(kubectl -n ${WALLARM_INGRESS_NAMESPACE} get pods -o name -l "app.kubernetes.io/component=controller" | cut -d '/' -f 2)
    kubectl -n ${WALLARM_INGRESS_NAMESPACE} get pod ${POD} -o jsonpath='{.metadata.annotations.openshift\.io\/scc}{"\n"}'

    WALLARM_INGRESS_NAMESPACE="<WALLARM_INGRESS_NAMESPACE>"
    POD=$(kubectl -n ${WALLARM_INGRESS_NAMESPACE} get pods -o name -l "app.kubernetes.io/component=controller-wallarm-wstore" | cut -d '/' -f 2)
    kubectl -n ${WALLARM_INGRESS_NAMESPACE} get pod ${POD} -o jsonpath='{.metadata.annotations.openshift\.io\/scc}{"\n"}'
    ```

    期待される出力は`wallarm-ingress-controller`です。

## 設定

Wallarm Ingress controllerのインストールと確認が完了したら、次のような高度な設定を行うことができます:

* [エンドユーザーのパブリックIPアドレスを正しく取得する][best-practices-for-public-ip]
* [IPアドレスブロッキングの管理][ip-lists-docs]
* [高可用性の考慮事項][best-practices-for-high-availability]
* [Ingress Controllerの監視][best-practices-for-ingress-monitoring]

高度な設定で使用するパラメーターと手順は、[こちら][configure-nginx-ing-controller-docs]をご確認ください。