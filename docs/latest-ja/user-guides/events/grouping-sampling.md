```markdown
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

# ヒットのグループ化とサンプリング

[check-attack.md](check-attack.md)で攻撃を分析する際、悪意のあるリクエストがどのように提示されるかを理解することが重要です。Wallarmは攻撃リストを簡素化するために、ヒットのグループ化およびサンプリング技術を使用します。本記事ではこれらの技術について説明します。

## ヒットのグループ化

Wallarmは、二つのグループ化手法を利用して、[ヒット](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)を一つの攻撃にまとめます：

* 基本グループ化
* 送信元IPによるヒットのグループ化

これらの手法は相互に排他的ではありません。もしヒットが両方の手法の特徴を有する場合、全て一つの攻撃にグループ化されます。

### 基本グループ化

攻撃タイプ、悪意のあるペイロードを持つパラメータ、およびヒットが送信されたアドレスが同一である場合、ヒットはグループ化されます。同一攻撃タイプ内で、ヒットは同一または異なるIPアドレスから発生し、悪意のあるペイロードの値が異なる場合もあります。

このヒットグループ化手法は基本であり、全てのヒットに適用され、無効化や変更はできません。

### 送信元IPによるヒットのグループ化

送信元IPアドレスが同一である場合、ヒットはグループ化されます。グループ化されたヒットが異なる攻撃タイプ、悪意のあるペイロードおよびURLを有する場合、攻撃パラメータは攻撃リスト内で`[multiple]`タグが付与されます。

このヒットグループ化手法は、Brute force、Forced browsing、BOLA(IDOR)、Resource overlimit、Data bombおよびVirtual patch攻撃タイプのヒット以外の全てに対して機能します。

もしこの方法でヒットがグループ化されると、攻撃に対して[**Mark as false positive**](check-attack.md#false-positives)ボタンおよび[active verification](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)オプションが利用できなくなります。

送信元IPによるグループ化は、Wallarm Consoleの→**Triggers**にある、15分以内に単一IPアドレスから50件以上のヒットが発生した場合に起動するデフォルトトリガー**Hits from the same IP**により、デフォルトで有効になっています。

![Example of a trigger for hit grouping](../../images/user-guides/triggers/trigger-example-group-hits.png)

送信元IPによるグループ化はユーザーのニーズに合わせて調整可能です。**Hits from the same IP**タイプのカスタムトリガーを作成することで実施します。カスタムトリガーを作成するとデフォルトのトリガーは削除され、全てのカスタムトリガーを削除するとデフォルトが復元されます。また、デフォルトトリガーを一時的に無効化することでグループ化を一時停止することもできます。

## ヒットのサンプリング

攻撃の詳細を生成する際、Wallarmは解析をより快適にするために、ユニークな[ヒット](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)のみを表示し、同一（同等かつ同一）のヒットはWallarm Cloudへのアップロードが省略され、表示されません。このプロセスはヒットの**サンプリング**と呼ばれます。

ヒットのサンプリングは攻撃検出の品質に影響せず、検出の遅延を回避するのに役立ちます。Wallarmノードはヒットのサンプリングが有効であっても、攻撃検出および[blocking](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)を継続します。

**Hits sampling is enabled**通知は、サンプリングが現在稼働していることを示します。この通知をクリックするか、検索フィールドに[`sampled`](../search-and-filters/use-search.md#search-for-sampled-hits)を追加することで、サンプリングが適用された攻撃のみを確認できます。攻撃の詳細には、検出されたが表示されなかった類似のヒットの数が示されます：

![Dropped hits](../../images/user-guides/events/bruteforce-dropped-hits.png)

!!! info "攻撃リストに表示されないヒットについて"
    アップロードされなかったヒットはWallarm Cloudに送信されないため、特定のヒットまたは攻撃全体がリストに存在しない場合があります。

省略されたリクエストもWallarmノードによって処理されるリクエストであるため、ノード詳細UIのRPS値は各省略リクエストごとに増加します。[Threat Prevention dashboard](../dashboards/threat-prevention.md)のリクエストおよびヒット数にも、省略されたヒットの数が含まれます。

**ヒットのサンプリングが有効の場合**

* [input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)の場合、ヒットのサンプリングはデフォルトで無効です。トラフィック内の攻撃割合が高い場合、ヒットのサンプリングは2段階で実施されます：**extreme**と**regular**です。
* [behavioral attacks](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)、[Data bomb](../../attacks-vulns-list.md#data-bomb)および[Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit)の場合、**regular**サンプリングアルゴリズムがデフォルトで有効です。**Extreme**サンプリングはトラフィック内の攻撃割合が高い場合にのみ開始されます。
* denylisted IPからのイベントの場合、サンプリングはノード側で設定され、最初の10件の同一リクエストのみがCloudにアップロードされ、残りのヒットにはサンプリングアルゴリズムが適用されます。

トラフィック内の攻撃割合が低下すると、サンプリングは自動的に無効化されます。

### Extremeサンプリング

Extremeサンプリングアルゴリズムの基本的な考え方は以下の通りです：

* もしヒットが[input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)タイプの場合、アルゴリズムはユニークな[悪意のあるペイロード](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)を持つヒットのみをCloudにアップロードします。同一ペイロードの複数のヒットが1時間以内に検出された場合、最初の1件のみがCloudにアップロードされ、その他は省略されます。
* もしヒットが[behavioral](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)、[Data bomb](../../attacks-vulns-list.md#data-bomb)または[Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit)タイプの場合、アルゴリズムは1時間以内に検出された最初の10％のみをCloudにアップロードします。

### Regularサンプリング

Regularアルゴリズムは、[behavioral](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)、[Data bomb](../../attacks-vulns-list.md#data-bomb)または[Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit)タイプ以外のヒットに対して、Extreme段階の後に保存されたヒットのみを処理します。これらのタイプのヒットについてExtremeサンプリングが無効の場合、Regularアルゴリズムは元のヒットセットを処理します。

Regularサンプリングアルゴリズムの基本的な考え方は以下の通りです：

1. 各時間ごとに、最初の5件の同一ヒットがWallarm Cloudのサンプルに保存されます。残りのヒットはサンプルに保存されませんが、その件数が別のパラメータに記録されます。

   ヒットが同一と見なされる条件は、以下の全てのパラメータが同一の値を持つ場合です：

    * 攻撃タイプ
    * 悪意のあるペイロードを持つパラメータ
    * ターゲットアドレス
    * リクエストメソッド
    * レスポンスコード
    * 発信元IPアドレス

2. ヒットサンプルは、イベントリスト内で[攻撃](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)にグループ化されます。
```