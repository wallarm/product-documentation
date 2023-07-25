# Wallarmプラットフォームの概要
Wallarmプラットフォームは、クラウドアプリケーションとAPIを保護するために最適なものです。そのハイブリッドアーキテクチャにより、次の機能を提供し、リソースを保護します。

* [超低偽陽性](protecting-against-attacks.ja.md)のハッカー攻撃対策
* [API乱用を行うボットに対する保護](api-abuse-prevention.ja.md)
* [API検出](api-discovery.ja.md)
* [脆弱性の自動検出](detecting-vulnerabilities.ja.md)

Wallarmには、以下の主要コンポーネントがあります。

* Wallarmフィルタリングノード
* Wallarm Cloud

## フィルタリングノード
Wallarmフィルタリングノードは、以下のような機能を提供します。

* 企業のネットワークトラフィック全体を分析し、悪意のあるリクエストを緩和します。
* ネットワークトラフィックのメトリックを収集し、それらをWallarm Cloudにアップロードします。
* Wallarm Cloudで定義したリソース固有のセキュリティルールをダウンロードし、トラフィック分析時に適用します。

Wallarmフィルタリングノードをネットワークインフラストラクチャに展開するには、[サポートされているデプロイオプション](../installation/supported-deployment-options.ja.md)のいずれかを使用します。

## Cloud
Wallarm Cloudは、以下のような機能を提供します。

* フィルタリングノードがアップロードしたメトリックを処理
* カスタムリソース固有のセキュリティルールをコンパイル
* 脆弱性を検出するために企業が公開しているアセットをスキャンします。
* トラフィックメトリックに基づいてAPI構造を構築する。

Wallarmは、[米国](#us-cloud)および[ヨーロッパ](#eu-cloud)のクラウドインスタンスを管理します。各Cloudは、データベース、APIエンドポイント、クライアントアカウントなど、完全に分離されています。1つのWallarm Cloudに登録されたクライアントは、最初のCloudに保存されたデータにアクセスまたは管理するために別のWallarm Cloudを使用することはできません。

同時に、両方のWallarm Cloudを使用することができます。この場合、Wallarm ConsoleおよびAPIエンドポイントで異なるアカウントを使用して、個々のCloudで情報にアクセスして管理する必要があります。

Wallarm Cloudのエンドポイントは、以下に示されています。

### 米国Cloud
米国に場所があります。

* Wallarmアカウントを作成するには https://us1.my.wallarm.com/
* APIメソッドを呼び出すには `https://us1.api.wallarm.com/`

### EU Cloud
オランダに場所があります。

* Wallarmアカウントを作成するには https://my.wallarm.com/
* APIメソッドを呼び出すには `https://api.wallarm.com/`