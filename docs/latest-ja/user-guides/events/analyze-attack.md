[link-check-attack]: check-attack.md
[link-false-attack]: false-attack.md

[img-analyze-attack]: ../../images/user-guides/events/analyze-attack.png
[img-analyze-attack-raw]: ../../images/user-guides/events/analyze-attack-raw.png
[img-current-attack]: ../../images/user-guides/events/analyze-current-attack.png

[glossary-attack-vector]: ../../glossary-en.md#malicious-payload

# アタックの分析

Wallarmインタフェースの*Events*タブで攻撃を確認できます。

Wallarmは、関連する悪意のあるリクエストを1つのエンティティー（アタック）に自動的にグループ化します。

## アタックの分析

[「攻撃とインシデントの確認」][link-check-attack]で説明されるすべてのテーブル列を調査することで、アタックに関する情報を得ることができます。

## アタック内のリクエストの分析

1. アタックを選択します。
2. *リクエスト*カラムの数字をクリックします。

数字をクリックすると、選択したアタック内のすべてのリクエストが展開されます。

![!アタック内のリクエスト][img-analyze-attack]

各リクエストは、以下のカラムに関連する情報を表示します。

* *Date*：リクエストの日付と時刻。
* *Payload*：[悪意のあるペイロード][glossary-attack-vector]。payloadカラムの値をクリックすると、アタックタイプの参照情報が表示されます。
* *Source*：リクエストが発信されたIPアドレス。IPアドレスをクリックすると、IPアドレスの値が検索フィールドに追加されます。また、IP2Locationなどのデータベースに見つかった場合には、以下の情報も表示されます。
     * IPアドレスが登録されている国/地域。
     * ソースタイプ（例：**Proxy**、**Tor**、IPが登録されているクラウドプラットフォームなど）。
* *Code*：リクエストからのサーバーのレスポンスステータスコード。フィルタリングノードがリクエストをブロックした場合、コードは`403`または別の[カスタム値](../../admin-en/configuration-guides/configure-block-page-and-code.md)になります。
* *Size*：サーバーのレスポンスサイズ。
* *Time*：サーバーのレスポンス時間。

アタックが現在進行中の場合、リクエストグラフの下に*"now"*ラベルが表示されます。

![!現在進行中のアタック][img-current-attack]

リクエストビューには、Wallarm動作の微調整に役立つ以下のオプションが提供されています。

* [**偽陽性としてマーク**および**False**](false-attack.md)で、アタックとしてフラグされた正当なリクエストを報告します。
* **Disable base64**で、base64パーサーがリクエスト要素に誤って適用されたことを示します。

    ボタンは、[パーサーを無効にするルール](../rules/disable-request-parsers.md)を設定するための事前入力済みのフォームを開きます。
