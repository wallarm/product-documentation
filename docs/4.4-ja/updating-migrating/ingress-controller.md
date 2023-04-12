[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[ip-list-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md

# Wallarm付きのNGINX Ingressコントローラーをアップグレードする

これらの手順は、デプロイ済みのWallarm NGINXベースのIngress Controller 4.xをWallarmノード4.4で新しいバージョンにアップグレードする方法を説明しています。

既にサポートが終了したノード（3.6以下）をアップグレードする場合は、[別の手順](older-versions/ingress-controller.md)を使用してください。

## 要件

--8<-- "../include-ja/waf/installation/requirements-nginx-ingress-controller-4.4.md"

## ステップ1: Wallarm Helmチャートリポジトリを更新する

```bash
helm repo update wallarm
```

## ステップ2: すべての来るべきK8sマニフェスト変更を確認する

予期せぬIngressコントローラーの振る舞い変更を避けるために、[Helm Diff Plugin](https://github.com/databus23/helm-diff)を使用して今後のすべてのK8sマニフェストの変更を確認してください。このプラグインは、デプロイ済みのIngressコントローラーバージョンのK8sマニフェストと新しいバージョンのK8sマニフェストの差分を出力します。

プラグインをインストールおよび実行するには:

1. プラグインをインストールします：

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインを実行します:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.4.8 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: IngressコントローラーチャートのHelmリリース名
    * `<NAMESPACE>`: Ingressコントローラがデプロイされているネームスペース
    * `<PATH_TO_VALUES>`: Ingressコントローラ4.4の設定を定義する`values.yaml`ファイルへのパス。前のIngressコントローラーバージョンの実行に使用したものを使用できます。
3. サービスの安定性に影響しない変更がないことを確認し、stdoutのエラーを慎重に検討します。

    stdoutが空の場合、`values.yaml`ファイルが有効であることを確認してください。

## ステップ3: Ingressコントローラをアップグレードする

デプロイ済みのNGINX Ingressコントローラをアップグレードします：

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.4.8 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: IngressコントローラーチャートのHelmリリース名
* `<NAMESPACE>`: Ingressコントローラがデプロイされているネームスペース
* `<PATH_TO_VALUES>`: Ingressコントローラ4.4の設定を定義する`values.yaml`ファイルへのパス。前のIngressコントローラーバージョンの実行に使用したものを使用できます。

## ステップ4: アップグレードしたIngressコントローラをテストする

1. Helmチャートのバージョンがアップグレードされたことを確認します：

    ```bash
    helm list -n <NAMESPACE>
    ```

    ここで`<NAMESPACE>`は、Ingressコントローラがデプロイされているネームスペースです。

    チャートバージョンは`wallarm-ingress-4.4.8`に対応する必要があります。
    
1. Podのリストを取得します：
    
    ``` bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    各Podのステータスは**STATUS: Running**または**READY: N/N**である必要があります。例：

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      4/4       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

1. テスト[Path Traversal](../attacks-vulns-list.md#path-traversal)攻撃を含むリクエストをWallarm Ingressコントローラーのアドレスに送信します：

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    新しいバージョンのソリューションが、前のバージョンと同じように悪意のあるリクエストを処理していることを確認します。