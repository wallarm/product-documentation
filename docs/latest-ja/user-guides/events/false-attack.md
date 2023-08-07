[link-analyzing-attacks]:       analyze-attack.md

[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png


# 偽陽性アタックの取り扱い

**偽陽性**は、合法的なリクエストに攻撃の兆候が検出された際に発生します。攻撃を分析した後、この攻撃の全リクエストまたは一部のリクエストが偽陽性であると結論付けることができます。過去の送信トラフィックから同様のリクエストを攻撃として認識することを防ぐために、いくつかのリクエストや攻撃全体を偽陽性としてマークすることができます。

## 偽陽性マークの動作は？

* [Information Exposure](../../attacks-vulns-list.md#information-exposure)と異なるタイプの攻撃に偽陽性マークが追加された場合、検出した攻撃の兆候（[トークン](../../about-wallarm/protecting-against-attacks.md#library-libproton)）の同一リクエストの分析が無効になるルールが自動的に作成されます。
* [Information Exposure](../../attacks-vulns-list.md#information-exposure)の攻撃タイプのインシデントに対して偽陽性マークが追加された場合、検出した[脆弱性の兆候](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods)の同一リクエストの分析を無効にするルールが自動的に作成されます。

作成されたルールは、保護対象のアプリケーションへのリクエストを分析するときに適用されます。ルールはWallarm Consoleに表示されず、[Wallarmの技術サポート](mailto: support@wallarm.com)へのリクエストによってのみ変更または削除することができます。

## ヒットを偽陽性とマークする

1つのリクエスト（ヒット）を偽陽性とマークするには：

1. Wallarm Console → **イベント**　では、偽陽性と思われる攻撃のリクエストリストを展開します。

    リクエスト分析の時間を節約するために、正確に悪意のあるリクエストを隠すことができます。[tag `!known`](../search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits)を使用します。
2. 有効なリクエストを定義し、**アクション**列の**偽**をクリックします。

    ![!偽のヒット][img-false-attack]

## 攻撃を偽陽性とマークする

攻撃の全てのリクエスト（ヒット）を偽陽性とマークするには：

1. Wallarm Console → **イベント**　では、有効なリクエストを持つ攻撃を選択します。

    リクエスト分析の時間を節約するために、正確に悪意のあるリクエストを隠すことが可能です。[tag `!known`](../search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits)を使用します。
2. **偽陽性とマークする**をクリックします。

    ![!偽の攻撃](../../images/user-guides/events/analyze-attack.png)

!!! warning "攻撃がIPによってグループ化されたヒットである場合"
    攻撃がIPアドレスによって[グループ化](../../about-wallarm/protecting-against-attacks.md#attack)されたヒットで構成されている場合、**偽陽性とマークする**ボタンは利用できません。特定のヒットを偽陽性と[マーク](#mark-a-hit-as-a-false-positive)することができます。

攻撃の全てのリクエストが偽陽性とマークされた場合、その攻撃に関する情報は次のようになります：

![!全攻撃が偽陽性にマークされている][img-removed-attack-info]

## 偽陽性マークを削除する

ヒットや攻撃の偽陽性マークを削除するには、[Wallarmの技術サポート](mailto: support@wallarm.com)へリクエストを送ってください。また、マークが適用された数秒後に、Wallarm Consoleのダイアログボックスで偽陽性マークを元に戻すこともできます。

## 攻撃リストの偽陽性表示

Wallarm Consoleでは、別のフィルターを通じて攻撃リストの偽陽性表示を制御することができます。以下のフィルターのオプションがあります：

* **デフォルトビュー**：実際の攻撃のみ
* **偽陽性を含む**：実際の攻撃と偽陽性
* **偽陽性のみ**

![!偽陽性フィルタ](../../images/user-guides/events/filter-for-falsepositive.png)