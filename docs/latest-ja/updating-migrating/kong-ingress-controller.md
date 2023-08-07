[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# Wallarmモジュールが統合されたKong Ingressコントローラーのアップグレード

これらの指示は、デプロイされたWallarm KongベースのIngress Controller 4.xをWallarm node 4.6が含まれた新バージョンにアップグレードする手順を説明します。

## 必要条件

--8<-- "../include/waf/installation/kong-ingress-controller-reqs.md"

## ステップ1：Wallarm Helmチャートリポジトリを更新する

```bash
helm repo update wallarm
```

## ステップ2：すべての来るK8sマニフェストの変更を確認する

予想外に変更されたIngressコントローラーの振る舞いを避けるために、[Helm Diffプラグイン](https://github.com/databus23/helm-diff)を使用して、すべての来るK8sマニフェストの変更を確認します。このプラグインは、デプロイされたIngressコントローラーのバージョンと新しいバージョンのK8sマニフェストの違いを出力します。

プラグインをインストールして実行するには：

1. プラグインをインストールします。

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインを実行します。

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.1 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: IngressコントローラーチャートのHelmリリースの名前
    * `<NAMESPACE>`: Ingressコントローラーがデプロイされているネームスペース
    * `<PATH_TO_VALUES>`: Ingressコントローラー4.6の設定を定義する`values.yaml`ファイルへのパス - 以前のIngressコントローラーバージョンの実行のために作成したものを使用することができます
3. 実行中のサービスの安定性に影響を与える変更がないことを確認し、stdoutからのエラーを慎重に調査します。

    stdoutが空の場合は、`values.yaml`ファイルが有効であることを確認します。

## ステップ3：イングレンスコントローラーをアップグレードする

デプロイされたKong Ingressコントローラーをアップグレードします：

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.1 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: IngressコントローラーチャートのHelmリリースの名前
* `<NAMESPACE>`: Ingressコントローラーがデプロイされているネームスペース
* `<PATH_TO_VALUES>`: Ingressコントローラーチャート部署4.6設定を定義する`values.yaml`ファイルへのパス - 以前のIngressコントローラーバージョンの実行のために作成したものを使用することができます

## ステップ4：アップグレードされたIngressコントローラーをテストする

1. Helmチャートのバージョンがアップグレードされたことを確認します：

    ```bash
    helm list -n <NAMESPACE>
    ```

    ここで`<NAMESPACE>`は、IngressコントローラーのHelmチャートがデプロイされているネームスペースです。

    チャートのバージョンは`kong-4.6.0`に対応しているべきです。
1. Wallarm podの詳細を取得して、成功して開始されたことを確認します：

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    各ポッドは次のような状況を表示するべきです： **READY: N/N**および**STATUS: Running**、例えば：

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Kong Ingress Controller Serviceへのテスト用[Path Traversal](../attacks-vulns-list.md#path-traversal)攻撃を送信します：

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    新しいバージョンのソリューションが、前のバージョンと同様に悪意あるリクエストを処理することを確認します。