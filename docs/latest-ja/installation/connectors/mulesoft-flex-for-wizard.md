# ウィザード用MuleSoft Flex

Wallarm Edge nodeは、MuleSoft Flex Gatewayに[同期](../inline/overview.md)または[非同期](../oob/overview.md)モードで接続できます。どちらのモードでもリクエストをブロックしません。

以下の手順に従って接続を設定します。

**1. WallarmポリシーをMuleSoft Exchangeにアップロードします**

1. お使いのプラットフォーム用の提供されているコードバンドルをダウンロードします。
1. ポリシーアーカイブを展開します。
1. ポリシーを公開するために使用するマシンが[すべての必要要件](mulesoft-flex.md#requirements)を満たしていることを確認します。
1. MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → 組織を選択 → その**business group ID**をコピーします。
1. 展開したポリシーディレクトリ → `Cargo.toml` → `[package.metadata.anypoint]` → `group_id`で、コピーしたグループIDを指定します:

    ```toml
    ...
    [package.metadata.anypoint]
    group_id = "<BUSINESS_GROUP_ID>"
    definition_asset_id = "wallarm-custom-policy"
    implementation_asset_id = "wallarm-custom-policy-flex"
    ...
    ```
1. ポリシーを操作しているのと同じターミナルセッションで[Anypoint CLIで認証します](https://docs.mulesoft.com/anypoint-cli/latest/auth):

    ```
    anypoint-cli-v4 conf username <USERNAME>
    anypoint-cli-v4 conf password '<PASSWORD>'
    ```
1. ポリシーをビルドして公開します:

    ```bash
    make setup      # 依存関係とPDK CLIをインストールします
    make build      # ポリシーをビルドします
    make release    # ポリシーの新しい本番版をAnypointに公開します
    ```

カスタムポリシーはMuleSoft Anypoint PlatformのExchangeで利用できるようになりました。

**2. WallarmポリシーをAPIにアタッチします**

Wallarmポリシーは個々のAPIにも、すべてのAPIにもアタッチできます。

1. 個別のAPIにポリシーを適用するには、Anypoint Platform → **API Manager** → 対象のAPIを選択 → **Policies** → **Add policy**に進みます。
1. すべてのAPIにポリシーを適用するには、Anypoint Platform → **API Manager** → **Automated Policies** → **Add automated policy**に進みます。
1. ExchangeからWallarmポリシーを選択します。
1. `wallarm_node`パラメータに、`http://`または`https://`を含めたWallarmノードのURLを指定します。
1. 必要に応じて、[その他のパラメータ](mulesoft-flex.md#configuration-options)を変更します。
1. ポリシーを適用します。

[詳細](mulesoft-flex.md)

<style>
  h1#mulesoft-flex-for-wizard {
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