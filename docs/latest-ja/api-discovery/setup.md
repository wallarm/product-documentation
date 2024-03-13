# API Discovery の設定 <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

この記事では、[API Discovery](overview.md) モジュールを有効にし、設定し、デバッグする方法について説明します。

## 有効化

API Discovery は、Debian 11.x および Ubuntu 22.04 の個別パッケージを除く、Wallarm ノードのすべての[形態](../installation/supported-deployment-options.md)に含まれています。ノードの展開中に、API Discovery モジュールをインストールしますが、デフォルトでは無効になっています。

API Discovery を正しく有効にして実行するには：

1. 個別のパッケージからノードをインストールする場合、Wallarm ノードが[サポートされているバージョン](../updating-migrating/versioning-policy.md#version-list)であることを確認してください。

    API Discovery の機能の全範囲に常にアクセスできるようにするため、以下のように定期的に `wallarm-appstructure` パッケージの更新を確認することをお勧めします：


    === "Debian Linux"
        ```bash
        sudo apt update
        sudo apt install wallarm-appstructure
        ```
    === "RedHat Linux"
        ```bash
        sudo yum update
        sudo yum install wallarm-appstructure
        ```
1. [サブスクリプションプラン](../about-wallarm/subscription-plans.md#subscription-plans)に **API Discovery** が含まれていることを確認してください。サブスクリプションプランを変更するには、[sales@wallarm.com](mailto:sales@wallarm.com) にリクエストを送ってください。
1. Wallarm コンソール → **API Discovery** → **API Discovery の設定** で、API Discovery でのトラフィック分析を有効にします。

API Discovery モジュールが有効になると、トラフィック分析と API インベントリの構築が開始されます。API インベントリは Wallarm コンソールの **API Discovery** セクションに表示されます。

## 設定

**API Discovery** セクションの **API Discovery の設定** ボタンをクリックすると、API Discovery の選択やリスクスコア計算のカスタマイズなどの細かい設定オプションに進みます。

### API Discovery のためのアプリケーションの選択

すべてのアプリケーション、または選択したアプリケーションのみに対して API Discovery を有効/無効にすることができます：

1. アプリケーションが[アプリケーションの設定](../user-guides/settings/applications.md)の記事で述べられたように追加されていることを確認してください。

    アプリケーションが設定されていない場合、すべての API の構造が1つのツリーにグループ化されます。

1. Wallarm コンソール → **API Discovery** → **API Discovery の設定** で、必要なアプリケーションの API Discovery を有効にします。

    ![API Discovery – 設定](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

**設定** → **[アプリケーション](../user-guides/settings/applications.md)** に新しいアプリケーションを追加すると、**無効** 状態で API Discovery のアプリケーションリストに自動的に追加されます。

### リスクスコア計算のカスタマイズ

[リスクスコア](risk-score.md)計算の各要因の重みと計算方法を設定することができます。

## デバッグ

API Discovery ログを取得および分析するには、以下の方法を使用できます：

* Wallarm ノードが個別の DEB/RPM パッケージからインストールされている場合：インスタンス内で標準ユーティリティ **journalctl** または **systemctl** を実行します。

    === "journalctl"
        ```bash
        journalctl -u wallarm-appstructure
        ```
    === "systemctl"
        ```bash
        systemctl status wallarm-appstructure
        ```
* Wallarm ノードが Docker コンテナ、Amazon マシンイメージ (AMI)、または Google Cloud マシンイメージから展開されている場合：コンテナ内のログファイル `/opt/wallarm/var/log/wallarm/appstructure-out.log` を読みます。
* Wallarm ノードが Kubernetes Ingress コントローラとして展開されている場合：Tarantool および `wallarm-appstructure` コンテナを実行しているポッドの状態を確認します。ポッドの状態は **Running** でなければなりません。

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    `wallarm-appstructure` コンテナのログを読みます：

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```