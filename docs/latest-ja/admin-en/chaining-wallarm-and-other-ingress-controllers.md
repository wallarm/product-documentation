[node-token-types]:                      ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[nginx-ing-create-node-img]:             ../images/user-guides/nodes/create-wallarm-node-name-specified.png

# 同一Kubernetesクラスター内でのWallarmと追加Ingressコントローラーのチェーン構成

本手順では、K8sクラスターにWallarm Ingressコントローラーをデプロイし、すでに環境で稼働している他のコントローラーとチェーン構成にする方法を説明します。

## 本ソリューションが対応する課題

Wallarmは、[Community Ingress NGINX Controller上に構築されたIngress Controller](installation-kubernetes-en.md)など、複数のフォームファクターでノードソフトウェアを提供します。

すでにIngressコントローラーを使用している場合、既存のIngressコントローラーをWallarmコントローラーに置き換えるのは難しいことがあります(例: AWS ALB Ingress Controllerを使用している場合)。その際は[Wallarm Sidecarソリューション](../installation/kubernetes/sidecar-proxy/deployment.md)の検討をおすすめしますが、それでもインフラに適合しない場合は、複数のIngressコントローラーをチェーン構成にすることが可能です。

Ingressコントローラーのチェーン構成により、エンドユーザーからのリクエストを既存のコントローラーでクラスターに取り込み、必要なアプリケーション保護を提供するための追加のWallarm Ingressコントローラーをデプロイできます。

## 要件

