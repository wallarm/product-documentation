[link-check-attack]:        check-attack.md
[link-false-attack]:        false-attack.md

[img-analyze-attack]:       ../../images/user-guides/events/analyze-attack.png
[img-analyze-attack-raw]:   ../../images/user-guides/events/analyze-attack-raw.png
[img-current-attack]:       ../../images/user-guides/events/analyze-current-attack.png

[glossary-attack-vector]:   ../../glossary-en.md#malicious-payload

# 攻撃の分析

Wallarm Consoleの**イベント**セクションで攻撃を確認することができます。Wallarmは関連する悪意のあるリクエストを一つのエンティティ— 攻撃— に自動的にグループ化します。

## 攻撃の分析

[「攻撃とインシデントの確認」][link-check-attack]で説明されているすべての表の列を調査することで、攻撃に関する情報を取得することができます。

## 攻撃内のリクエストの分析

1. 攻撃を選択します。
2. *リクエスト*列の数字をクリックします。

数字をクリックすると、選択した攻撃内のすべてのリクエストが展開されます。

![攻撃内のリクエスト][img-analyze-attack]

各リクエストは次の列内に関連情報を表示します:

* *日付*: リクエストの日付と時間。
* *ペイロード*: [悪意のあるペイロード][glossary-attack-vector]。ペイロード列の値をクリックすると、攻撃タイプの参照情報が表示されます。
* *ソース*: リクエスト元のIPアドレス。IPアドレスをクリックすると、IPアドレスの値が検索フィールドに追加されます。また、IP2Locationまたは類似のデータベースに見つかった場合、以下の情報も表示されます:
     * IPアドレスが登録されている国/地域。
     * ソースのタイプ、例えば **プロキシ**、**Tor** またはIPが登録されているクラウドプラットフォームなど。
* *ステータス*: リクエストのブロック状況（[トラフィックフィルタモード](../../admin-en/configure-wallarm-mode.md)に依存します）。
* *コード*: サーバーによるリクエストへの応答ステータスコード。フィルタリングノードがリクエストをブロックした場合、コードは `403` や他の[カスタム値](../../admin-en/configuration-guides/configure-block-page-and-code.md)となります。
* *サイズ*: サーバーの応答のサイズ。
* *時間*: サーバーの応答時間。

攻撃が現在進行中の場合、リクエストグラフの下に *"now"* ラベルが表示されます。

![現在進行中の攻撃][img-current-attack]

リクエストビューには、Wallarmの振る舞いの微調整を提供する以下のオプションがあります:

* [**誤検知としてマーク** と **誤検知**](false-attack.md)は、攻撃として誤ってフラグされた正当なリクエストを報告します。
* **Base64を無効化** もしリクエスト要素にbase64パーサーが間違って適用されていた場合、そのことを示します。

    このボタンは、[パーサを無効にするルール](../rules/disable-request-parsers.md)の設定用の事前入力されたフォームを開きます。
