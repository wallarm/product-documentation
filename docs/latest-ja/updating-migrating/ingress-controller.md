[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[ip-list-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md

# Wallarm モジュール統合の NGINX Ingress コントローラーのアップグレード

この指示は、デプロイされた Wallarm の NGINX ベースの Ingress Controller 4.x を Wallarm node 4.6 を持つ新バージョンにアップグレードする手順を説明しています。

終了時期を指定したノード（バージョン3.6 またはそれ以下）をアップグレードするには、[別の指示](older-versions/ingress-controller.md)を使用してください。

## 前提条件

--8<-- "../include-ja/waf/installation/requirements-nginx-ingress-controller-latest.md"

## ステップ 1: Wallarm の Helm チャートリポジトリを更新する

```bash
helm repo update wallarm
```

## ステップ 2: すべての来る K8s マニフェストの変更を確認します

予期しない Ingress コントローラーの挙動の変更を避けるために、[Helm Diff Plugin](https://github.com/databus23/helm-diff) を使って全ての来る K8s マニフェスト変更を確認します。このプラグインは、デプロイされている Ingress コントローラーのバージョンと新しいバージョンの K8s マニフェストの差を出力します。

プラグインのインストールと実行方法:

1. プラグインをインストール：

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. プラグインを実行：

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.6.8 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress Controller のチャートと Helm リリースの名称
    * `<NAMESPACE>`: Ingress コントローラーがデプロイされているネームスペース
    * `<PATH_TO_VALUES>`: Ingress コントローラー 4.6 の設定を定義した `values.yaml` ファイルへのパス - 以前の Ingress コントローラーのバージョンを実行するために作成されたものを使うことができます。
3. 稼働中のサービスの安定性に影響を及ぼす変更がないことを確認し、標準出力からのエラーを注意深く調査します。

    stdout が空の場合、`values.yaml` ファイルが有効であることを確認してください。

## ステップ 3: Ingress コントローラーをアップグレードする

デプロイされている NGINX Ingress コントローラーをアップグレードします：

```bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.6.8 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: Ingress Controller のチャートと Helm リリースの名称
* `<NAMESPACE>`: Ingress コントローラーがデプロイされているネームスペース
* `<PATH_TO_VALUES>`: Ingress コントローラー 4.6 の設定を定義した `values.yaml` ファイルへのパス - 以前の Ingress コントローラーのバージョンを実行するために作成されたものを使うことができます。

## ステップ 4: アップグレードされた Ingress コントローラーをテストする

1. Helm チャートのバージョンがアップグレードされたことを確認します：

    ```bash
    helm list -n <NAMESPACE>
    ```

    ここで、`<NAMESPACE>` は Ingress コントローラーを含む Helm チャートがデプロイされているネームスペースです。

    チャートのバージョンは `wallarm-ingress-4.6.8` に対応すべきです。
1. ポッドのリストを取得します：
    
    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    各ポッドのステータスは **STATUS: Running** または **READY: N/N** であるべきです。例えば：

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      4/4       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

1. テスト [パス トラバーサル](../attacks-vulns-list.md#path-traversal) 攻撃で Wallarm Ingress コントローラーのアドレスにリクエストを送ります：

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    新しいバージョンのソリューションが以前のバージョンと同様に悪意のあるリクエストを処理することを確認します。

## ステップ 5: Wallarm のブロッキングページを更新する

もしページ `&/usr/share/nginx/html/wallarm_blocked.html` が Ingress 注釈を通じて設定されていて、ブロックされたリクエストに返されている場合は、リリースされた変更に合わせて[その設定を調整](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)します。

新しいノードのバージョンでは、Wallarm のブロッキングページには[更新](what-is-new.md#new-blocking-page)された UI があり、デフォルトではロゴとサポートのメールが指定されていません。