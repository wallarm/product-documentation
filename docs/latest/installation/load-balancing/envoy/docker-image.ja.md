[バージョニングポリシー]: ../../../更新-移行/バージョニングポリシー.md#バージョンリスト
[ptrav-攻撃-docs]: ../../../攻撃-vulns-リスト.md#path-traversal
[attacks-in-ui-image]: ../../../画像/管理ガイド/テスト攻撃-クイックスタート.png
[wallarm-token-types]: ../../../ユーザーガイド/nodes/nodes.md#api-and-node-tokens-for-node-生成


# Docker Envoyベース画像の実行

以下の手順では、[Envoy 1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)ベースのWallarm Dockerイメージの実行方法を説明します。 このイメージには、Wallarmノードが正しく動作するために必要なすべてのシステムが含まれています：

* 組み込みのWallarmモジュールを備えたEnvoyプロキシサービス
* ポストアナリティクス用のTarantoolモジュール
* その他のサービスとスクリプト

Wallarmモジュールは、リクエストのプロキシング用のEnvoy HTTPフィルタとして設計されています。

!!! warning "サポートされている設定パラメータ"
   NGINXベースのフィルタリングノード設定用の最も [ディレクティブ](../../../admin-en/configure-parameters-en.ja.md) は、Envoyベースのフィルタリングノード設定ではサポートされていません。 [Envoyベースのフィルタリングノード設定 →](../../../admin-en/configuration-guides/envoy/fine-tuning.md)で利用可能なパラメータのリストをご覧ください。

## 必要条件

