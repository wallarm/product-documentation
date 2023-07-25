# APIインベントリーの発見<a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>
Wallarmプラットフォームの**API Discovery**モジュールは、実際のAPI使用に基づいてREST APIインベントリを構築します。このモジュールは、実際のトラフィックリクエストを連続的に分析し、分析結果に基づいてAPIインベントリを構築します。 

デフォルトでは、API Discoveryモジュールは[無効になっています](#enabling-and-configuring-api-discovery)。

## API Discoveryで解決される問題

**実際の完全なAPIインベントリの構築**がAPI Discoveryモジュールが解決する主要な問題です。

APIのインベントリを最新の状態に保つことは困難です。複数のチームが異なるAPIを使用し、APIドキュメントを作成するために異なるツールやプロセスを使用することが一般的です。その結果、企業は、どのAPIが存在し、どのデータが公開されているかを理解し、最新のAPIドキュメントを取得することに苦労しています。

API Discoveryモジュールは実際のトラフィックをデータソースとして使用するため、リクエストを処理しているすべてのエンドポイントをAPIインベントリに含めることで、最新の完全なAPIドキュメントを取得するのに役立ちます。

**WallarmによってAPIインベントリが発見された場合は、次のことができます。**

* [内部および外部](#external-and-internal-apis)APIリストを含む、全体のAPIエステートの完全な可視性を持ちます。
* [APIに入力されるデータ](../user-guides/api-discovery.ja.md#params)を確認できます。
* [攻撃のターゲットに最もなりやすい](#endpoint-risk-score)エンドポイントを理解できます。
* 過去7日間で最も攻撃されたAPIを表示できます。
* 攻撃されたAPIのみをフィルタリングし、ヒット数で並べ替えることができます。
* 機密データを消費および運搬するAPIをフィルタリングできます。
* [APIインベントリを最新の状態に保ち](../user-guides/api-discovery.ja.md#download-openapi-specification-oas-of-your-api-inventory)、OpenAPI v3へエクスポートするオプションを持っています。あなたは次のことを発見することができます：
    * Wallarmによって発見されたエンドポイントのリストがありますが、仕様書に存在しない（欠落しているエンドポイント、別名「シャドーAPI」）。
    * 仕様書に表示されているが、Wallarmによって発見されていないエンドポイント（使用されていないエンドポイント、別名「ゾンビAPI」）のリスト。
* 選択した期間内に発生したAPIの[変更を追跡](#tracking-changes-in-api)できます。
* [任意のAPIエンドポイントに対してルール](../user-guides/api-discovery.ja.md#api-inventory-and-rules)をすばやく作成できます。
* 任意のAPIエンドポイントごとに悪意のあるリクエストの完全なリストを取得できます。
* 構築されたAPIインベントリのレビューおよびダウンロードに関する開発者へのアクセスを提供できます。

## API Discoveryはどのように機能しますか？

API Discoveryはリクエスト統計に依存し、実際のAPI使用に基づく最新のAPI仕様を生成するために洗練されたアルゴリズムを使用します。### ハイブリッドアプローチ

API Discovery は、ローカルとクラウドの両方で解析を実行するハイブリッドアプローチを使用します。この方法により、リクエストデータや機密データをローカルに保持しながら、統計解析をクラウドのパワーで行うプライバシーファーストプロセス(#security-of-data-uploaded-to-the-wallarm-cloud)が可能になります。

1. API Discovery は正規のトラフィックをローカルで解析します。Wallarm はリクエストが行われたエンドポイントと渡されたパラメータを解析します。
1. このデータに基づいて統計情報が作成され、クラウドに送信されます。
1. Wallarmクラウドは、受信した統計情報を集計し、その基に[APIの説明書](../user-guides/api-discovery.ja.md)を作成します。

    !!! info "ノイズ検出"
        まれまたは単発のリクエストは、[ノイズ検出](#noise-detection)され、APIの在庫リストには含まれません。

### ノイズ検出

API Discovery モジュールは、2つの主要なトラフィックパラメータに基づいてノイズ検出を行います。

* エンドポイントの安定性 - エンドポイントへの最初のリクエストから5分以内に少なくとも5つのリクエストが記録されていなければなりません。
* パラメータの安定性 - エンドポイントへのリクエスト中のパラメータの出現率は1%以上である必要があります。

APIの在庫リストは、これらの制限を超えたエンドポイントとパラメータを表示します。完全なAPIインベントリを作成するには、トラフィックの多様性と強度に応じた時間が必要です。

また、API Discovery は他の基準に基づいてリクエストのフィルタリングを実行します。

* サーバーから2xx範囲の応答を受け取ったリクエストのみが処理されます。
* REST APIの設計原則に準拠しないリクエストは処理されません。これは、応答の `Content-Type` ヘッダパラメータを制御することで実現されます。`Content-Type` パラメータに `application` をタイプとして、`json` をサブタイプとして含まない場合、そのリクエストは非REST APIと見なされ、フィルタリングされます。REST API応答の例： `Content-Type: application/json;charset=utf-8`。パラメータが存在しない場合、API Discovery はリクエストを解析します。
* `Accept` 等の標準フィールドは破棄されます。

### API在庫要素

API在庫には、次の要素が含まれます。

* APIのエンドポイント
* リクエストメソッド(GET、POSTなど)
* 必須およびオプションのGET、POST、ヘッダーパラメーター、および以下を含む:

    * 各パラメータに送信されるデータの[タイプ/フォーマット](#parameter-types-and-formats)
    * パラメータが伝送する機密データ(PII)の存在とタイプ：

        * IPアドレスやMACアドレスなどの技術的なデータ
        * シークレットキーやパスワードなどのログイン資格情報
        * 銀行カード番号などの財務情報
        * 医療許可番号などの医療情報
        * 氏名、パスポート番号、または社会保障番号などの個人識別情報(PII)
    
    * パラメータ情報の最終更新日時### パラメーターの種類とフォーマット

Wallarmは、各エンドポイントパラメーターに渡される値を解析し、そのフォーマットを判定します。

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

パラメーターの値が特定のデータフォーマットに適合しない場合、共通のデータタイプの1つが指定されます。

* 整数
* 数字
* 文字列
* ブール

各パラメーターについて、**タイプ**列には、以下が表示されます。

* データフォーマット
* フォーマットが定義されていない場合 - データタイプ

このデータにより、期待されるフォーマットの値が各パラメーターに渡されていることを確認できます。一貫性のない値は、攻撃またはAPIのスキャンの結果である可能性があります。

* `IP`のフィールドに`String`値が渡された場合
* `Int32`以下の値である必要があるフィールドに`Double`値が渡された場合

### サンプルのプレビュー

API Discoveryのサブスクリプションプランを購入する前に、サンプルデータをプレビューできます。 **API Discovery**のセクションで、**PlaygroundでExplore**をクリックしてください。

![!API Discovery – Sample Data](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

## ビルド済みAPIインベントリの使用

**API Discovery**のセクションでは、多数のビルドAPIインベントリの使用オプションを提供しています。

![!Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

これらのオプションは以下のとおりです。

* 検索とフィルタ
* 内部APIと外部APIを別々にリストする機能
* エンドポイントパラメーターの表示
* APIの変更の追跡
* 特定のエンドポイントに関連する攻撃へのクイックナビゲーション
* 特定のエンドポイントに対するカスタムルールの作成
* あなたのAPIインベントリのOpenAPI仕様（OAS）を`swagger.json`ファイルとしてダウンロード

利用可能なオプションについて詳しくは[ユーザーガイド](../user-guides/api-discovery.ja.md)を参照してください。## エンドポイントのリスクスコア

API Discoveryは、APIインベントリ内の各エンドポイントに対して、自動的に**リスクスコア**を計算します。リスクスコアにより、攻撃の対象となりやすいエンドポイントを理解し、セキュリティ対策の焦点を置くことができます。

リスクスコアは、次の要因から構成されています。

* 認可されていないデータアクセスや破壊をもたらす可能性がある[**アクティブな脆弱性**](detecting-vulnerabilities.ja.md)の存在。
* サーバーへの**ファイルのアップロード能力**- エンドポイントは、悪意のあるコードを含むファイルがサーバーにアップロードされる[リモートコード実行（RCE）](../attacks-vulns-list.ja.md#remote-code-execution-rce)攻撃の標的になることがよくあります。これらのエンドポイントを保護するには、アップロードされたファイルの拡張子や内容を[OWASPチートシート](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)で推奨されるように適切に検証する必要があります。
* ユーザーIDなどの[**可変パス部分**](#variability-in-endpoints)の存在、「/ api / articles / author / {parameter_X}」など。攻撃者はオブジェクトIDを操作し、不十分なリクエストの認証の場合、オブジェクトの機密データを読み取るか変更するかのいずれかに対処することができます([**BOLA攻撃**](../admin-en/configuration-guides/protecting-against-bola.ja.md)）。
* [**機密データ**](#api-inventory-elements)を含むパラメータの存在- APIを直接攻撃する代わりに、攻撃者は機密データを盗んで、シームレスにリソースに到達することができます。
* 攻撃の方向数を増やす**多数のパラメータ**。
* エンドポイントリクエストで渡される**XMLまたはJSONオブジェクト**は、攻撃者が悪意のあるXML外部エンティティおよびインジェクションをサーバーに転送するために使用する可能性があります。

!!! info "リスクスコア計算の設定"
    リスクスコアの推定を、各要因の重み付けと計算方法を[設定](../user-guides/api-discovery.ja.md#customizing-risk-score-calculation)することで、あなた自身の理解に合わせて適応することができます。

[リスクスコアの操作方法を学ぶ→](../user-guides/api-discovery.ja.md#working-with-risk-score)## API の変更の追跡

API を更新してトラフィック構造を調整すると、API Discovery が構築された API インベントリを更新します。

企業は、複数のチーム、バラバラのプログラミング言語、およびさまざまな言語フレームワークを持っている場合があります。そのため、異なるソースからいつでも API に変更が加えられる可能性があり、これらの変更を制御するのは難しいです。セキュリティ担当者にとっては、変更をできるだけ早く検出して分析することが重要です。このような変更を見逃すと、以下のようなリスクが生じる可能性があります。

* 開発チームが、独立した API を持つサードパーティライブラリを使用し、セキュリティ専門家に通知しない場合があります。これにより、モニタリングされず、脆弱性にチェックされていないエンドポイントが会社に出現する可能性があります。それらは攻撃の潜在的な方向である可能性があります。

* PII データがエンドポイントに転送されるようになります。PII の予期しない転送は、規制当局の要件の違反や企業の信用リスクにつながる場合があります。

* ビジネスロジックの重要なエンドポイント（たとえば、`/login`、`/order/{order_id}/payment/`など）が呼び出されなくなりました。

* 送信しないで済む他のパラメーター（たとえば、`is_admin`（someone accesses the endpoint and tries to do it with administrator rights）など）がエンドポイントに転送されるようになりました。

Wallarm の **API Discovery** モジュールを使用すると、次の操作を実行できます。

* 変更を追跡し、現在の業務プロセスを妨げないことを確認します。
* インフラストラクチャに潜在的な脅威ベクターとなるエンドポイントが登場していないことを確認します。
* PII および予期しないパラメーターがエンドポイントに送信されていないことを確認します。
* **API に変更がある場合**の条件に従って、[トリガー](../user-guides/triggers/trigger-examples.ja.md#new-endpoints-in-your-api-inventory)を介して API の変更の通知を設定します。

[ユーザーガイド](../user-guides/api-discovery.ja.md#tracking-changes-in-api)で、変更を追跡する機能の使用方法について学びます。

## 外部および内部 API

外部ネットワークからアクセス可能なエンドポイントが、主要な攻撃方向となります。そのため、最初に外部から利用可能なエンドポイントを見て、これらのエンドポイントに注意を払うことが重要です。

Wallarm は、検出された API を自動的に外部および内部に分割します。すべてのエンドポイントを備えたホストは、次の場所にある場合に内部と見なされます。

* プライベート IP またはローカル IP アドレス
* 汎用トップレベルドメイン ( たとえば：localhost、dashboard など )

その他の場合は、ホストが外部と見なされます。

デフォルトでは、すべての API ホスト ( 外部および内部 ) のリストが表示されます。構築された API インベントリでは、内部および外部の API をそれぞれ表示できます。これを行うには、 **External** または **Internal** をクリックしてください。## エンドポイントの可変性

URLには、ユーザーのIDなど、さまざまな要素が含まれる場合があります。

* `/api/articles/author/author-a-0001`
* `/api/articles/author/author-a-1401`
* `/api/articles/author/author-b-1401`

「APIディスカバリー」モジュールは、エンドポイントパス内のこれらの要素を `{parameter_X}` 形式に統一します。上記の例について、3つのエンドポイントがありません。代わりに、1つのエンドポイントがあります。

* `/api/articles/author/{parameter_X}`

エンドポイントをクリックして、パラメーターを展開し、異なるパラメーターの自動検出で一致するアドレスの数を確認できます。

![!API Discovery - Variability in path](../images/about-wallarm-waf/api-discovery/api-discovery-variability-in-path.png)

アルゴリズムが新しいトラフィックを分析することに注意してください。まだ統一される必要があるアドレスがある場合は、時間を置いてください。より多くのデータが到着すると、システムは新しく見つかったパターンに一致するエンドポイントを適切な数の一致するアドレスで統一します。

## 自動BOLA保護

[Broken Object Level Authorization (BOLA)](../attacks-vulns-list.ja.md#broken-object-level-authorization-bola)のような行動タイプの攻撃は、脆弱性を悪用します。この脆弱性により、APIリクエストを介して識別子によるオブジェクトへのアクセスが可能になり、認証メカニズムをバイパスしてデータを読み取ったり変更したりすることができます。

BOLA攻撃の潜在的なターゲットは、可変性のあるエンドポイントです。Wallarmは、API Discoveryモジュールで探索された中から、このようなエンドポイントを自動的に検出および保護できます。

自動BOLA保護を有効にするには、[Wallarmコンソール → **BOLA protection**](../user-guides/bola-protection.ja.md)に進み、スイッチを有効な状態に切り替えてください。

![!BOLA trigger](../images/user-guides/bola-protection/trigger-enabled-state.png)

保護された各APIエンドポイントは、APIインベントリで対応するアイコンでハイライトされます。

![!BOLA trigger](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

BOLA自動保護ステータスでAPIエンドポイントをフィルタリングできます。対応するパラメータは、**その他**フィルタの下で利用可能です。## Wallarm Cloud へアップロードされたデータのセキュリティ

API Discovery はほとんどのトラフィックをローカルで解析します。このモジュールは、発見されたエンドポイント、パラメータ名、そして様々な統計データ（到着時間、数など）のみを Wallarm Cloud に送信します。すべてのデータは安全なチャネルを通じて伝送されます。API Discovery モジュールは、Wallarm Cloud に統計情報をアップロードする前に、リクエストパラメータの値を [SHA-256](https://en.wikipedia.org/wiki/SHA-2) アルゴリズムを使用してハッシュ化します。

クラウド側では、ハッシュ化されたデータを使用して統計分析を行います（たとえば、同じパラメータを持つリクエストの数量を定量化する場合など）。

その他のデータ（エンドポイントの値、リクエスト方法、およびパラメータ名）は、API インベントリを構築するのが不可能になるため、 Wallarm Cloud にアップロードする前にハッシュ化されません。

!!! warning "重要"
    Wallarm は、パラメータで指定された値をクラウドに送信しません。エンドポイント、パラメータ名、およびその統計データだけが送信されます。## APIディスカバリを有効にし、構成する

`wallarm-appstructure`パッケージは、Debian 11.xおよびUbuntu 22.04パッケージを除く、Wallarmノードのすべての[フォーム](../installation/supported-deployment-options.ja.md)に含まれています。ノードのデプロイ時にAPIディスカバリモジュールがインストールされますが、デフォルトでは無効化された状態になっています。

APIディスカバリを正常に有効化、実行するには以下の手順を行ってください。

1. Wallarmノードが[サポートされているバージョン](../updating-migrating/versioning-policy.ja.md#version-list)であることを確認してください。

APIディスカバリの全機能にアクセスできるようにするために、正常にAPIディスカバリの機能を利用できるようにするために、`wallarm-appstructure`パッケージの更新を定期的に確認することをお勧めします。 


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

1. [サブスクリプションプラン](subscription-plans.ja.md#subscription-plans)に**APIディスカバリ**が含まれていることを確認してください。サブスクリプションプランを変更するには、[sales@wallarm.com](mailto:sales@wallarm.com)へリクエストを送信してください。

1. 選択したアプリケーションのみでAPIディスカバリを有効にする場合は、[アプリケーションを設定する](../user-guides/settings/applications.ja.md)の記事に記載されているように、アプリケーションが追加されていることを確認してください。

    アプリケーションが構成されていない場合、すべてのAPIの構造が1つのツリーにグループ化されます。

1. Wallarm コンソール → **APIディスカバリ** → **APIディスカバリの構成**で必要なアプリケーションのAPIディスカバリを有効にしてください。

    ![!APIディスカバリ - 設定](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

    !!! info "APIディスカバリ設定へのアクセス"
        あなたの企業のWallarmアカウントの管理者しかAPIディスカバリ設定にアクセスすることはできません。アクセスがない場合は、管理者に連絡してください。

APIディスカバリモジュールが有効化されると、トラフィック解析とAPIインベントリの作成が開始されます。APIインベントリはWallarmコンソールの**APIディスカバリ**セクションに表示されます。## API Discovery のデバッグ

API Discovery のログを取得して解析するには、次の方法を使用できます。

* Wallarm ノードがソースパッケージからインストールされている場合：インスタンス内で標準ユーティリティの **journalctl** または **systemctl** を実行します。

    === "journalctl"
        ```bash
        journalctl -u wallarm-appstructure
        ```
    === "systemctl"
        ```bash
        systemctl status wallarm-appstructure
        ```
* Wallarm ノードが Docker コンテナからデプロイされている場合：コンテナ内のログファイル `/var/log/wallarm/appstructure.log` を読み取ります。
* Wallarm ノードが Kubernetes Ingress コントローラとしてデプロイされている場合：Tarantool および `wallarm-appstructure` コンテナを実行しているポッドのステータスを確認します。ポッドのステータスは **Running** である必要があります。

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    `wallarm-appstructure` コンテナのログを読み取ります：

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```