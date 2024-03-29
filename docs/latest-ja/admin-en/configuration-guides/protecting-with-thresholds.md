# 複数の攻撃を実行する攻撃者からの保護

Wallarmが[ブロッキングモード](../../admin-en/configure-wallarm-mode.md)に設定されている場合、悪意のあるペイロードを持つすべてのリクエストが自動的にブロックされ、正当なリクエストのみが通過します。特定の閾値を超えた同一IPからの異なる悪意のあるペイロードの数（しばしば**複数の攻撃を実行する攻撃者**と呼ばれます）の場合にWallarmの反応を設定することにより、アプリケーションとAPIに対する追加の保護を構成できます。

そのような攻撃者は自動的に拒否リストに配置され、それらからの**すべてのリクエストをブロック**します。これらが過去に多くの悪意のあるリクエストを生成したという事実に基づいて、それらが悪意のあるかどうかを分析する時間を費やさずにブロックします。

## 設定

悪意のあるリクエストの源を保護するには：

1. Wallarmコンソール → **トリガー** を開き、トリガー作成ウィンドウを開きます。
1. **悪意のあるペイロードの数** 条件を選択します。
1. 時間間隔ごとの1つのIPからの異なる悪意のあるペイロードの数を設定します。この数を指定された時間内に超えると、トリガーがアクティブになります。

    !!! info "カウントされないもの"
        [カスタム正規表現](../../user-guides/rules/regex-rule.md)に基づいた実験的ペイロード。

1. 必要に応じて、1つまたは複数のフィルタを設定：

    * **タイプ** はリクエストで検出された攻撃の[タイプ](../../attacks-vulns-list.md)またはリクエストが向けられている脆弱性のタイプです。
    * **アプリケーション** はリクエストを受信する[アプリケーション](../../user-guides/settings/applications.md)です。
    * **IP** はリクエストが送信されたIPアドレスです。

        フィルタは単一のIPのみを期待し、サブネット、ロケーション、ソースタイプは許可しません。

    * **ドメイン** はリクエストを受信するドメインです。
    * **レスポンスステータス** はリクエストに返されたレスポンスコードです。
    * **ターゲット** は攻撃が向けられているアプリケーションのアーキテクチャ部分またはインシデントが検出された部分です。以下の値を取ることができます：`サーバー`, `クライアント`, `データベース`。

1. トリガーの反応を選択：

    * 悪意のあるリクエストを発信する[**IPアドレスを拒否リストに追加**](../../user-guides/ip-lists/overview.md)し、ブロック期間を設定。
    
        Wallarmノードは、拒否リストに登録されたIPから発信された正当なリクエストと悪意のあるリクエストの両方をブロックします。
    
    * 悪意のあるリクエストを発信する[**IPアドレスをグレーリストに追加**](../../user-guides/ip-lists/overview.md)し、ブロック期間を設定。
    
        Wallarmノードは、[入力検証](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[`vpatch`](../../user-guides/rules/vpatch-rule.md) または [カスタム](../../user-guides/rules/regex-rule.md) 攻撃サインを含むリクエストのみをグレーリストのIPから送信された場合にブロックします。

    ![デフォルトトリガー](../../images/user-guides/triggers/trigger-example-default.png)

1. トリガーを保存し、[クラウドとノードの同期完了](../configure-cloud-node-synchronization-en.md)を待ちます（通常、2-4分かかります）。

## 事前設定されたトリガー

新しい企業アカウントは、1時間以内に3つ以上の異なる[悪意のあるペイロード](../../glossary-en.md#malicious-payload)を発信した場合にIPを1時間グレーリストに登録する事前設定（デフォルト）の**悪意のあるペイロードの数**トリガーを特徴としています。

[グレーリスト](../../user-guides/ip-lists/overview.md)は、ノードが次のように処理する疑わしいIPアドレスのリストです：グレーリストに登録されたIPが悪意のあるリクエストを発信した場合、ノードはそれらをブロックしながら正当なリクエストを許可します。グレーリストとは対照的に、[拒否リスト](../../user-guides/ip-lists/overview.md)は、あなたのアプリケーションに到達することが許されていないIPアドレスを指し示し、ノードは拒否リストに登録されたソースから発信された正当なトラフィックでさえブロックします。IPのグレーリスト登録は、[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)の削減を目的としたオプションの一つです。

トリガーは任意のノードフィルタリングモードでリリースされるため、ノードモードに関係なくIPをグレーリストに登録します。

ただし、ノードは**セーフブロッキング**モードでのみグレーリストを分析します。グレーリストに登録されたIPから発信された悪意のあるリクエストをブロックするには、ノードの[モード](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)をセーフブロッキングに切り替え、まずその特徴を学びます。

このトリガーでは、ブルートフォース、強制ブラウジング、リソースオーバーリミット、データボム、またはバーチャルパッチ攻撃タイプのヒットは考慮されません。

デフォルトトリガーを一時的に無効にしたり、変更したり、削除したりすることができます。

## テスト

以下は、[事前設定されたトリガー](#pre-configured-trigger)のテスト例です。あなたのトリガービューに合わせて調整することができます。

1. 次のリクエストを保護されたリソースに送信します：

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    [SQLi](../../attacks-vulns-list.md#sql-injection)、[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)、および[パストラバーサル](../../attacks-vulns-list.md#path-traversal)タイプの4つの悪意のあるペイロードがあります。
1. Wallarm コンソール → **IPリスト** → **グレーリスト** を開き、リクエストを発信したIPアドレスが1時間グレーリストに登録されていることを確認します。
1. セクション **攻撃** を開き、攻撃がリストに表示されていることを確認します：

    ![UI内の3つの悪意のあるペイロード](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    攻撃を検索するには、`multiple_payloads` [検索タグ](../../user-guides/search-and-filters/use-search.md#search-by-attack-type)を使用できます。