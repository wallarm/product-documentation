[api-discovery-enable-link]:    ../api-discovery/setup.md#enable

# ファイルアップロード制限ポリシー

[無制限のリソース消費](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md)は、最も重大なAPIセキュリティリスクの一覧である[OWASP API Top 10 2023](../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023)に含まれています。これはそれ自体が脅威（過負荷によるサービスの遅延や完全停止）であるだけでなく、列挙攻撃などさまざまな攻撃の土台にもなります。過大なファイルのアップロードを許容することは、こうしたリスクの一因です。この記事では、Wallarmでファイルアップロード制限を設定する方法を説明します。

[設定方法](#configuration-method)として緩和コントロールを使用してファイルアップロード制限を構成すると、コントロール本来の目的（ダウンロードされるファイルの最大サイズの制限）に加えて、特定のリクエストパラメータのサイズを制限して攻撃面を縮小することにも利用できます。例えば、任意のヘッダーの最大サイズを制限するルールを設定できます。この場合、攻撃者がペイロードを押し込む、またはBufferOverflowの悪用を成立させる余地が少なくなります。

なお、ファイルサイズのアップロード制限は、Wallarmが提供する[無制限のリソース消費を防止するための施策](#comparison-to-other-measures-for-preventing-unrestricted-resource-consumption)の唯一の手段ではありません。

## 設定方法

ご契約のサブスクリプションプランに応じて、ファイルアップロード制限の設定方法として次のいずれかが利用できます。

* Mitigation controls（[Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）- 緩和コントロールを使用すると、リクエスト全体のサイズだけでなく、特定のパラメータにも上限を設定できます（ルールよりも精密な設定が可能です）。
* Rules（[Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）

## 緩和コントロールベースの保護 <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

[Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプションの一部として、Wallarmは**File upload restriction policy**という[緩和コントロール](../about-wallarm/mitigation-controls-overview.md)を提供しています。

!!! tip ""
    使用には[NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.3.0以上が必要で、現時点では[Native Node](../installation/nginx-native-node-internals.md#native-node)ではサポートされていません。

この緩和コントロールにより、特定のパラメータのサイズに制限を設定できます（より精密な設定）。簡易に、リクエスト全体に対して設定することもできます。

特定のリクエストパラメータのサイズを制限すると、コントロール本来の目的（ダウンロードされるファイルの最大サイズの制限）に加えて、攻撃面を縮小できます。例えば、任意のヘッダーの最大サイズを制限するルールを設定できます。この場合、攻撃者がペイロードを押し込む、またはBufferOverflowの悪用を成立させる余地が少なくなります。

### 緩和コントロールの作成と適用

!!! info "緩和コントロールの基本情報"
    作業を始める前に: [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration)の記事を参照して、任意の緩和コントロールに対して**Scope**や**Mitigation mode**をどのように設定するかを確認してください。

ファイルアップロード制限ポリシーを設定するには:

1. Wallarm Console → **Mitigation Controls**に進みます。
1. **Add control** → **File upload restriction policy**を使用します。
1. 緩和コントロールを適用する**Scope**を記述します。
1. リクエスト全体または選択したポイントに対して**Size restrictions**を設定します。
1. **Mitigation mode**セクションで実行するアクションを設定します。
1. **Add**をクリックします。

### 緩和コントロールの例

#### 特定のリクエストフィールド経由のファイルアップロードサイズを制限

例えば、アプリケーション`application-001`の`/upload`アドレスに対し、POSTリクエストパラメータ`upfile`経由でアップロードされるファイルのサイズを100KBに制限し、超過分はすべてブロックしたいとします。

そのためには、次のスクリーンショットのとおり**File upload restriction policy**の緩和コントロールを設定します。

![ファイルアップロード制限MC - 例](../images/api-protection/mitigation-controls-file-upload-1.png)

#### 特定ポイントのサイズ指定によるPUTアップロード制限

例えば、アプリケーションの`/put-upload`アドレスに対し、PUTメソッドでリクエストボディに100KBを超えるファイルを含めてアップロードしようとする試行を、ブロックせずに攻撃として記録したいとします。

そのためには、次のスクリーンショットのとおり**File upload restriction policy**の緩和コントロールを設定します。

![ファイルアップロード制限MC - 例](../images/api-protection/mitigation-controls-file-upload-2.png)

上記の例では、リクエストポイントの定義における`post`は「リクエストボディ内」を意味するWallarmの[タグ](../user-guides/rules/request-processing.md#metadata)です。

#### JSON Base64アップロードの制限

例えば、アプリケーションの`/json-upload`アドレスを対象とする場合に限り、リクエストボディのJSONオブジェクト内に100KB以上のBase64エンコードされたファイル文字列をアップロードしようとする試行を、ブロックせずに攻撃として記録したいとします。

そのためには、次のスクリーンショットのとおり**File upload restriction policy**の緩和コントロールを設定します。

![ファイルアップロード制限MC - 例](../images/api-protection/mitigation-controls-file-upload-3.png)

上記の例では、リクエストポイントは次のWallarmの[タグ](../user-guides/rules/request-processing.md)の並びで定義されます。

* `post` - リクエストボディ内
* `json_doc` - JSON形式のデータ
* `hash` - 連想配列のキー用
* `file` - このキーの値

#### マルチパートフォームデータのアップロード制限

例えば、アプリケーションの`/multipart-upload`アドレスを対象とする場合に限り、ファイルアップロードフィールドを含むHTMLフォームで100KBを超えるファイルを送信しようとする試行を、ブロックせずに攻撃として記録したいとします。通常、この操作のContent-Typeは`multipart/form-data`になります。

そのため、この制限を適用するには、次のスクリーンショットのとおり**File upload restriction policy**の緩和コントロールを設定します。

![ファイルアップロード制限MC - 例](../images/api-protection/mitigation-controls-file-upload-4.png)

上記の例では、リクエストポイントは次のWallarmの[タグ](../user-guides/rules/request-processing.md)の並びで定義されます。

* `post` - リクエストボディ内
* `multipart` - Content-Typeが`multipart/form-data`のデータ
* `file` - フォームにより生成される混在コンテンツの「ファイル部分」

## ルールベースの保護

[Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプションの一部として、Wallarmは**File upload restriction policy**の[ルール](../user-guides/rules/rules.md)を提供しています。

!!! tip ""
    使用には[NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.3.0以上が必要で、現時点では[Native Node](../installation/nginx-native-node-internals.md#native-node)ではサポートされていません。

**ルールの作成と適用**

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls** → **File upload restriction policy**を選択します。
1. **If request is**で、このルールを適用する対象範囲を[記述](../user-guides/rules/rules.md#configuring)します。
1. **Size restrictions**でサイズ制限と**Mode**を設定します。
1. 必要に応じて、制限を適用するリクエストポイントを指定します（指定しない場合、制限はリクエスト全体のサイズに適用されます）。

    ![ファイルアップロード制限 - ルール](../images/api-protection/rule-file-upload.png)

1. [ルールのコンパイルとフィルタリングノードへのアップロードが完了する](../user-guides/rules/rules.md#ruleset-lifecycle)まで待ちます。

## 検出された攻撃の表示

ファイルアップロード制限ポリシーの違反は、**Attacks**および**API Sessions**で[File upload violation](../attacks-vulns-list.md#file-upload-violation)攻撃として表示されます。

![ファイルアップロード制限 - 検出された攻撃](../images/api-protection/mitigation-controls-file-upload-detected.png)

リクエスト詳細内のボタンで**Attacks**ビューと**API Sessions**ビューを切り替えられます。この攻撃タイプの攻撃/セッションは、攻撃タイプフィルターを**File upload violation**に設定すると見つけられます（また、**Attacks**では`file_upload_violation`という[検索タグ](../user-guides/search-and-filters/use-search.md#search-by-attack-type)も使用できます）。

## 無制限のリソース消費の防止に向けた他の手段との比較

ファイルアップロード制限ポリシーの設定に加えて、Wallarmは無制限のリソース消費を防止するための他の仕組みも提供しています。例えば次のとおりです。

* ボットによる無制限のリソース消費の検知とブロック（WallarmのAPI Abuse Prevention。利用には設定が必要です）。
* [DoS protection](../api-protection/dos-protection.md)の緩和コントロール（利用には[Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプションが必要です）。
* [Advanced rate limiting](../user-guides/rules/rate-limiting.md)。