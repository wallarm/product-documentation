# シャドウ、オーファン、ゾンビAPI <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Discovery](overview.md)モジュールは、アップロードした仕様と実トラフィックを比較することで、シャドウ、オーファン、ゾンビAPIを自動的に特定します。

|ローグAPIの種類 | 概要 |
|--|--|
| [シャドウAPI](#shadow-api) | 適切な認可や監督なしに組織のインフラ内に存在する、未文書化のAPIです。|
| [オーファンAPI](#orphan-api) | ドキュメント化されているものの、トラフィックを受信していないAPIです。 |
| [ゾンビAPI](#zombie-api) | 無効化済みだと誰もが想定しているものの、実際にはまだ使用されている非推奨APIです。 |

![API Discovery - ローグAPIのハイライトとフィルタリング](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

## セットアップ {#setup}

ローグAPIの検出を開始するには、仕様をアップロードし、ローグAPI検出に使用する仕様を選択し、検出パラメータを設定する必要があります。

仕様とAPIはどちらも時間とともに変化しますので、以下にご留意ください。

* 初回セットアップ後に比較を開始します。
* APIに[変更](track-changes.md)が見つかった場合、比較を再開します。
* その仕様の設定を新しく保存した場合、比較を再開します。
* 新しいファイル（名前または完全なURIが異なるもの）を選択した場合、比較を再開します。
* URIからアップロードしたファイルに変更があり、かつ**Regularly update the specification**（毎時）オプションを選択している場合、比較を再開します。

    URIが利用できない、または更新された仕様ファイルがAPI仕様の構文に適合しない場合、自動更新中にエラーが発生することがあります。このようなエラーの通知を受け取るには、設定済みの[**Integrations**](../user-guides/settings/integrations/integrations-intro.md)で**System related**イベントを選択します。仕様のアップロードエラーに関する通知はこのカテゴリに含まれます。

* 仕様メニュー→**Restart comparison**から、いつでも比較を再開できます。

また、**API Specifications**→仕様の詳細ウィンドウ→**Download specification**から、以前にアップロードした仕様をダウンロードできます。

### ステップ1：仕様のアップロード

1. [US Cloud](https://us1.my.wallarm.com/api-specifications/)または[EU Cloud](https://my.wallarm.com/api-specifications/)の**API Specifications**セクションで、**Upload specification**をクリックします。
1. 仕様のアップロードパラメータを設定し、アップロードを開始します。

    ![Upload specification](../images/api-specification-enforcement/specificaton-upload.png)

仕様ファイルはAPI仕様の構文に適合するか検証され、不正な場合はアップロードされません。仕様ファイルが正常にアップロードされるまで、ローグAPI検出の設定を開始できない点にご注意ください。

仕様をURIからアップロードし、**Regularly update the specification**（毎時）オプションを選択した場合、定期更新中にエラーが発生することがあります（URIが利用できない、または更新ファイルがAPI仕様の構文に適合しないなど）。このようなエラーの通知を受け取るには、設定済みの[**Integrations**](../user-guides/settings/integrations/integrations-intro.md)で**System related**イベントを選択します。仕様のアップロードエラーに関する通知はこのカテゴリに含まれます。

### ステップ2：ローグAPI検出パラメータの設定

1. **Rogue APIs detection**タブをクリックします。

    !!! info "API仕様のエンフォースメント"
        ローグAPIの検出に加えて、仕様は[API仕様のエンフォースメント](../api-specification-enforcement/overview.md)にも使用できます。

1. **Use for rogue APIs detection**を選択します。
1. **Applications**と**Hosts**を選択します。選択したホストに関連するエンドポイントのみがローグAPIの対象として検索されます。

    ![API Discovery - API Specifications - ローグAPI検出のためのAPI仕様アップロード](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

### 無効化

ローグAPI検出は、アップロード済み仕様（複数可）のうち**Use for rogue APIs detection**オプションが選択されているものを基に動作します。特定の仕様でこのオプションの選択を外す、またはその仕様を削除すると、次の結果になります。

* 当該仕様に基づくローグAPI検出が停止します。
* 過去に当該仕様に基づいて検出されたローグAPIに関するデータが**すべて削除**されます。

## 検出されたローグAPIの表示

比較が完了すると、**API Specifications**の一覧で各仕様に対して検出されたローグ（シャドウ、オーファン、ゾンビ）APIの数が表示されます。

![API Specificationsセクション](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

また、ローグAPIは**API Discovery**セクションにも表示されます。**Rogue APIs**フィルターを使用すると、選択した比較に関連するシャドウ、オーファン、ゾンビAPIのみを表示し、その他のエンドポイントを除外できます。

![API Discovery - ローグAPIのハイライトとフィルタリング](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

これらのエンドポイントの詳細画面の**Specification conflicts**セクションには、シャドウ/ゾンビ/オーファンの検出に使用された仕様が表示されます。

シャドウAPIは、[API Discovery Dashboard](dashboard.md)上の最もリスクの高いエンドポイントにも表示されます。

## 仕様バージョンとゾンビAPI

シャドウAPIやオーファンAPIと異なり、[ゾンビAPI](#zombie-api)には異なる仕様バージョン間の比較が必要です。

* [セットアップ](#setup)時に**Regularly update the specification**オプションを選択している場合は、仕様をホストしているURLに新しいバージョンを配置するだけで構いません。毎時のスケジュールで処理されるか、仕様メニューから**Restart comparison**を選択した場合は即時に処理されます。
* **Regularly update the specification**オプションを選択していない場合：
    * URLからアップロードしており、そのURLの内容が新しくなっているときは、**Restart comparison**をクリックします。
    * ローカルマシンからアップロードする場合は、仕様ダイアログを開き、新しいファイルを選択して変更を保存します。ファイル名は異なる必要があります。

上記いずれの場合も、新しい内容は次の仕様バージョンとして扱われ、バージョン間で比較され、ゾンビAPIが表示されます。

## 複数の仕様の取り扱い

APIの異なる側面を別々の仕様で記述している場合は、それらの一部またはすべてをWallarmにアップロードできます。

**API Discovery**セクションで**Compare to...**フィルターを使用して比較対象の仕様を選択します。選択した比較に対してのみ、**Issues**列に特別なマークでローグAPIがハイライトされます。

![API Discovery - ローグAPIのハイライトとフィルタリング](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

## 通知の受信

新たに検出されたローグAPIについて、[SIEM、SOAR、ログ管理システム、またはメッセンジャー](../user-guides/settings/integrations/integrations-intro.md)に即時通知を送るには、Wallarm Consoleの**Triggers**セクションで**Rogue API detected**条件のトリガーを1つ以上設定します。

新たに検出されたシャドウ、オーファン、ゾンビAPIのいずれか、またはすべてに関するメッセージを受け取れます。監視したいアプリケーションやホスト、検出に使用した仕様で通知を絞り込むこともできます。

**通知の動作**
    
* 新たに検出されたローグAPI1件につき、通知メッセージを1通送信します。
* あるローグAPIについてすでに通知を受け取っている場合、比較を何度実行しても同じ通知は再送されません。
* アップロード済み仕様の設定を更新すると、**オーファン**APIに関する通知はすべて再送されます（シャドウAPIおよびゾンビAPIには適用されません）。

**トリガー例：Slackで新たに検出されたシャドウエンドポイントの通知**

この例では、API Discoveryが`Specification-01`に記載されていない新しいエンドポイント（シャドウAPI）を検出した場合、その通知が設定済みのSlackチャンネルに送信されます。

![Rogue API detectedトリガー](../images/user-guides/triggers/trigger-example-rogue-api.png)

**トリガーをテストするには：**

1. Wallarm Console→[US](https://us1.my.wallarm.com/integrations/)または[EU](https://my.wallarm.com/integrations/)クラウドの**Integrations**に移動し、[Slackとの連携](../user-guides/settings/integrations/slack.md)を設定します。
1. **API Discovery**セクションで任意のAPIホストでエンドポイントをフィルタリングし、結果を仕様としてダウンロードして`Specification-01`という名前を付けます。
1. **API Specifications**セクションに`Specification-01`をアップロードして比較します。
1. **Triggers**セクションで、上の例と同様のトリガーを作成します。
1. ローカルの`Specification-01`ファイルからエンドポイントを1つ削除します。
1. **API Specifications**で、`Specification-01`を再アップロードして比較します。
1. **Issues**列で、そのエンドポイントにシャドウAPIのマークが付いたことを確認します。
1. Slackチャンネルに次のようなメッセージが届いていることを確認します：

    ```
    [wallarm] A new shadow endpoint has been discovered in your API

    Notification type: api_comparison_result

    The new GET example.com/users shadow endpoint has been discovered in your API.

        Client: Client-01
        Cloud: US

        Details:

          application: Application-01
          api_host: example.com
          endpoint_path: /users
          http_method: GET
          type_of_endpoint: shadow
          link: https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
          specification_name: Specification-01
    ```

## ローグAPIの種類とリスク

### シャドウAPI {#shadow-api}

シャドウAPIは、適切な認可や監督なしに組織のインフラ内に存在する未文書化のAPIを指します。

シャドウAPIはビジネスにリスクをもたらします。攻撃者がこれらを悪用して重要なシステムにアクセスしたり、機密データを窃取したり、業務を妨害したりできるためです。APIは重要データへのゲートキーパーとして機能することが多く、またさまざまなOWASP APIの脆弱性がAPIセキュリティを迂回するために悪用され得る点も、このリスクを増大させます。

アップロードしたAPI仕様の観点では、シャドウAPIとは、実トラフィック（API Discoveryで検出）に存在するものの、仕様に存在しないエンドポイントを指します。

WallarmでシャドウAPIを特定したら、仕様に不足しているエンドポイントを追加して更新し、APIインベントリ全体を見渡しながら監視とセキュリティ対策を実施できます。

### オーファンAPI {#orphan-api}

オーファンAPIは、ドキュメント化されているものの、トラフィックを受信していないAPIを指します。

オーファンAPIが存在する場合、次のような検証プロセスを実施する理由になり得ます。

* トラフィックが本当に受信されていないのか、あるいはWallarmノードをすべてのトラフィックが通過するように配置していないためにWallarmから見えていないだけなのかを理解するために、Wallarmのトラフィック検査設定を確認します（誤ったトラフィックルーティング、別のWeb Gatewayが存在するのにその上にノードを配置し忘れている、など）。
* 特定のアプリケーションが当該エンドポイントでトラフィックを一切受け取るべきでないのか、それとも何らかのミスコンフィグレーションなのかを判断します。
* 古いエンドポイント（以前のアプリケーションバージョンでは使用され、現行では未使用）について、セキュリティチェックの工数を削減するために仕様から削除すべきかを判断します。

### ゾンビAPI {#zombie-api}

ゾンビAPIは、無効化済みだと誰もが想定しているものの、実際にはまだ使用されている非推奨APIを指します。

ゾンビAPIのリスクは、他の未文書化（シャドウ）APIと同様ですが、より深刻な場合があります。無効化の理由が、攻撃されやすい安全でない設計であることが多いためです。

アップロードしたAPI仕様の観点では、ゾンビAPIとは、以前の仕様バージョンには存在し、現行バージョンには存在しない（すなわち当該エンドポイントを削除する意図があった）ものの、実トラフィック（API Discoveryで検出）には依然として存在するエンドポイントです。

WallarmでゾンビAPIを発見した場合、当該エンドポイントが実際に無効化されるよう、アプリケーションのAPI設定を再確認するきっかけになります。