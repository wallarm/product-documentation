[versioning-policy]:               ../../../updating-migrating/versioning-policy.ja.md#version-list
[ptrav-attack-docs]:               ../../../attacks-vulns-list.ja.md#path-traversal
[attacks-in-ui-image]:             ../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:             ../../../user-guides/nodes/nodes.ja.md#api-and-node-tokens-for-node-creation


# DockerのEnvoyベースイメージを実行する

これらの指示事項は、[Envoy 1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)に基づいたWallarm Dockerイメージを実行するための手順を説明しています。このイメージには、Wallarmノードを正しく操作するためのすべてのシステムが含まれています：

* 組み込みのWallarmモジュールを備えたEnvoyプロキシサービス
* ポストアナリティクス用のTarantoolモジュール
* その他のサービスとスクリプト

Wallarmモジュールは、リクエストをプロキシするためのEnvoy HTTPフィルタとして設計されています。

!!! warning "サポートされている設定パラメータ"
NGINXベースのフィルタリングノード設定のためのほとんどの[ディレクティブ](../../../admin-en/configure-parameters-en.ja.md)は、Envoyベースのフィルタリングノード設定ではサポートされていません。[Envoyベースのフィルタリングノード設定→](../../../admin-en/configuration-guides/envoy/fine-tuning.ja.md)で利用可能なパラメータのリストをご覧ください。

## 要件

* [米国クラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)のWallarm Console内の**Administrator**ロールを持つアカウントへのアクセス
* 米国のWallarm Cloudを利用して作業している場合は、`https://us1.api.wallarm.com`へのアクセス、また、EUのWallarm Cloudを利用して作業している場合は、`https://api.wallarm.com`へのアクセスが必要です。これらのアクセスがファイアウォールによってブロックされていないことを確認してください。

## コンテナの実行オプション

`docker run`コマンドにフィルタリングノード設定パラメータを以下の方法で渡すことができます：

* **環境変数による設定**：この選択肢は、基礎的なフィルタリングノードのパラメータ設定しか許可しません。ほとんどの[パラメータ](../../../admin-en/configuration-guides/envoy/fine-tuning.ja.md)を環境変数を通じて変更することはできません。
* **マウントされた設定ファイル内**：この選択肢は、すべてのフィルタリングノード[パラメータ](../../../admin-en/configuration-guides/envoy/fine-tuning.ja.md)の設定を許可します。

## 環境変数を指定してコンテナを起動する

コンテナを起動するには：

--8<-- "../include/waf/installation/get-api-or-node-token.ja.md"

1. ノードがついたコンテナを起動します：

    === "米国クラウド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:4.6.2-1
        ```
    === "EUクラウド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:4.6.2-1
        ```

以下の基本的なフィルタリングノード設定を、オプション`-e`によってコンテナに渡すことができます：

環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | WallarmノードまたはAPIトークン。 | はい
`ENVOY_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>デフォルトは `api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード：<ul><li>`block` で悪意のあるリクエストをブロックする</li><li>`safe_blocking` は、[グレーリストに登録されたIPアドレス](../../../user-guides/ip-lists/graylist.ja.md)から発生した悪意あるリクエストのみをブロックします</li><li>`monitoring` はリクエストを分析するがブロックしない</li><li>`off` でトラフィックの分析と処理を無効にする</li></ul>デフォルトは `monitoring`。<br>[詳細なフィルタリングモードの説明→](../../../admin-en/configure-wallarm-mode.ja.md) | いいえ
`WALLARM_LABELS` | <p>ノード4.6以降で利用可能。`WALLARM_API_TOKEN`が`Deploy`ロールの[APIトークン](../../../user-guides/settings/api-tokens.ja.md)に設定されている場合のみ機能します。ノードインスタンスのグループ化のための`group`ラベルを設定します。例えば：</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...とすると、ノードインスタンスが`<GROUP>`インスタンスグループ（既存の場合）に配置されます。存在しない場合は作成されます。</p> | はい（APIトークンの場合）
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てられた[メモリ量](../../../admin-en/configuration-guides/allocate-resources-for-node.ja.md)。値は整数または浮動小数点（小数点は <code>.</code> で表します）で指定できます。デフォルトは0.2ギガバイト。 | いいえ

このコマンドは以下の作業を行います：

* コンテナディレクトリ`/etc/envoy`に最小限のEnvoy設定である`envoy.yaml`ファイルを作成します。
* コンテナディレクトリ`/etc/wallarm`にWallarm Cloudへのアクセスのためのフィルタリングノード認証ファイルを作成します：
    * フィルタリングノードのUUIDと秘密キーである`node.yaml`
    * Wallarmの秘密鍵である`private.key`
* リソース`http://ENVOY_BACKEND:80`を保護します。

## envoy.yamlファイルをマウントしてコンテナを起動する

`envoy.yaml`という名前の準備済みのファイルを`-v`オプションを使用してDockerコンテナにマウントすることができます。このファイルは以下の設定を含む必要があります：

* [指示事項](../../../admin-en/configuration-guides/envoy/fine-tuning.ja.md)で説明されているようなフィルタリングノードの設定
* [Envoyの指示事項](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)に記述されているようなEnvoyの設定

コンテナを起動するには：

--8<-- "../include/waf/installation/get-api-or-node-token.ja.md"

1. ノードがついたコンテナを起動します：

    === "米国クラウド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.6.2-1
        ```
    === "EUクラウド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.6.2-1
        ```

    * `-e`オプションは、以下の必要な環境変数をコンテナに渡します：

    環境変数 | 説明 | 必須
    --- | ---- | ----
    `WALLARM_API_TOKEN` | Wallarmノードのトークン。<br><div class="admonition info"> <p class="admonition-title">一つのトークンを複数のインストールに使用</p> <p>選択した[プラットフォーム](../../../installation/supported-deployment-options.ja.md)に関係なく、一つのトークンを複数のインストールで使用することができます。Wallarm Console UIでのノードインスタンスの論理的なグループ化が可能です。例：開発環境にいくつかのWallarmノードをデプロイし、それぞれのノードが特定の開発者が所有する自身のマシン上にあります。</p></div> | はい
    `WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>By default: `api.wallarm.com`. | いいえ

    * `-v`オプションは、設定ファイル`envoy.yaml`があるディレクトリをコンテナの`/etc/envoy`ディレクトリにマウントします。

このコマンドは以下の作業を行います：

* ファイル`envoy.yaml`をコンテナの`/etc/envoy`ディレクトリにマウントします。
* コンテナの`/etc/wallarm`ディレクトリにWallarm Cloudへのアクセスのためのフィルタリングノード認証ファイルを作成します：
    * フィルタリングノードのUUIDと秘密キーである`node.yaml`
    * Wallarmの秘密鍵である`private.key`
* マウントされた設定ファイルに記述されたリソースを保護します。

## ログローテーションの設定（オプション）

ログファイルのローテーションは事前に設定されており、デフォルトでは有効になっています。必要に応じてローテーションの設定を調整することができます。これらの設定は、コンテナの`/etc/logrotate.d`ディレクトリにあります。

## Wallarmノードの動作テスト

--8<-- "../include/waf/installation/test-waf-operation-no-stats.ja.md"