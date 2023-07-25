# Wallarmおよび追加Ingressコントローラの同じKubernetesクラスタでの連鎖

これらの手順は、Wallarm IngressコントローラをK8sクラスタにデプロイし、すでに環境で実行されている他のコントローラとチェーンする方法を提供します。

## この解決策が対処する課題

Wallarmは、コミュニティIngress NGINXコントローラをベースにした[Ingressコントローラ](installation-kubernetes-en.ja.md)を含む、さまざまなフォームファクタでノードソフトウェアを提供します。

すでにIngressコントローラを使用している場合、既存のIngressコントローラとWallarmコントローラを置き換えることは難しいかもしれません（たとえば、AWS ALB Ingressコントローラを使用している場合）。この場合、[Wallarmサイドカープロキシソリューション](../installation/kubernetes/sidecar-proxy/deployment.ja.md)を試すことができますが、これもインフラストラクチャに適合しない場合は、複数のIngressコントローラをチェーンすることができます。

Ingressコントローラのチェーンでは、既存のコントローラを利用してエンドユーザーリクエストをクラスタに転送し、追加のWallarm Ingressコントローラをデプロイして必要なアプリケーション保護を提供できます。

## 要件

* Kubernetesプラットフォームバージョン1.24-1.26
* [Helm](https://helm.sh/)パッケージマネージャ
* Wallarm Consoleで**Administrator**ロールのアカウントへのアクセス[USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)
* US Wallarm Cloudで作業するには`https://us1.api.wallarm.com`、EU Wallarm Cloudで作業するには`https://api.wallarm.com`へのアクセス
* Wallarm Helmチャートを追加するための`https://charts.wallarm.com`へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認してください
* Docker HubのWallarmリポジトリ `https://hub.docker.com/r/wallarm`へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認してください
* [許可リスト、拒否リスト、またはグレーリスト](../user-guides/ip-lists/overview.ja.md)の国、地域、またはデータセンターに登録されているIPアドレスの実際のリストをダウンロードするための[GCPストレージアドレス](https://www.gstatic.com/ipranges/goog.json)へのアクセス
* Ingressコントローラを実行しているKubernetesクラスタがデプロイされていること

## Wallarm Ingressコントローラをデプロイし、追加のIngressコントローラとチェーンする

Wallarm Ingressコントローラをデプロイし、追加のコントローラとチェーンするには：

1. 既存のIngressコントローラとは異なるIngressクラス値を使用して、公式のWallarmコントローラHelmチャートをデプロイします。
1. 以下のものでWallarm特有のIngressオブジェクトを作成します：

    * Wallarm Ingress Helmチャートの`values.yaml`で指定された同じ`ingressClass`。
    * 既存のIngressコントローラと同じように設定されたIngressコントローラのリクエストルーティングルール。

    !!! info "Wallarm Ingressコントローラはクラスタ外に公開されません"
        Wallarm Ingressコントローラは`ClusterIP`を使用しているため、クラスタ外には公開されないことに注意してください。
1. 既存のIngressコントローラを再設定し、アプリケーションサービスの代わりに新しいWallarm Ingressコントローラーに着信リクエストを転送します。
1. Wallarm Ingressコントローラの動作をテストします。

### ステップ1：Wallarm Ingressコントローラをデプロイする

1. Wallarm Console→**Nodes**に移動します：以下のリンクを使用してください。
    * 米国クラウドの場合：https://us1.my.wallarm.com/nodes
    * EUクラウドの場合：https://my.wallarm.com/nodes
1. **Wallarmノード**タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。

    ![!Wallarmノードの作成](../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. [Wallarm Helmチャートリポジトリ](https://charts.wallarm.com/)を追加します：

    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update
    ```
1. 次のWallarm構成で`values.yaml`ファイルを作成します。

    === "USクラウド"
        ```bash
        controller:
          wallarm:
            enabled: true
            token: "<NODE_TOKEN>"
            apiHost: us1.api.wallarm.com
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
    === "EUクラウド"
        ```bash
        controller:
          wallarm:
            enabled: true
            token: "<NODE_TOKEN>"
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
    
    `<NODE_TOKEN>`はWallarmノードトークンです。

    より多くの構成オプションを学ぶには、[リンク](configure-kubernetes-en.ja.md)を使用してください。
1. Wallarm Ingress Helmチャートをインストールします：
    ``` bash
    helm install --version 4.4.8 internal-ingress wallarm/wallarm-ingress -n wallarm-ingress -f values.yaml --create-namespace
    ```

    * `internal-ingress`はHelmリリースの名前です
    * `values.yaml`は前のステップで作成されたHelm値のYAMLファイルです
    * `wallarm-ingress`はHelmチャートをインストールする名前空間です（作成されます）
1. Wallarm Ingressコントローラが起動し、実行中であることを確認します：

    ```bash
    kubectl get pods -n wallarm-ingress
    ```

    各ポッドの状態は**STATUS：Running**または**READY： N/N**である必要があります。例：

    ```
    NAME                                                             READY   STATUS    RESTARTS   AGE
    internal-ingress-wallarm-ingress-controller-6d659bd79b-952gl      4/4     Running   0          8m7s
    internal-ingress-wallarm-ingress-controller-wallarm-tarant64m44   5/5     Running   0          8m7s
    ```### ステップ2：Wallarm固有の `ingressClassName` を持つIngressオブジェクトを作成

前のステップで `values.yaml` で設定された `ingressClass` 名と同じIngressオブジェクトを作成します。

Ingressオブジェクトは、デプロイされたアプリケーションと同じ名前空間内にある必要があります。例：

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

### ステップ3：既存のIngressコントローラーを再構成して、Wallarmにリクエストを転送

既存のIngressコントローラーを次のように再構成して、新しいWallarm Ingressコントローラーにリクエストを転送するようにし、アプリケーションサービスには転送しないようにします。

* `ingressClass` 名が `nginx` になるようにIngressオブジェクトを作成します。デフォルト値であることに注意してください。値が異なる場合は、独自の値に置き換えることができます。
* Ingressオブジェクトは、Wallarm Ingress Chartと同じ名前空間内にある必要があります。例では `wallarm-ingress` です。
* `spec.rules[0].http.paths[0].backend.service.name` の値は、Helmリリース名と `.Values.nameOverride` で構成されるWallarm Ingressコントローラーサービスの名前でなければなりません。

    名前を取得するには、次のコマンドを使用できます。
   
    ```bash
    kubectl get svc -l "app.kubernetes.io/component=controller" -n wallarm-ingress -o=jsonpath='{.items[0].metadata.name}'
    ```

    例では、名前は `internal-ingress-wallarm-ingress-controller` です。

結果の設定例：

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

### ステップ4：Wallarm Ingressコントローラーの動作をテスト

既存の外部IngressコントローラーのLoad BalancerのパブリックIPを取得します。例えば、それは `ingress-nginx` 名前空間にデプロイされているとしましょう：

```bash
LB_IP=$(kubectl get svc -l "app.kubernetes.io/component=controller" -n ingress-nginx -o=jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')
```

既存のIngressコントローラーアドレスにテストリクエストを送信し、システムが期待通りに動作していることを確認します：

```bash
curl -H "Host: www.example.com" ${LB_IP}/etc/passwd
```