# API Attack Surface Management  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Wallarmの**API Attack Surface Management**（**AASM**）は、APIエコシステムに特化したエージェントレスの検出ソリューションで、外部ホストとそのAPIを発見し、不足しているWAF/WAAPソリューションを特定し、APIリークやその他の脆弱性を軽減するように設計されています。

API Attack Surface Managementには次が含まれます:

* [API Attack Surface Discovery（AASD）](api-surface.md)
* [セキュリティ問題の検出](security-issues.md)

![AASM](../images/api-attack-surface/aasm.png)

## 仕組み

API Attack Surface Managementは、以下のセクションで説明する複数の自動化機能を提供します。

### ステップ1: 外部API攻撃対象領域のディスカバリー

* 外部ホストとそのAPI（CDN、IaaS、PaaSなどのホスティングプロバイダを含む）を[検出](api-surface.md)します。
* IP解決に基づいてジオロケーションとデータセンターを特定します。
* 組織が使用している可能性のあるAPIプロトコル（JSON-API、GraphQL、XML-RPC、JSON-RPC、OData、gRPC、WebSocket、SOAP、WebDav、HTML WEBなど）に関するインサイトを提供します。
* 意図せず公開されているプライベートなAPI仕様を明らかにします。
* 外部API攻撃対象領域の変化を継続的に監視し、開発やデプロイの過程で導入された新しいAPI、シャドーAPI、不正なエンドポイントを検出します。
* API攻撃対象領域の検出結果や変更について[通知](setup.md#notifications)します。

### ステップ2: WAFカバレッジのディスカバリーとテスト

* APIがWAF/WAAPで保護されているかどうかを[検出](api-surface.md)します。
* WAF/WAAPが検出するよう設定されている脅威の種類をテストします。
* 検出された各エンドポイントに対して[セキュリティスコア](api-surface.md#security-posture)を算出します。
* OWASP Top 10の脆弱性に対するルールの不足や、BOLAやクレデンシャルスタッフィングなど最新のAPI特有の脅威に対するカバレッジの欠如など、WAFの設定におけるギャップを特定して報告します。

### ステップ3: APIリークと脆弱性の自動検出

* 外部の攻撃対象領域の全体像が把握されると、検出されたアプリとAPIに関連する[APIリークと脆弱性の検出](security-issues.md)を開始します。
* 脆弱性を重大度で監視・分類し、誤設定、弱い暗号化、古い依存関係といった問題をカテゴライズして、対処の優先順位付けを効果的に行います。
* 見つかったリークや検出された脆弱性について[通知](setup.md#notifications)します。

## 検出される脆弱性の種類

API Attack Surface Managementは以下を検出します:

* GraphQLの誤設定
* 情報露出（デバッグデータ、設定ファイル、ログ、ソースコード、バックアップ）
* 機密性の高いAPIの露出（例: Prometheusのメトリクス、ステータスページ、システム/デバッグデータを公開するAPI）
* Path traversal、SQLi、SSRF、XSSなどの最も広く見られるケース
* リモート管理インターフェイスの露出（API Gatewayの管理インターフェイスを含む）
* データベース管理インターフェイスの露出
* SSL/TLSの誤設定
* API仕様の露出
* APIキー、PII（ユーザー名とパスワード）、認可トークン（Bearer/JWT）などを含むAPIリーク
* 古いソフトウェアバージョンとそれに対応するCVE
* 最も一般的なWebおよびAPI関連のCVE約2,000件

説明付きの全リストは[こちら](security-issues.md#list-of-detected-issues)にあります。

## 有効化とセットアップ

API Attack Surface Managementの使用を開始するには、API[Attack Surface Managementのセットアップ](setup.md)に従って有効化と設定を行います。