* **Rule**で、特定のリクエストを処理するための[任意の個別ルール](../rules/add-rule.md#rule)を作成します。

    ボタンは、リクエストデータが事前入力されたルール設定フォームを開きます。

## Raw Formatでのリクエストの分析

生形式のリクエストは、最大限の詳細レベルです。Wallarm ConsoleのRaw formatビューでは、cURL形式でリクエストをコピーすることもできます。

生形式でリクエストを表示するには、必要なアタックを展開し、それからリクエストを展開します。

![!リクエストの生形式][img-analyze-attack-raw]

## ヒットのサンプリング

悪意のあるトラフィックは、多くの場合比較可能で同一の[ヒット](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)で構成されています。全てのヒットを保存すると、イベントリストに重複したエントリが追加され、Wallarm Cloudのアナリティクスの時間と負荷が増加します。

ヒットサンプリングは、非ユニークなヒットをWallarm Cloudにアップロードされないようにすることで、データの保存と分析を最適化します。

!!! warning "RPS内のドロップされたヒット"
    送信されたリクエストは、Wallarmノードによって処理されたリクエストであるため、RPS値は、ドロップされたリクエストごとにノード詳細UIが増加します。

    [Threat Preventionダッシュボード](../dashboards/threat-prevention.md)のリクエスト数とヒット数には、ドロップされたヒット数も含まれます。

ヒットサンプリングは、アタック検出の品質に影響せず、遅延を回避するだけです。Wallarmノードは、ヒットサンプリングが有効になっている場合でも、アタック検出と[ブロック](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)を続行します。

### サンプリングアルゴリズムの有効化

* [入力検証攻撃](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)の場合、ヒットサンプリングはデフォルトでは無効です。トラフィック内のアタックの割合が高い場合、ヒットサンプリングは**極端**と**通常**の2つの段階で行われます。
* [行動攻撃](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)、[Data bomb](../../attacks-vulns-list.md#data-bomb)および[Resource overlimiting](../../attacks-vulns-list.md#overlimiting-of-computational-resources)の攻撃の場合：**通常**のサンプリングアルゴリズムがデフォルトで有効になっています。**極端**なサンプリングは、トラフィック内の攻撃の割合が高い場合にのみ開始されます。

サンプリングアルゴリズムが有効になっていると、**エベント**セクションでは、**ヒットサンプリングが有効**という通知が表示されます。

トラフィック内のアタックの割合が減少したら、サンプリングは自動的に無効になります。### ヒットサンプリングのコアロジック

ヒットサンプリングは、**極端**および**通常**の2つの段階で順次実行されます。

通常のアルゴリズムは、極端な段階の後に保存されたヒットのみを処理し、ヒットが[行動](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)、[データ爆弾](../../attacks-vulns-list.md#data-bomb)、または[リソースオーバーリミット](../../attacks-vulns-list.md#overlimiting-of-computational-resources)のタイプでない限りです。これらのタイプのヒットに対して極端なサンプリングが無効になっている場合、通常のアルゴリズムは元のヒットセットを処理します。

**極端なサンプリング**

極端なサンプリングアルゴリズムには、次のコアロジックがあります：

* ヒットが[入力検証](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)タイプの場合、アルゴリズムはユニークな[悪意のあるペイロード](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)を持つものだけをクラウドにアップロードします。同じペイロードを持つ複数のヒットが1時間以内に検出された場合、最初のヒットのみがクラウドにアップロードされ、他のヒットは破棄されます。
* ヒットが[行動](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)、[データ爆弾](../../attacks-vulns-list.md#data-bomb)、または[リソースオーバーリミット](../../attacks-vulns-list.md#overlimiting-of-computational-resources)タイプの場合、アルゴリズムは、1時間以内に検出された最初の10％のみをクラウドにアップロードします。

**通常のサンプリング**

通常のサンプリングアルゴリズムには、次のコアロジックがあります：

1. 各時間の最初の5つの同一ヒットがWallarm Cloudのサンプルに保存されます。残りのヒットはサンプルに保存されませんが、その数は別のパラメータに記録されます。

    以下のすべてのパラメータが同じ値を持っている場合、ヒットは同一です：

    * 攻撃タイプ
    * 悪意のあるペイロードを持つパラメータ
    * ターゲットアドレス
    * 要求メソッド
    * レスポンスコード
    * 発信元IPアドレス
2. ヒットサンプルがイベントリスト内の[攻撃](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)にグループ化されます。

グループ化されたヒットは、Wallarm Consoleの**イベント**セクションに次のように表示されます：

![!Dropped hits](../../images/user-guides/events/bruteforce-dropped-hits.png)

サンプリングされたヒットのみを表示するイベントリストをフィルタリングするには、**ヒットサンプリングが有効**通知をクリックします。`sampled` 属性が検索フィールドに[追加](../search-and-filters/use-search.md#search-for-sampled-hits)され、イベントリストにサンプリングされたヒットのみが表示されます。

!!! info "イベントリストでドロップされたヒットを表示する"
     ドロップされたヒットはWallarmクラウドにアップロードされないため、特定のヒットまたは全体の攻撃がイベントリストに欠落している場合があります。

<!-- ## デモ動画

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/spD3BnI6fq4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->