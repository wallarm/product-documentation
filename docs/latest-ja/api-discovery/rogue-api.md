# シャドウAPI、オーファンAPI、ゾンビAPI <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

「[API Discovery](overview.md)」モジュールは、アップロードした仕様書と実際のトラフィックを比較することで、シャドウAPI、オーファンAPI、ゾンビAPIを自動的に識別します。

| 不正なAPIタイプ | 概要 |
|--|--|
| [Shadow API](#shadow-api) | 正式な承認や監視なしに組織内に存在する、ドキュメントに記載されていないAPIです。 |
| [Orphan API](#orphan-api) | トラフィックを受信しない、ドキュメントに記載されたAPIです。 |
| [Zombie API](#zombie-api) | 誰もが無効化済みと想定している廃止済みのAPIですが、実際にはまだ使用されているAPIです。 |

![API Discovery - highlighting and filtering rogue API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

## セットアップ

不正なAPIの検出を開始するには、仕様書をアップロードして、不正API検出に使用する仕様書として選択し、検出パラメータを設定する必要があります。

仕様書とAPI自体は時間とともに変化するため、以下の点を考慮してください。

* 初回セットアップ後に比較が開始されます
* [APIの変更](track-changes.md)を検出した場合、比較が再開始されます
* 新しい設定を保存した場合、比較が再開始されます
* 新たなファイル（名前または完全なURI）を選択した場合、比較が再開始されます
* URIからアップロードされたファイルに変更があった場合、かつ**Regularly update the specification**（毎時更新）オプションが選択されている場合、比較が再開始されます
* 仕様書メニュー → **Restart comparison**を使用して、いつでも比較を再開始できます

また、以前アップロードされた仕様書は、**API Specifications** → 仕様書詳細ウィンドウ → **Download specification**からダウンロードできます。

### ステップ1: 仕様書のアップロード

1. [US Cloud](https://us1.my.wallarm.com/api-specifications/)または[EU Cloud](https://my.wallarm.com/api-specifications/)の**API Specifications**セクションで、**Upload specification**をクリックします。
2. 仕様書のアップロードパラメータを設定し、アップロードを開始します。

    ![Upload specification](../images/api-specification-enforcement/specificaton-upload.png)

仕様書のファイルが正常にアップロードされるまで、不正なAPI検出の設定を開始できない点にご注意ください。

### ステップ2: 不正なAPI検出パラメータの設定

1. **Rogue APIs detection**タブをクリックします。

    !!! info "API仕様施行"
        不正なAPI検出に加えて、仕様書は[API仕様施行](../api-specification-enforcement/overview.md)にも使用できます。
    
2. **Use for rogue APIs detection**を選択します。
3. **Applications**および**Hosts**を選択します―選択されたホストに関連するエンドポイントのみが不正なAPIとして検索されます。

    ![API Discovery-API Specifications-アップロードされた仕様書による不正API検出](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

### 無効化

不正なAPI検出は、アップロードされた仕様書または複数の仕様書において**Use for rogue APIs detection**オプションが選択されているものに基づいて行われます。これらの仕様書でこのオプションのチェックを外す、または仕様書を削除すると、以下の結果となります。

* この仕様書に基づく不正なAPI検出が停止されます。
* 以前にこの仕様書に基づいて検出された不正なAPIに関する**すべてのデータが削除されます。

## 検出された不正なAPIの表示

比較が完了すると、各仕様書に対して**API Specifications**のリストに不正な（shadow、orphan、zombie）APIの数が表示されます。

![API Specificationsセクション](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

また、**API Discovery**セクションにも不正なAPIが表示されます。**Rogue APIs**フィルターを使用して、選択された比較に関連するshadow、orphan、および/またはzombie APIのみを表示し、その他のエンドポイントを除外してください。

![API Discovery - highlighting and filtering rogue API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

これらのエンドポイントの詳細、**Specification conflicts**セクションで、shadow/zombie/orphanが検出された際に使用された仕様書が示されます。

また、Shadow APIは[API Discovery Dashboard](dashboard.md)の中で最もリスクの高いエンドポイントとして表示されます。

## 仕様書のバージョンとゾンビAPI

Shadow APIやOrphan APIとは異なり、[Zombie API](#zombie-api)は異なる仕様書のバージョン間の比較が必要です：

* [setup](#setup)時に**Regularly update the specification**オプションが選択されている場合は、仕様書をホストしているURLに新しいバージョンを配置するだけで、毎時間のスケジュールで、または仕様書メニューから**Restart comparison**を選択すると直ちに処理されます。
* **Regularly update the specification**オプションが選択されていない場合：
    * URLからアップロードしており、かつ新しい内容がある場合は、**Restart comparison**をクリックしてください。
    * ローカルマシンからアップロードする場合は、仕様書ダイアログを開き、新しいファイルを選択して変更を保存してください。ファイル名は異なる必要があります。

すべての場合、新しい内容が仕様書の新バージョンとみなされ、バージョンが比較されることでゾンビAPIが表示されます。

## 複数の仕様書を使用する場合

APIの異なる側面を記述するために複数の独立した仕様書を使用する場合、それらをいくつかまたはすべてWallarmにアップロード可能です。

**API Discovery**セクションで、**Compare to...**フィルターを使用して仕様書の比較を選択すると、選択された仕様書に対してのみ、不正なAPIが**Issues**列内の特別なマークで強調表示されます。

![API Discovery - highlighting and filtering rogue API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

## 通知の受け取り

新たに検出された不正なAPIについて、[SIEM, SOAR, log management system or messenger](../user-guides/settings/integrations/integrations-intro.md)へ即時通知を受け取るには、Wallarm Consoleの**Triggers**セクションで**Rogue API detected**条件を持つ1つ以上のトリガーを設定してください。

新たに検出されたshadow、orphan、またはzombie API、あるいはそのすべてについてのメッセージを受け取ることができます。また、監視対象のアプリケーションやホスト、及びそれらの検出に使用された仕様書によって通知を絞り込むことも可能です。

**通知の受信方法**

* 新たに検出された不正なAPIごとに1つの通知メッセージが発生します。
* 既に通知を受信している不正なAPIについては、比較が何度実施されても再度送信されません。
* アップロードされた仕様書の設定を更新すると、すべての**orphan** APIに関する通知が再送信されます（この仕様はshadowやzombie APIには適用されません）。

**トリガー例：Slackでの新たに検出されたshadowエンドポイントに関する通知**

この例では、API Discoveryが`Specification-01`に記載されていない新しいエンドポイント（shadow API）を検出した場合、その通知が設定済みのSlackチャンネルへ送信されます。

![Rogue API detectedトリガー](../images/user-guides/triggers/trigger-example-rogue-api.png)

**トリガーのテスト方法：**

1. [US](https://us1.my.wallarm.com/integrations/)または[EU](https://my.wallarm.com/integrations/)クラウドのWallarm Console→**Integrations**に移動し、[integration with Slack](../user-guides/settings/integrations/slack.md)を設定します。
2. **API Discovery**セクションで、任意のAPI hostによりエンドポイントをフィルターしてから、結果を仕様書としてダウンロードし、`Specification-01`と命名します。
3. **API Specifications**セクションで、`Specification-01`を比較のためにアップロードします。
4. **Triggers**セクションで、上記のようにトリガーを作成します。
5. ローカルの`Specification-01`ファイルから任意のエンドポイントを削除します。
6. **API Specifications**セクションで、比較のために`Specification-01`を再アップロードします。
7. エンドポイントが**Issues**列でshadow APIマークを取得していることを確認します。
8. Slackチャンネルで次のようなメッセージが表示されているか確認します：

    ```
    [wallarm] 新しいshadowエンドポイントがあなたのAPIで検出されました

    通知タイプ: api_comparison_result

    あなたのAPIで新しいGET example.com/users shadowエンドポイントが検出されました。

        クライアント: Client-01
        クラウド: US

        詳細:

          application: Application-01
          api_host: example.com
          endpoint_path: /users
          http_method: GET
          type_of_endpoint: shadow
          link: https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
          specification_name: Specification-01
    ```

## 不正なAPIの種類とリスク

### Shadow API

**Shadow API**は、正式な承認や監視なしに組織のインフラ内に存在する、ドキュメントに記載されていないAPIを指します。

Shadow APIは、攻撃者がこれらを悪用して重要なシステムへアクセスし、貴重なデータを盗み、または運用を妨害することにより、ビジネスにリスクをもたらす可能性があります。さらに、APIは重要なデータへのゲートキーパーとして機能することや、さまざまなOWASP API脆弱性がAPIセキュリティを回避するために悪用される可能性がある点も、リスクを増大させます。

アップロードされたAPI仕様書の観点では、Shadow APIは実際のトラフィックに存在する（API Discoveryにより検出される）ものの、仕様書には記載されていないエンドポイントです。

WallarmでShadow APIを検出した場合、不足しているエンドポイントを追加するために仕様書を更新し、API全体を把握した上で、監視やセキュリティ対策を実施することができます。

### Orphan API

**Orphan API**は、トラフィックを受信しない、ドキュメントに記載されたAPIを指します。

Orphan APIの存在は、以下を含む検証プロセスの理由となる可能性があります：

* Wallarmのトラフィックチェック設定を確認し、トラフィックが実際に受信されていないのか、またはWallarmノードにすべてのトラフィックが通過しない形で展開されているために表示されていないのか（例えば、誤ったトラフィックルーティングや、設定漏れにより別のWeb Gatewayが存在するなど）を確認します。
* 特定のエンドポイントで特定のアプリケーションがトラフィックを受信すべきでないのか、または何らかの設定ミスであるのかを判断します。
* 旧バージョンのアプリケーションで使用され、現行では使用されていない不要なエンドポイントについて、セキュリティチェックの手間を削減するために仕様書から削除すべきかどうかを決定します。

### Zombie API

**Zombie API**は、すべての人が無効化済みと考えている廃止済みのAPIですが、実際にはまだ使用されているAPIを指します。

Zombie APIのリスクは、未文書の（shadow）APIと類似していますが、無効化の理由がしばしば容易に攻撃される不安全な設計である点から、より深刻な場合があります。

アップロードされたAPI仕様書の観点では、Zombie APIは前バージョンの仕様書に記載され、現行バージョンには記載されていないエンドポイント（すなわち、そのエンドポイントを削除する意図があったにもかかわらず）でありながら、実際のトラフィックに存在する（API Discoveryにより検出される）ものです。

WallarmでZombie APIを検出することは、これらのエンドポイントを実際に無効化するために、アプリケーションのAPI設定を再確認する理由となる場合があります。