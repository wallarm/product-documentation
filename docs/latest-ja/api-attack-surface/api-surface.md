[link-aasm-security-issue-risk-level]:  security-issues.md#issue-risk-level
[link-integrations-intro]:              ../user-guides/settings/integrations/integrations-intro.md
[link-integrations-email]:              ../user-guides/settings/integrations/email.md#setting-up-integration

# API Attack Surface Discovery <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Wallarmの[API Attack Surface Management](overview.md)の**API Attack Surface Discovery**（**AASD**）コンポーネントは、選択したドメインをスキャンして外部ホストとそのAPIをすべて発見し、WebおよびAPIベースの攻撃に対する保護状況を評価し、不足しているWAF/WAAPソリューションを特定します。Wallarmでサブスクライブするだけで利用でき、デプロイは不要です。本記事ではこのコンポーネントの概要を説明します。

![API Attack Surface Discovery](../images/api-attack-surface/aasm-api-surface.png)

## 対応する課題

### 提供機能

監視されていない、またはドキュメント化されていないAPIは悪意ある攻撃の侵入経路になり得るため、組織の外部APIの全リストを把握することが潜在的なセキュリティリスクを軽減する第一歩です。

**API Attack Surface Discovery**コンポーネントは、次の機能を提供することでこれらの課題の解決を支援します。

* [選択したドメイン](setup.md)の外部ホストの自動検出。
* 検出された各ホストの開放ポートの自動検出。
* 検出された各ホストのAPIの自動検出。

    検出可能な**APIタイプ**（プロトコル）は、JSON-API, GraphQL, XML-RPC, JSON-RPC, OData, gRPC, WebSocket, SOAP, WebDav, HTML WEBです。

    HTML WEB — ブラウザでの人による閲覧を想定したHTMLのWebページです。静的なHTMLのWebページの場合もあれば、アプリケーションの単一HTMLページであり、そのページからAPIにアクセスする場合もあります。

* 検出されたホストの[security posture](#security-posture)の自動評価。
* APIサーフェス全体の総合WAAPスコア。
* セキュリティベンダー、データセンター、ロケーション別のアセット集計。

    1つのホストに複数のIPアドレスが割り当てられている場合があるため、データセンターおよび地理的ロケーション別のアセット統計はホスト単位ではなくIPアドレス単位で評価します。CDNを使用している場合、アセットのロケーションは実態を正確に反映しないことがあります。

* 検出されたホストのセキュリティ課題の自動検出。

これらはすべてWallarmで当該コンポーネントをサブスクライブするだけで利用でき、デプロイは一切不要で、分析済みデータをすぐに確認できます。

### 旧Scannerの置き換え

API Attack Surface Discovery（AASD）の機能は旧来のWallarm Scannerの全機能を網羅しており、[Security Issues](security-issues.md)と組み合わせることでさらに多くの価値を提供するため、2025年5月7日以降、Scannerは無効化されます。

![旧Scanner](../images/user-guides/scanner/check-scope.png)

旧Scannerの無効化には次が含まれます:

* 旧Scannerを使用していたすべてのお客様にAASDへのアクセスを提供します
* 旧Scannerのすべての設定をAASDへ移行します（Wallarmサポートが実施します）
* AASDによるホストとAPIの自動再検出と、それらに関する拡張データの提示
* ホストおよびAPIに対するセキュリティ課題の自動検出
* 2025年5月7日以前に旧Scannerが検出した脆弱性は、[data retention policy](../about-wallarm/data-retention-policy.md)に従い、引き続きVulnerabilitiesセクションに表示されます

## 検出されたホストのデータ

ドメインのホストが検出されると、Wallarm ConsoleでAPI Attack Surfaceセクションに移動します。リストのホストをクリックすると、次を確認できます: 

* ホストで検出された開放ポート
* ホストで検出されたAPI
* ホストの[評価済み](#security-posture)WAAPスコアの詳細

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(60.65% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/dqmlj6dzflgq?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## Security posture

Wallarmは外部ネットワーク境界のセキュリティ態勢を自動評価し、その状態を0（最低）から100（最高）の保護レベルで表す**Total score**として表示します。

![APIサーフェス - 保護スコア](../images/api-attack-surface/aasm-api-surface-protection-score.png)

Total scoreは、以下を組み合わせた複合的な独自アルゴリズムにより算出します。

* **WAAP coverage score**は、WAF/WAAPソリューションによる外部WebおよびAPIサービスのカバレッジを表します。WAF/WAAPで保護されているHTTP/HTTPSポートの割合として算出します。
* **Average WAAP score**は、外部ホストのWebおよびAPI攻撃に対する耐性を表します。AASMがブロッキングモードの有効なWAAPソリューションを特定し、かつエラーなくWAAPスコアを評価できたすべてのホストの平均として算出します。

    特定エンドポイントのWAAPスコアはWallarmによるテスト結果であり、次の式で算出します:

    ```
    ((AppSec + FalsePositive) / 2 + APISec) / 2
    ```

    * `AppSec` - SQLインジェクション、XSS、コマンドインジェクションなどのWeb攻撃に対する耐性。
    * `APISec` - GraphQL、SOAP、gRPCなどのプロトコルを対象としたAPI攻撃に対する耐性。
    * `FalsePositive` - 正当なリクエストを脅威と誤判定せずに正確に許可できる能力。

    各ホストについて、詳細なWAAPスコア評価レポートをPDF形式でダウンロードできます。

* **追加メトリクス**（TLSカバレッジ、セキュリティ課題の有無、検出されたセキュリティ課題など）。

## API Attack Surfaceレポート

選択したドメインで検出された外部ホストとそのAPIに関する詳細なDOCXレポートを取得できます。このレポートには、これらのAPIで検出された[セキュリティ課題](security-issues.md)について、任意に選択した情報も含められます。

加えて、APIサーフェスの情報を表形式（CSV）で取得でき、次の単位で整理されています:

* ホスト（1ホストにつき1行）
* ポート（1ポートにつき1行）
* API（1 APIにつき1行）

![APIサーフェス - レポート](../images/api-attack-surface/aasm-reports.png)

もう1つの選択肢として、機械可読形式のJSONレポートでAPIサーフェス情報を取得できます。

セキュリティ課題については、[個別のレポート](security-issues.md#security-issue-reports)も取得できます。

## 通知

--8<-- "../include/api-attack-surface/aasm-notifications.md"