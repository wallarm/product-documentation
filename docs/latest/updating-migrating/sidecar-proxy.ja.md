[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# Wallarm Sidecar プロキシのアップグレード

これらの手順は、Wallarm Sidecar プロキシ 4.x を Wallarm ノード 4.4 を備えた新しいバージョンにアップグレードする方法を説明しています。

## 要件

--8<-- "../include/waf/installation/sidecar-proxy-reqs.ja.md"

## ステップ1：Wallarm Helmチャートリポジトリを更新する

```bash
helm repo update wallarm
```

## ステップ2：すべての来るK8sマニフェストの変更をチェックアウトする

予期しない Sidecar プロキシの動作の変更を防ぐために、[Helm Diff プラグイン](https://github.com/databus23/helm-diff)を使用して、すべての来るK8sマニフェストの変更をチェックアウトしてください。このプラグインは、デプロイされた Sidecar プロキシバージョンのK8sマニフェストと新しいものの違いを出力します。

プラグインをインストールして実行するには：

1. プラグインをインストールする:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインを実行する:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.4.5 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Sidecar プロキシチャートの Helm リリースの名前
    * `<NAMESPACE>`: Sidecar プロキシがデプロイされている名前空間
    * `<PATH_TO_VALUES>`: Sidecar プロキシ 4.4 の設定を定義する `values.yaml` ファイルへのパス - 以前の Sidecar プロキシバージョンを実行するために作成されたものを使用できます
3. 実行中のサービスの安定性に影響を与える変更がないことを確認し、stdout からのエラーを注意深く調べてください。

    stdout が空の場合は、`values.yaml` ファイルが有効であることを確認してください。

## ステップ3：Sidecar プロキシソリューションのアップグレード

Sidecar プロキシソリューションのデプロイ済みコンポーネントをアップグレードする：

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.4.5 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: デプロイされた Sidecar プロキシチャートのHelmリリースの名前
* `<NAMESPACE>`: Sidecar プロキシがデプロイされている名前空間
* `<PATH_TO_VALUES>`: Sidecar プロキシ 4.4 の設定を定義する `values.yaml` ファイルへのパス - 以前の Sidecar プロキシバージョンを実行するために作成されたものを使用できます

## ステップ4：アップグレードされた Sidecar ソリューションをテストする

1. Helm チャートのバージョンがアップグレードされたことを確認する：

    ```bash
    helm list -n <NAMESPACE>
    ```

    ここで、`<NAMESPACE>`はSidecarプロキシがデプロイされている名前空間です。

    チャートのバージョンは `wallarm-sidecar-1.1.5` に対応している必要があります。
1. Wallarm ポッドの詳細を取得して、正常に開始されたことを確認します：

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-sidecar
    ```

    各ポッドは、次のように表示される必要があります：**READY: N/N**および**STATUS: Running**、例えば：

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-f7jtb      1/1     Running   0          91m
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. テスト [Path Traversal](../attacks-vulns-list.md#path-traversal) 攻撃をアプリケーションクラスタのアドレスに送信する：

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    要求されたアプリケーションPodには、`wallarm-sidecar: enabled`ラベルが付いている必要があります。

    新しいバージョンのソリューションが、前のバージョンで行っていたように、悪意のあるリクエストを処理していることを確認します。