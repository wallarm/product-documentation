					[versioning-policy]:                ../../../updating-migrating/versioning-policy.md#version-list
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png

# Docker Envoyベースのイメージの実行

この手順は、[Envoy 1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)をベースにしたWallarm Dockerイメージを実行する方法を説明しています。このイメージには、Wallarmノードの正しい動作に必要なすべてのシステムが含まれています：

* 組み込みのWallarmモジュールを備えたEnvoyプロキシサービス
* postanalytics用のTarantoolモジュール
* その他のサービスとスクリプト

Wallarmモジュールは、リクエストのプロキシに対するEnvoy HTTPフィルタとして設計されています。

!!! warning "サポートされている設定パラメータ"
    [ディレクティブ](../../configure-parameters-en.md)のほとんどは、NGINXベースのフィルタリングノード設定用ではなく、Envoyベースのフィルタリングノード設定用にサポートされていません。[Envoyベースのフィルタリングノード設定用 →](../../configuration-guides/envoy/fine-tuning.md)で利用できるパラメータのリストを参照してください。

## 要件

* [米国クラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)のWallarmコンソールで **管理者** ロールを持つアカウントへのアクセス
* 米国Wallarmクラウドと共同作業する場合は`https://us1.api.wallarm.com`へのアクセス、またはEU Wallarmクラウドと共同作業する場合は`https://api.wallarm.com`へのアクセスが必要です。ファイアウォールでアクセスがブロックされていないことを確認してください。

## コンテナの実行オプション

フィルタリングノードの設定パラメータは、以下の方法で `docker run` コマンドに渡すことができます。

* **環境変数で**。このオプションでは、基本的なフィルタリングノードのパラメータのみが設定できます。[パラメータ](../../configuration-guides/envoy/fine-tuning.md)のほとんどは、環境変数を介して変更することはできません。
* **マウントされた設定ファイルで**。このオプションでは、すべてのフィルタリングノード[パラメータ](../../configuration-guides/envoy/fine-tuning.md)を設定することができます。

## 環境変数を渡してコンテナを実行する

1. [米国クラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)のWallarm Console → **ノード** を開き、**Wallarmノード** タイプのノードを作成します。

    ![!Wallarmノード作成](../../../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. 作成したノードでコンテナを実行します。

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:4.4.3-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:4.4.3-1
        ```

次の基本的なフィルタリングノード設定をオプション `-e` でコンテナに渡すことができます。

環境変数 | 説明 | 必要
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarmノードトークン。<br><div class="admonition info"> <p class="admonition-title">複数のインストールで1つのトークンを使用する</p> <p>選択した[プラットフォーム](../../supported-platforms.md)に関係なく、複数のインストールで1つのトークンを使用できます。これにより、Wallarm Console UIでノードインスタンスを論理的にグループ化できます。例：開発環境に複数のWallarmノードをデプロイし、各ノードが特定の開発者が所有する独自のマシン上に配置されている場合。</p></div> | はい
`ENVOY_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>米国クラウドの場合は `us1.api.wallarm.com`</li><li>EUクラウドの場合は `api.wallarm.com`</li></ul>デフォルト： `api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード：<ul><li>`block` で悪意のあるリクエストをブロック</li><li>`safe_blocking` で[グレーリスト化されたIPアドレス](../../../user-guides/ip-lists/graylist.md)からの悪意のあるリクエストのみをブロック</li><li>`monitoring` でリクエストを解析するがブロックしない</li><li>`off` でトラフィックの解析と処理を無効にする</li></ul>デフォルト： `monitoring`。<br>[フィルタリングモードの詳細説明 →](../../configure-wallarm-mode.md) | いいえ
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てる[メモリの量](../../configuration-guides/allocate-resources-for-node.md)。整数または小数（小数点は <code>.</code>）を指定できます。デフォルト： 0.2ギガバイト。 | いいえ

このコマンドは、以下の操作を行います。

* `/etc/envoy` コンテナディレクトリに最小限のEnvoy設定を含む `envoy.yaml` ファイルを作成します。
* `/etc/wallarm` コンテナディレクトリに、Wallarmクラウドへのアクセスのためのフィルタリングノード資格情報を含むファイルを作成します：
    * フィルタリングノード UUID およびシークレットキーを持つ `node.yaml`
    * Wallarmプライベートキーを持つ `private.key`
* リソース `http://ENVOY_BACKEND:80` を保護します。

## コンテナをマウントしてenvoy.yamlを実行する

`envoy.yaml` ファイルを `-v` オプションを使用して Docker コンテナにマウントできます。このファイルには、以下の設定が含まれている必要があります。

* [指示](../../configuration-guides/envoy/fine-tuning.md)に記載されているように、フィルタリングノード設定
* [Envoyの指示](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)に記載されているように、Envoy設定

コンテナを実行するには：

1. [米国クラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)のWallarm Console → **ノード** を開き、**Wallarmノード** タイプのノードを作成します。

    ![!Wallarmノード作成](../../../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. 作成したノードでコンテナを実行します：

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.4.3-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.4.3-1
        ```

    * `-e` オプションで、以下の必要な環境変数をコンテナに渡します：

    環境変数 | 説明 | 必要
    --- | ---- | ----
    `WALLARM_API_TOKEN` | Wallarmノードトークン。<br><div class="admonition info"> <p class="admonition-title">複数のインストールで1つのトークンを使用する</p> <p>選択した[プラットフォーム](../../supported-platforms.md)に関係なく、複数のインストールで1つのトークンを使用できます。これにより、Wallarm Console UIでノードインスタンスを論理的にグループ化できます。例：開発環境に複数のWallarmノードをデプロイし、各ノードが特定の開発者が所有する独自のマシン上に配置されている場合。</p></div> | はい
    `WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>米国クラウドの場合は `us1.api.wallarm.com`</li><li>EUクラウドの場合は `api.wallarm.com`</li></ul>デフォルト： `api.wallarm.com`。 | いいえ

    * `-v` オプションで、設定ファイル `envoy.yaml` を含むディレクトリを `/etc/envoy` コンテナディレクトリにマウントします。

このコマンドは、以下の操作を行います：

* ファイル `envoy.yaml` を `/etc/envoy` コンテナディレクトリにマウントします。
* `/etc/wallarm` コンテナディレクトリに、Wallarmクラウドへのアクセスのためのフィルタリングノード資格情報を含むファイルを作成します：
    * フィルタリングノード UUID およびシークレットキーを持つ `node.yaml`
    * Wallarmプライベートキーを持つ `private.key`
* マウントされた設定ファイルで指定されたリソースを保護します。

## ログローテーションの設定 (オプション)

ログファイルのローテーションは、デフォルトで事前に設定され有効化されています。必要に応じてローテーションの設定を調整できます。これらの設定は、コンテナの `/etc/logrotate.d` ディレクトリに配置されています。

## Wallarmノードの動作テスト

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"