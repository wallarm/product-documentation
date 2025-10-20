# Wallarmプラットフォームの始め方

WallarmはオールインワンのAPIセキュリティを提供し、APIの脆弱性や悪意ある行為を特定して保護します。プラットフォームの利用開始を支援するために、登録前に試せるPlayground、登録後に利用できるFree Tier、そして円滑な体験のためのエキスパートサポートをご用意しています。

## PlaygroundでWallarmを学ぶ

サインアップやお使いの環境へのコンポーネントのデプロイ前でもWallarmを確認できるように、[Wallarm Playground](https://tour.playground.wallarm.com/?utm_source=wallarm_docs_quickstart)をご利用ください。

Playgroundでは、実データが入っているかのようなWallarm Consoleのビューにアクセスできます。Wallarm Consoleは、処理されたトラフィックに関するデータを表示し、プラットフォームの細かなチューニングを可能にする、Wallarmプラットフォームの主要コンポーネントです。Playgroundを使えば、製品の動作を学んで試すことができ、読み取り専用モードでの有用な使用例も確認できます。

![Playground](../images/playground.png)

自社トラフィックでWallarmソリューションの機能を試すには、[Security Edge Free Tierアカウントを作成](#self-signup-and-security-edge-free-tier)してください。

## セルフサインアップとSecurity Edge Free Tier

Wallarmにサインアップすると、Wallarmプラットフォームのナビゲーションと設定の中枢となるWallarm Consoleにアカウントを作成します。Console UIは[Wallarm Cloud](../about-wallarm/overview.md#cloud)上でホストされています。

新規アカウントはすべて自動的に[Security Edge Free Tier](../about-wallarm/subscription-plans.md#security-edge-free-tier)に登録され、月あたり50万件のリクエストを無料で利用できます。

1. 使用するWallarm Cloudを選択してください:

    || US Cloud | EU Cloud |
    | -- | -------- | -------- |
    | **Signup link** | https://us1.my.wallarm.com/signup | https://my.wallarm.com/signup |
    | **Physical location** | USA | Netherlands |
    | **Wallarm Console URL** | https://us1.my.wallarm.com/ | https://my.wallarm.com/ |
    | **Wallarm API Endpoint** | `https://us1.api.wallarm.com/` | `https://api.wallarm.com/` |
1. サインアップリンクに進み、個人情報を入力してください。
1. 無料でトラフィック分析を開始するために、[Security Edge InlineまたはConnectors](../installation/security-edge/free-tier.md)を設定してください:

    ![!](../images/waf-installation/security-edge/onboarding-wizard.png)

## デプロイ不要でAPIを把握する

監視されていない、またはドキュメント化されていないAPIは悪意ある攻撃の侵入経路になり得るため、組織の外部APIの全リストを把握することが、潜在的なセキュリティリスクを軽減するための第一歩です。

Wallarmの[API Attack Surface Management (AASM)](../api-attack-surface/overview.md)を購読すると、外部ホストとそのAPIを即座に可視化でき、次の情報を得られます:

* 外部ホストの一覧。
* ホストの保護スコア - Wallarmが検出したサブドメイン/ホストに対して、WebおよびAPIサービスへの攻撃に対する耐性を自動テストし、保護レベルを評価します。
* ホストに関する漏えい認証情報 - 選択したドメインおよび公開ソースを対象に、認証情報（APIトークンやキー、パスワード、クライアントシークレット、ユーザー名、メールアドレスなど）の漏えいをWallarmが積極的にスキャンします。

これらは、Wallarm内の該当コンポーネントを購読するだけで利用できます。情報を取得するために、何かをデプロイする必要はありません。

開始するには、次のいずれかを実行してください:

* [sales@wallarm.com](mailto:sales@wallarm.com)に連絡する、または 
* 料金情報を確認し、Wallarmの公式サイト[こちら](https://www.wallarm.com/product/aasm)でAASMを有効化します。

## ガイド付きトライアル

オンボーディング全体を当社のセールスエンジニアチームが支援するガイド付きトライアルを選択できます。2週間にわたり製品の価値をご紹介し、トラフィックをフィルタリングするためのWallarm filtering instancesのデプロイを支援します。

このトライアルをご希望の場合は、[sales@wallarm.com](mailto:sales@wallarm.com?subject=Request%20for%20a%20Guided%20Wallarm%20Trial&body=Hello%20Wallarm%20Sales%20Engineer%20Team%2C%0A%0AI'm%20writing%20to%20request%20a%20guided%20Wallarm%20trial.%20I%20would%20be%20happy%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20my%20requirements%20in%20detail.%0A%0AThank%20you%20for%20your%20time%20and%20assistance.)までメールでご連絡ください。