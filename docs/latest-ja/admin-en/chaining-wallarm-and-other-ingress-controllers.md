[node-token-types]:                      ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[nginx-ing-create-node-img]:             ../images/user-guides/nodes/create-wallarm-node-name-specified.png

# 同一Kubernetesクラスタ内でのWallarmと追加Ingress Controllerのチェーン構成

この手順では、K8sクラスタにWallarm Ingress Controllerをデプロイし、すでに稼働中の他のControllerとチェーン構成する手順を示します。

## ソリューションで解決する問題

Wallarmは[Community Ingress NGINX Controller上に構築されたIngress Controller](installation-kubernetes-en.md)を含む、さまざまな形態のノードソフトウェアを提供します。

既にIngress Controllerを使用している場合、既存のIngress Controller（例：AWS ALB Ingress Controller）をWallarm Controllerに置き換えるのは困難な場合があります。この場合、[Wallarm Sidecarソリューション](../installation/kubernetes/sidecar-proxy/deployment.md)を検討できますが、インフラに合わない場合は複数のIngress Controllerをチェーン構成することも可能です。

Ingress Controllerのチェーン構成により、既存のControllerを利用してエンドユーザーリクエストをクラスタに届け、追加のWallarm Ingress Controllerをデプロイして必要なアプリケーション保護を提供できます。

## 必要条件