* **ルール** は、特定のリクエストを処理するための[個別のルール](../rules/rules.md#rule)を作成します。

    このボタンは、リクエストデータで事前に記入されたルール設定フォームを開きます。

## Raw形式でのリクエストの分析

リクエストのRaw形式は最大限の詳細レベルを持つ形式です。Wallarm ConsoleのRaw形式ビューは、cURL形式でリクエストをコピーすることも可能にします。

Raw形式でリクエストを表示するためには、要求された攻撃を展開し、その中のリクエストも展開します。

![リクエストのRaw形式][img-analyze-attack-raw]

## ヒットのサンプリング

悪意のあるトラフィックは、しばしば比較可能な、あるいは同一の[ヒット](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)で構成されています。すべてのヒットを保存すると、イベントリストに重複エントリーが出現し、イベント分析の時間とWallarm Cloudへの負荷が増えます。

ヒットのサンプリングは、ユニークでないヒットのアップロードを省くことで、データの保存と分析を最適化します。

!!! warning "RPSの数値におけるドロップされたヒット"
    ドロップされたリクエストは、Wallarmノードが処理したリクエストであるため、ドロップされたリクエストごとにノード詳細UIのRPS値が増加します。

    [脅威防止ダッシュボード](../dashboards/threat-prevention.md)上のリクエストとヒットの数も、ドロップされたヒットの数も含みます。

サンプリングが行われていても、攻撃の検出品質には影響しません。これは単に攻撃の遅延を避けるための手段です。Wallarmノードは攻撃の検出と[ブロック](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)を続けます。

### サンプリングアルゴリズムの有効化

* [入力検証攻撃](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)の場合、サンプリングはデフォルトで無効化されています。あなたのトラフィック内の攻撃の割合が高い場合、サンプリングは**エクストリーム**と**レギュラー**の2段階で行われます。
* [行動攻撃](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)、[データボム](../../attacks-vulns-list.md#data-bomb)および[リソースの超過制限](../../attacks-vulns-list.md#overlimiting-of-computational-resources)の攻撃の場合: **レギュラー**のサンプリングアルゴリズムはデフォルトで有効化されています。**エクストリーム**のサンプリングは、あなたのトラフィック内の攻撃の割合が高い場合のみ開始されます。

サンプリングアルゴリズムが有効化されているとき、**イベント**セクションには**ヒットのサンプリングが有効**という通知が表示されます。

攻撃のトラフィックが減少すると、サンプリングは自動的に無効化されます。

### ヒットサンプリングのコアロジック

ヒットのサンプリングは、**エクストリーム**と**レギュラー**の2段階で行われます。

レギュラーアルゴリズムは、エクストリーム段階の後に保存されたヒットのみを処理します。ただし、ヒットのタイプが[行動的](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)、[データボム](../../attacks-vulns-list.md#data-bomb)または[リソースの超過制限](../../attacks-vulns-list.md#overlimiting-of-computational-resources)の場合、エクストリームサンプリングがこれらのヒットタイプに対して無効化されていた場合、レギュラーアルゴリズムは元のヒットセットを処理します。

**エクストリームサンプリング**

エクストリームサンプリングアルゴリズムのコアロジックは次のとおりです:

* ヒットが[入力検証](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)のタイプである場合、アルゴリズムはユニークな[悪意のあるペイロード](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)を持つものだけをクラウドにアップロードします。同じペイロードを持つ複数のヒットが1時間以内に検出された場合、そのうち最初のものだけがクラウドにアップロードされ、その他はドロップされます。
* ヒットが[行動的](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)、[データボム](../../attacks-vulns-list.md#data-bomb)または[リソースの超過制限](../../attacks-vulns-list.md#overlimiting-of-computational-resources)のタイプである場合、アルゴリズムは1時間以内に検出された最初の10％だけをクラウドにアップロードします。

**レギュラーサンプリング**

レギュラーサンプリングアルゴリズムのコアロジックは次のとおりです:

1. 同一のヒットの最初の5つは、Wallarm Cloud内のサンプルに保存されます。それ以降のヒットはサンプルに保存されませんが、その数は別のパラメータに記録されます。

    ヒットが同一であるとは、次の全てのパラメータが同じ値をもつ場合を指します:

    * 攻撃のタイプ
    * 悪意のあるペイロードを持つパラメータ
    * ターゲットアドレス
    * リクエスト方法
    * レスポンスコード
    * 送り元のIPアドレス
2. ヒットのサンプルは、イベントリストの[攻撃](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)にグループ化されます。

グループ化されたヒットは、Wallarm Consoleの**イベント**セクションに以下のように表示されます:

![ドロップされたヒット](../../images/user-guides/events/bruteforce-dropped-hits.png)

サンプリングされたヒットのみを表示させるためにイベントリストをフィルタリングするには、**ヒットのサンプリングが有効**の通知をクリックします。`sampled` 属性が検索フィールドに[追加](../search-and-filters/use-search.md#search-for-sampled-hits)され、イベントリストにはサンプリングされたヒットのみが表示されます。

!!! info "イベントリストにおけるドロップされたヒットの表示"
    ドロップされたヒットはWallarm Cloudにアップロードされていないため、特定のヒットや全体の攻撃がイベントリストにない場合があります。
