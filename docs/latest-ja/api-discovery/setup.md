# API Discoveryのセットアップ <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

この記事では、[API Discovery](overview.md)モジュールを有効化、構成、デバッグする方法を説明します。

## 有効化

API Discoveryは、Wallarmノードのインストール形態のうち、[自己ホスト型](../installation/supported-deployment-options.md)、[Security Edge](../installation/security-edge/overview.md)、および[Connector](../installation/connectors/overview.md)のすべてに含まれています。ノードのデプロイ時にAPI Discoveryモジュールはインストールされますが、デフォルトでは無効になっています。

API Discoveryを正しく有効化して動作させるには、次の手順を実行します。

1. [サブスクリプションプラン](../about-wallarm/subscription-plans.md#core-subscription-plans)に**API Discovery**が含まれていることを確認します。サブスクリプションプランを変更するには、[sales@wallarm.com](mailto:sales@wallarm.com)までリクエストを送信してください。
1. Wallarm Console → **API Discovery** → **Configure API Discovery**で、API Discoveryによるトラフィック解析を有効化します。

API Discoveryモジュールを有効化すると、トラフィック解析とAPIインベントリの構築が開始されます。APIインベントリはWallarm Consoleの**API Discovery**セクションに表示されます。

## 構成

**API Discovery**セクションの**Configure API Discovery**ボタンをクリックすると、API Discoveryの微調整オプション（API Discoveryの対象アプリケーションの選択やリスクスコア計算のカスタマイズなど）に進みます。

### API Discoveryの対象アプリケーションの選択

すべてのアプリケーション、または選択したアプリケーションに対してのみAPI Discoveryを有効化または無効化できます。

1. アプリケーションが[アプリケーションの設定](../user-guides/settings/applications.md)の記事の説明どおりに追加されていることを確認します。

    アプリケーションが設定されていない場合、すべてのAPIの構造は1つのツリーにまとめられます。

1. Wallarm Console → **API Discovery** → **Configure API Discovery**で、必要なアプリケーションに対してAPI Discoveryを有効化します。

    ![API Discovery – Settings](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

**Settings** → **[Applications](../user-guides/settings/applications.md)**で新しいアプリケーションを追加すると、**disabled**の状態でAPI Discoveryの対象アプリケーション一覧に自動的に追加されます。

### リスクスコア計算のカスタマイズ

[リスクスコア](risk-score.md)の計算における各要素の重みや計算方法を設定できます。

### 機密データ検出のカスタマイズ

API Discoveryは、APIで扱われる機密データを[検出してハイライト表示](sensitive-data.md)します。既存の検出プロセスを微調整し、検出対象を独自のデータ型で拡張できます。

現在の構成を表示して変更するには、Wallarm Consoleで**API Discovery** → **Configure API Discovery** → **Sensitive data**に移動します。ここでは、既存の機密データパターンの確認と変更、独自パターンの追加ができます。

[詳細はこちら→](sensitive-data.md#customizing-sensitive-data-detection)

## デバッグ

API Discoveryのログを取得して分析するには、ノードが稼働しているLinuxマシン上のログファイル`/opt/wallarm/var/log/wallarm/appstructure-out.log`を参照できます。