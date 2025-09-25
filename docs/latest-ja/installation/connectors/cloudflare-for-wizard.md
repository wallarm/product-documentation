# ウィザード向けCloudflare

Wallarm Edge nodeをCloudflareに接続すると、トラフィックを[同期](../inline/overview.md)または[非同期](../oob/overview.md)モードで検査できます。いずれのモードでも、リクエストはブロックしません。

接続を設定するには、次の手順に従います。

1. お使いのプラットフォーム向けに提供されたコードバンドルをダウンロードします。
1. ダウンロードしたコードを使用して[Cloudflare workerを作成](https://developers.cloudflare.com/workers/get-started/dashboard/)します。
1. `wallarm_node`パラメータにWallarm nodeのURLを設定します。
1. [非同期（アウトオブバンド）](../oob/overview.md)モードを使用する場合、`wallarm_mode`パラメータを`async`に設定します。
1. 必要に応じて、[その他のパラメータ](cloudflare.md#configuration-options)を変更します。
1. **Website** → your domainで、**Workers Routes** → **Add route**に移動します:

    * **Route**では、Wallarmで検査するためにルーティングするパスを指定します（例：すべてのパスの場合は`*.example.com/*`）。
    * **Worker**では、作成したWallarm workerを選択します。

[詳細](cloudflare.md)

<style>
  h1#cloudflare-for-wizard {
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