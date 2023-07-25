[link-analyzing-attacks]:       analyze-attack.ja.md

[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png

# 偽陽性攻撃の取り扱い

**偽陽性**とは、適切なリクエストで攻撃の兆候が検出されることです。攻撃を分析した後、その攻撃のすべてまたは一部のリクエストが偽陽性であると結論付けることがあります。今後のトラフィック分析でこのようなリクエストを攻撃として認識しないようにするために、いくつかのリクエストや攻撃全体を偽陽性としてマークすることができます。

## 偽陽性マークの仕組みは？

* [情報漏えい](../../attacks-vulns-list.ja.md#information-exposure) と異なるタイプの攻撃に対して偽陽性マークが追加されると、同じリクエストに対する検出された攻撃の兆候 ([トークン](../../about-wallarm/protecting-against-attacks.ja.md#library-libproton)) の解析を無効にするルールが自動的に作成されます。
* [情報漏えい](../../attacks-vulns-list.ja.md#information-exposure) タイプのインシデントに対して偽陽性マークが追加されると、検出された[脆弱性の兆候](../../about-wallarm/detecting-vulnerabilities.ja.md#vulnerability-detection-methods)の同じリクエストの解析を無効にするルールが自動的に作成されます。

作成されたルールは、保護されたアプリケーションへのリクエストの分析時に適用されます。ルールは Wallarm Console に表示されず、[Wallarm の技術サポート](mailto: support@wallarm.com) に送信されるリクエストによってのみ変更または削除できます。

## ヒットを偽陽性としてマークする

1つのリクエスト（ヒット）を偽陽性としてマークするには：

1. Wallarm Console → **イベント**で、偽陽性と思われる攻撃のリクエスト一覧を展開します。

    リクエスト分析の時間を短縮するために、[タグ `!known`](../search-and-filters/use-search.ja.md#search-by-known-attacks-cve-and-wellknown-exploits) を使用して、確実に悪意のあるリクエストを非表示にすることができます。
2. 有効なリクエストを特定し、**アクション**列で**False**をクリックします。

    ![!False hit][img-false-attack]

## 攻撃を偽陽性としてマークする

攻撃内のすべてのリクエスト（ヒット）を偽陽性としてマークするには：

1. Wallarm Console → **イベント**で、有効なリクエストが含まれる攻撃を選択します。

    リクエスト分析の時間を短縮するために、[タグ `!known`](../search-and-filters/use-search.ja.md#search-by-known-attacks-cve-and-wellknown-exploits) を使用して、確実に悪意のあるリクエストを非表示にすることができます。
2. **Mark as false positive（偽陽性としてマーク）**をクリックします。

    ![!False attack](../../images/user-guides/events/analyze-attack.png)

!!! warning "攻撃がIPによってグループ化されたヒットの場合"
    攻撃がIPアドレスごとに[グループ化](../../about-wallarm/protecting-against-attacks.ja.md#attack)されたヒットで構成されている場合、**Mark as false positive（偽陽性としてマーク）** ボタンは利用できません。偽陽性として[特定のヒットをマーク](#mark-a-hit-as-a-false-positive)することができます。

攻撃のすべてのリクエストが偽陽性としてマークされた場合、その攻撃に関する情報は次のようになります：

![!The whole attack is marked as false one][img-removed-attack-info]

## 偽陽性マークを削除する

ヒットまたは攻撃から偽陽性マークを削除するには、[Wallarm の技術サポート](mailto: support@wallarm.com) にリクエストを送信してください。また、Wallarm Console のダイアログボックスでマークが適用された数秒以内に偽陽性マークを元に戻すことができます。

## 攻撃リストに偽陽性を表示する

Wallarm Console では、別のフィルタを使用して攻撃リスト内の偽陽性の表示を制御することができます。以下のフィルタオプションがあります：

* **デフォルトビュー**：実際の攻撃のみ
* **偽陽性あり**：実際の攻撃と偽陽性
* **偽陽性のみ**

![!False positive filter](../../images/user-guides/events/filter-for-falsepositive.png)