# API Discoveryの概要 <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmプラットフォームの**API Discovery**モジュールは、実際のAPI利用状況に基づいてアプリケーションのREST APIインベントリを構築します。モジュールは実トラフィックのリクエストを継続的に分析し、その結果に基づいてAPIインベントリを作成します。

APIインベントリには以下の要素が含まれます:

* APIエンドポイント
* リクエストメソッド（GET、POSTなど）
* リクエストおよびレスポンスの必須/任意のGET、POST、ヘッダーの各パラメータ。以下を含みます:
    * 各パラメータで送られるデータの[型/フォーマット](./exploring.md#format-and-data-type)
    * パラメータ情報が最後に更新された日時

!!! info "レスポンスパラメータの可用性"
    レスポンスパラメータはノード4.10.1以上を使用している場合にのみ利用できます。

<div>
    <script src="https://js.storylane.io/js/v1/storylane.js"></script>
    <div class="sl-embed" style="position:relative;padding-bottom:calc(60.95% + 27px);width:100%;height:0;transform:scale(1)">
        <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/cgqrxqwhmgyp" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
    </div>
</div>

## API Discoveryで解決する課題

「実態に即した完全なAPIインベントリの構築」が、API Discoveryモジュールが取り組む主な課題です。

APIインベントリを最新に保つことは難しい作業です。複数のチームが異なるAPIを使用しており、APIドキュメントを作成するために異なるツールやプロセスが用いられることは一般的です。その結果、企業は自社がどのAPIを保有し、どのデータを公開しているのか、そしてAPIドキュメントが最新であるかの把握に苦労します。

API Discoveryモジュールは実トラフィックをデータソースとして使用するため、実際にリクエストを処理しているすべてのエンドポイントをAPIインベントリに含めることで、最新かつ完全なAPIドキュメントの取得に役立ちます。

**WallarmによってAPIインベントリが把握されると、次のことが可能です**:

* [外部と内部](exploring.md#external-vs-internal)のAPI一覧を含む、APIエステート全体を可視化できます。
* APIに[どのようなデータ](exploring.md#endpoint-details)が出入りしているかを確認できます。
* 未解決の脆弱性があるエンドポイントの一覧を取得できます。
* 任意のAPIエンドポイントごとに、過去7日間に発生した脅威の一覧を取得できます。
* 攻撃されたAPIのみをフィルタリングし、Hitsの数で並べ替えできます。
* [機密データ](#sensitive-data-detection)を扱うAPIをフィルタリングできます。
* APIインベントリの構造と問題点を、使いやすい[dashboard](dashboard.md)で可視化されたサマリーとして確認できます。
* どのエンドポイントが攻撃対象に[なりやすい](risk-score.md)かを把握できます。
* [シャドーAPI、オーファンAPI、ゾンビAPI](rogue-api.md)を発見できます。
* 選択した期間内にAPIで発生した[Track changes](track-changes.md)を確認できます。
* [BOLA auto protection state](bola-protection.md)でAPIエンドポイントをフィルタリングできます。
* 開発者に、作成されたAPIインベントリの閲覧とダウンロードのための[アクセス](../user-guides/settings/users.md#user-roles)を付与できます。

## API Discoveryはどのように動作しますか？

API Discoveryはリクエスト統計に依拠し、実際のAPI利用に基づいた最新のAPI仕様を生成するために高度なアルゴリズムを使用します。

### トラフィック処理

API DiscoveryはローカルとCloudの双方で分析を実施するハイブリッドアプローチを採用します。このアプローチにより、統計分析にはCloudの処理能力を活用しつつ、リクエストデータや機密データはローカルに保持する[プライバシー最優先のプロセス](#security-of-data-uploaded-to-the-wallarm-cloud)が実現します:

1. API Discoveryは正当なトラフィックをローカルで分析します。Wallarmは、リクエストが送られるエンドポイントや、どのパラメータが渡され、どのパラメータが返されるかを分析します。
1. このデータに基づいて統計を作成し、Cloudに送信します。
1. Wallarm Cloudは受信した統計を集約し、それに基づいて[APIの説明](exploring.md)を構築します。

    !!! info "ノイズ検出"
        まれなリクエストや単発のリクエストは[ノイズとして判定](#noise-detection)され、APIインベントリには含まれません。

### ノイズ検出 {#noise-detection}

API Discoveryモジュールは、次の2つの主要なトラフィック特性に基づいてノイズを検出します:

* エンドポイントの安定性 - 最初のリクエストから5分以内に、少なくとも5件のリクエストが記録される必要があります。
* パラメータの安定性 - 当該エンドポイントへのリクエストにおけるそのパラメータの出現率が1パーセントを超えている必要があります。

これらの閾値を満たしたエンドポイントとパラメータのみがAPIインベントリに表示されます。完全なAPIインベントリの構築に要する時間は、トラフィックの多様性と量に依存します。 

また、API Discoveryは次の基準に基づいてリクエストをフィルタリングします:

* サーバーが2xxの範囲で応答したリクエストのみを処理します。
* REST APIの設計原則に適合しないリクエストは処理しません。
    
    これはレスポンスの`Content-Type`ヘッダーを確認することで行います。ヘッダーに`application/json`（例: `Content-Type: application/json;charset=utf-8`）が含まれていない場合、そのリクエストは非REST APIと見なされ、分析しません。
    
    ヘッダーが存在しない場合は、API Discoveryはリクエストを分析します。

* `Accept`などの標準的なフィールドは除外します。
* `localhost`やループバックアドレスを対象とするリクエストは処理しません。

### 機密データの検出 {#sensitive-data-detection}

API Discoveryは、APIが扱う機密データを[検出してハイライト表示](sensitive-data.md)します:

* IPアドレスやMACアドレスなどの技術的データ
* シークレットキーやパスワードなどの認証情報
* クレジットカード番号などの金融データ
* 医療免許番号などの医療関連データ
* 氏名、パスポート番号、社会保障番号（SSN）などの個人を特定できる情報（PII）

API Discoveryは検出プロセスの調整や独自の機密データパターンの追加が可能です（NGINX Node 5.0.3またはNative Node 0.7.0以上が必要です）。

### センシティブなビジネスフロー

[センシティブなビジネスフロー](sbf.md)機能により、API Discoveryは認証、アカウント管理、課金などの重要なビジネスフローや機能に不可欠なエンドポイントを自動的に特定できます。

自動識別に加えて、割り当てられたセンシティブなビジネスフロータグを手動で調整したり、任意のエンドポイントにタグを手動で設定したりできます。

エンドポイントにセンシティブなビジネスフロータグが割り当てられると、特定のビジネスフローで検出済みのエンドポイントをフィルタリングできるようになり、最重要のビジネス機能を保護しやすくなります。

![API Discovery - センシティブなビジネスフローによるフィルタリング](../images/about-wallarm-waf/api-discovery/api-discovery-sbf-filter.png)

### Wallarm Cloudにアップロードされるデータのセキュリティ {#security-of-data-uploaded-to-the-wallarm-cloud}

API Discoveryはほとんどのトラフィックをローカルで分析します。モジュールがWallarm Cloudに送信するのは、検出されたエンドポイント、パラメータ名、および各種の統計データ（到着時刻、件数など）のみです。すべてのデータは安全なチャネルで送信されます。統計をWallarm Cloudにアップロードする前に、API Discoveryモジュールは[SHA-256](https://en.wikipedia.org/wiki/SHA-2)アルゴリズムを使用してリクエストパラメータの値をハッシュ化します。

クラウド側では、ハッシュ化されたデータは統計分析（例えば、同一パラメータのリクエスト件数の集計など）に使用されます。

その他のデータ（エンドポイントの値、リクエストメソッド、パラメータ名）はWallarm Cloudにアップロードする前にハッシュ化しません。ハッシュは元の値に復元できないため、ハッシュ化するとAPIインベントリの構築が不可能になるためです。

!!! warning "重要"
    Wallarmは、パラメータに指定された値そのものをCloudに送信しません。送信するのはエンドポイント、パラメータ名、およびそれらに関する統計のみです。

## API Discoveryのデモ動画

API Discoveryのデモ動画をご覧ください:

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/0bRHVtpWkJ8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## PlaygroundでAPI Discoveryを試す

サインアップやノードのデプロイ前にモジュールを試したい場合は、[Wallarm PlaygroundのAPI Discovery](https://playground.wallarm.com/api-discovery/?utm_source=wallarm_docs_apid)を探索してください。

Playgroundでは、実データで満たされたかのようにAPI Discoveryのviewにアクセスでき、モジュールの動作を学んで試すことができ、読み取り専用モードで有用な使用例も確認できます。

![API Discovery – サンプルデータ](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

## API Discoveryの有効化と設定

API Discoveryを使い始めるには、[API Discoveryのセットアップ](setup.md)に従って有効化と設定を行ってください。