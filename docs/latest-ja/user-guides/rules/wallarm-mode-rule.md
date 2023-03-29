[link-wallarm-mode-override]: ../../admin-en/configure-parameters-en.md#wallarm_mode_allow_override

[img-mode-rule]: ../../images/user-guides/rules/wallarm-mode-rule-with-safe-blocking.png

# フィルタリングモードのルール

フィルタリングモードでは、ウェブアプリケーションのさまざまな部分へのリクエストのブロッキングを有効化または無効化できます。

フィルタリングモードを設定するには、*フィルタリングモードの設定*ルールを作成し、適切なモードを選択します。

フィルタリングモードは、以下の値のうちの一つを取ることができます。

* **デフォルト**: システムは、NGINXの設定ファイルで指定されたパラメータに従って動作します。
* **無効**: リクエストの解析とフィルタリングが完全に無効化されます。
* **モニタリング**: リクエストは解析され、インターフェースに表示されますが、[ブロックリスト](../ip-lists/denylist.md)内のIPからのリクエストであっても、ブロックされません。
* **セーフブロッキング**: 悪意のあるリクエストが[グレイリストのIP](../ip-lists/graylist.md)から発信されている場合にのみブロックされます。
* **ブロッキング**: 悪意のあるリクエストがブロックされ、インターフェイスに表示されます。

このルールを実装するには、NGINXの設定ファイルが[運用モードの一元管理][link-wallarm-mode-override]を許可している必要があります。

## ルールの作成と適用

--8<-- "../include-ja/waf/features/rules/rule-creation-options.md"

## デフォルトのルールインスタンス

Wallarmは、[default](../../user-guides/rules/view.md#default-rules)レベルで`フィルタリングモードの設定`ルールのインスタンスを自動的に作成します。システムは、[一般的なフィルタリングモード](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)の設定に基づいてその値を設定します。

このルールのインスタンスは削除することができません。値を変更するには、システムの[一般的なフィルタリングモード](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)設定を変更してください。

他のすべてのデフォルトルールと同様に、`フィルタリングモードの設定`デフォルトルールはすべてのブランチで[継承](../../user-guides/rules/view.md)されます。

## 例: ユーザー登録中のリクエストブロッキングの無効化

以下の条件が揃った**場合**:

* 新規ユーザー登録が *example.com/signup*で利用可能
* 攻撃を見逃すよりも顧客を失わない方が良い

**それでは**、ユーザー登録中にブロッキングを無効にするルールを作成するには

1. *ルール*タブに移動します
1. `example.com/signup`のブランチを見つけて、*ルールの追加*をクリックします
1. *フィルタリングモードの設定*を選択します。
1. *モニタリング*運用モードを選択します。
1. *作成*をクリックします。

![!トラフィックフィルタリングモードの設定][img-mode-rule]

## ルールを作成するためのAPI呼び出し

Wallarm Console UIを使用する代わりに、フィルタリングモードのルールを作成するために、[Wallarm APIを直接呼び出す](../../api/overview.md)ことができます。以下は、対応するAPI呼び出しの例です。

次のリクエストは、モニタリングモードでID `3`を持つ[アプリケーション](../settings/applications.md)に向かうトラフィックをフィルタリングするノードを設定するルールを作成します。

--8<-- "../include-ja/api-request-examples/create-filtration-mode-rule-for-app.md"