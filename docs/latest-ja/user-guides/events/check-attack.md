[link-using-search]: ../search-and-filters/use-search.md
[link-verify-attack]: ../events/verify-attack.md

[img-attacks-tab]: ../../images/user-guides/events/check-attack.png
[img-current-attacks]: ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]: ../../images/user-guides/events/incident-vuln.png
[img-vulns-tab]: ../../images/user-guides/events/check-vulns.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]: ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action

# イベントの確認

Wallarmコンソールの**イベント**セクションで検出された攻撃とインシデントを確認することができます。必要なデータを見つけるには、[こちら][use-search]で説明されているように検索フィールドを使用するか、手動で必要な検索フィルターを設定してください。

## アタック

![!Attacks tab][img-attacks-tab]

* **日付**: 悪意のあるリクエストの日付と時間。
    * 同じタイプのいくつかのリクエストが短時間に検出された場合、アタック継続時間が日付の下に表示されます。継続時間は、特定のタイプの最初のリクエストと同じタイプの最後のリクエストとの間の時間です。
    * アタックが現在進行中の場合、適切な[ラベル](#る現在進行中のイベント)が表示されます。
* **リクエスト（ヒット）**: 指定された時間枠内のアタックのリクエスト（ヒット）の数。
* **ペイロード**: アタックタイプと一意の[悪意のあるペイロード](../../glossary-en.md#malicious-payload)の数。
* **Top IP / Source**: 悪意のあるリクエストが発生したIPアドレス。悪意のあるリクエストがいくつかのIPアドレスから発生した場合、インターフェイスは最もリクエストの多いIPアドレスを表示します。IPアドレスには以下のデータも表示されます：
     * 同じ攻撃で指定された時間枠内にリクエストが発生したIPアドレスの総数。
     * IPアドレスが登録されている国/地域（IP2Locationなどのデータベースで見つかった場合）
     * ソースタイプ、**Public proxy**, **Web proxy**, **Tor**や IP が登録されているクラウドプラットフォームなど（IP2Locationなどのデータベースで見つかった場合） 
* **Domain / Path**: リクエストがターゲットとしたドメイン、パス、およびアプリケーションID。
* **ステータス**: アタックのブロック状態（[トラフィックフィルタモード](../../admin-en/configure-wallarm-mode.md)に依存）：
     * ブロック：アタックのすべてのヒットはフィルタリングノードによってブロックされました。
     * 部分的にブロック：アタックの一部のヒットはブロックされ、他のヒットは登録のみされました。
     * モニタリング：アタックのすべてのヒットは登録されましたが、ブロックはされていません。
* **パラメータ**: 悪意のあるリクエストのパラメータとリクエストに適用された[parsers](../rules/request-processing.md)のタグ。
* **アクティブな検証**: アタックの検証ステータス。攻撃が誤検知（FP）とされている場合、該当するマークがこの列（**FP**）に表示され、攻撃は再検証されません。誤検知アクションによる攻撃を検索するには、以下の検索フィルターを使用してください
    ![!Filter for false positive][img-show-falsepositive]

最後のリクエストの時間で攻撃を並べ替えるには、**最新のヒットで並べ替える**スイッチを使用できます。

## インシデント

![!Incidents tab][img-incidents-tab]

インシデントは攻撃と同じパラメーターを持ちますが、一つの列が違います： **脆弱性**列が攻撃の**検証**列を置き換えます。**脆弱性**列は、対応するインシデントが突き止めた脆弱性を表示します。

脆弱性をクリックすると、その詳細な説明と修正方法が表示されます。

最後のリクエストの時間でインシデントを並べ替えるには、**最新のヒットで並べ替える**スイッチを使用します。

## 現在進行中のイベント

リアルタイムでイベントを確認することができます。あなたの企業のリソースが悪意のあるリクエストを受けている場合、Wallarm Consoleには以下のデータが表示されます：

* 過去5分間に発生したイベントの数、これは**イベント**セクション名の隣とセクション内に表示されます。
* 特別なラベル、これは攻撃またはインシデントテーブルのイベント日付の下に表示されます。

また、検索フィールドに`now`キーワードを追加することで、現在進行中のイベントのみを表示することもできます：

* `attacks now`は、現在進行中の攻撃を表示します。
* `incidents now`は、現在進行中のインシデントを表示します。
* `attacks incidents now`は、現在進行中の攻撃とインシデントを表示します。

![!Attacks happening right now][img-current-attacks]

## アタックとインシデントを取得するAPIコール

攻撃やインシデントの詳細を取得するには、Wallarm Console UIを使用するかわりに[Wallarm APIを直接呼び出す](../../api/overview.md)ことができます。以下に、関連するAPIコールの例をいくつか示します。

**過去24時間で検出された最初の50件の攻撃を取得する**

`TIMESTAMP`を24時間前の日付に置き換えて[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換してください。

--8<-- "../include-ja/api-request-examples/get-attacks-en.md"

!!! warning "100件以上の攻撃を取得する"
    攻撃とヒットセットが100件以上の記録を含む場合、大量のデータセットを一度に取得するのではなく、パフォーマンスを最適化するために小さいサイズで取得することをお勧めします。[対応するリクエストの例を確認する](../../api/request-examples.md#get-a-large-number-of-attacks-100-and-more)

**過去24時間で確認された最初の50件のインシデントを取得する**

このリクエストは攻撃リストの前の例と非常に似ています。このリクエストに`"!vulnid": null`という項目が追加されています。この項目は、APIに特定の脆弱性IDなしですべての攻撃を無視するよう指示し、これによりシステムは攻撃とインシデントを区別します。

`TIMESTAMP`を24時間前の日付に置き換えて[Unix Timestamp](https://www.unixtimestamp.com/)形式に変換してください。

--8<-- "../include-ja/api-request-examples/get-incidents-en.md"

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/rhigX3DEoZ8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->