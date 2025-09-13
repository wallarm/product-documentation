# Security Edge Free Tier

[Security Edge](overview.md)のFree Tierにより、Wallarmプラットフォームを評価し、自身でWallarm Nodeをホスティングすることなく、月あたり**500,000リクエストまで - 無料**で保護できます。

Security Edge Free Tierでは、[Advanced API Security](../../about-wallarm/subscription-plans.md#core-subscription-plans)としてWallarmプラットフォームにアクセスでき、ほとんどの機能を利用できますが、いくつかの[制限事項](#limitations)があります。

## はじめに

Security Edge Free Tierの利用を開始するには、**[US](https://us1.my.wallarm.com/signup/?utm_source=wallarm_docs&utm_campaign=se_free_tier_guide)または[EU Cloud](https://my.wallarm.com/signup/?utm_source=wallarm_docs&utm_campaign=se_free_tier_guide)のいずれかでWallarmにサインアップします。**

自動的にFree Tierに割り当てられ、**Quick setup wizard**にリダイレクトされます。

Security Edgeのデプロイがユースケースに合わない場合は、代替案についてsales@wallarm.comまでお問い合わせください。

## Quick setup wizard

このウィザードは、Security Edgeの基本的な[Inline](inline/overview.md)または[Connector](se-connector.md)デプロイを案内します。

Edge Nodeは**monitoring** [mode](../../admin-en/configure-wallarm-mode.md)で開始されるため、リクエストはブロックされません。

=== "Security Edge Inline"
    1. デプロイ先のリージョンを選択します。
    1. パブリックホスト（ユーザーが接続するドメイン）を指定します。
    1. 解析済みトラフィックの転送先となるオリジンを定義します。

        オリジンに複数のサーバーがある場合は、すべて指定できます。Edge Nodeは[ラウンドロビン](https://en.wikipedia.org/wiki/Round-robin_DNS)方式のロードバランシングでそれらにトラフィックを転送します。

        ループを回避するため、オリジンはホストと異なる必要があります。
    1. ドメイン所有権を確認するため、提示された**Certificate CNAME**レコードをDNSゾーンに追加します。
    1. ルーティングを完了するため、ホストのDNSを提示された**Traffic CNAME**に向けます。

        Certificate CNAMEの検証が完了すると、Traffic CNAMEが提供されます。

    ![](../../images/waf-installation/security-edge/inline/quick-setup-wizard-inline.png)
=== "Security Edge Connector"
    1. デプロイ先のリージョンを選択します。
    1. 提供されたNode URL（Connectorのエントリポイント）をコピーします。
    1. 対象プラットフォーム用のコードバンドルをダウンロードします。
    1. 以下の手順に従って、API管理プラットフォームにバンドルを適用します。

        * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
        * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
        * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
        * [IBM DataPower](../connectors/ibm-api-connect.md#2-obtain-and-apply-the-wallarm-policies-to-apis-in-ibm-api-connect)

    ![](../../images/waf-installation/security-edge/inline/quick-setup-wizard-connector.png)

セットアップ後、テスト攻撃が自動的にEdge Nodeに送信されます。検出されると、Free Tierの全機能を備えたWallarm Consoleにアクセスできるようになります。この攻撃は[**Attacks**](../../user-guides/events/check-attack.md)セクションに表示されます。

オンボーディングにチームメイトを招待することもできます。彼らには**Administrator**の[role](../../user-guides/settings/users.md#user-roles)が割り当てられ、招待リンクがメールで届きます。

後で、Security Edgeセクションの**Quick setup**または/onboardingから、このウィザードを再度開くことができます。

## 制限事項

完全なSecurity Edgeの構成フローと比べて、**Quick setup**ウィザードには次の制限があります。

* ホストの詳細設定はサポートされません（filtration modes、Wallarm applications、NGINX directives）
* Security Edge Inline:

    * ホストでApexドメインはサポートされません
    * オリジンは1つのみ追加できます
    * オリジンがCloudflareのようなプロキシの背後にある場合などでも、[ドメイン所有権の確認](inline/deployment.md#3-certificates)をスキップできません
    * [ホストのリダイレクト](inline/host-redirection.md)はサポートされません
    * [カスタムブロックページ](inline/custom-block-page.md)
    * [NGINXオーバーライド](inline/nginx-overrides.md)
    * [相互TLS](inline/mtls.md)の構成は利用できません

Quick setupか完全な構成フローかにかかわらず、Free Tierでは利用できない機能があります。

* [脆弱性評価](../../user-guides/vulnerabilities.md)
* [API Abuse Prevention](../../api-abuse-prevention/overview.md)
* Security EdgeのTelemetry portal
* Microsoft Azureへのデプロイ
* マルチクラウドおよびマルチリージョンでのSecurity Edge Inlineのデプロイ

## 次のステップ

* [Security Edge Inline: 完全な構成フロー](inline/deployment.md)
* [Security Edge Connector: 完全な構成フロー](se-connector.md)