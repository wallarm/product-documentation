# APIインベントリの検出 <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmプラットフォームの**API Discovery**モジュールは、実際のAPI使用に基づいてアプリケーションのREST APIインベントリを作成します。モジュールはリアルタイムのトラフィックリクエストを継続的に分析し、分析結果に基づいてAPIインベントリを構築します。

デフォルトでは、API Discoveryモジュールは[無効](#enabling-and-configuring-api-discovery)になっています。

## API Discoveryが対処する問題

**実際的で完全なAPIインベントリの構築**は、API Discoveryモジュールが対処する主要な問題です。

APIインベントリを最新の状態に保つことは困難な作業です。異なるAPIを使用する複数のチームがあり、APIドキュメントを作成するために異なるツールやプロセスが使用されることが一般的です。その結果、企業は、保有するAPIや公開しているデータを理解すること、および最新のAPIドキュメントを持つことに苦労しています。

API Discoveryモジュールは、実際のトラフィックをデータソースとして使用するため、実際にリクエストを処理しているすべてのエンドポイントをAPIインベントリに含めることで、最新で完全なAPIドキュメントを取得するのに役立ちます。

**WallarmによってAPIインベントリが検出されると、以下のことができます**：

* [外部および内部](#external-and-internal-apis) APIを含むAPI全体の完全な可視性を持つこと。
* APIに[入力されるデータ](../user-guides/api-discovery.md#params)を確認する。
* 最も[攻撃の対象](#endpoint-risk-score)になりやすいエンドポイントを理解する。
* 過去7日間で最も攻撃されたAPIを表示する。
* 攻撃されたAPIのみをフィルタリングし、ヒット数で並べ替える。
* 機密データを消費および運搬するAPIをフィルタリングする。
* [エクスポート可能な](../user-guides/api-discovery.md#download-openapi-specification-oas-of-your-api-inventory) 最新のAPIインベントリを持つこと。OpenAPI v3で比較する独自のAPI説明。次のことが分かります。
    * Wallarmによって検出されたエンドポイントのリストで、仕様には存在しない（欠落しているエンドポイント、いわゆる「シャドウAPI」）。
    * 仕様で提示されているが、Wallarmによって検出されなかったエンドポイントのリスト（使用されていないエンドポイント、いわゆる「ゾンビAPI」）。
* 選択した期間内にAPIで行われた[変更の追跡](#tracking-changes-in-api)。
* 任意のAPIエンドポイントに対して短時間で[ルールを作成する](../user-guides/api-discovery.md#api-inventory-and-rules)。
* 任意のAPIエンドポイントに対する悪意のあるリクエストの完全なリストを取得する。
* 開発者に構築されたAPIインベントリのレビューとダウンロードへのアクセスを提供する。

## API Discoveryの仕組み

API Discoveryはリクエスト統計に依存し、実際のAPI使用に基づいて最新のAPI仕様を生成するための洗練されたアルゴリズムを使用しています。

### ハイブリッドアプローチ

API Discoveryは、ローカルとクラウドで分析を行うハイブリッドアプローチを使用します。このアプローチにより、リクエストデータと機密データがローカルに保持される一方で、クラウドの力を利用して統計分析が行われる[プライバシーファーストプロセス](#security-of-data-uploaded-to-the-wallarm-cloud)が可能になります。

1. API Discoveryはローカルで正当なトラフィックを分析します。Wallarmは、リクエストが行われるエンドポイントとどのようなパラメータが渡されるかを分析します。
1. このデータに基づいて、統計が作成され、クラウドに送信されます。
1. Wallarm Cloudは受信した統計を集約し、[API説明](../user-guides/api-discovery.md) を作成します。

    !!! info "ノイズ検出"
        希少または単一のリクエストは [ノイズとして判断され](#noise-detection)、APIインベントリには含まれません。

### ノイズ検出

API Discoveryモジュールは、次の2つの主要なトラフィックパラメータに基づいてノイズ検出を行います。

* エンドポイントの安定性 - エンドポイントへの最初のリクエストから5分以内に、少なくとも5回のリクエストが記録されている必要があります。
* パラメータの安定性 - エンドポイントへのリクエストでパラメータが出現する頻度は、1%以上である必要があります。

APIインベントリは、これらの制限を超えたエンドポイントとパラメータを表示します。完全なAPIインベントリを構築するために必要な時間は、トラフィックの多様性と強度によって異なります。

また、API Discoveryは他の基準に基づいてリクエストのフィルタリングを実行します。

* サーバーが2xx範囲で応答したリクエストのみが処理されます。
* `Сontent-Type`、`Accept`などの標準フィールドは破棄されます。

### APIインベントリの要素

APIインベントリには以下の要素が含まれます。

* APIエンドポイント
* リクエストメソッド（GET、POSTなど）
* 必須およびオプションのGET、POST、およびヘッダーパラメータを含む：
    * 各パラメータで送信されるデータの[タイプ/フォーマット](#parameter-types-and-formats)
    * パラメータで送信される機密データ（PII）の有無および種類：
        * IPおよびMACアドレスなどの技術データ
        * 秘密鍵やパスワードなどのログイン資格情報
        * 銀行カード番号などの金融データ
        * 医療免許番号などの医療データ
        * 氏名、パスポート番号、SSNなどの個人識別情報（PII）
    
    * パラメータ情報が最後に更新された日時

### パラメータのタイプとフォーマット

Wallarmは、エンドポイントの各パラメータで渡される値を分析し、そのフォーマットを決定しようとします。

* Int32
* Int64
* Float
* Double
* Date
* Datetime
* Email
* IPv4
* IPv6
* UUID
* URI
* Hostname
* Byte
* MAC

パラメータの値が特定のデータ形式に適合していない場合、一般的なデータ型のうちの1つが指定されます。

* Integer
* Number
* String
* Boolean

**Type**列には、各パラメータについて以下が表示されます。

* データ形式
* 形式が定義されていない場合 - データタイプ

このデータにより、各パラメータに予想される形式の値が渡されているかどうかを確認できます。一貫性のないものは、攻撃またはAPIのスキャンの結果である可能性があります。

* `IP` のフィールドに `String` の値が渡される
* `Int32` 以下の値があるはずのフィールドに `Double` の値が渡される

### サンプルプレビュー

API Discoveryが含まれた[サブスクリプションプラン](subscription-plans.md#subscription-plans)を購入する前に、サンプルデータをプレビューできます。そのためには、**API Discovery**セクションで**Explore in a playground**をクリックします。

![!API Discovery – Sample Data](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

## 構築済みAPIインベントリの使用

**API Discovery**セクションでは、ビルドしたAPIインベントリを使用する多くのオプションが提供されています。

![!API Discoveryが検出したエンドポイント](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

これらのオプションには以下が含まれます。

* 検索とフィルタ。
* 内部APIと外部APIを別々にリストアップする機能。
* エンドポイントパラメータの表示。
* APIの変更の追跡。
* いくつかのエンドポイントに関連する攻撃へのクイックナビゲーション。
* 特定のエンドポイント用のカスタムルール作成。
* APIインベントリのOpenAPI仕様（OAS）を `swagger.json` ファイルとしてダウンロードする。

利用可能なオプションについては、[ユーザーガイド](../user-guides/api-discovery.md)で詳しく説明しています。## エンドポイントリスクスコア

API Discoveryは、APIインベントリ内の各エンドポイントに対して自動的に**リスクスコア**を計算します。リスクスコアにより、攻撃対象となりやすいエンドポイントを把握し、セキュリティ対策を重点的に行う必要があることがわかります。

リスクスコアは、以下のようなさまざまな要素から構成されています。

* 無権限でのデータアクセスや破損が発生する可能性がある [**アクティブな脆弱性**](detecting-vulnerabilities.md) の存在。
* サーバーに**ファイルをアップロードする**機能 - エンドポイントは、悪意のあるコードが含まれたファイルがサーバーにアップロードされる [リモートコード実行（RCE）](../attacks-vulns-list.md#remote-code-execution-rce) 攻撃によく狙われます。これらのエンドポイントを安全にするために、アップロードされたファイルの拡張子と内容を、[OWASPチートシート](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) の推奨に従って適切に検証する必要があります。
* [**変数パス部分**](#variability-in-endpoints) の存在、たとえばユーザーID（例：`/api/articles/author/{parameter_X}`）です。攻撃者はオブジェクトIDを操作し、要求認証が不十分な場合にオブジェクトの機密データを読み取ったり変更したりすることができます（[**BOLA攻撃**](../admin-en/configuration-guides/protecting-against-bola.md)）。
* [**機密データ**](#api-inventory-elements) を含むパラメータの存在 - 攻撃者は、APIを直接攻撃するのではなく、機密データを盗んでリソースにスムーズにアクセスすることができます。
* 攻撃方向の数を増やす**多数のパラメータ**。
* エンドポイントリクエストで渡される **XMLまたはJSONオブジェクト** は、攻撃者がサーバーに悪意のあるXML外部エンティティやインジェクションを転送するために使用することがあります。

!!! info "リスクスコア計算の設定"
    リスクスコアの推定を、要素の重要性に関するあなたの理解に合わせて適応させるために、リスクスコア計算における各要素の重みや計算方法を [設定](../user-guides/api-discovery.md#customizing-risk-score-calculation) することができます。

[リスクスコアの使い方を学ぶ →](../user-guides/api-discovery.md#working-with-risk-score)

## APIの変更を追跡する

APIを更新し、トラフィック構造が調整されると、API Discoveryは構築済みのAPIインベントリを更新します。

会社にはいくつかのチームや、異なるプログラミング言語、さまざまな言語フレームワークがある場合があります。そのため、APIにはいつでもどこからでも変更が加えられることがあり、それを制御することが難しくなります。セキュリティ担当者にとっては、できるだけ早く変更を検出し、それらを分析することが重要です。そうでないと、以下のようなリスクが発生することがあります。

* 開発チームが別のAPIを持つサードパーティ製ライブラリを使用し始め、セキュリティ専門家に通知せずにこれを利用します。これにより、会社は監視対象でなく、脆弱性がチェックされていないエンドポイントが現れることになり、攻撃の方向性が出てくる可能性があります。
* PIIデータがエンドポイントに転送され始めます。予定外のPII転送により、規制要求への遵守が守られず、評判リスクが発生することがあります。
* ビジネスロジックのエンドポイント（例：`/login`、`/order/{order_id}/payment/`）が呼び出されなくなります。
* エンドポイントに転送されるべきでない他のパラメータ（例えば、`is_admin`）が転送され始めます（誰かがエンドポイントにアクセスし、管理者権限で行おうと試みるケース）。

Wallarmの**API Discovery**モジュールを使用することで、以下ができます。

* 変更の追跡と、それらが現在のビジネスプロセスを損なわないことの確認。
* インフラに潜在的な脅威ベクトルとなる未知のエンドポイントが登場していないことの確認。
* PIIおよびその他の予期しないパラメータがエンドポイントに転送され始めていないことの確認。
* **APIの変更**条件を持つ[トリガー](../user-guides/triggers/trigger-examples.md#new-endpoints-in-your-api-inventory)を介して、APIの変更に関する通知の設定。

[ユーザーガイド](../user-guides/api-discovery.md#tracking-changes-in-api)で、トラック変更機能の使い方を学びましょう。

## 外部および内部API

外部ネットワークからアクセス可能なエンドポイントは、主な攻撃方向です。そのため、何が外部から利用可能かを確認し、これらのエンドポイントにまず注意を払うことが重要です。

Wallarmは、検出されたAPIを外部および内部に自動的に分割します。ホストとそのすべてのエンドポイントは、以下に配置されている場合に内部と見なされます。

* プライベートIPまたはローカルIPアドレス
* 一般的なトップレベルドメイン（例：localhost、dashboard など）

残りのケースでは、ホストは外部と見なされます。

デフォルトでは、すべてのAPIホスト（外部および内部）が表示されるリストが表示されます。構築されたAPIインベントリで、内部および外部のAPIを別々に表示することができます。これを行うには、**External** または **Internal** をクリックします。

## エンドポイントの変動性

URLには、ユーザーのIDなど、さまざまな要素が含まれることがあります。

* `/api/articles/author/author-a-0001`
* `/api/articles/author/author-a-1401`
* `/api/articles/author/author-b-1401`

**API Discovery**モジュールは、エンドポイントのパス内のこのような要素を `{parameter_X}` 形式に統一します。そのため、上記の例では、3つのエンドポイントではなく、次の1つになります。

* `/api/articles/author/{parameter_X}`

エンドポイントをクリックして、そのパラメータを展開し、多様なパラメータに対して自動的に検出されたタイプを表示します。

![!API Discovery - Variability in path](../images/about-wallarm-waf/api-discovery/api-discovery-variability-in-path.png)

アルゴリズムは新しいトラフィックを分析します。ある時点で、統一されるべきアドレスが見つかったものの、まだ統一されていない場合は、時間をかけてください。新しいデータが多く届くと、システムは、見つかったパターンに一致する適切な数のアドレスを持つエンドポイントを統一します。

## 自動BOLA保護

[破損したオブジェクトレベルの承認（BOLA）](../attacks-vulns-list.md#broken-object-level-authorization-bola) のような行動攻撃は、同名の脆弱性を利用しています。この脆弱性は、攻撃者がAPIリクエスト経由でオブジェクトに識別子でアクセスし、認証メカニズムをバイパスしてデータを読み取ったり変更したりすることを可能にします。

BOLA攻撃の潜在的な対象は、変量を持つエンドポイントです。Wallarmは、**API Discovery**モジュールで調査したエンドポイントの中から、このようなエンドポイントを自動的に発見および保護することができます。

自動BOLA保護を有効にするには、[Wallarm Console → **BOLA protection**](../user-guides/bola-protection.md) に進み、スイッチを有効状態に切り替えます。

![!BOLA trigger](../images/user-guides/bola-protection/trigger-enabled-state.png)

APIインベントリ内の保護された各APIエンドポイントは、対応するアイコンで強調表示されます。

![!BOLA trigger](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

BOLA自動保護状態でAPIエンドポイントをフィルタリングすることができます。対応するパラメータは、**Others**フィルターの下にあります。

## Wallarm Cloudへのアップロードデータのセキュリティ

API Discoveryは、トラフィックのほとんどをローカルで分析します。モジュールは、検出されたエンドポイントやパラメータ名、さまざまな統計データ（到着時間、件数など）をWallarm Cloudに送信します。すべてのデータは、セキュアチャネルを介して転送されます。API Discoveryモジュールは、[SHA-256](https://en.wikipedia.org/wiki/SHA-2) アルゴリズムを使用してリクエストパラメータの値をハッシュし、Wallarm Cloudに統計情報をアップロードする前にその値をハッシュします。

クラウド側では、ハッシュ化されたデータは統計解析（例：同一パラメータのリクエスト量を数える）に使用されます。

他のデータ（エンドポイントの値、リクエストメソッド、パラメータ名）は、APIインベントリの構築が不可能となるオリジナル状態に復元できないハッシュのため、Wallarm Cloudにアップロードされる前にハッシュ化されません。

!!! warning "重要"
    Wallarmは、パラメータに指定された値をCloudに送信しません。エンドポイント、パラメータ名、およびそれらの統計情報のみが送信されます。## API Discoveryの有効化と設定

`wallarm-appstructure`パッケージは、Debian 11.xとUbuntu 22.04パッケージを除くすべての[形態](../installation/supported-deployment-options.md)のWallarmノードに含まれています。ノードのデプロイ中に、API Discoveryモジュールをインストールしますが、デフォルトでは無効にしています。

API Discoveryを正しく有効化して実行するには：

1. Wallarmノードが[サポート対象のバージョン](../updating-migrating/versioning-policy.md#version-list)であることを確認してください。

    API Discoveryの機能をフルに活用できるようにするために、以下のように定期的に`wallarm-appstructure`パッケージを更新することをお勧めします。


    === "Debian Linux"
        ```bash
        sudo apt update
        sudo apt install wallarm-appstructure
        ```
    === "RedHat Linux"
        ```bash
        sudo yum update
        sudo yum install wallarm-appstructure
        ```
1. [サブスクリプションプラン](subscription-plans.md#subscription-plans)に**API Discovery**が含まれていることを確認してください。プランを変更するには、[sales@wallarm.com](mailto:sales@wallarm.com)にリクエストを送ってください。
1. 選択したアプリケーションのみでAPI Discoveryを有効にしたい場合は、[アプリケーションの設定](../user-guides/settings/applications.md)記事に記載されているように、アプリケーションが追加されていることを確認してください。

    アプリケーションが設定されていない場合、すべてのAPIの構造が1つのツリーにグループ化されます。

1. Wallarmコンソールで、**API Discovery** → **Configure API Discovery**から、必要なアプリケーションのAPI Discoveryを有効にします。

    ![!API Discovery – Settings](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

    !!! info "API Discovery設定へのアクセス"
        企業のWallarmアカウントの管理者のみがAPI Discovery設定にアクセスできます。アクセスがない場合は、管理者に連絡してください。

API Discoveryモジュールが有効になると、トラフィック分析とAPIインベントリの構築が開始されます。APIインベントリは、Wallarmコンソールの**API Discovery**セクションに表示されます。

## API Discoveryのデバッグ

API Discoveryのログを取得して分析するには、以下の方法を使用できます：

* Wallarmノードがソースパッケージからインストールされている場合 : インスタンス内で標準ユーティリティ**journalctl**または**systemctl**を実行します。

    === "journalctl"
        ```bash
        journalctl -u wallarm-appstructure
        ```
    === "systemctl"
        ```bash
        systemctl status wallarm-appstructure
        ```
* WallarmノードがDockerコンテナからデプロイされている場合：コンテナ内のログファイル`/var/log/wallarm/appstructure.log`を読みます。
* WallarmノードがKubernetes Ingressコントローラとしてデプロイされている場合：Tarantoolおよび`wallarm-appstructure`コンテナを実行しているポッドの状態を確認します。ポッドの状態は**Running**でなければなりません。

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    `wallarm-appstructure`コンテナのログを読みます:

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```