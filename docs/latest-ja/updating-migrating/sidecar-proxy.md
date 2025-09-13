[ip-lists-docs]: ../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../api-specification-enforcement/overview.md

# Wallarm Sidecarのアップグレード

本手順では、Wallarm Sidecarソリューションを最新の6.xバージョンにアップグレードする手順を説明します。

## 要件

--8<-- "../include/waf/installation/sidecar-proxy-reqs-latest.md"

## 手順1: Wallarm Helmチャートリポジトリを更新します

```bash
helm repo update wallarm
```

## 手順2: 反映されるK8sマニフェストの変更点を確認します

Sidecarの動作が想定外に変わることを避けるため、[Helm Diff Plugin](https://github.com/databus23/helm-diff)を使用して、今後適用されるK8sマニフェストの変更点を確認します。このプラグインは、現在デプロイされているSidecarのバージョンと新しいバージョンのK8sマニフェストの差分を出力します。

プラグインをインストールして実行するには次のとおりです:

1. プラグインをインストールします:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインを実行します:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n wallarm-sidecar wallarm/wallarm-sidecar --version 6.4.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`はWallarm SidecarのHelmリリース名です。
    * `wallarm-sidecar`はWallarm Sidecarソリューションがデプロイされているnamespaceです。弊社の[デプロイ](../installation/kubernetes/sidecar-proxy/deployment.md)ガイドに従う場合、通常は`wallarm-sidecar`に設定されています。
    * `<PATH_TO_VALUES>`はSidecar Helmチャート6.xの設定を含む`values.yaml`ファイルへのパスです。[Tarantoolからwstoreへの移行](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)に合わせて更新すれば、以前のバージョンのファイルを再利用できます:
    
        Helmの値名が変更されました: `postanalytics.tarantool` → `postanalytics.wstore`。postanalyticsメモリを明示的に[割り当てている](../installation/kubernetes/sidecar-proxy/scaling.md)場合は、`values.yaml`にこの変更を適用してください。

3. 稼働中のサービスの安定性に影響する変更がないことを確認し、stdoutに出力されるエラーを注意深く確認します。

    stdoutが空の場合は、`values.yaml`ファイルが有効であることを確認します。

リリース 4.10.7では互換性に破壊的な変更が導入されたため、ソリューションの再インストールが必要となります。admission webhook証明書の生成デフォルト方式は[`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen)プロセスに置き換えられました。アップグレード中に、新しい`certgen`プロセスにより証明書が自動生成されます。

[リリース4.10.7](/4.10/updating-migrating/node-artifact-versions/#helm-chart-for-sidecar)では互換性を破る変更が導入され、ソリューションの再インストールが必要になりました。admission webhook証明書の生成方法の既定が[`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen)プロセスに置き換えられています。アップグレード中は、新しい`certgen`プロセスを使用して証明書が自動生成されます。

さらに、このリリースでは、[admission webhook証明書のプロビジョニングに`cert-manager`を使用する、または証明書を手動で指定する](../installation/kubernetes/sidecar-proxy/customization.md#certificates-for-the-admission-webhook)ことが可能です。

### 手順3: 以前のバージョンのソリューションをアンインストールします

```
helm uninstall <RELEASE_NAME> -n wallarm-sidecar
```

### 手順4: 既存の証明書アーティファクトを削除します

```
kubectl delete MutatingWebhookConfiguration <RELEASE_NAME>-wallarm-sidecar
kubectl delete secret <RELEASE_NAME>-wallarm-sidecar-admission-tls -n wallarm-sidecar
```

### 手順5: 新しいソリューションバージョンをデプロイします

``` bash
helm install --version 6.4.0 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`はHelmリリース名です。ソリューションの初回デプロイ時に使用した名前を再利用することを推奨します。
* `wallarm-sidecar`はHelmリリースをデプロイするnamespaceです。ソリューションの初回デプロイ時に使用したnamespaceを再利用することを推奨します。
* `<PATH_TO_VALUES>`はSidecar Helmチャート6.xの設定を含む`values.yaml`ファイルへのパスです。[Tarantoolからwstoreへの移行](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)に合わせて更新すれば、以前のバージョンのファイルを再利用できます:
    
    Helmの値名が変更されました: `postanalytics.tarantool` → `postanalytics.wstore`。postanalyticsメモリを明示的に[割り当てている](../installation/kubernetes/sidecar-proxy/scaling.md)場合は、`values.yaml`にこの変更を適用してください。

### 手順6: Sidecar ProxyがアタッチされたDeploymentを再起動します

既にアプリケーションPodにインジェクトされているプロキシコンテナをアップグレードするには、該当するDeploymentを再起動します:

```
kubectl rollout restart deployment <DEPLOYMENT_NAME> -n <NAMESPACE>
```

* `<DEPLOYMENT_NAME>`はアプリケーションのDeployment名です
* `<NAMESPACE>`はそのDeploymentが存在するnamespaceです

## バージョン4.10.7以上からのアップグレード

### 手順3: Sidecarソリューションをアップグレードします

デプロイ済みのSidecarソリューションのコンポーネントをアップグレードします:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 6.4.0 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: デプロイ済みSidecarチャートのHelmリリース名です
* `<NAMESPACE>`: Sidecarがデプロイされているnamespaceです
* `<PATH_TO_VALUES>`はSidecar Helmチャート6.xの設定を含む`values.yaml`ファイルへのパスです。[Tarantoolからwstoreへの移行](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)に合わせて更新すれば、以前のバージョンのファイルを再利用できます:
    
    Helmの値名が変更されました: `postanalytics.tarantool` → `postanalytics.wstore`。postanalyticsメモリを明示的に[割り当てている](../installation/kubernetes/sidecar-proxy/scaling.md)場合は、`values.yaml`にこの変更を適用してください。

### 手順4: Sidecar ProxyがアタッチされたDeploymentを再起動します

既にアプリケーションPodにインジェクトされているプロキシコンテナをアップグレードするには、該当するDeploymentを再起動します:

```
kubectl rollout restart deployment <DEPLOYMENT_NAME> -n <NAMESPACE>
```

* `<DEPLOYMENT_NAME>`はアプリケーションのDeployment名です
* `<NAMESPACE>`はそのDeploymentが存在するnamespaceです

## アップグレード後のSidecarソリューションをテストします

1. Helmチャートのバージョンがアップグレードされたことを確認します:

    ```bash
    helm list -n wallarm-sidecar
    ```

    `wallarm-sidecar`はSidecarがデプロイされているnamespaceです。namespaceが異なる場合は、この値を変更できます。

    チャートバージョンは`wallarm-sidecar-6.4.0`である必要があります。
1. Wallarmコントロールプレーンの詳細を取得し、正常に起動していることを確認します:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    各Podには次が表示されている必要があります: READY: N/N および STATUS: Running。例:

    ```
    NAME                                             READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   3/3     Running   0          91m
    ```
1. アプリケーションクラスターのアドレスにテスト用の[パストラバーサル](../attacks-vulns-list.md#path-traversal)攻撃を送信します:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    対象のアプリケーションPodには`wallarm-sidecar: enabled`ラベルが付与されている必要があります。

    新しいバージョンのソリューションが、前のバージョンと同様に悪意のあるリクエストを処理することを確認します。