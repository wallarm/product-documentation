[ip-lists-docs]: ../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../api-specification-enforcement/overview.md

# Wallarm Sidecarのアップグレード

本手順では、Wallarm Sidecarソリューションのアップグレード手順を説明します。

## 要件

--8<-- "../include/waf/installation/sidecar-proxy-reqs-latest.md"

## ステップ1: Wallarm Helmチャートリポジトリの更新

```bash
helm repo update wallarm
```

## ステップ2: これから適用されるK8sマニフェストの変更内容を確認

想定外のSidecar動作の変更を防ぐため、[Helm Diff Plugin](https://github.com/databus23/helm-diff)を使用して、デプロイ済みSidecarバージョンと新バージョンのK8sマニフェスト間の差分を確認します。

プラグインのインストールと実行方法は以下の通りです。

1. プラグインをインストールします:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインを実行します:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n wallarm-sidecar wallarm/wallarm-sidecar --version 5.3.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`はWallarm Sidecar Helmリリースの名前です。
    * `wallarm-sidecar`はWallarm Sidecarソリューションをデプロイしたnamespaceです。当社の[デプロイガイド](../installation/kubernetes/sidecar-proxy/deployment.md)に従い、通常は`wallarm-sidecar`に設定されています。
    * `<PATH_TO_VALUES>`はSidecar設定を定義する`values.yaml`ファイルへのパスです。以前のSidecarバージョン実行時に作成したものを使用できます。
3. すべての変更が稼働中のサービスの安定性に影響しないことを確認し、stdoutのエラーを慎重に確認してください。

    stdoutが空の場合、`values.yaml`ファイルが有効であることを確認します。

## バージョン4.10.6または4.10.x以前からのアップグレード

リリース 4.10.7では互換性に破壊的な変更が導入されたため、ソリューションの再インストールが必要となります。admission webhook証明書の生成デフォルト方式は[`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen)プロセスに置き換えられました。アップグレード中に、新しい`certgen`プロセスにより証明書が自動生成されます。

さらに、本リリースでは[`cert-manager`を使用してadmission webhook証明書を提供するか、証明書を手動で指定する](../installation/kubernetes/sidecar-proxy/customization.md#certificates-for-the-admission-webhook)ことが可能です。

### ステップ3: 前バージョンのソリューションをアンインストール

```
helm uninstall <RELEASE_NAME> -n wallarm-sidecar
```

### ステップ4: 以前の証明書アーティファクトを削除

```
kubectl delete MutatingWebhookConfiguration <RELEASE_NAME>-wallarm-sidecar
kubectl delete secret <RELEASE_NAME>-wallarm-sidecar-admission-tls -n wallarm-sidecar
```

### ステップ5: 新バージョンのソリューションをデプロイ

```bash
helm install --version 5.3.0 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`はHelmリリースの名称です。初回デプロイ時と同じ名称を使用することが推奨されます。
* `wallarm-sidecar`はHelmリリースをデプロイするnamespaceです。初回デプロイ時と同じnamespaceを使用することが推奨されます。
* `<PATH_TO_VALUES>`は`values.yaml`ファイルへのパスです。初回デプロイ時に生成したものを再利用でき、アップグレード時に変更は必要ありません。

## バージョン4.10.7以降からのアップグレード

### ステップ3: Sidecarソリューションのアップグレード

デプロイ済みのSidecarソリューションコンポーネントをアップグレードします:

```bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 5.3.0 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`：デプロイされたSidecarチャートのHelmリリース名
* `<NAMESPACE>`：Sidecarがデプロイされているnamespace
* `<PATH_TO_VALUES>`：Sidecar 4.10設定を定義する`values.yaml`ファイルへのパスです。以前のSidecarバージョン実行時に作成したものを使用できます。

## アップグレード後のSidecarソリューションのテスト

1. Helmチャートのバージョンがアップグレードされたことを確認します:

    ```bash
    helm list -n wallarm-sidecar
    ```

    ここで`wallarm-sidecar`はSidecarがデプロイされているnamespaceです。namespaceが異なる場合は、この値を変更してください。

    チャートバージョンは`wallarm-sidecar-5.3.0`に対応している必要があります。
2. Wallarmコントロールプレーンの詳細を取得し、正常に起動していることを確認します:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    各podは**READY: N/N**および**STATUS: Running**と表示されるはずです。例:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
3. アプリケーションクラスターのアドレスに対して、テスト[パストラバーサル](../attacks-vulns-list.md#path-traversal)攻撃を送信します:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    リクエストされたアプリケーションPodには`wallarm-sidecar: enabled`ラベルが付与されているはずです。

    新バージョンのソリューションが前バージョンと同様に悪意あるリクエストを処理することを確認してください。