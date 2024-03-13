[link-using-search]:    ../search-and-filters/use-search.md
[link-verify-attack]:   ../events/verify-attack.md
[img-attacks-tab]:      ../../images/user-guides/events/check-attack.png
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[use-search]:           ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action

# インシデントの確認

Wallarmコンソールでは、検出されたインシデントを**インシデント**セクションで確認できます。必要なデータを見つけるには、[こちら][use-search]で説明されているように検索フィールドを使用するか、必要な検索フィルターを手動で設定してください。

## インシデント

![インシデントタブ][img-incidents-tab]

* **日付**: 悪意のあるリクエストの日付と時刻。
    * 同じタイプの複数のリクエストが短い間隔で検出された場合、攻撃の期間が日付の下に表示されます。期間とは、特定のタイプの最初のリクエストと同じタイプの最後のリクエストの間の時間期間です。
    * 攻撃が現在発生している場合、適切な[ラベル](#events-that-are-currently-happening)が表示されます。
* **ペイロード**: 攻撃タイプとユニークな[悪意のあるペイロード](../../glossary-en.md#malicious-payload)の数。
* **ヒット**: 指定された時間枠内での攻撃のヒット（リクエスト）の数。
* **トップIP／ソース**: 悪意のあるリクエストの発信元IPアドレス。悪意のあるリクエストが複数のIPアドレスから発信された場合、インターフェイスは最もリクエストが多かったIPアドレスを表示します。IPアドレスについては、以下のデータも表示されます：
     * 指定された時間枠内で同じ攻撃のリクエストが発信されたIPアドレスの総数。
     * IPアドレスが登録されている国/地域（IP2Locationなどのデータベースで見つかった場合）
     * ソースタイプは、**Public proxy**、**Web proxy**、**Tor**あるいはIPが登録されているクラウドプラットフォームなどです（IP2Locationなどのデータベースで見つかった場合）
     * **悪意のあるIP**ラベルは、IPアドレスが悪意のある活動で知られている場合に表示されます。これは公開記録と専門家の検証に基づいています。
* **ドメイン／パス**: リクエストが対象としたドメイン、パス、およびアプリケーションID。
* **ステータス**: 攻撃のブロック状況（[トラフィックフィルタリングモード](../../admin-en/configure-wallarm-mode.md)に依存します）：
     * ブロック済み：攻撃の全てのヒットがフィルタリングノードによってブロックされました。
     * 部分的にブロック：攻撃のいくつかのヒットがブロックされ、他は登録のみされました。
     * 監視中：攻撃の全てのヒットが登録されましたが、ブロックされませんでした。
* **パラメータ**: 悪意のあるリクエストのパラメータとリクエストに適用された[パーサ](../rules/request-processing.md)のタグ
* **脆弱性**: インシデントが悪用する脆弱性。脆弱性をクリックすると、その詳細な説明と修復方法が表示されます。

最後のリクエストの時間によってインシデントを並べ替えるには、**最新のヒットで並べ替え**スイッチを使用できます。

## インシデント取得のAPIコール

WallarmコンソールUIを使用する他に、[Wallarm APIを直接呼び出す](../../api/overview.md)ことでインシデントの詳細を取得できます。以下は**過去24時間で検出された最初の50件のインシデントを取得する**APIコールの例です。

リクエストは、攻撃リスト[で使用されるもの](check-attack.md#api-calls-to-get-attacks)と似ています。`"!vulnid": null`という項目がインシデントのリクエストへ追加されています。この項目は、APIに特定された脆弱性IDなしで攻撃を無視するよう指示し、これによってシステムは攻撃とインシデントを区別します。

24時間前の日付を[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換して`TIMESTAMP`と置き換えてください。

--8<-- "../include/api-request-examples/get-incidents-en.md"