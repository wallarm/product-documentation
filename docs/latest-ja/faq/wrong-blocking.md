# 正当なリクエストがブロックされました

ユーザーからWallarmの対策にもかかわらず正当なリクエストがブロックされると報告された場合は、本記事に説明されているように、当該リクエストを確認評価できます。

正当なリクエストがWallarmによりブロックされる問題を解決するため、以下の手順に従ってください:

1. ユーザーにブロックされたリクエストに関連する情報を**テキスト形式**（スクリーンショットではなく）で提供するよう依頼してください。取得する情報は次のいずれかとなります:

    * Wallarmの[ブロックページ](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)で提供される情報（設定されている場合。ユーザーのIPアドレス、リクエストUUID、その他事前に設定された要素が含まれる可能性があります）。

        ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

        !!! warning "ブロックページの使用について"
            デフォルトまたはカスタマイズ済みのWallarmのブロックページを使用されていない場合は、ユーザーから適切な情報を取得するために[設定](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)することを強く推奨します。サンプルページでも、ブロックされたリクエストに関連する有意義な情報を収集し、容易にコピーすることができます。さらに、このページはカスタマイズまたは完全に再構築して、ユーザーに有益なブロックメッセージを返すように変更できます。
    
    * ユーザーのクライアントリクエストおよびレスポンスのコピー。ブラウザページのソースコード、またはターミナルクライアントのテキスト入力および出力が適しています。

1. Wallarm Consoleの[**Attacks**](../user-guides/events/check-attack.md)または[**Incidents**](../user-guides/events/check-incident.md)セクションにて、ブロックされたリクエストに関連するイベントを[検索](../user-guides/search-and-filters/use-search.md)してください。例えば、[request IDによる検索](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    ```
    attacks incidents request_id:<requestId>
    ```

1. イベントを調査して、誤ったブロックか正当なブロックかを判断してください。
1. もし誤ったブロックである場合は、以下の措置のいずれかまたは組み合わせを適用して問題を解決してください: 

    * [false positives](../user-guides/events/check-attack.md#false-positives)に対する措置
    * [rules](../user-guides/rules/rules.md)の再設定
    * [triggers](../user-guides/triggers/triggers.md)の再設定
    * [IP lists](../user-guides/ip-lists/overview.md)の修正

1. もし初期にユーザーから提供された情報が不完全である場合、または安全に適用できる措置について確信が持てない場合は、詳細を[Wallarm support](mailto:support@wallarm.com)に共有し、さらなる支援と調査を依頼してください。