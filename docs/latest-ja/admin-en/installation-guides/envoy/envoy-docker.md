[link-wallarm-health-check]:        ../../../admin-en/uat-checklist-en.md

# Docker Envoy‑ベースのイメージを実行する

これらの手順は、[Envoy 1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)に基づくWallarm Dockerイメージの実行手順を説明します。このイメージには、正しいWallarmノード動作に必要なすべてのシステムが含まれています:

* Envoyプロキシサービス（Wallarmモジュールを内蔵）
* Tarantoolモジュール（ポストアナリティクス用）
* その他のサービスおよびスクリプト

Wallarmモジュールは、リクエストプロキシ用のEnvoy HTTPフィルターとして設計されています。

!!! warning "サポートされている設定パラメーター"
    NGINXベースのフィルタリングノード設定のほとんどの[ディレクティブ][nginx-directives-docs]は、Envoyベースのフィルタリングノード設定ではサポートされていません。その結果、[レート制限][rate-limit-docs]および[クレデンシャルスタッフィング検知][cred-stuffing-docs]は、このデプロイ方法では利用できません。

    [Envoy‑ベースのフィルタリングノード設定で利用可能なパラメーターの一覧 →][docker-envoy-configuration-docs]

## ユースケース

--8<-- "../include/waf/installation/docker-images/envoy-based-use-cases.md"

## 必要条件

--8<-- "../include/waf/installation/docker-images/envoy-requirements.md"

## コンテナ実行のオプション

フィルタリングノードの設定パラメーターは、以下の方法で`docker run`コマンドに渡すことができます:

* **環境変数内に**．このオプションは基本的なフィルタリングノードパラメーターの設定のみを可能にし、ほとんどの[パラメーター][docker-envoy-configuration-docs]は環境変数を通じて変更することはできません．
* **マウントされた設定ファイル内に**．このオプションにより、フィルタリングノードの[すべてのパラメーター][docker-envoy-configuration-docs]の設定が可能になります．

## 環境変数を渡してコンテナを実行する

コンテナを実行するには:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. ノード付きでコンテナを実行します:

    === "USクラウド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "EUクラウド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```

以下の基本的なフィルタリングノードの設定を、オプション`-e`を通じてコンテナに渡すことができます:

Environment variable | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | WallarmノードまたはAPIトークン． | Yes
`ENVOY_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス． | Yes
`WALLARM_API_HOST` | Wallarm APIサーバ:<ul><li>USクラウドの場合は `us1.api.wallarm.com`</li><li>EUクラウドの場合は `api.wallarm.com`</li></ul>デフォルトは:`api.wallarm.com`． | No
`WALLARM_MODE` | ノードモード:<ul><li>`block`は悪意のあるリクエストをブロックします</li><li>`safe_blocking`は[graylisted IP addresses][graylist-docs]から発生した悪意のあるリクエストのみをブロックします</li><li>`monitoring`はリクエストを解析しますがブロックはしません</li><li>`off`はトラフィックの解析と処理を無効にします</li></ul>デフォルトは:`monitoring`．<br>[フィルトレーションモードの詳細な説明 →][wallarm-mode-docs] | No
`WALLARM_LABELS` | ノード4.6以降で利用可能です。`WALLARM_API_TOKEN`が`Deploy`ロールの[API token][api-tokens-docs]に設定されている場合にのみ動作します。ノードインスタンスのグループ化のために`group`ラベルを設定します．例えば:<br><p>`WALLARM_LABELS="group=<GROUP>"`</p><p>…はノードインスタンスを`<GROUP>`インスタンスグループに配置します（既存の場合、または存在しない場合は作成されます．）</p> | Yes (for API tokens)
`TARANTOOL_MEMORY_GB` | Tarantoolに割り当てられる[メモリ量][allocate-resources-for-wallarm-docs]．値は整数または浮動小数点数で指定し、(ドット<code>.</code>は小数点の区切り文字です)．デフォルトは0.2ギガバイトです． | No

コマンドは以下の処理を行います:

* `/etc/envoy`コンテナディレクトリ内に最小限のEnvoy設定を含む`envoy.yaml`ファイルを作成します．
* `/etc/wallarm`コンテナディレクトリ内にWallarm Cloudへアクセスするためのフィルタリングノード認証情報のファイルを作成します:
    * `node.yaml`：フィルタリングノードのUUIDとシークレットキー
    * `private.key`：Wallarmプライベートキー
* `http://ENVOY_BACKEND:80`のリソースを保護します．

## envoy.yamlをマウントしてコンテナを実行する

用意した`envoy.yaml`ファイルは`-v`オプションを使用してDockerコンテナにマウントできます。ファイルには以下の設定が含まれている必要があります:

* [手順][docker-envoy-configuration-docs]に記載されているフィルタリングノード設定
* [Envoyの手順](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)に記載されているEnvoy設定

コンテナを実行するには:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. ノード付きでコンテナを実行します:

    === "USクラウド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "EUクラウド"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```

    * `-e`オプションは以下の必須環境変数をコンテナに渡します:

    Environment variable | 説明 | 必須
    --- | ---- | ----
    `WALLARM_API_TOKEN` | Wallarmノードトークン．<br><div class="admonition info"> <p class="admonition-title">複数インストールで1つのトークンを使用する場合</p> <p>選択された[プラットフォーム][supported-deployments]に関係なく、1つのトークンを複数のインストールで使用できます。これにより、Wallarm Console UIでノードインスタンスを論理的にグループ化できます。例：開発環境に複数のWallarmノードをデプロイし、各ノードが特定の開発者所有の別々のマシン上にある場合などです。</p></div> | Yes
    `WALLARM_API_HOST` | Wallarm APIサーバ:<ul><li>USクラウドの場合は `us1.api.wallarm.com`</li><li>EUクラウドの場合は `api.wallarm.com`</li></ul>デフォルトは:`api.wallarm.com`． | No

    * `-v`オプションは設定ファイル`envoy.yaml`のあるディレクトリを`/etc/envoy`コンテナディレクトリにマウントします.

コマンドは以下の処理を行います:

* `envoy.yaml`ファイルを`/etc/envoy`コンテナディレクトリにマウントします．
* `/etc/wallarm`コンテナディレクトリ内にWallarm Cloudへアクセスするためのフィルタリングノード認証情報のファイルを作成します:
    * `node.yaml`：フィルタリングノードのUUIDとシークレットキー
    * `private.key`：Wallarmプライベートキー
* マウントされた設定ファイルに指定されたリソースを保護します．

## ログローテーションの設定（オプション）

ログファイルのローテーションはあらかじめ設定され、デフォルトで有効になっています。必要に応じてローテーションの設定を調整できます。これらの設定はコンテナの`/etc/logrotate.d`ディレクトリにあります.

## Wallarmノードの動作テスト

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"