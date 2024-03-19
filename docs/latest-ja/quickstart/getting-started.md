# Wallarm プラットフォームの利用開始

Wallarmは、APIの脆弱性や悪意のある活動からAPIを特定して保護する、オールインワンのAPIセキュリティを提供します。プラットフォームの利用を開始するために、登録前の探索のためのPlayground、登録時の無料プラン、そしてスムーズな体験のための専門家によるサポートへのアクセスを提供します。

## PlaygroundでWallarmを学ぶ

サインアップして環境にコンポーネントをデプロイする前に、Wallarmを探索するために[Wallarm Playground](https://my.us1.wallarm.com/playground)を利用してください。

Playgroundでは、Wallarmコンソールビューにアクセスできます。これは、実際のデータで埋め尽くされたようなものです。Wallarmコンソールは、処理されたトラフィックに関するデータを表示し、プラットフォームの微調整を可能にする、主要なWallarmプラットフォームコンポーネントです。したがって、Playgroundを使用すると、製品の動作方法を学び、試すことができ、読み取り専用モードでその使用方法の役立つ例をいくつか得ることができます。

![Playground](../images/playground.png)

お使いのトラフィック上でWallarmソリューションの機能を試すには、[無料アカウントを作成](#self-signup-and-free-tier)してください。

## セルフサインアップと無料プラン

Wallarmにサインアップすると、Wallarmプラットフォームをナビゲートして設定するための中心的なハブとして機能するWallarmコンソールのアカウントを作成します。コンソールUIは[Wallarm Cloud](../about-wallarm/overview.md#cloud)にホスティングされています。

Wallarmは、データベース、APIエンドポイント、クライアントアカウントなど、異なるアメリカとヨーロッパのクラウドインスタンスを管理しています。したがって、最初のステップは、使用したいクラウドを選択することです。

1. Wallarmクラウドを選択してください：

    || US クラウド | EU クラウド |
    | -- | -------- | -------- |
    | **サインアップリンク** | https://us1.my.wallarm.com/signup | https://my.wallarm.com/signup |
    | **物理的な場所** | アメリカ | オランダ |
    | **WallarmコンソールURL** | https://us1.my.wallarm.com/ | https://my.wallarm.com/ |
    | **Wallarm API エンドポイント** | `https://us1.api.wallarm.com/` | `https://api.wallarm.com/` |
1. [US](https://us1.my.wallarm.com/signup)または[EU](https://my.wallarm.com/signup)のWallarmクラウドの登録リンクに従い、個人情報を入力してください。
1. あなたのメールに送られた確認メッセージからリンクに従って、アカウントを確認してください。

アカウントが登録され、確認されたら、自動的に**無料プラン**または**無料トライアル**が、使用されているWallarmクラウドに応じて割り当てられます。

USクラウドでは、無料プランを使用して月間50万リクエストに対してWallarmソリューションのパワーを無料で探ることができます。

EUクラウドでは、14日間のトライアル期間があり、その間に無料でWallarmソリューションを探ることができます。

[最初のWallarmフィルタリングノード](#start-securing-your-traffic)をデプロイすることによって続行してください。

## ガイド付きトライアル

当社のセールスエンジニアチームが、オンボーディングプロセス全体を通してサポートするガイド付きトライアルを選択できます。彼らは、2週間の期間中に製品の価値をデモンストレーションし、あなたのトラフィックをフィルタリングするためのWallarmフィルタリングインスタンスをデプロイするお手伝いをします。

このトライアルをリクエストするには、[sales@wallarm.com](mailto:sales@wallarm.com?subject=Request%20for%20a%20Guided%20Wallarm%20Trial&body=Hello%20Wallarm%20Sales%20Engineer%20Team%2C%0A%0AI'm%20writing%20to%20request%20a%20guided%20Wallarm%20trial.%20I%20would%20be%20happy%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20my%20requirements%20in%20detail.%0A%0AThank%20you%20for%20your%20time%20and%20assistance.)へメールをお送りください。

## トラフィックの保護を開始する

Wallarmアカウントを作成した後、次のステップは[Wallarmフィルタリングノード](../about-wallarm/overview.md#filtering-node)のデプロイを開始することです。この必須コンポーネントは、あなたの受信トラフィックを処理しフィルタリングし、Wallarmのトラフィック分析、攻撃の防止、および脆弱性検出機能を可能にします。

[Wallarmノードのデプロイオプションを選択](../installation/supported-deployment-options.md)