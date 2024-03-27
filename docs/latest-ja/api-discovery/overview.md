# API Discovery の概要 <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm プラットフォームの **API Discovery** モジュールは、実際の API 使用状況に基づいてアプリケーション REST API のインベントリを構築します。このモジュールは、実際のトラフィックリクエストを継続的に分析し、分析結果に基づいて API インベントリを構築します。

構築された API インベントリには、以下の要素が含まれます：

* API エンドポイント
* リクエスト方法（GET、POST など）
* 必須およびオプションの GET、POST、およびヘッダーパラメーター、これには以下が含まれます：
    * 各パラメーターで送信されるデータの[タイプ/フォーマット](./exploring.md#parameter-format-and-data-type)
    * パラメーター情報が最後に更新された日時

![API Discovery によって発見されたエンドポイント](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

## API Discovery が対処する問題

**実際の完全な API インベントリの構築**は、API Discovery モジュールが対処する主要な問題です。

API インベントリを最新の状態に保つことは難しい課題です。異なる API を使用する複数のチームがあり、API ドキュメントを作成するために異なるツールやプロセスが使用されるのが一般的です。その結果、企業は自身が持っている API や公開しているデータを理解すること、および最新の API ドキュメントを持つことに苦労しています。

API Discovery モジュールが実際のトラフィックをデータソースとして使用しているため、実際にリクエストを処理するすべてのエンドポイントを API インベントリに含めることにより、最新で完全な API ドキュメントを得るのに役立ちます。

**Wallarm によって API インベントリが発見された場合、あなたは**：

* [外部および内部](exploring.md#distinguish-external-and-internal-apis) API のリストを含む、API エステート全体に完全な可視性を持つことができます。
* [API に入っていくデータ](exploring.md#viewing-endpoint-parameters)を確認できます。
* 開いている脆弱性を持つエンドポイントのリストを取得できます。
* 任意の API エンドポイントについて、過去 7 日間に発生した脅威のリストを取得できます。
* 攻撃された API のみをフィルタリングし、ヒット数でそれらを並べ替えることができます。
* [機密データ](#sensitive-data-detection)を消費および運搬する API をフィルタリングできます。
* 便利な[ダッシュボード](dashboard.md)上で、API インベントリの構造と問題の視覚的な要約を表示できます。
* どのエンドポイントが攻撃の対象となる[可能性が最も高いか](risk-score.md)を理解できます。
* [シャドー、孤児、ゾンビ API](rogue-api.md)を見つけることができます。
* 選択した期間内に API で発生した[変更を追跡](track-changes.md)できます。
* [BOLA 自動保護状態](bola-protection.md)によって API エンドポイントをフィルタリングできます。
* 開発者に構築された API インベントリのレビューとダウンロードへの[アクセス](../user-guides/settings/users.md#user-roles)を提供できます。

## API Discovery の仕組み

API Discovery はリクエスト統計を基にしており、実際の API 使用状況に基づいて最新の API 仕様を生成するために高度なアルゴリズムを使用しています。

### トラフィック処理

API Discovery は、ローカルおよびクラウドで分析を行うハイブリッドアプローチを使用しています。このアプローチにより、リクエストデータと機密データがローカルに保持される一方で、統計分析のためにクラウドのパワーを使用する[プライバシー第一のプロセス](#security-of-data-uploaded-to-the-wallarm-cloud)が実現されます：

1. API Discovery は、リクエストが行われたエンドポイントと渡されたパラメーターをローカルで分析します。Wallarm は、エンドポイントと渡されたパラメーターを分析します。
1. このデータに基づいて、統計が作成され、クラウドに送信されます。
1. Wallarm Cloud は受信した統計を集約し、その基礎となる [API 説明](exploring.md) を構築します。

    !!! info "ノイズ検出"
        稀または単一のリクエストは[ノイズとして判断され](#noise-detection)、API インベントリに含まれません。

### ノイズ検出

API Discovery モジュールは、2つの主要なトラフィックパラメーターに基づいてノイズ検出を行います：

* エンドポイントの安定性 - 最初のリクエストの瞬間からの 5 分以内に、少なくとも 5 件のリクエストが記録されている必要があります。
* パラメータの安定性 - エンドポイントへのリクエストにおけるパラメータの出現は 1 パーセント以上でなければなりません。

API インベントリは、これらの制限を超えたエンドポイントとパラメータを表示します。完全な API インベントリを構築するために必要な時間は、トラフィックの多様性と強度によって異なります。

また、API Discovery は他の基準に依存してリクエストのフィルタリングを行います：

* サーバーが 2xx 範囲で応答したリクエストのみが処理されます。
* REST API の設計原則に準拠していないリクエストは処理されません。これは、レスポンスの `Content-Type` ヘッダーパラメーターを制御することによって行われます：`Content-Type` パラメーターがタイプとして `application` を、サブタイプとして `json` を含んでいない場合、そのようなリクエストは非 REST API と見なされ、フィルタリングされます。REST API レスポンスの例： `Content-Type: application/json;charset=utf-8`。パラメーターが存在しない場合、API Discovery はリクエストを分析します。
* `Accept` などの標準フィールドは破棄されます。

### 機密データの検出

API Discovery は、API が消費および運搬する機密データを検出し、強調表示します：

* IP アドレスや MAC アドレスなどの技術データ
* シークレットキーやパスワードなどのログイン資格情報
* 銀行カード番号などの財務データ
* 医療ライセンス番号などの医療データ
* 氏名、パスポート番号、SSN などの個人を特定できる情報 (PII)

### Wallarm Cloud にアップロードされるデータのセキュリティ

API Discovery はほとんどのトラフィックをローカルで分析します。このモジュールは、発見されたエンドポイント、パラメータ名、および様々な統計データ（到着時間、その数など）のみを Wallarm Cloud に送信します。すべてのデータは安全なチャネルを介して送信されます：Wallarm Cloud に統計をアップロードする前に、API Discovery モジュールはリクエストパラメーターの値を [SHA-256](https://en.wikipedia.org/wiki/SHA-2) アルゴリズムを使用してハッシュ化します。

クラウド側では、ハッシュ化されたデータは統計分析に使用されます（例えば、同一パラメーターを持つリクエストの数量を計測する場合）。

他のデータ（エンドポイントの値、リクエストメソッド、およびパラメーター名）は、Wallarm Cloud にアップロードされる前にハッシュ化されず、ハッシュは元の状態に復元できないため、API インベントリの構築が不可能になるからです。

!!! warning "重要"
    Wallarm は、パラメーターで指定された値を Cloud に送信しません。エンドポイント、パラメーター名、およびそれらの統計のみが送信されます。

## API Discovery デモビデオ

API Discovery デモビデオをご覧ください：

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/0bRHVtpWkJ8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Playground での API Discovery のチェック

ノードを環境にデプロイしてサインアップする前にモジュールを試すには、[Wallarm Playground の API Discovery](https://my.us1.wallarm.com/playground?utm_source=wallarm_docs_apidja) を探索してください。

Playground では、API Discovery ビューに実際のデータが記入されたようにアクセスできるため、モジュールの動作を学び、試すことができ、読み取り専用モードでの使用例をいくつか得ることができます。

![API Discovery – サンプルデータ](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

## API Discovery の有効化と設定

API Discovery の使用を開始するには、[API Discovery のセットアップ](setup.md) で説明されているように、それを有効化して設定してください。