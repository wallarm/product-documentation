[link-using-search]:    ../search-and-filters/use-search.ja.md
[link-verify-attack]:   ../events/verify-attack.ja.md
[link-check-vulns]:     ../vulnerabilities/check-vuln.ja.md

[img-attacks-tab]:      ../../images/user-guides/events/check-attack.png
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[img-vulns-tab]:        ../../images/user-guides/events/check-vulns.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]:             ../search-and-filters/use-search.ja.md
[search-by-attack-status]: ../search-and-filters/use-search.ja.md#search-attacks-by-the-action

# イベントの確認

検出された攻撃、インシデント、および脆弱性をWallarm Consoleの**イベント**セクションで確認できます。必要なデータを見つけるには、[こちら][use-search]に説明されているように検索フィールドを使用するか、手動で必要な検索フィルタを設定してください。

## 攻撃

![!Attacks tab][img-attacks-tab]

* **日付**: 悪意のあるリクエストの日付と時刻。
    * 同じタイプの複数のリクエストが短い間隔で検出された場合、攻撃の持続時間が日付の下に表示されます。持続時間は、指定された時間枠で、特定のタイプの最初のリクエストと同じタイプの最後のリクエストの間の時間期間です。
    * 攻撃が現在進行中の場合、適切な[ラベル](#events-that-are-currently-happening)が表示されます。
* **リクエスト（ヒット数）**: 指定された時間枠での攻撃のリクエスト（ヒット）数。
* **ペイロード**: 攻撃タイプとユニークな[悪意のあるペイロード](../../glossary-en.ja.md#malicious-payload)の数。
* **トップIP / ソース**: 悪意のあるリクエストが発生したIPアドレス。悪意のあるリクエストが複数のIPアドレスから発生した場合、インターフェースには最もリクエストが多かったIPアドレスが表示されます。また、IPアドレスに関して以下のデータが表示されます。
     * 指定された時間枠において、同じ攻撃でリクエストが発生したIPアドレスの総数。
     * IPアドレスが登録されている国/地域（IP2Locationなどのデータベースに存在する場合）
     * ソースタイプ、**Public proxy**、**Web proxy**、**Tor**などのIPが登録されているクラウドプラットフォーム（IP2Locationなどのデータベースに存在する場合）
* **ドメイン / パス**: リクエストが対象としたドメイン、パス、およびアプリケーションID。
* カラーインジケータは、攻撃の遮断状況を表示します。

     * オレンジ色のインジケータは、フィルタリングノードが監視[モード](../../admin-en/configure-wallarm-mode.ja.md)で動作するため、攻撃のすべてのヒットが記録されるがフィルタリングノードによって遮断されない場合。アプリケーションが攻撃をブロックした場合（例：アプリケーションが `403 Forbidden`を返した場合）、インジケータはオレンジのままで、**コード**列にはアプリケーションが返したコードが表示されます。
     * 赤いインジケータは、攻撃のすべてのヒットがフィルタリングノードによって遮断された場合。
     * 白いインジケータが赤い場合、攻撃の一部のヒットが遮断され、他のヒットは記録のみされた場合（一部のヒットの[フィルタモード](../../admin-en/configure-wallarm-mode.ja.md)が監視に設定されている場合）。
* **コード**: リクエストに対するサーバーの応答ステータスコード。複数の応答ステータスコードがある場合、最も頻繁なコードと返されたコードの総数が表示されます。フィルタリングノードがリクエストをブロックした場合、コードは`403`または他の[カスタム値](../../admin-en/configuration-guides/configure-block-page-and-code.ja.md)になります。
* **パラメータ**: 悪意のあるリクエストのパラメータと、リクエストに適用された[パーサ](../rules/request-processing.ja.md)のタグ。
* **アクティブな検証**: 攻撃の検証ステータス。攻撃がfalse positiveとしてチェックされている場合、この列に対応するマーク（**FP**）が表示され、再度攻撃は検証されません。下の検索フィルタを使用して、false positiveアクションによって攻撃を見つけます。