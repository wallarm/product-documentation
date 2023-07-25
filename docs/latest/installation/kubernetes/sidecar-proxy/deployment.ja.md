[ip-lists-docs]:                ../../../user-guides/ip-lists/overview.ja.md
[deployment-platform-docs]:     ../../../installation/supported-deployment-options.ja.md

# Wallarmサイドカーコントローラのデプロイ

Kubernetesクラスタ内のPodとしてデプロイされたアプリケーションを保護するために、アプリケーションの前でNGINXベースのWallarmノードをサイドカーコントローラとして実行することができます。Wallarmサイドカーコントローラは、正当なリクエストのみを許可し、悪意のあるリクエストを軽減することによって、アプリケーションPodへの流入トラフィックをフィルタリングします。

Wallarmサイドカープロキシソリューションの**主要機能**:

* アプリケーションに類似したデプロイメント形式を提供することにより、独立したマイクロサービスやそのレプリカ、シャードの保護を簡素化
* 任意のIngressコントローラと完全に互換性がある
* 通常、サービスメッシュアプローチに一般的な高負荷下で安定して動作
* アプリを保護するために最小限のサービス構成が必要; アプリケーションpodにアノテーションとラベルを追加するだけで保護できる
* Wallarmコンテナのデプロイメントに2つのモードをサポート: Wallarmサービスが1つのコンテナで実行される中負荷用、およびWallarmサービスが複数のコンテナに分割される高負荷用
* Wallarmサイドカープロキシソリューションのローカルデータアナリティクスバックエンドであるpostanalyticsモジュールに専用のエンティティを提供し、CPUの大部分を消費

!!! info "以前のWallarmサイドカーソリューションを使用している場合"
    以前のバージョンのWallarm Sidecarソリューションを使用している場合は、新しいものに移行することをお勧めします。このリリースでは、新しいKubernetes機能と多くの顧客からのフィードバックを活用して、Sidecarソリューションをアップデートしました。新しいソリューションは、Kubernetesマニフェストの変更を大幅に必要とせず、アプリケーションを保護するためには、チャートをデプロイし、Podにラベルとアノテーションを追加するだけです。

    Wallarm Sidecarプロキシソリューションv2.0への移行支援については、[Wallarm技術サポート](mailto:support@wallarm.com)にお問い合わせください。

## ユースケース

すべてのサポートされている[Wallarmデプロイメントオプション](../../../installation/supported-deployment-options.ja.md)の中で、このソリューションは以下の**ユースケース**に対して推奨されています:

* 既存のIngressコントローラ（例: AWS ALB Ingressコントローラ）があるインフラストラクチャにセキュリティソリューションをデプロイすることを阻止しているため、セキュリティソリューションを探しています。」 セキュリティソリューション
* ゼロトラスト環境で、各マイクロサービス（内部APIを含む）がセキュリティソリューションによって保護される必要がある
* セキュリティソリューションがポッドがVPCに到達できるようにする必要がある
* セキュリティソリューションは、AWS API Gatewayのようなトラフィックをルーティングするサードパーティサービスと互換性がある必要がある

## トラフィックの流れ

Wallarmサイドカープロキシなしのトラフィックフロー:

![!Wallarmサイドカープロキシなしのトラフィックフロー](../../../images/waf-installation/kubernetes/sidecar-controller/traffic-flow-without-wallarm.png)

Wallarmサイドカープロキシ付きのトラフィックフロー:

![!Wallarmサイドカープロキシ付きのトラフィックフロー](../../../images/waf-installation/kubernetes/sidecar-controller/traffic-flow-with-wallarm.png)

## ソリューションアーキテクチャ

Wallarm Sidecarプロキシソリューションは、以下のDeploymentオブジェクトによって構成されています:

* **サイドカーコントローラー** (`wallarm-sidecar-controller`) は、Helmチャートの値とPodのアノテーションに基づいてそれを設定し、ノードコンポーネントをWallarm Cloudに接続する、WallarmサイドカープロキシリソースをPodにインジェクトする[mutating admission webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)です。

    Kubernetesで`wallarm-sidecar: enabled`ラベルを持つ新しいPodが開始されると、コントローラは自動的に、Podに流入するトラフィックをフィルタリングする追加のコンテナを挿入します。
* **Postanalyticsモジュール** (`wallarm-sidecar-postanalytics`) は、Wallarmサイドカープロキシソリューションのローカルデータアナリティクスバックエンドです。モジュールは、in-memoryストレージTarantoolといくつかのヘルパーコンテナ（例: collectd, attack export services）のセットを使用します。

![!Wallarmデプロイメントオブジェクト](../../../images/waf-installation/kubernetes/sidecar-controller/deployment-objects.png)

Wallarmサイドカープロキシは、そのライフサイクルで2つの標準的な段階があります:

1. **初期**段階では、コントローラはWallarmサイドカープロキシリソースをPodにインジェクトし、Helmチャートの値とPodのアノテーションに基づいてそれを設定し、ノードコンポーネントをWallarm Cloudに接続します。
1. **実行時**段階では、ソリューションは、Postanalyticsモジュールを使用してリクエストを分析し、プロキシ/フォワーディングします。

## 要件

--8<-- "../include/waf/installation/sidecar-proxy-reqs.ja.md"

## デプロイメント

Wallarmサイドカープロキシソリューションをデプロイするには:

1. Wallarmノードを作成する。
1. Wallarm Helmチャートをデプロイする。
1. WallarmサイドカープロキシをアプリケーションPodにアタッチする。
1. Wallarmサイドカープロキシの動作をテストする。

### ステップ1: Wallarmノードの作成

1. 以下のリンクからWallarm Console → **Nodes** を開く:

    * https://us1.my.wallarm.com/nodes USクラウド用
    * https://my.wallarm.com/nodes EUクラウド用
1. **Wallarm node**タイプのフィルタリングノードを作成し、生成されたトークンをコピーする。
    
    ![!Wallarmノードの作成](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)

### ステップ2: Wallarm Helmチャートのデプロイ

1. [Wallarmチャートリポジトリ](https://charts.wallarm.com/)を追加する:
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. `values.yaml`ファイルを作成し、[Wallarmサイドカープロキシ設定](customization.ja.md)を記述する。

    最小構成のファイルの例：

    === "USクラウド"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              host: "us1.api.wallarm.com"
        ```
    === "EUクラウド"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
        ```    
    
    `<NODE_TOKEN>`は、Kubernetesで実行されるWallarmノードのトークンです。

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.ja.md"
1. Wallarm Helmチャートをデプロイする:

    ``` bash
    helm install --version 4.4.5 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`は、Wallarm SidecarプロキシチャートのHelmリリースの名前です
    * `wallarm-sidecar`は、Wallarm Sidecarプロキシチャートが含まれるHelmリリースをデプロイする新しいネームスペースで、別のネームスペースにデプロイすることが推奨されます
    * `<PATH_TO_VALUES>`は`values.yaml`ファイルへのパスです

### ステップ3: WallarmサイドカープロキシをアプリケーションPodにアタッチ

アプリケーションのトラフィックをWallarmでフィルタリングするために、対応するアプリケーションPodに`wallarm-sidecar: enabled`ラベルを追加する:

```bash
kubectl edit deployment -n <KUBERNETES_NAMESPACE> <APP_LABEL_VALUE>
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

* `wallarm-sidecar`アプリケーションPodラベルが`disabled`に設定されているか、明示的に指定されていない場合、WallarmサイドカーコンテナはPodにインジェクトされず、Wallarmはトラフィックをフィルタリングしない。
* `wallarm-sidecar`アプリケーションPodラベルが`enabled`に設定されている場合、WallarmサイドカーコンテナはPodにインジェクトされ、Wallarmは流入トラフィックをフィルタリングする。### ステップ4：Wallarm Sidecarプロキシの動作をテストする

Wallarm Sidecarプロキシが正しく動作していることをテストするには：

1. Wallarmポッドの詳細を取得し、正常に起動されたか確認します：

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-sidecar
    ```

    各ポッドには、次のように表示される必要があります：**READY: N/N** および **STATUS: Running** 例：

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-f7jtb      1/1     Running   0          91m
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Wallarmサイドカーコントローラが正常にインジェクトされたか確認するために、アプリケーションのポッド詳細を取得します：

    ```bash
    kubectl get pods --selector app=<APP_LABEL_VALUE>
    ```

    出力は、**READY: 2/2** がサイドカーコンテナの成功したインジェクションを指し、**STATUS: Running** がWallarmクラウドへの成功した接続を指すべきです：

    ```
    NAME                     READY   STATUS    RESTARTS   AGE
    myapp-5c48c97b66-lzkwf   2/2     Running   0          3h4m
    ```
1. Wallarmがトラフィックをフィルタリングするために有効になっているアプリケーションクラスターアドレスにテスト [Path Traversal](../../../attacks-vulns-list.ja.md#path-traversal) 攻撃を送信します：

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    Wallarmプロキシはデフォルトで **モニタリング**[フィルタリングモード](../../../admin-en/configure-wallarm-mode.ja.md)で動作するため、Wallarmノードは攻撃をブロックせずに登録します。

    攻撃が登録されたことを確認するには、Wallarmコンソール → **Events** に進みます：

    ![!Attacks in the interface](../../../images/admin-guides/test-attacks-quickstart.png)

## カスタマイズ

Wallarmポッドは、[デフォルトの`values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml)と2番目のデプロイメントステップで指定したカスタム設定に基づいてインジェクトされました。

Wallarmプロキシの動作を、グローバルレベルとper-podレベルの両方でさらにカスタマイズし、Wallarmソリューションを最大限活用できます。

[Wallarmプロキシソリューションのカスタマイズガイド](customization.ja.md)に進んでください。