* Kubernetesプラットフォームバージョン 1.26-1.30
* [Helm](https://helm.sh/)パッケージマネージャー
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス
* US Wallarm Cloudで作業するための`https://us1.api.wallarm.com`、またはEU Wallarm Cloudで作業するための`https://api.wallarm.com`へのアクセス
* Wallarm Helmチャートを追加するための`https://charts.wallarm.com`へのアクセス。ファイアウォールでアクセスがブロックされていないことを確認します
* Docker HubのWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセス。ファイアウォールでアクセスがブロックされていないことを確認します
* 攻撃検知ルールや[API仕様](../api-specification-enforcement/overview.md)の更新をダウンロードし、さらに国、地域、データセンターごとの正確なIPを取得するために、以下のIPアドレスへのアクセス([allowlisted, denylisted, or graylisted](../user-guides/ip-lists/overview.md)の対象に対して)

    --8<-- "../include/wallarm-cloud-ips.md"
* Ingressコントローラーが稼働しているKubernetesクラスターがデプロイ済みであること

## Wallarm Ingressコントローラーのデプロイと追加Ingressコントローラーとのチェーン構成

Wallarm Ingressコントローラーをデプロイして追加のコントローラーとチェーン構成にするには、次の手順を実行します。

1. 既存のIngressコントローラーとは異なるIngressクラス値を使用して、公式のWallarmコントローラーHelmチャートをデプロイします。
1. 次の条件でWallarm専用のIngressオブジェクトを作成します。

    * Wallarm Ingress Helmチャートの`values.yaml`に指定したものと同じ`ingressClass`。
    * 既存のIngressコントローラーと同様に構成されたIngressコントローラーのリクエストルーティングルール。

    !!! info "Wallarm Ingressコントローラーはクラスター外部には公開されません"
        Wallarm Ingressコントローラーは、サービスに`ClusterIP`を使用します。つまり、クラスター外部には公開されません。
1. 既存のIngressコントローラーを再構成し、アプリケーションサービスではなく、新しいWallarm Ingressコントローラーに着信リクエストを転送します。
1. Wallarm Ingressコントローラーの動作をテストします。

### Step 1: Wallarm Ingressコントローラーをデプロイする

1. [適切な種類][node-token-types]のフィルタリングノードトークンを生成します。

    === "APIトークン(Helmチャート4.6.8以上)"
        1. Wallarm Console → **Settings** → **API tokens**( [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) または [EU Cloud](https://my.wallarm.com/settings/api-tokens) )を開きます。
        1. 使用タイプが`Node deployment/Deployment`のAPIトークンを探すか作成します。
        1. このトークンをコピーします。
    === "ノードトークン"
        1. Wallarm Console → **Nodes**( [US Cloud](https://us1.my.wallarm.com/nodes) または [EU Cloud](https://my.wallarm.com/nodes) )を開きます。
        1. **Wallarm node**タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。
            
            ![Wallarmノードの作成][nginx-ing-create-node-img]
1. [Wallarm Helmチャートリポジトリ](https://charts.wallarm.com/)を追加します:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update
    ```
1. 次のWallarm構成で`values.yaml`ファイルを作成します。

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

    さらに多くの構成オプションについては、[リンク](configure-kubernetes-en.md)をご参照ください。
1. Wallarm Ingress Helmチャートをインストールします:
    ``` bash
    helm install --version 6.4.0 internal-ingress wallarm/wallarm-ingress -n wallarm-ingress -f values.yaml --create-namespace
    ```

    * `internal-ingress`はHelmリリース名です
    * `values.yaml`は前の手順で作成したHelm値のYAMLファイルです
    * `wallarm-ingress`はHelmチャートをインストールするネームスペースです(存在しない場合は作成されます)
1. Wallarm Ingressコントローラーが起動して稼働中であることを確認します:

    ```bash
    kubectl get pods -n wallarm-ingress
    ```

    Wallarmポッドのステータスは**STATUS: Running**、**READY: N/N**である必要があります:

    ```
    NAME                                                                  READY   STATUS    RESTARTS   AGE
    ingress-controller-wallarm-ingress-controller-6d659bd79b-952gl        3/3     Running   0          8m7s
    ingress-controller-wallarm-ingress-controller-wallarm-wstore-7ddmgbfm 3/3     Running   0          8m7s
    ```

### Step 2: Wallarm専用の`ingressClassName`を指定したIngressオブジェクトを作成する

前の手順の`values.yaml`で構成したものと同じ`ingressClass`名でIngressオブジェクトを作成します。

Ingressオブジェクトは、アプリケーションをデプロイしているのと同じネームスペースに配置する必要があります。例:

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

### Step 3: 既存のIngressコントローラーを再構成してWallarmにリクエストを転送する

既存のIngressコントローラーを再構成し、アプリケーションサービスではなく新しいWallarm Ingressコントローラーに着信リクエストを転送するには、次のようにします。

* `ingressClass`名が`nginx`となるIngressオブジェクトを作成します。これはデフォルト値です。異なる場合は自身の値に置き換えることができます。 
* IngressオブジェクトはWallarm Ingressチャートと同じネームスペースに配置する必要があります。この例では`wallarm-ingress`です。
* `spec.rules[0].http.paths[0].backend.service.name`の値は、Helmリリース名と`.Values.nameOverride`で構成されるWallarm Ingressコントローラーのサービス名である必要があります。

    名前を取得するには、次のコマンドを使用できます:
   
    ```bash
    kubectl get svc -l "app.kubernetes.io/component=controller" -n wallarm-ingress -o=jsonpath='{.items[0].metadata.name}'
    ```

    この例では、名前は`internal-ingress-wallarm-ingress-controller`です。

最終的な設定例:

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

### Step 4: Wallarm Ingressコントローラーの動作をテストする

既存の外部IngressコントローラーのロードバランサーのパブリックIPを取得します。例えば、`ingress-nginx`ネームスペースにデプロイされていると仮定します:

```bash
LB_IP=$(kubectl get svc -l "app.kubernetes.io/component=controller" -n ingress-nginx -o=jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')
```

既存のIngressコントローラーのアドレスにテストリクエストを送信し、期待どおりに動作していることを確認します:

```bash
curl -H "Host: www.example.com" ${LB_IP}/etc/passwd
```