* Kubernetesプラットフォームバージョン 1.24-1.30
* [Helm](https://helm.sh/)パッケージマネージャー
* Wallarm Consoleで**Administrator**ロールを持ち、二要素認証が無効化されたアカウントにアクセスできること（[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)）
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com`にアクセスできること
* Wallarm Helmチャートを追加するために`https://charts.wallarm.com`にアクセスできること。ファイアウォールでアクセスがブロックされていないことを確認してください
* Docker Hub上のWallarmリポジトリ`https://hub.docker.com/r/wallarm`にアクセスできること。ファイアウォールでアクセスがブロックされていないことを確認してください
* 以下のIPアドレスにアクセスできること。これにより、攻撃検出ルールのアップデートおよび[API仕様](../api-specification-enforcement/overview.md)の取得、さらに[ホワイトリスト、ブラックリスト、またはグレイリスト](../user-guides/ip-lists/overview.md)に登録された国、地域、データセンターの正確なIPを取得できます

    --8<-- "../include/wallarm-cloud-ips.md"
* Ingress Controllerが稼働しているKubernetesクラスタがデプロイされていること

## Wallarm Ingress Controllerのデプロイと追加Ingress Controllerとのチェーン構成

Wallarm Ingress Controllerをデプロイし、追加Controllerとチェーン構成するには、以下の手順に従います。

1. 既存のIngress Controllerと異なるIngressクラスの値を使用して、公式Wallarm ControllerのHelmチャートをデプロイします。
1. 以下の条件を満たすWallarm専用Ingressオブジェクトを作成します:

    * Wallarm Ingress Helmチャートの`values.yaml`で指定したのと同じ`ingressClass`を使用
    * 既存のIngress Controllerと同様にIngress Controllerリクエストルーティングルールを構成

    !!! info "Wallarm Ingress Controllerはクラスタ外に公開されません"
        Wallarm Ingress Controllerはそのサービスに`ClusterIP`を使用するため、クラスタ外に公開されないことにご注意ください。
1. 既存のIngress Controllerを再構成し、アプリケーションサービスの代わりに新しいWallarm Ingress Controllerへリクエストを転送するように設定します。
1. Wallarm Ingress Controllerの動作をテストします。

### 手順1: Wallarm Ingress Controllerのデプロイ

1. [適切なタイプ][node-token-types]のフィルタリングノードトークンを生成します:

    === "API token (Helm chart 4.6.8 and above)"
        1. Wallarm Console → **Settings** → **API tokens**にアクセスし、[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)から操作します。
        1. `Deploy`ソースロールのAPIトークンを見つけるか作成します。
        1. このトークンをコピーします。
    === "Node token"
        1. Wallarm Console → **Nodes**にアクセスし、[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)から操作します。
        1. **Wallarm node**タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。
            
            ![Wallarmノードの作成][nginx-ing-create-node-img]
1. [Wallarm Helmチャートリポジトリ](https://charts.wallarm.com/)を追加します:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update
    ```
1. 以下のWallarm構成を含む`values.yaml`ファイルを作成します:

    === "US Cloud"
        ```bash
        controller:
          wallarm:
            enabled: true
            token: "<NODE_TOKEN>"
            apiHost: us1.api.wallarm.com
            # nodeGroup: defaultIngressGroup
          config:
            use-forwarded-headers: "true"  
          ingressClass: wallarm-ingress
          ingressClassResource:
            name: wallarm-ingress
            controllerValue: "k8s.io/wallarm-ingress"
          service:
            type: ClusterIP
        nameOverride: wallarm-ingress
        ```
    === "EU Cloud"
        ```bash
        controller:
          wallarm:
            enabled: true
            token: "<NODE_TOKEN>"
            # nodeGroup: defaultIngressGroup
          config:
            use-forwarded-headers: "true"
          ingressClass: wallarm-ingress
          ingressClassResource:
            name: wallarm-ingress
            controllerValue: "k8s.io/wallarm-ingress"
          service:
            type: "ClusterIP"
        nameOverride: wallarm-ingress
        ```    
    
    * `<NODE_TOKEN>`はWallarmノードトークンです。
    * APIトークンを使用する場合は、`nodeGroup`パラメータにノードグループ名を指定します。ノードはこのグループに割り当てられ、Wallarm Consoleの**Nodes**セクションに表示されます。デフォルトのグループ名は`defaultIngressGroup`です。

    詳細な構成オプションについては、[こちら](configure-kubernetes-en.md)のリンクをご参照ください。
1. Wallarm Ingress Helmチャートをインストールします:
    ``` bash
    helm install --version 5.3.0 internal-ingress wallarm/wallarm-ingress -n wallarm-ingress -f values.yaml --create-namespace
    ```

    * `internal-ingress`はHelmリリースの名前です
    * `values.yaml`は前ステップで作成したHelmの値を含むYAMLファイルです
    * `wallarm-ingress`はHelmチャートをインストールする名前空間で、存在しない場合は作成されます
1. Wallarm Ingress Controllerが起動していることを確認します:

    ```bash
    kubectl get pods -n wallarm-ingress
    ```

    各Podのステータスは**STATUS: Running**または**READY: N/N**である必要があります。例:

    ```
    NAME                                                             READY   STATUS    RESTARTS   AGE
    internal-ingress-wallarm-ingress-controller-6d659bd79b-952gl      3/3     Running   0          8m7s
    internal-ingress-wallarm-ingress-controller-wallarm-tarant64m44   4/4     Running   0          8m7s
    ```

### 手順2: Wallarm専用の`ingressClassName`を利用したIngressオブジェクトの作成

前の手順で`values.yaml`に設定したのと同じ`ingressClass`名でIngressオブジェクトを作成します。

Ingressオブジェクトは、アプリケーションがデプロイされているのと同じ名前空間に配置する必要があります。例:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/wallarm-application: "1"
    nginx.ingress.kubernetes.io/wallarm-mode: monitoring
  name: myapp-internal
  namespace: myapp
spec:
  ingressClassName: wallarm-ingress
  rules:
  - host: www.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp
            port:
              number: 80
```

### 手順3: 既存のIngress Controllerを再構成し、リクエストをWallarmに転送する

既存のIngress Controllerを再構成し、アプリケーションサービスの代わりに新しいWallarm Ingress Controllerへリクエストを転送する設定は、次の手順で実施します:

* `ingressClass`名を`nginx`に設定したIngressオブジェクトを作成します。これはデフォルト値ですが、異なる場合はご自身の値に置き換えてください。
* IngressオブジェクトはWallarm Ingress Chartと同じ名前空間（本例では`wallarm-ingress`）に配置します。
* `spec.rules[0].http.paths[0].backend.service.name`の値は、Helmリリース名と`.Values.nameOverride`で構成されるWallarm Ingress Controllerサービスの名前でなければなりません。

    名前を取得するには、以下のコマンドを使用できます:

    ```bash
    kubectl get svc -l "app.kubernetes.io/component=controller" -n wallarm-ingress -o=jsonpath='{.items[0].metadata.name}'
    ```

    本例では、名前は`internal-ingress-wallarm-ingress-controller`です。

以下は構成例です:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-external
  namespace: wallarm-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: www.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: internal-ingress-wallarm-ingress-controller
                port:
                  number: 80
```

### 手順4: Wallarm Ingress Controllerの動作テスト

既存の外部Ingress ControllerのLoad BalancerのパブリックIPを取得します。例として、`ingress-nginx`名前空間にデプロイされているとします:

```bash
LB_IP=$(kubectl get svc -l "app.kubernetes.io/component=controller" -n ingress-nginx -o=jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')
```

取得したLBのアドレスに対してテストリクエストを送信し、システムが期待通りに動作していることを確認します:

```bash
curl -H "Host: www.example.com" ${LB_IP}/etc/passwd
```