* [米国クラウド](https://us1.my.wallarm.com/)または[ヨーロッパクラウド](https://my.wallarm.com/)のWallarmコンソールの**Administrator**ロールのアカウントへのアクセス
* 米国のWallarm Cloudで作業している場合は `https://us1.api.wallarm.com` へのアクセス、ヨーロッパのWallarm Cloudで作業している場合は `https://api.wallarm.com` へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認してください。

## コンテナの実行オプション

フィルタリングノードの設定パラメータは、以下の方法で `docker run` コマンドに渡すことができます：

* **環境変数にて**。このオプションは基本的なフィルタリングノードパラメータの設定のみを可能にします、最も [パラメータ](../../../admin-en/configuration-guides/envoy/fine-tuning.md) は環境変数を通じては変更できません。
* **マウントされた設定ファイルにて**。このオプションを使用すると、フィルタリングノードのすべての [パラメータ](../../../admin-en/configuration-guides/envoy/fine-tuning.md) を設定できます。

## 環境変数を渡してコンテナを実行する

コンテナを実行するには：

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. ノードを含むコンテナを実行します:

    === "米国クラウド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:4.6.2-1
        ```
    === "ヨーロッパクラウド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:4.6.2-1
        ```

以下の基本的なフィルタリングノードの設定を、オプション `-e` によりコンテナに渡すことができます：

環境変数 | 説明| 必要性
--- | ---- | ----
`WALLARM_API_TOKEN` | WallarmノードまたはAPIトークン。 | 必須
`ENVOY_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | 必須
`WALLARM_API_HOST` | Wallarm APIサーバー：<ul><li>`us1.api.wallarm.com`（米国クラウド向け）</li><li>`api.wallarm.com`（ヨーロッパクラウド向け）</li></ul>デフォルトは `api.wallarm.com`。 | 任意
`WALLARM_MODE` | ノードモード：<ul><li>`block`（悪意のあるリクエストをブロック）</li><li>`safe_blocking`（[グレーリスト化されたIPアドレス](../../../ユーザーガイド/ip-リスト/グレーリスト.md)からの悪意のあるリクエストのみをブロック）</li><li>`monitoring`（リクエストを分析するがブロックしない）</li><li>`off`（トラフィックの解析と処理を無効化）</li></ul>デフォルトは `monitoring`。<br>[フィルタリングモードの詳細説明 →](../../../admin-en/configure-wallarm-mode.md) | 任意
`WALLARM_LABELS` | <p>ノード4.6から利用可能。 `WALLARM_API_TOKEN` が `Deploy` ロールの [APIトークン](../../../ユーザーガイド/設定/api-トークン.md) に設定されている場合にのみ機能します。Nodeインスタンスのグループ化に `group` ラベルを設定します。例えば：</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...これは、ノードインスタンスを `<GROUP>` インスタンスグループ（既存のもの、または存在しない場合は新規作成されたもの）に配置します。</p> | APIトークンの場合は必須
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てる [メモリの量](../../../admin-en/configuration-guides/allocate-resources-for-node.md)。値は整数または浮動小数点数（小数点 <code>.</code> を使用）にできます。デフォルトは0.2ギガバイト。 | 任意

このコマンドは次の操作を行います：

* `/etc/envoy` コンテナディレクトリに最小限のEnvoy設定を持つファイル `envoy.yaml` を作成します。
* `/etc/wallarm` コンテナディレクトリにWallarm Cloudにアクセスするためのフィルタリングノード認証ファイルを作成します：
    * フィルタリングノードUUIDとシークレットキーを含む `node.yaml`
    * Wallarmのプライベートキーを含む `private.key`
* リソース `http://ENVOY_BACKEND:80` を保護します。

## envoy.yamlをマウントしてコンテナを実行する

`envoy.yaml` ファイルを `-v` オプションを通じてDockerコンテナにマウントできます。ファイルには以下の設定を含む必要があります：

* [指示書](../../../admin-en/configuration-guides/envoy/fine-tuning.md)に記載されているフィルタリングノードの設定
* [Envoyの指示書](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)に記載されているEnvoyの設定

コンテナを実行するには：

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. ノードを含むコンテナを実行します：

    === "米国クラウド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.6.2-1
        ```
    === "ヨーロッパクラウド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.6.2-1
        ```

    * `-e`オプションは次の必須の環境変数をコンテナに渡します：

    環境変数 | 説明| 必要性
    --- | ---- | ----
    `WALLARM_API_TOKEN` | Wallarmノードトークン。<br><div class="admonition info"> <p class="admonition-title">一つのトークンを複数のインストールで使用する</p> <p>選択した[プラットフォーム](../../../installation/supported-deployment-options.md)に関係なく、一つのトークンを複数のインストールで使用することができます。これにより、WallarmコンソールUIでノードインスタンスを論理的にグループ化することができます。例: あなたは開発環境にいくつかのWallarmノードをデプロイし、それぞれのノードは特定の開発者が所有するマシンにあります。 </p></div> | 必須
    `WALLARM_API_HOST` | Wallarm APIサーバー：<ul><li>`us1.api.wallarm.com`（米国クラウド向け）</li><li>`api.wallarm.com`（ヨーロッパクラウド向け）</li></ul>デフォルトは `api.wallarm.com`。 | 任意

    * `-v`オプションは設定ファイル `envoy.yaml` が含まれるディレクトリを `/etc/envoy` コンテナディレクトリにマウントします。

このコマンドは次の操作を行います：

* ファイル `envoy.yaml` を `/etc/envoy` コンテナディレクトリにマウントします。
* `/etc/wallarm` コンテナディレクトリにWallarm Cloudにアクセスするためのフィルタリングノード認証ファイルを作成します：
    * フィルタリングノードUUIDとシークレットキーを含む `node.yaml`
    * Wallarmのプライベートキーを含む `private.key`
* マウントされた設定ファイルに指定されたリソースを保護します。

## ログローテーションの設定（任意）

ログファイルのローテーションはデフォルトで有効化されており、事前に設定済みです。必要に応じてローテーション設定を調整することができます。これらの設定は、コンテナの `/etc/logrotate.d` ディレクトリに位置しています。

## Wallarmノード操作のテスト

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"