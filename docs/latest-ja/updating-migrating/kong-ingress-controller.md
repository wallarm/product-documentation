[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# Wallarmモジュール統合済みKong Ingress Controllerのアップグレード方法

本手順は、デプロイされたWallarmのKongベースIngress Controller 4.xを、Wallarm node 4.6搭載の新バージョンにアップグレードする手順について説明します。

## 前提条件

--8<-- "../include/waf/installation/kong-ingress-controller-reqs.md"

## 手順 1: Wallarm Helmチャートリポジトリの更新

```bash
helm repo update wallarm
```

## 手順 2: 追加されるすべてのK8sマニフェストの変更内容を確認

予期せぬIngress Controllerの動作変更を回避するため、[Helm Diff Plugin](https://github.com/databus23/helm-diff)を使用し、追加されるすべてのK8sマニフェストの変更内容を確認してください。このプラグインは、デプロイ済みのIngress Controllerバージョンと新しいバージョンのK8sマニフェスト間の差分を出力します。

プラグインをインストールして実行するには:

1. プラグインをインストールします:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインを実行します:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`：Ingress ControllerチャートのHelmリリース名です
    * `<NAMESPACE>`：Ingress Controllerチャートがデプロイされているnamespaceです
    * `<PATH_TO_VALUES>`：Ingress Controller 4.6の設定を定義した`values.yaml`ファイルへのパスです。以前のIngress Controllerバージョンで使用していたファイルを使用することができます
3. 変更により実行中のサービスの安定性に影響が及ばないことを確認し、stdoutに出力されるエラーを慎重に確認してください。

    もしstdoutが空の場合は、`values.yaml`ファイルが有効であることを確認してください。

## 手順 3: Ingress Controllerのアップグレード

デプロイされたKong Ingress Controllerをアップグレードします:

```bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`：Ingress ControllerチャートのHelmリリース名です
* `<NAMESPACE>`：Ingress Controllerチャートがデプロイされているnamespaceです
* `<PATH_TO_VALUES>`：Ingress Controller 6の設定を定義した`values.yaml`ファイルへのパスです。以前のIngress Controllerバージョンで使用していたファイルを使用することができます

## 手順 4: アップグレードされたIngress Controllerのテスト

1. Helmチャートのバージョンがアップグレードされたことを確認してください:

    ```bash
    helm list -n <NAMESPACE>
    ```

    ここで`<NAMESPACE>`はIngress Controllerチャートがデプロイされているnamespaceです。

    チャートバージョンは`kong-4.6.3`に一致している必要があります。
2. Wallarmのpodの詳細を取得して、正常に起動したことを確認してください:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    各podは次の情報を表示している必要があります：**READY: N/N**および**STATUS: Running**．例:

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
3. Kong Ingress Controller Serviceへテスト用の[Path Traversal](../attacks-vulns-list.md#path-traversal)攻撃を送信してください:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    新バージョンのソリューションが、前バージョンと同様に悪意のあるリクエストを処理することを確認してください.