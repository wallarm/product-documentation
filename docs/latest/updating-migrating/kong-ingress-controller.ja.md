[ip-lists-docs]: ../user-guides/ip-lists/overview.ja.md

# Wallarm統合Kong Ingressコントローラをアップグレードする

これらの手順は、デプロイされたWallarm KongベースのIngress Controller 4.xをWallarmノード4.4で新しいバージョンにアップグレードする手順を説明しています。

## 要件

--8<-- "../include/waf/installation/kong-ingress-controller-reqs.ja.md"

## ステップ1：Wallarm Helmチャートリポジトリを更新する

```bash
helm repo update wallarm
```

## ステップ2：すべての来K8sマニフェストの変更をチェックアウトする

予期しないIngressコントローラの変更を回避するために、[Helm Diff Plugin](https://github.com/databus23/helm-diff)を使用してすべての来K8sマニフェストの変更をチェックアウトしてください。このプラグインは、デプロイされたIngressコントローラのバージョンと新しいバージョンのK8sマニフェストの間の差分を出力します。

プラグインをインストールして実行するには：

1. プラグインをインストールする：

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインを実行する：

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.4.3 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: IngressコントローラーチャートのHelmリリース名
    * `<NAMESPACE>`: Ingressコントローラーをデプロイしている名前空間
    * `<PATH_TO_VALUES>`: Ingressコントローラ4.4の設定を定義した`values.yaml`ファイルへのパス－以前のIngressコントローラバージョンを実行するために作成したものを使用できます
3. 実行中のサービスの安定性に影響を与える変更がないことを確認し、stdoutのエラーを注意深く確認してください。

    stdoutが空の場合は、`values.yaml`ファイルが有効であることを確認してください。

## ステップ3：Ingressコントローラをアップグレードする

デプロイされたKong Ingressコントローラをアップグレードします：

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.4.3 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: IngressコントローラーチャートのHelmリリース名
* `<NAMESPACE>`: Ingressコントローラーをデプロイしている名前空間
* `<PATH_TO_VALUES>`: Ingressコントローラ4.4の設定を定義した`values.yaml`ファイルへのパス－以前のIngressコントローラバージョンを実行するために作成したものを使用できます

## ステップ4：アップグレードされたIngressコントローラをテストする

1. Helmチャートのバージョンがアップグレードされたことを確認します：

    ```bash
    helm list -n <NAMESPACE>
    ```

    ここで、`<NAMESPACE>`はIngressコントローラがデプロイされている名前空間です。

    チャートのバージョンは`kong-4.4.0`に対応する必要があります。
1. Wallarmポッドの詳細が正常に開始されたことを確認する：

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    各ポッドは以下の内容を表示する必要があります：**READY：N / N**および**STATUS：Running**、例：

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. テスト[Path Traversal](../attacks-vulns-list.ja.md#path-traversal)攻撃をKong Ingress Controller Serviceに送信します：

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    新しいバージョンのソリューションが以前のバージョンで行ったように悪意のあるリクエストを処理することを確認します。