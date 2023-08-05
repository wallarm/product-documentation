[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# Wallarm Sidecar プロキシのアップグレード

これらの指示は、Wallarm Sidecar プロキシ 4.x を Wallarm ノード 4.6 を含む新バージョンにアップグレードする手順を説明しています。

## 要件

--8<-- "../include/waf/installation/sidecar-proxy-reqs.md"

## ステップ 1：Wallarm Helm チャートリポジトリを更新する

```bash
helm repo update wallarm
```

## ステップ 2：すべての新たな K8s マニフェスト変更を確認する

Sidecar プロキシの動作が予期せずに変更されないように、[Helm Diff Plugin](https://github.com/databus23/helm-diff) を使用してすべての新たな K8s マニフェスト変更を確認します。このプラグインは、展開された Sidecar プロキシバージョンの K8s マニフェストと新しいものとの差分を出力します。

プラグインのインストールと実行方法：

1. プラグインのインストール：

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインの実行：

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.6.4 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Sidecar プロキシチャートの Helm リリース名
    * `<NAMESPACE>`: Sidecar プロキシがデプロイされているネームスペース
    * `<PATH_TO_VALUES>`: Sidecar プロキシ 4.6 の設定を定義する `values.yaml` ファイルへのパス - 前の Sidecar プロキシバージョンの実行に作成したものを使用できます
3. 実行中のサービスの安定性に影響を及ぼす変更がないことを確認し、stdout からのエラーを慎重に調査します。

    stdout が空の場合は、`values.yaml` ファイルが有効であることを確認します。

## ステップ 3：Sidecar プロキシソリューションのアップグレード

Sidecar プロキシソリューションのデプロイされたコンポーネントをアップグレードします：

```bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.6.4 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: デプロイされた Sidecar プロキシチャートの Helm リリース名
* `<NAMESPACE>`: Sidecar プロキシがデプロイされているネームスペース
* `<PATH_TO_VALUES>`: Sidecar プロキシ 4.6 の設定を定義する `values.yaml` ファイルへのパス - 前の Sidecar プロキシバージョンの実行に作成したものを使用できます

## ステップ 4：アップグレードされた Sidecar ソリューションのテスト

1. Helm chartのバージョンがアップグレードされたことを確認します：

    ```bash
    helm list -n <NAMESPACE>
    ```
   
    ここで、`<NAMESPACE>`は、Sidecarプロキシがデプロイされているネームスペースです。

    チャートバージョンは `wallarm-sidecar-1.1.5` に対応しているべきです。
1. Wallarm ポッドの詳細を取得して、正常に起動したかどうかを確認します：

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-sidecar
    ```

    各ポッドは次のように表示されるべきです：**READY: N/N** 及び **STATUS: Running**、例えば：

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-f7jtb      1/1     Running   0          91m
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. テスト [Path Traversal](../attacks-vulns-list.md#path-traversal) 攻撃をアプリケーションクラスターアドレスに送信します：

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    要求されたアプリケーション Pod は `wallarm-sidecar: enabled` ラベルを持つべきです。

    新バージョンのソリューションが、以前のバージョンと同様に悪意のあるリクエストを処理することを確認してください。