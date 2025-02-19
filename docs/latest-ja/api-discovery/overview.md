# API Discoveryの概要 <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

WallarmプラットフォームのAPI Discoveryモジュールは、実際のAPI利用に基づいてアプリケーションREST APIのインベントリを構築します。このモジュールは実際のトラフィックリクエストを継続的に解析し、解析結果に基づいてAPIインベントリを生成します。

構築されたAPIインベントリには、以下の要素が含まれます：

* APIエンドポイント
* リクエストメソッド（GET、POSTなど）
* リクエストおよびレスポンスの必須および任意のGET、POST、ヘッダパラメータ：
    * 各パラメータで送信されるデータの[型/フォーマット](./exploring.md#format-and-data-type)
    * パラメータ情報が最後に更新された日時

!!! info "レスポンスパラメータの利用可能性"
    レスポンスパラメータはノード4.10.1以上を使用時のみ利用可能です。

<div>
    <script src="https://js.storylane.io/js/v1/storylane.js"></script>
    <div class="sl-embed" style="position:relative;padding-bottom:calc(60.95% + 27px);width:100%;height:0;transform:scale(1)">
        <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/cgqrxqwhmgyp" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
    </div>
</div>

## API Discoveryで解決される課題

実際に使用される完全なAPIインベントリの構築は、API Discoveryモジュールが解決する主な課題です。

APIインベントリを常に最新の状態に保つことは困難な作業です。複数のチームが異なるAPIを利用しており、異なるツールやプロセスを用いてAPIドキュメントを生成する場合が多々あります。そのため、企業は自身のAPIが何であるか、どのデータを公開しているか、最新のAPIドキュメントを維持することに苦労します。

API Discoveryモジュールは実際のトラフィックをデータソースとして使用するため、実際にリクエストを処理しているすべてのエンドポイントをAPIインベントリに含めることで、最新かつ完全なAPIドキュメントの構築に貢献します。

WallarmでAPIインベントリが検出されると、以下が可能になります：

* [external and internal](exploring.md#external-vs-internal) APIのリストを含む、全API資産の完全な可視性を確保できます。
* APIの出入りする[データ](exploring.md#endpoint-details)を確認できます。
* 脆弱性が開かれているエンドポイントのリストを取得できます。
* 任意のAPIエンドポイントごとに過去7日間に発生した脅威のリストを取得できます。
* 攻撃を受けたAPIのみをフィルタリングし、ヒット数で並べ替え可能です。
* [sensitive data](#sensitive-data-detection)を消費・運搬しているAPIをフィルタリングできます。
* 便利な[dashboard](dashboard.md)上でAPIインベントリの構造や問題点を視覚的に確認できます。
* 攻撃対象となる可能性が[最も高い](risk-score.md)エンドポイントを把握できます。
* [shadow, orphan and zombie APIs](rogue-api.md)を検出できます。
* 選択された期間内に発生したAPIの[変更](track-changes.md)を追跡できます。
* [BOLA auto protection state](bola-protection.md)でAPIエンドポイントをフィルタリングできます。
* 開発者に対して、構築済のAPIインベントリの閲覧およびダウンロードの[アクセス](../user-guides/settings/users.md#user-roles)を提供できます。

## API Discoveryはどのように動作しますか？

API Discoveryはリクエスト統計に依存し、実際のAPI利用に基づいて最新のAPI仕様書を生成するための高度なアルゴリズムを使用します。

### トラフィック処理

API Discoveryは、ローカルとCloudのハイブリッドアプローチを使用して解析を実施します。このアプローチにより、リクエストデータや機密データをローカルに保持しながら、統計解析にはCloudのパワーを利用する[プライバシー重視のプロセス](#security-of-data-uploaded-to-the-wallarm-cloud)が可能になります：

1. API Discoveryは正当なトラフィックをローカルで解析します。Wallarmはリクエストが送信されるエンドポイントおよび受け渡されるパラメータを解析します。
1. これらのデータに基づいて統計情報が作成され、Cloudに送信されます。
1. Wallarm Cloudは受信した統計情報を集約し、その情報に基づいて[API記述](exploring.md)を構築します。

    !!! info "ノイズ検出"
        まれなリクエストや単発のリクエストは[ノイズと判断](#noise-detection)され、APIインベントリには含まれません。

### ノイズ検出

API Discoveryモジュールは、以下の2つの主要なトラフィックパラメータに基づいてノイズ検出を実施します：

* エンドポイント安定性 - エンドポイントへの最初のリクエスト発生から5分以内に少なくとも5回のリクエストが記録される必要があります。
* パラメータ安定性 - エンドポイントへのリクエストでそのパラメータが出現する頻度が1パーセント以上である必要があります。

これらの基準を超えたエンドポイントやパラメータがAPIインベントリに表示されます。完全なAPIインベントリの構築に必要な時間は、トラフィックの多様性と強度に依存します。

また、API Discoveryは、以下の他の基準に基づいてリクエストのフィルタリングを実施します：

* サーバーが2xxレンジで応答したリクエストのみが処理されます。
* REST APIの設計原則に準拠していないリクエストは処理されません。
    
    これはレスポンスの`Content-Type`ヘッダを制御することで実施されます：`Content-Type: application/json;charset=utf-8`のように`application/json`を含まない場合、そのリクエストはREST APIではないと判断され、解析されません。
    
    ヘッダが存在しない場合は、API Discoveryがリクエストを解析します。

* `Accept`などの標準フィールドは破棄されます。

### 機密データの検出

API Discoveryは、APIによって使用・運搬される機密データを[検出および強調表示](sensitive-data.md)します：

* IPアドレスやMACアドレスなどの技術データ
* シークレットキーやパスワードなどのログイン認証情報
* 銀行カード番号などの金融データ
* 医療免許番号などの医療データ
* 氏名、パスポート番号、SSNなどの個人識別情報(PII)

API Discoveryは検出プロセスの設定および独自の機密データパターンの追加が可能です（NGINX Node 5.0.3またはNative Node 0.7.0以上が必要です）。

### センシティブビジネスフロー

[センシティブビジネスフロー](sbf.md)機能により、API Discoveryは認証、アカウント管理、請求など、特定のビジネスフローや機能にとって重要なエンドポイントを自動的に識別できます。

自動識別に加えて、割り当てられたセンシティブビジネスフロータグを手動で調整したり、任意のエンドポイントに対してタグを手動で設定することも可能です。

エンドポイントにセンシティブビジネスフロータグが割り当てられると、特定のビジネスフローでフィルタリングすることで、最も重要なビジネス機能の保護が容易になります。

![API Discovery - センシティブビジネスフローによるフィルタリング](../images/about-wallarm-waf/api-discovery/api-discovery-sbf-filter.png)

### Wallarm Cloudにアップロードされたデータのセキュリティ

API Discoveryはトラフィックの大部分をローカルで解析します。モジュールがWallarm Cloudに送信するのは、検出されたエンドポイント、パラメータ名、及び各種統計情報（到着時刻、件数など）のみです。すべてのデータは安全なチャネルを経由して送信されます。統計情報をWallarm Cloudにアップロードする前に、API Discoveryモジュールはリクエストパラメータの値を[SHA-256](https://en.wikipedia.org/wiki/SHA-2)アルゴリズムを用いてハッシュ化します。

Cloud側では、ハッシュ化されたデータが統計解析に使用されます（たとえば、同一パラメータのリクエスト数の算出時など）。

エンドポイントの値、リクエストメソッド、パラメータ名などの他のデータは、APIインベントリの構築を可能にするため、Wallarm Cloudにアップロードする前にハッシュ化されません。

!!! warning "重要"
    Wallarmはパラメータに指定された値をCloudに送信しません。送信されるのは、エンドポイント、パラメータ名、およびそれらに関する統計情報のみです。

## API Discoveryデモ動画

API Discoveryのデモ動画をご覧ください：

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/0bRHVtpWkJ8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## PlaygroundでのAPI Discoveryの確認

サインアップやノードの環境への展開前にモジュールを試用するには、[Wallarm PlaygroundのAPI Discovery](https://playground.wallarm.com/api-discovery/?utm_source=wallarm_docs_apid)をお試しください。

Playgroundでは、実際のデータで構成されたAPI Discoveryビューにアクセスでき、モジュールの動作を理解し、読み取り専用モードでその使用例を試すことができます。

![API Discovery – サンプルデータ](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

## API Discoveryの有効化と構成

API Discoveryの使用を開始するには、[API Discovery Setup](setup.md)に記載された手順の通りに有効化および構成してください。