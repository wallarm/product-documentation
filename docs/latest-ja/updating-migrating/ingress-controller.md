```markdown
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[ip-list-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../api-specification-enforcement/overview.md

# 統合Wallarmモジュール搭載のNGINX Ingressコントローラーのアップグレード

本手順では、既にデプロイされたWallarm NGINXベースのIngressコントローラー4.xから、Wallarmノード5.0搭載の新バージョンへのアップグレード手順を説明します。

サポート終了ノード（3.6以下）のアップグレードには、[こちらの手順](older-versions/ingress-controller.md)をご利用ください。

## 要件

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## ステップ1: Wallarm Helmチャートリポジトリの更新

```bash
helm repo update wallarm
```

## ステップ2: 今後のK8sマニフェストの変更内容を確認する

予期しないIngressコントローラーの動作変更を防ぐため、[Helm Diff Plugin](https://github.com/databus23/helm-diff)を使用して、今後のK8sマニフェストの変更内容を確認してください。このプラグインは、デプロイ済みのIngressコントローラーのバージョンのK8sマニフェストと新バージョンとの差分を出力します。

プラグインのインストールと実行方法は以下の通りです：

1. プラグインのインストール：

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインの実行：

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`：IngressコントローラーチャートのHelmリリース名
    * `<NAMESPACE>`：IngressコントローラーがデプロイされているNamespace
    * `<PATH_TO_VALUES>`：Ingressコントローラー5.0設定を定義する`values.yaml`ファイルへのパス–前バージョン実行時に作成したファイルを利用できます
3. 変更が稼働中のサービスの安定性に影響を及ぼさないことを確認し、stdoutからのエラーを注意深く確認してください。

    もしstdoutが空の場合は、`values.yaml`ファイルが有効であることを確認してください。

## ステップ3: Ingressコントローラーのアップグレード

デプロイ済みのNGINX Ingressコントローラーをアップグレードしてください：

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.0 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`：IngressコントローラーチャートのHelmリリース名
* `<NAMESPACE>`：IngressコントローラーがデプロイされているNamespace
* `<PATH_TO_VALUES>`：Ingressコントローラー5.0設定を定義する`values.yaml`ファイルへのパス–前バージョン実行時に作成したファイルを利用できます

## ステップ4: アップグレード後のIngressコントローラーのテスト

1. Helmチャートのバージョンがアップグレードされたことを確認してください：

    ```bash
    helm list -n <NAMESPACE>
    ```

    ここで`<NAMESPACE>`は、IngressコントローラーのHelmチャートがデプロイされたNamespaceです。

    チャートバージョンが`wallarm-ingress-5.3.0`に一致している必要があります。
2. Pod一覧の取得：

    ``` bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    各Podのステータスは**STATUS: Running**または**READY: N/N**である必要があります。例えば：

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```
3. Wallarm Ingressコントローラーのアドレスに対して、テスト[パストラバーサル](../attacks-vulns-list.md#path-traversal)攻撃リクエストを送信してください：

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    新バージョンのソリューションが、前バージョンと同様に悪意あるリクエストを処理することを確認してください。
```