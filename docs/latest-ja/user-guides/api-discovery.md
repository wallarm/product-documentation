# API Discovery <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmコンソールの**API Discovery**セクションを使用すると、[APIインベントリ](../api-discovery/overview.md)の管理やその発見を微調整することができます。 このガイドでは、このセクションの使用方法について説明します。

このセクションは、次の [ロール](../user-guides/settings/users.md#user-roles)のユーザーにのみ利用可能です：

* **管理者**と**アナリスト**は、API Discoveryモジュールで発見したデータの表示と管理、およびAPI Discovery設定部分へのアクセスが可能です。

    マルチテナンシー機能があるアカウントの **Global Administrator（グローバル管理者）**と**Global Analyst（グローバルアナリスト）**は同じ権限を持っています。
* **API開発者**は、API Discoveryモジュールで発見したデータの表示とダウンロードが可能です。 この役割は、Wallarmを用いて企業のAPIに対する現行のデータの取得だけが必要なユーザーを識別することできます。 これらのユーザーは、**API Discovery**と**Settings → Profile**以外のWallarm Consoleセクションにアクセスすることはできません。

![Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

!!! info "デフォルトビュー：期間、ソート、グループ化 "

    **期間**

    **API Discovery**セクションを開くたびに：
    
    * あなたのAPIの現在のインベントリ（発見された全エンドポイント）が表示されます
    * **Changes since（以降の変更）**フィルターが`Lask week（先週）` ステータスになり、以下のことを意味します：

        * 提示されたエンドポイントの中で、この期間中に`New（新規）`や`Changed（変更）`ステータスになったものが、それぞれに対応する[マーク](#tracking-changes-in-api)を得ます
        * さらに、この期間中に`Deleted（削除済み）`となったエンドポイントが表示されます

    デフォルトで何が表示されるかを理解するために、[この例](#example)を参照してください。

    カバーする他の期間を手動で選択することも可能です。

    **ソートとグルーピング**

    デフォルトでは、エンドポイントはホスト／エンドポイント名順（およびホスト別）にソートされます。 **Hits（ヒット数）**や**Risk（リスク）**でソートすると、グルーピングが無くなります - デフォルトに戻るには、再度ホスト／エンドポイント列をクリックします。

## エンドポイントのフィルタリング

APIエンドポイントフィルタの中から、分析目的に対応するものを選びます。 以下が例です：

* ヒット数でソートできる、攻撃されたエンドポイントのみ。
* 最終週に変更されたか新しく発見され、PIIデータを処理しているエンドポイントを見つける。 このようなリクエストは、APIの重要な変更を常に把握するのに役立ちます。
* PUTまたはPOST呼び出しによりサーバーにデータをアップロードできるエンドポイントを使用しているエンドポイントを見つける。 このようなエンドポイントは頻繁に攻撃の対象となるため、強固に保護されるべきです。 この種のリクエストを使用すると、エンドポイントがチームに認識されており、攻撃から適切に保護されているかを確認できます。
* 顧客の銀行カードデータを処理するエンドポイントを見つける。 このリクエストを使用すると、機密データが保護されたエンドポイントによってのみ処理されていることを確認できます。
* `/v1`を検索することにより、廃止予定のAPIバージョンのエンドポイントを見つけ、それらがクライアントによって使用されていないことを確認します。
* 高リスクレベルの活動的な脆弱性を持ち、機密データの処理が特徴的な、最も脆弱なエンドポイントを見つける。 高リスクレベルの脆弱性を悪用することにより、攻撃者はエンドポイントが処理／保存する機密データの窃取を含むシステムに対する多くの悪意のある行為を行うことができます。

すべてのフィルタリングされたデータは、OpenAPI v3にエクスポートして追加分析を行うことができます。

## エンドポイントパラメータの表示

<a name="params"></a>エンドポイントをクリックすると、リクエストの統計、必須およびオプションのパラメータとそれに関連するデータタイプを含むエンドポイントの詳細を見ることができます：

![Request parameters discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

各パラメータ情報には以下が含まれます：

* パラメータ名とこのパラメータが所属するリクエストのパート
* パラメータの変更情報（新規、未使用）
* このパラメータによって伝送される個人を特定できる情報 (PII) の存在とタイプを含む、敏感なデータ：

    * IPやMACアドレスのような技術データ
    * シークレットキーとパスワードのようなログイン認証情報
    * 銀行カード番号のような金融データ
    * 医療免許番号のような医療データ
    * フルネーム、パスポート番号、またはSSNのような個人を特定できる情報 (PII)

* このパラメータで送信されるデータの[タイプ/フォーマット](../api-discovery/overview.md)
* パラメータ情報が最後に更新された日付と時刻

## APIの変更の追跡

指定した期間内にAPIで何が[変更された](../api-discovery/track-changes.md)かを確認することができます。 これを行うには、**Changes since（以降の変更）**フィルターから適切な期間または日付を選択します。 エンドポイントリストには次のマークが表示されます：

* 期間中にリストに追加されたエンドポイントには **New（新規）**。
* この期間内に新しく発見されたパラメーターまたは`Unused（未使用）` ステータスを取得したパラメーターがあるエンドポイントには **Changed（変更）**。 エンドポイントの詳細では、そのようなパラメーターは対応するマークが付きます。

    * 期間内に発見されたパラメーターは`New（新規）`ステータスになります。
    * 7日間データを伝送しなかったパラメーターは`Unused（未使用）`ステータスになります。
    * 後に`Unused（未使用）`状態のパラメーターが再びデータを伝送すると、`Unused（未使用）`ステータスは解除されます。

* 期間中に`Unused（未使用）`ステータスを取得したエンドポイントには **Unused（未使用）**。

    * 7日間リクエストされていない（応答にコード200を含む）エンドポイントは`Unused（未使用）`ステータスになります。
    * 後に`Unused（未使用）`状態のエンドポイントが再度リクエストされる（応答にコード200を含む）と、`Unused（未使用）`ステータスは解除されます。

どの期間が選択されていても、**New（新規）**、**Changed（変更）**、または**Unused（未使用）**マークでハイライトされていない場合、その期間のAPIの変更はないことを意味します。

![API Discovery - track changes](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

!!! info "デフォルトの期間"
    **API Discovery** セクションを開くたびに、**Changes since（以降の変更）** フィルターは `Last week（先週）` 状態になります。 これは、最終週に生じた変更のみがハイライトされることを意味します。

**Changes since（以降の変更）**フィルターを使用して、選択した期間内に変更されたエンドポイントだけをハイライトしますが、変更のないエンドポイントはフィルタリングしません。

**Changes in API（APIの変更）**フィルターは異なり、選択した期間内に変更された**だけ**のエンドポイントを表示し、残りをすべてフィルタリングします。

<a name="example"></a>例を考えてみましょう：あなたのAPIは今日10つのエンドポイントを持っていて（12個あったけれども、そのうちの3つは10日前に未使用とマークされました）、そのうちの1つは昨日追加され、2つがパラメーターの変更が5日前に1つ、10日前に1つ発生しました：

* **API Discovery**セクションを今日開くたびに、**Changes since（以降の変更）**フィルターは`Last week（先週）` 状態になり、ページには10個のエンドポイントが表示され、**Changes（変更）** 列の1つには **New（新規）** マーク、1つには **Changed（変更）** マークが表示されます。
* **Changes since（以降の変更）** を `Last 2 weeks（最終2週間）`に切り替えると、13つのエンドポイントが表示され、**Changes（変更）** 列の1つには **New（新規）** マーク、2つには **Changed（変更）** マーク、3つには **Unused（未使用）** マークが表示されます。
* **Changes in API（APIの変更）** を `Unused endpoints（未使用のエンドポイント）` に設定すると、3つのエンドポイントが表示され、すべてに **Unused（未使用）** マークが表示されます。
* **Changes in API（APIの変更）** を `New endpoints（新規エンドポイント） + Unused endpoints（未使用のエンドポイント）` に変更すると、4つのエンドポイントが表示され、3つに **Unused（未使用）** マーク、1つに **New（新規）** マークが表示されます。
* **Changes since（以降の変更）** を `Last week（先週）` に戻すと、ひとつのエンドポイントが表示され、それには **New（新規）** マークが表示されます。

## リスクスコアの利用

[リスクスコア](../api-discovery/risk-score.md) を使用すると、攻撃のターゲットとなりやすいエンドポイントを把握し、それらをあなたのセキュリティ取り組みの焦点とすることができます。

リスクスコアは `1`（最低）から `10`（最高）までです：

| 値 | リスクレベル | 色 |
| --------- | ----------- | --------- |
| 1～3 | 低 | グレー |
| 4～7 | 中 | オレンジ |
| 8～10 | 高 | 赤 |

* `1`は、このエンドポイントにリスク要因がないことを意味します。
* 未使用のエンドポイントにはリスクスコアは表示されません（`N/A`）。
* **Risk（リスク）**列でリスクスコアでソートします。
* **Risk score（リスクスコア）**フィルターを使用して`High（高）`、`Medium（中）`、または`Low（低）`をフィルタリングします。

!!! info "リスクスコア計算の設定"
    デフォルトでは、API Discoveryモジュールは各エンドポイントのリスクスコアを、確立されたリスク要因の重みに基づいて自動的に計算します。 リスクスコアの推定をあなたの理解の重要性に適合させるために、各要因の重みとリスクスコア計算方法を[設定](#customizing-risk-score-calculation)することができます。

エンドポイントのリスクスコアが何を引き起こしたのか、そしてリスクをどのように軽減するかを理解するために、エンドポイント詳細に移動します：

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

## APIエンドポイントへの攻撃の監視

APIエンドポイントへの攻撃件数は、過去7日間の**Hits（ヒット）**列に表示されます。

あなたは：

* フィルタの選択で：**Others（その他）** → **Attacked endpoints（攻撃されたエンドポイント）**と設定し、攻撃されたエンドポイントのみを表示するようにリクエストできます。
* **Hits（ヒット）**列でソートします。

エンドポイントへの攻撃を確認するには、**Hits（ヒット）**列の数値をクリックします：

![API endpoint - open events](../images/about-wallarm-waf/api-discovery/endpoint-open-events.png)

次の[フィルタを適用](../user-guides/search-and-filters/use-search.md)した **Events（イベント）** セクションが表示されます：

```
attacks last 7 days endpoint_id:<YOUR_ENDPOINT_ID>
```

エンドポイントのURLをクリップボードにコピーし、それを使用してイベントを検索することもできます。 これを行うには、このエンドポイントのメニューで **Copy URL（URLをコピー）**を選択します。

## APIインベントリとルール

あなたはAPIインベントリの任意のエンドポイントから新しい[カスタムルール](../user-guides/rules/rules.md)を素早く作成することができます： 

1. このエンドポイントのメニューで**Create rule（ルールを作成）**を選択します。 ルール作成ウィンドウが表示されます。 エンドポイントのアドレスは自動的にウィンドウにパースされます。
1. ルール作成ウィンドウで、ルール情報を指定し、**Create（作成）**をクリックします。

![Create rule from endpoint](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

## シャドウAPIの表示

**API Discovery**モジュールは、発見されたAPIインベントリと[お客様から提供された仕様](../api-discovery/rogue-api.md)を比較することでシャドウAPIを自動的に検出します。 Wallarmによって発見されたエンドポイントの中で[シャドウAPI](../api-discovery/rogue-api.md#shadow-api)を表示するには：

* **Compare to...（...と比較）**フィルターを使用して仕様の比較を選択します - これだけがシャドウAPIを**Issues（問題）** 列に特別なマークでハイライトします。

    ![API Discovery - highlighting and filtering shadow API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

* 選択された比較に関連するシャドウAPIのみを表示し、残りのエンドポイントをフィルタリングするために、 **Other → Shadow API（その他 → シャドウAPI）** フィルターを使用します。

Shadow APIとして定義されたエンドポイントの詳細では、このエンドポイントが存在しないアップロードされた仕様が**Specification conflicts（仕様の競合）**セクションにリストアップされています（複数ある場合があります）。

シャドウAPIは、[API Discoveryダッシュボード](../user-guides/dashboards/api-discovery.md)でもリスクの高いエンドポイントの中に表示されます。

## APIインベントリのOpenAPI仕様（OAS）のダウンロード

API Discovery UIでは、Wallarmによって発見された個々のAPIエンドポイントまたは全APIの[OpenAPI v3](https://spec.openapis.org/oas/v3.0.0)仕様をダウンロードするオプションを提供しています。

* APIインベントリページの **Download OAS（OASをダウンロード）**ボタンは、全インベントリまたはダウンロードする前に適用された場合フィルタリングされたデータだけの`swagger.json`を返します。

    ダウンロードされたデータを使用すると、あなたの仕様とWallarmの発見とを比較して、欠損しているエンドポイント（Shadow API）と未使用のエンドポイント（Zombie API）を特定できます。

    !!! warning "ダウンロードしたSwaggerファイルのAPIホスト情報"
        発見されたAPIインベントリに複数のAPIホストが含まれている場合、すべてのAPIホストのエンドポイントがダウンロードされたSwaggerファイルに含まれます。 現在、APIホスト情報はファイルに含まれていません。

* 個々のエンドポイントメニューの **Download OAS（OASをダウンロード）** ボタンは、選択されたエンドポイントの`swagger.json`を返します。

    他のアプリケーション（例：Postman）でダウンロードされた仕様を利用すると、エンドポイントの脆弱性テストやその他のテストを行うことができます。 さらに、エンドポイントの機能を詳しく調べて、敏感なデータの処理と未文書化のパラメータの存在を発見することができます。

## 自動BOLA保護

Wallarmは [自動的に発見し、BOLA攻撃に対して脆弱なエンドポイントを保護する](../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery)ことができます。 このオプションが有効では、保護されたエンドポイントはAPIインベントリで対応するアイコンでハイライトされます。例えば：

![BOLA trigger](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

BOLA自動保護の状態によってAPIエンドポイントをフィルタリングすることができます。対応するパラメータは**Others（その他）**フィルタの下で利用可能です。

## API Discoveryの設定

**API Discovery** セクションの **Configure API Discovery（API Discoveryの設定）** ボタンをクリックすると、API Discoveryの微調整オプション、例えば、API Discoveryのためのアプリケーションの選択やリスクスコア計算のカスタマイズに進むことができます。

### API Discoveryのためのアプリケーションの選択

あなたの会社アカウントで[API Discovery](../api-discovery/overview.md)サブスクリプションが購入されている場合、API Discovery を有効/無効にするため、Wallarm Console → **API Discovery** → **Configure API Discovery**に進むことができます。

あなたはすべてのアプリケーションに対してAPI Discoveryを有効/無効にするか、選択したものだけに対してAPI Discoveryを有効/無効にします。

![API Discovery – Settings](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

新しいアプリケーションを**Settings（設定）** → **[Applications（アプリケーション）](settings/applications.md)** で追加すると、それは自動的にAPI Discoveryのアプリケーションリストに**disabled（無効）** 状態で追加されます。

### リスクスコア計算のカスタマイズ

あなたは各要素の重みと[リスクスコア](../api-discovery/risk-score.md)計算方法を設定することができます。

デフォルト：

* 計算方法：`Use the highest weight from all criteria as endpoint risk score（全ての基準から最も高い重みをエンドポイントのリスクスコアとして使用する）`。
* デフォルトの要素の重み：

    | 因子 | 重み |
    | --- | --- |
    | 有効脆弱性 | 9 |
    | BOLAへの潜在的な脆弱性 | 6 |
    | 敏感なデータのあるパラメータ | 8 |
    | クエリと本文のパラメータ数 | 6 |
    | XML / JSONオブジェクトを受け付ける | 6 |
    | サーバーにファイルをアップロード可能 | 6 |

リスクスコアの計算方法を変更するには： 

1. **API Discovery** セクションの **Configure API Discovery（API Discoveryの設定）** ボタンをクリックします。
1. 計算方法を選択します：最高の重みまたは平均重み。
1. 必要であれば、リスクスコアに影響を与えたくない要素を無効にします。
1. 残りの要素に重みを設定します。

    ![API Discovery - Risk score setup](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)
1. 変更を保存します。 Wallarmは、新しい設定に従ってあなたのエンドポイントのリスクスコアを数分以内に再計算します。