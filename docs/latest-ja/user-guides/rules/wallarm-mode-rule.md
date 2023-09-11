[link-wallarm-mode-override]:       ../../admin-en/configure-parameters-en.md#wallarm_mode_allow_override

[img-mode-rule]:        ../../images/user-guides/rules/wallarm-mode-rule-with-safe-blocking.png

# フィルタリングモードのルール

フィルタリングモードを使用すると、ウェブアプリケーションのさまざまな部分に対するリクエストのブロックを有効または無効にできます。

フィルタリングモードを設定するためには、*フィルタリングモードの設定*ルールを作成し、適切なモードを選択します。

フィルタリングモードは以下の[値](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)のいずれかをとることができます：

* **デフォルト**：システムは、NGINX設定ファイルで指定されたパラメータに従って動作します。
* **無効**：[denylist](../ip-lists/denylist.md)にあるIPからのリクエストを除き、リクエストの分析とフィルタリングがオフになります。denylistに登録されたIPからのリクエストはブロックされます（インターフェイスには表示されません）。
* **監視**：リクエストは分析され、インターフェイスに表示されますが、denylistに登録されたIPからのリクエストでなければブロックされません。denylistに登録されたIPからのリクエストはブロックされます（インターフェイスには表示されません）。
* **安全なブロック**：悪意のあるリクエストは、[graylisted IPs](../ip-lists/graylist.md)から発生した場合のみブロックされます。
* **ブロック**：悪意のあるリクエストはブロックされ、インターフェイスに表示されます。

このルールを実装するためには、NGINX設定ファイルが[動作モードの集中管理][link-wallarm-mode-override]を許可する必要があります。

## ルールの作成と適用

--8<-- "../include-ja/waf/features/rules/rule-creation-options.md"

## ルールのデフォルトインスタンス

Wallarmは自動的に`フィルタリングモードの設定`ルールのインスタンスを[デフォルト](../../user-guides/rules/view.md#default-rules)レベルで作成します。システムはその値を[全体のフィルタリングモード](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)設定に基づいて設定します。

このルールのインスタンスは削除できません。その値を変更するためには、システムの[全体のフィルタリングモード](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)設定を変更します。

他のすべてのデフォルトルールと同様に、`フィルタリングモードの設定`デフォルトルールはすべてのブランチで[継承](../../user-guides/rules/view.md)されます。

## 例：ユーザ登録中のリクエストブロックの無効化

以下の条件が存在する**場合**：

* *example.com/signup* で新規ユーザ登録が可能
* 攻撃を見逃すより顧客を失うことがない方が良い

**その場合**、ユーザ登録中のブロックを無効化するルールを作成するには

1. *ルール*タブに移動します
1. `example.com/signup`のブランチを見つけて、*ルールを追加*をクリックします
1. *フィルタリングモードの設定*を選択します
1. *監視*という操作モードを選択します
1. *作成*をクリックします

![トラフィックフィルタリングモードの設定][img-mode-rule]

## ルール作成のAPI呼び出し

フィルタリングモードのルールを作成するためには、Wallarm Console UIの使用の他に、直接Wallarm APIを[呼び出す](../../api/overview.md)こともできます。以下に、該当するAPI呼び出しの例を示します。

以下のリクエストでは、ID `3`の[アプリケーション](../settings/applications.md)へのトラフィックをフィルタリングするノードを設定するルールが作成されます。

--8<-- "../include-ja/api-request-examples/create-filtration-mode-rule-for-app.md"
