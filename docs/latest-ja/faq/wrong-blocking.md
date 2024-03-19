# 合法的な要求がブロックされる

ユーザーから、Wallarmの対策にもかかわらず合法的な要求がブロックされたと報告があった場合、この記事で説明するように、その要求をレビューし評価することができます。

Wallarmによって合法的な要求がブロックされる問題を解決するためには、以下の手順に従ってください。

1. ユーザーに、ブロックされた要求に関連する情報を**テキストとして**（スクリーンショットではなく）提供してもらうよう依頼します。これは以下のいずれかとなります：

    * Wallarmの[ブロックページ](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)が設定されている場合に提供される情報（ユーザーのIPアドレス、要求のUUID、および他の設定されている要素を含む場合があります）。

        ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

        !!! warning "ブロックページの使用"
            デフォルトやカスタマイズされたWallarmのブロックページを使用していない場合、ユーザーから適切な情報を取得するために、それを[設定する](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)ことを強く推奨します。サンプルページがブロックされた要求に関連する意味のある情報を収集し、簡単にコピーすることを忘れないでください。さらに、ユーザーに情報を提供するブロックメッセージを返すために、このようなページをカスタマイズまたは完全に再構築することもできます。
    
    * ユーザーのクライアント要求と応答のコピー。ブラウザーのページソースコードやターミナルクライアントのテキスト入力と出力が適しています。

1. Wallarmコンソール → [**イベント**](../user-guides/events/check-attack.md) セクションで、ブロックされた要求に関連するイベントを[検索](../user-guides/search-and-filters/use-search.md)します。例えば、[要求IDで検索](../user-guides/search-and-filters/use-search.md#search-by-request-identifier)します：

    ```
    attacks incidents request_id:<requestId>
    ```

1. イベントを調査して、誤ったブロックか合法的なブロックかを判断します。
1. 誤ったブロックである場合、以下の一つまたは複数の対策を適用して問題を解決します： 

    * [誤報に対する対策](../user-guides/events/false-attack.md)
    * [ルール](../user-guides/rules/rules.md)の再設定
    * [トリガー](../user-guides/triggers/triggers.md)の再設定
    * [IPリスト](../user-guides/ip-lists/overview.md)の編集

1. ユーザーから最初に提供された情報が不完全であったり、安全に適用できる対策について確信が持てない場合は、詳細を[Wallarmサポート](mailto:support@wallarm.com)と共有し、追加の支援と調査を依頼します。