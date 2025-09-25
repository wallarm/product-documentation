[link-using-search]:    ../search-and-filters/use-search.md
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[al-brute-force-attack]:      ../../attacks-vulns-list.md#brute-force-attack
[al-forced-browsing]:         ../../attacks-vulns-list.md#forced-browsing
[al-bola]:                    ../../attacks-vulns-list.md#broken-object-level-authorization-bola
[link-analyzing-attacks]:       analyze-attack.md
[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png
[link-check-attack]:        check-attack.md
[link-false-attack]:        false-attack.md
[img-current-attack]:       ../../images/user-guides/events/analyze-current-attack.png
[glossary-attack-vector]:   ../../glossary-en.md#malicious-payload

# ヒットのグルーピングとサンプリング

[攻撃を分析する](check-attack.md)際には、不正リクエストがどのように提示されるかを理解することが重要です。Wallarmは攻撃一覧を簡潔にするためにヒットのグルーピングとサンプリング手法を使用します。本記事ではこれらの手法について説明します。

## ヒットのグルーピング

Wallarmは、[ヒット](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)を1つの攻撃にまとめるために次の2つのグルーピング方法を使用します:

* 基本グルーピング
* 送信元IPによるヒットのグルーピング

これらの方法は相互排他的ではありません。ヒットが両方の条件を満たす場合は、すべて同一の攻撃にグルーピングされます。

### 基本グルーピング

攻撃タイプ、悪意のあるペイロードを含むパラメータ、送信先アドレスが同一であればヒットはグルーピングされます。ヒットは同一または異なるIPアドレスから送られていてもよく、同一の攻撃タイプ内であっても悪意のあるペイロードの値が異なる場合があります。

このヒットのグルーピング方法は基本であり、すべてのヒットに適用され、無効化や変更はできません。

### 送信元IPによるヒットのグルーピング

送信元IPアドレスが同一であればヒットはグルーピングされます。グルーピングされたヒットに異なる攻撃タイプ、悪意のあるペイロード、URLが含まれる場合、攻撃一覧では攻撃パラメータに`[multiple]`タグが付与されます。

このヒットのグルーピング方法は、Brute force、Forced browsing、BOLA (IDOR)、Resource overlimit、Data bomb、Virtual patchの各攻撃タイプを除くすべてのヒットに適用されます。

ヒットがこの方法でグルーピングされている場合、その攻撃に対しては[**Mark as false positive**](check-attack.md#false-positives)ボタンおよび[active verification](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)オプションは利用できません。

送信元IPによるグルーピングは、Wallarm Console→**Triggers**でデフォルトで有効になっており、15分間に単一のIPアドレスから50件を超えるHitsが発生したときに作動する**Hits from the same IP**というデフォルトトリガーで実現します.

![ヒットのグルーピング用トリガーの例](../../images/user-guides/triggers/trigger-example-group-hits.png)

送信元IPによるグルーピングは要件に合わせて調整できます。**Hits from the same IP**タイプのカスタムトリガーを作成してください。任意のカスタムトリガーを作成するとデフォルトトリガーは削除され、すべてのカスタムトリガーを削除するとデフォルトが復元されます。デフォルトトリガーを一時的に無効化してグルーピングを一時停止することもできます。

## ヒットのサンプリング

攻撃の詳細を生成する際、Wallarmは分析しやすいように、ユニークな[ヒット](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)のみを表示し、ユニークでない（同等または同一の）ヒットはWallarm Cloudへのアップロードから除外して表示しません。この処理をヒットのサンプリングと呼びます。

ヒットのサンプリングは攻撃検知の品質には影響せず、処理の低下を避けるのに役立ちます。ヒットのサンプリングが有効な場合でも、Wallarmノードは攻撃の検知および[ブロック](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)を継続します。

**Hits sampling is enabled**という通知が表示されていると、現在サンプリングが動作していることを示します。この通知をクリックするか、検索フィールドに[`sampled`](../search-and-filters/use-search.md#search-for-sampled-hits)を追加すると、サンプリングが適用された攻撃のみを表示できます。攻撃の詳細では、検出されたものの表示されなかった類似ヒットの数が確認できます:

![ドロップされたヒット](../../images/user-guides/events/bruteforce-dropped-hits.png)

!!! info "攻撃一覧でのドロップ済みヒットの表示"
    ドロップされたヒットはWallarm Cloudにアップロードされないため、攻撃一覧に一部のヒットや攻撃全体が表示されない場合があります。

ドロップされたリクエストもWallarmノードで処理されたリクエストであるため、ノード詳細UIのRPS値はドロップされるたびに増加します。[Threat Preventionダッシュボード](../dashboards/threat-prevention.md)上のリクエスト数およびヒット数にも、ドロップされたヒットの数が含まれます。

**ヒットのサンプリングが有効な場合**

* [入力検証タイプの攻撃](../../attacks-vulns-list.md#attack-types)では、ヒットのサンプリングは既定で無効です。トラフィックに占める攻撃の割合が高い場合、サンプリングは**extreme**と**regular**の2段階で順に実行されます。
* [振る舞いタイプの攻撃](../../attacks-vulns-list.md#attack-types)、[Data bomb](../../attacks-vulns-list.md#data-bomb)および[Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit)の攻撃では、既定で**regular**サンプリングアルゴリズムが有効です。**Extreme**サンプリングは、トラフィックに占める攻撃の割合が高い場合にのみ開始されます。
* denylistされたIPからのイベントについては、サンプリングはノード側で設定されます。同一のリクエストは最初の10件のみをCloudにアップロードし、残りのヒットにはサンプリングアルゴリズムを適用します。

トラフィックに占める攻撃の割合が低下すると、サンプリングは自動的に無効になります。

### Extremeサンプリング

Extremeサンプリングアルゴリズムの基本ロジックは次のとおりです:

* ヒットが[入力検証](../../attacks-vulns-list.md#attack-types)タイプの場合、アルゴリズムはユニークな[悪意のあるペイロード](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)のみをCloudにアップロードします。1時間内に同一ペイロードのヒットが複数検出された場合は、そのうち最初の1件のみをCloudにアップロードし、残りはドロップします。
* ヒットが[振る舞い](../../attacks-vulns-list.md#attack-types)、[Data bomb](../../attacks-vulns-list.md#data-bomb)、[Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit)タイプの場合、アルゴリズムは1時間内に検出されたヒットのうち最初の10%のみをCloudにアップロードします。

### Regularサンプリング

Regularアルゴリズムは、[振る舞い](../../attacks-vulns-list.md#attack-types)、[Data bomb](../../attacks-vulns-list.md#data-bomb)、[Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit)タイプのヒットを除き、Extreme段階で保存されたヒットのみを処理します。これらのタイプでExtremeサンプリングが無効な場合は、Regularアルゴリズムが元のヒット集合を処理します。

Regularサンプリングアルゴリズムの基本ロジックは次のとおりです:

1. 各1時間ごとに最初の5件の同一ヒットをWallarm Cloudのサンプルとして保存します。残りのヒットはサンプルには保存されませんが、その件数は別パラメータに記録されます。

    以下のパラメータがすべて同じ値であれば、そのヒットは同一と見なします:

    * 攻撃タイプ
    * 悪意のあるペイロードを含むパラメータ
    * 宛先アドレス
    * リクエストメソッド
    * レスポンスコード
    * 送信元IPアドレス
2. ヒットのサンプルは、イベント一覧で[攻撃](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)にグルーピングされます。