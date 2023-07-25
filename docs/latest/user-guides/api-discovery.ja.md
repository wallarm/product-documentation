					# API Discovery <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

**API Discovery**セクションは、Wallarm Console で [API インベントリ](../about-wallarm/api-discovery.ja.md) を管理し、その発見を微調整する機能を提供します。このガイドでは、このセクションの使用方法について説明します。

このセクションは、以下の[ロール](../user-guides/settings/users.ja.md#user-roles)のユーザーのみが利用できます。

* **管理者**と**アナリスト**は、API Discovery モジュールで発見したデータを表示・管理し、API Discovery の構成部分にアクセスできます。

    マルチテナンシー機能をアカウントで利用している **Global Administrator** と **Global Analyst** も同様の権限を持っています。
* **API 開発者**は、API Discovery モジュールによって発見されたデータを閲覧・ダウンロードできます。このロールでは、企業の API に関する実際のデータを取得するだけの Wallarm の利用が課題となるユーザーを区別できます。これらのユーザーは、**API Discovery** と **Settings → Profile** を除く Wallarm Console のセクションにはアクセスできません。

![!API Discovery によって発見されたエンドポイント](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

!!! info "デフォルトの表示：期間、ソート、グループ化"

    **期間**

    **API Discovery** セクションを開くたびに：

    * API の実際のインベントリ（全ての発見されたエンドポイント）が表示されます
    * **Changes since** フィルターが `Last week` 状態に変わり、以下の意味になります：

        * この期間中に `New` および `Changed` のステータスが付与されたエンドポイントが提示される
        * さらに、この期間中に `Deleted` になったエンドポイントが表示される
    
    デフォルトで API Discovery に表示される内容を理解するための[例](#example)があります。

    カバーする別の期間を手動で選択することもできます。

    **ソートとグループ化**

    デフォルトでは、エンドポイントはホスト/エンドポイント名でソート（およびホストでグループ化）されます。**Hits** または **Risk** でソートすると、グループ化が解除されます。デフォルトに戻るには、もう一度ホスト/エンドポイント列をクリックしてください。

## エンドポイントのフィルタリング

幅広いAPIエンドポイントのフィルターから、分析目的に対応するものを選択できます。例：

* ヒット数で並べ替えることができる、攻撃されたエンドポイントのみ。
* 過去1週間以内に変更されたり、新しく発見されたりした、PIIデータを処理するエンドポイントを見つける。このようなリクエストは、APIの重要な変更に関する最新情報を入手するのに役立ちます。
* PUTまたはPOSTコールによってサーバーにデータをアップロードするために使用されるエンドポイントを見つける。このようなエンドポイントは、攻撃の対象となりやすいため、適切にセキュリティ対策を行う必要があります。この種類のリクエストを使用すると、チームがエンドポイントを把握し、攻撃から適切に保護されていることを確認できます。
* 顧客の銀行カードデータを処理するエンドポイントを見つける。このリクエストを使用すると、機密データがセキュリティ対策を施したエンドポイントによってのみ処理されていることを確認できます。
* 廃止されたAPIバージョン（例：`/v1`を検索）のエンドポイントを見つけ、クライアントによって使用されていないことを確認してください。
* 機密データの処理と高リスクレベルのアクティブな脆弱性が特徴の、最も脆弱なエンドポイントを見つける。高リスクレベルの脆弱性を悪用することで、攻撃者はエンドポイントが処理/保管する機密データを盗んだり、システムで悪意ある操作を実行することができます。

すべてのフィルタリングされたデータは、OpenAPI v3 でエクスポートして追加の解析が可能です。

## エンドポイントパラメータの表示

<a name="params"></a>エンドポイントをクリックすると、必須およびオプションのパラメータとそれに関連するデータタイプを含むエンドポイントの詳細が表示されます。

![!API Discovery によって発見されたリクエストパラメータ](../images/about-wallarm-waf/api-discovery/discovered-request-params.png)

各パラメータ情報には以下が含まれます。

* このパラメータが属するリクエストの部分にパラメータ名があります
* パラメータの変更情報（新規、削除）
* このパラメータで伝送される PII（個人情報）データの存在とタイプ、以下を含む：

    * IPアドレスやMACアドレスなどの技術データ
    * シークレットキーやパスワードなどのログイン認証情報
    * 銀行カード番号などの金融データ
    * 医療免許番号などの医療データ
    * 氏名、パスポート番号、SSNなどの個人情報（PII）

* このパラメータで送信されるデータの[タイプ/フォーマット](../about-wallarm/api-discovery.ja.md#parameter-types-and-formats)
* パラメータ情報が最後に更新された日時

## API の変更を追跡する

指定された期間内に API で[発生した変更](../about-wallarm/api-discovery.ja.md#tracking-changes-in-api)を確認できます。それには、**Changes since** フィルタから適切な期間または日付を選択してください。エンドポイントリストに以下のマークが表示されます：

* 期間内にリストに追加されたエンドポイントには **New**
* 新しいパラメータが追加されたり、削除されたりしたエンドポイントには **Changed**。エンドポイントの詳細では、そのようなパラメータに対応するマークが付けられます。
* 期間内にトラフィックがなかったエンドポイントには **Removed**。各エンドポイントにとってこの期間は異なり、エンドポイントへのアクセスの統計に基づいて計算されます。後で「削除した」エンドポイントが再びトラフィックを持つことが発見された場合、「新しい」マークが付けられます。

選択された期間に関係なく、**New**、**Changed**、**Removed** マークがハイライトされていない場合、その期間中に API の変更がないことを意味します。

![!API Discovery - 変更の追跡](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

!!! info "デフォルトの期間"
    **API Discovery** セクションを開くたびに、**Changes since** フィルターが `Last week` 状態になり、過去1週間以内に発生した変更だけがハイライトされます。

**Changes since** フィルターは、選択した期間内に変更されたエンドポイントだけをハイライトし、変更なしのエンドポイントはフィルタリングされません。

**Changes in API** フィルターは異なり、選択された期間内に変更された**エンドポイントのみ**を表示し、他のすべてのエンドポイントをフィルタリングします。

<a name="example"></a>例を考えてみましょう：今日のAPIには10つのエンドポイントがあります（12個あったが、10日前に3つ削除されました）。このうち1つは昨日追加され、2つはパラメータが変更された（1つは5日前、もう1つは10日前）：

* 今日 **API Discovery** セクションを開くたびに、**Changes since** フィルターが `Last week` 状態になります。ページには10のエンドポイントが表示され、**Changes** カラムには1つが **New** マーク、1つが **Changed** マークが付きます。
* **Changes since** を `Last 2 weeks` に切り替えると、13 のエンドポイントが表示され、**Changes** カラムには1つが **New** マーク、2つが **Changed** マーク、3つが **Removed** マークが付きます。
* **Changes in API** を `Removed endpoints` に設定すると、3つのエンドポイントが表示され、すべてが **Removed** マークが付きます。
* **Changes in API** を ` New endpoints + Removed endpoints` に変更すると、4つのエンドポイントが表示され、3つが **Removed** マーク、1つが **New** マークが付きます。
* **Changes since** を `Last week` に戻すと、1つのエンドポイントが表示され、**New** マークが付きます。## リスクスコアを使用する方法

[リスクスコア](../about-wallarm/api-discovery.ja.md#endpoint-risk-score) は、どのエンドポイントが攻撃対象となりやすく、そのためセキュリティ対策の焦点とすべきかを理解するのに役立ちます。

リスクスコアは `1`（最低）から `10`（最高）まであります。

| 値 | リスクレベル | 色 |
| --------- | ----------- | --------- |
| 1から3 | 低 | グレー |
| 4から7 | 中 | オレンジ |
| 8から10 | 高 | 赤 |

* `1` は、このエンドポイントにリスク要因がないことを意味します。
* 削除されたエンドポイントにはリスクスコアが表示されません（`N/A`）。
* **リスク** カラムでリスクスコアで並べ替えます。
* **リスクスコア** フィルターを使用して、`High`、`Medium`、または `Low` をフィルタリングします。

!!! info "リスクスコア計算の設定"
    デフォルトでは、API Discoveryモジュールは、検証済みのリスクファクターの重みに基づいて、各エンドポイントのリスクスコアを自動的に計算します。ファクターの重要性の理解にリスクスコアの推定値を適応させるために、各ファクターの重みとリスクスコア計算方法を[設定](#customizing-risk-score-calculation)できます。

エンドポイントのリスクスコアが何によって引き起こされ、リスクをどのように減らすかを理解するには、エンドポイントの詳細に進みます。

![!API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

## APIエンドポイントへの攻撃の監視

過去7日間のAPIエンドポイントへの攻撃回数が **Hits** カラムに表示されます。

次のことができます。

* フィルタで **Others** → **Attacked endpoints** を選択して、攻撃されたエンドポイントのみを表示するように要求します。
* **Hits** カラムで並べ替えます。

**Hits** カラムの数字をクリックして、いくつかのエンドポイントへの攻撃を確認します。

![!API endpoint - open events](../images/about-wallarm-waf/api-discovery/endpoint-open-events.png)

**Events** セクションが [フィルタが適用](../user-guides/search-and-filters/use-search.ja.md)された状態で表示されます。

```
attacks last 7 days endpoint_id:<YOUR_ENDPOINT_ID>
```

エンドポイントのURLをクリップボードにコピーして、イベントの検索に使用することもできます。これを行うには、このエンドポイントのメニューで **Copy URL** を選択します。

## APIインベントリとルール

APIインベントリの任意のエンドポイントから新しい[カスタムルール](../user-guides/rules/intro.ja.md)をすばやく作成できます。

1. エンドポイントのメニューで **Create rule** を選択します。ルール作成ウィンドウが表示されます。エンドポイントのアドレスは、自動的にウィンドウに解析されます。
1. ルール作成ウィンドウで、ルール情報を指定し、**Create** をクリックします。

![!Create rule from endpoint](../images/about-wallarm-waf/api-discovery/endpoint-create-rule.png)

## APIインベントリのOpenAPI仕様（OAS）をダウンロードする

**Download OAS** をクリックして、Wallarmによって発見されたAPIインベントリを持つ `swagger.json` ファイルを取得します。説明は [OpenAPI v3形式](https://spec.openapis.org/oas/v3.0.0)になります。

!!! info "フィルタリングされたダウンロード"
    APIインベントリをダウンロードする際に、適用されたフィルタが考慮されます。フィルタリングされたデータのみがダウンロードされます。

!!! warning "ダウンロードしたSwaggerファイルのAPIホスト情報"
    発見されたAPIインベントリに複数のAPIホストが含まれている場合、すべてのAPIホストのエンドポイントがダウンロードされたSwaggerファイルに含まれます。現在、ファイルにはAPIホスト情報が含まれていません。

ダウンロードしたデータを使用して、次のことを確認できます。

* Wallarmによって発見されたが、仕様には存在しないエンドポイントのリスト（不足しているエンドポイント、別名"Shadow API"）。
* 仕様に記載されているが、Wallarmによって発見されていないエンドポイントのリスト（使用されていないエンドポイント、別名"Zombie API"）。

## 自動BOLA保護

Wallarmは、**API Discovery**モジュールで調査されたエンドポイントの中から、BOLA攻撃に対して脆弱なエンドポイントを[自動的に発見し、保護](../admin-en/configuration-guides/protecting-against-bola.ja.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery)することができます。このオプションが有効になっている場合、APIインベントリの保護されたエンドポイントが対応するアイコンで強調表示されます。

![!BOLA trigger](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

BOLA自動保護ステータスによるAPIエンドポイントのフィルタリングが可能です。対応するパラメータは **Others** フィルターの下にあります。

## API Discoveryの設定

**API Discovery** セクションの **Configure API Discovery** ボタンをクリックすると、APIディスカバリの詳細設定オプション、例えばAPIディスカバリ用アプリケーションの選択やリスクスコア計算のカスタマイズなどに移動します。

### API Discovery用のアプリケーションの選択

お客様の企業アカウントに[API Discovery](../about-wallarm/api-discovery.ja.md) サブスクリプションが購入されている場合、Wallarm Console → **API Discovery** → **Configure API Discovery**でAPI Discoveryとともにトラフィックの分析を有効/無効にできます。

すべてのアプリケーションまたは選択されたアプリケーションだけに対してAPI Discoveryを有効/無効にすることができます。

![!API Discovery – 設定](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

**Settings** → **[Applications](settings/applications.ja.md)**で新しいアプリケーションを追加すると、それは自動的に **disabled** ステートになるAPIディスカバリのアプリケーションリストに追加されます。

### リスクスコア計算のカスタマイズ

[リスクスコア](../about-wallarm/api-discovery.ja.md#endpoint-risk-score) 計算のそれぞれのファクターの重みと計算方法を設定できます。

デフォルト：

* 計算方法: `すべての基準から最も高い重みを使用して、エンドポイントのリスクスコアを算出します`。
* デフォルトのファクターの重み：

    | ファクター | 重み |
    | --- | --- |
    | アクティブな脆弱性 | 9 |
    | BOLAに対して潜在的に脆弱 | 6 |
    | 機密データを含むパラメータ | 8 |
    | クエリパラメータと本文パラメータの数 | 6 |
    | XML / JSONオブジェクトの受け入れ | 6 |
    | サーバーへのファイルアップロードの許可 | 6 |

リスクスコアの計算方法を変更するには：

1. **API Discovery** セクションの **Configure API Discovery** ボタンをクリックします。
1. 計算方法を選択：最高または平均の重み。
1. 必要に応じて、リスクスコアに影響を与えたくないファクターを無効にします。
1. 残りの重みを設定します。

    ![!API Discovery - Risk score setup](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)
1. 変更を保存します。 Wallarmは、新しい設定に従ってエンドポイントのリスクスコアを数分で再計算します。