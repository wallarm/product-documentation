# Wallarmプラットフォームの使い始め方

WallarmはオールインワンのAPIセキュリティを提供し、あなたのAPIを脆弱性や悪意のある活動から特定し保護します。プラットフォームの利用開始を支援するために、サインアップ前の探索用Playground、登録時のFree tier、そして専門家のサポートへのアクセスを提供します。

## PlaygroundでWallarmを学ぶ

サインアップや環境へのコンポーネントのデプロイを行う前に、Wallarmを体験するには[Wallarm Playground](https://playground.wallarm.com/?utm_source=wallarm_docs_quickstart)をご利用ください。

Playgroundでは、実際のデータが満載されたかのようにWallarm Consoleのビューにアクセスできます。Wallarm Consoleは、処理されたトラフィックのデータを表示しプラットフォームの微調整を可能にする主要なコンポーネントです。したがって、Playgroundを用いることで、製品の動作方法を学び、実際に試すことができ、読み取り専用モードで有用な使用例も得ることができます。

![Playground](../images/playground.png)

あなたのトラフィックに対してWallarmソリューションの機能を試すには、[Free tierアカウントを作成](#self-signup-and-free-tier)してください。

## セルフサインアップとFree tier

Wallarmにサインアップすると、Wallarm Consoleにアカウントが作成され、これがWallarmプラットフォームのナビゲーションおよび設定の中心となります。Console UIは[Wallarm Cloud](../about-wallarm/overview.md#cloud)上にホストされています。

Wallarmは、データベース、APIエンドポイント、クライアントアカウントなどが異なる、アメリカおよびヨーロッパのクラウドインスタンスをそれぞれ管理します。したがって、最初のステップは利用するクラウドを選択することです。

1. Wallarm Cloudを選んでください:
    
    || US Cloud | EU Cloud |
    | -- | -------- | -------- |
    | **サインアップリンク** | https://us1.my.wallarm.com/signup | https://my.wallarm.com/signup |
    | **所在地** | USA | Netherlands |
    | **Wallarm Console URL** | https://us1.my.wallarm.com/ | https://my.wallarm.com/ |
    | **Wallarm API Endpoint** | `https://us1.api.wallarm.com/` | `https://api.wallarm.com/` |
1. [US](https://us1.my.wallarm.com/signup)または[EU](https://my.wallarm.com/signup)のWallarm Cloudの登録リンクに従い、個人情報を入力してください。
1. メールで送信された確認メッセージ内のリンクに従い、アカウントを確認してください。

アカウントの登録と確認が完了すると、月50万リクエストまで無料でWallarmソリューションの機能を試すことができる**Free tier**が自動的に割り当てられます。

次に、[最初のWallarmフィルタリングノード](#start-securing-your-traffic)のデプロイを行ってください。

## デプロイ不要でAPIを把握する

組織外部のAPIの全リストを把握することは、監視されていないまたはドキュメント化されていないAPIが悪意ある攻撃の潜在的な入り口となり得るため、潜在的なセキュリティリスクの軽減に向けた第一歩です。

Wallarmの[API Attack Surface Management (AASM)](../api-attack-surface/overview.md)に登録することで、外部ホストとそのAPIを即座に発見し、以下の情報を得ることができます：

* 外部ホストの一覧。
* ホストの保護スコア - Wallarmは検出されたサブドメインやホストに対し、WebおよびAPIサービスの攻撃耐性を自動でテストし、保護レベルを評価します。
* ホストの漏洩した認証情報 - Wallarmは選択したドメインおよび公開ソースを積極的にスキャンし、認証情報（APIトークン、キー、パスワード、クライアントシークレット、ユーザー名、メールアドレス等）の漏洩を検出します。

Wallarmのコンポーネントに登録するだけで、これらすべての情報を取得できます。情報取得のために、何もデプロイする必要はありません。

開始するには、以下のいずれかを実行してください：

* [sales@wallarm.com](mailto:sales@wallarm.com)に連絡してください。または
* Wallarm公式サイト[here](https://www.wallarm.com/product/aasm)で料金情報を確認し、AASMを有効化してください。

## ガイド付きトライアル

当社のSales Engineerチームがオンボーディング全体をサポートするガイド付きトライアルを選択することができます。2週間にわたり製品の価値を実演し、Wallarmフィルタリングインスタンスのデプロイによってトラフィックのフィルタリングを支援します。

このトライアルを希望する場合は、[sales@wallarm.com](mailto:sales@wallarm.com?subject=Request%20for%20a%20Guided%20Wallarm%20Trial&body=Hello%20Wallarm%20Sales%20Engineer%20Team%2C%0A%0AI'm%20writing%20to%20request%20a%20guided%20Wallarm%20trial.%20I%20would%20be%20happy%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20my%20requirements%20in%20detail.%0A%0AThank%20you%20for%20your%20time%20and%20assistance.)にメールしてください。

## トラフィックの保護を開始する

Wallarmアカウント作成後の次のステップは、[Wallarmフィルタリングノード](../about-wallarm/overview.md#filtering-node)のデプロイを開始することです。この重要なコンポーネントは、あなたの受信トラフィックを処理およびフィルタリングし、Wallarmのトラフィック解析、攻撃防止、および脆弱性検出機能を実現します。

[Wallarmノードのデプロイオプションを選択する](../installation/supported-deployment-options.md)