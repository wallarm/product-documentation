# ウィザード向けFastly

Wallarm Edge nodeは、APIを[同期](../inline/overview.md)または[非同期](../oob/overview.md)モードで実行しているFastlyに接続できます。いかなるリクエストもブロックしません。

以下の手順に従って接続を設定します。

**FastlyへのWallarmコードのデプロイ**

1. プラットフォーム用に提供されたコードバンドルをダウンロードします。
1. **Fastly** UI → **Account** → **API tokens** → **Personal tokens** → **Create token**に移動します:

    * Type: Automation token
    * Scope: Global API access
    * 特別な変更が必要な場合を除き、その他の設定はデフォルトのままにします
1. **Fastly** UI → **Compute** → **Compute services** → **Create service** → **Use a local project**に移動し、Wallarmのインスタンスを作成します。
1. 作成後、生成された`--service-id`をコピーします。
1. Wallarmパッケージを含むローカルディレクトリに移動し、次のコマンドでデプロイします:

    ```
    fastly compute deploy --service-id=<SERVICE_ID> --package=wallarm-api-security.tar.gz --token=<FASTLY_TOKEN>
    ```

    成功メッセージ:

    ```
    SUCCESS: Deployed package (service service_id, version 1)
    ```

**Wallarm Nodeとバックエンドのホストを指定する**

解析および転送のために適切なトラフィックルーティングを行うには、Fastlyサービスの設定でWallarm Nodeとバックエンドのホストを定義する必要があります。

1. **Fastly** UI → **Compute** → **Compute services** → Wallarm service → **Edit configuration**に移動します。
1. **Origins**に移動し、**Create hosts**を選択します:

    * 解析のためにトラフィックをWallarm Nodeへルーティングするよう、`wallarm-node`ホストとしてWallarm NodeのURLを追加します。
    * 別のホスト(例: `backend`)としてバックエンドのアドレスを追加し、Wallarm Nodeからオリジンバックエンドへトラフィックを転送します。
1. 新しいサービスバージョンを**Activate**します。

**Wallarm config storeの作成**

Wallarm固有の設定を定義する`wallarm_config`コンフィグを作成します。

1. **Fastly** UI → **Resources** → **Config stores** → **Create a config store**に移動し、次のキー/値項目で`wallarm_config`ストアを作成します:

    * `WALLARM_BACKEND`: Compute service settingsで指定したWallarm Nodeインスタンスのホスト名。
    * `ORIGIN_BACKEND`: Compute service settingsで指定したバックエンドのホスト名。
    * `WALLARM_MODE_ASYNC`: 元のフローに影響を与えないトラフィックの[コピー](../oob/overview.md)解析を有効にします(`true`)、またはインライン解析を有効にします(`false`、デフォルト)。

    [その他のパラメータ](fastly.md#configuration-options)
1. そのconfig storeをWallarm Compute serviceに**Link**します。

[詳細](fastly.md)

<style>
  h1#fastly-for-wizard {
    display: none;
  }

  .md-footer {
    display: none;
  }

  .md-header {
    display: none;
  }

  .md-content__button {
    display: none;
  }

  .md-main {
    background-color: unset;
  }

  .md-grid {
    margin: unset;
  }

  button.md-top.md-icon {
    display: none;
  }

  .md-consent {
    display: none;
  }
</style>