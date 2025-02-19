# API Discoveryセットアップ <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

本記事では、[API Discovery](overview.md)モジュールの有効化、設定、およびデバッグの方法について説明します。

## 有効化

API Discoveryはすべての[形態](../installation/supported-deployment-options.md)のWallarmノードインストールに含まれています。ノードのデプロイ時に、API Discoveryモジュールはインストールされますが、デフォルトでは無効状態となっています。

API Discoveryを正しく有効化して実行するには、次の手順に従ってください：

1. お使いの[サブスクリプションプラン](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security)に**API Discovery**が含まれていることを確認してください。サブスクリプションプランを変更する場合は、[sales@wallarm.com](mailto:sales@wallarm.com)までリクエストを送信してください。
2. Wallarm Console → **API Discovery** → **Configure API Discovery**で、API Discoveryによるトラフィック分析を有効にしてください。

API Discoveryモジュールの有効化後、トラフィック分析およびAPIインベントリの構築が開始されます。APIインベントリはWallarm Consoleの**API Discovery**セクションに表示されます。

## 設定

「API Discovery」セクションの**Configure API Discovery**ボタンをクリックすると、API Discoveryの調整オプションに進み、APIの検出対象アプリケーションの選択やリスクスコア計算のカスタマイズなどが可能になります。

### API Discoveryの対象アプリケーションの選択

すべてのアプリケーションまたは選択したアプリケーションのみで、API Discoveryを有効または無効にすることができます：

1. 記事[Setting up applications](../user-guides/settings/applications.md)に記載の手順に従い、アプリケーションを追加してください。

    アプリケーションが設定されていない場合、すべてのAPIの構造が1つのツリーにまとめられます。

2. Wallarm Console → **API Discovery** → **Configure API Discovery**で、必要なアプリケーションに対してAPI Discoveryを有効にしてください。

    ![API Discovery – 設定](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

「Settings」→ **[Applications](../user-guides/settings/applications.md)**で新しいアプリケーションを追加すると、API Discoveryの対象アプリケーションリストに自動的に**disabled**状態で追加されます。

### リスクスコア計算のカスタマイズ

[risk score](risk-score.md)計算における各要因の重みと計算方法を設定できます。

### 機微なデータ検出のカスタマイズ

API Discoveryは、APIによって使用および送信される機微なデータを[sensitive data](sensitive-data.md)として検出し、強調表示します。既存の検出プロセスを調整し、独自のデータタイプを追加して検出対象を拡張することができます。

現在の設定を表示し、変更を加えるには、Wallarm Consoleで**API Discovery** → **Configure API Discovery** → **Sensitive data**に移動してください。ここで、既存の機微なデータパターンを確認および修正し、独自のパターンを追加することができます。

[詳細はこちら →](sensitive-data.md#customizing-sensitive-data-detection)

## デバッグ

API Discoveryのログを取得して解析するには、次の方法を使用してください：

* ノードが実行されているマシンで`/opt/wallarm/var/log/wallarm/appstructure-out.log`ログファイルを確認してください。
* もしWallarmノードがKubernetes Ingressコントローラとしてデプロイされている場合は、Tarantoolと`wallarm-appstructure`コンテナが実行されているpodの状態を確認してください。podの状態は**Running**である必要があります。

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    `wallarm-appstructure`コンテナのログを確認してください：

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```