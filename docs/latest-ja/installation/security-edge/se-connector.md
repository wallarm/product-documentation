[se-connector-setup-img]:           ../../images/waf-installation/security-edge/connectors/setup-view.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-hosts-locations-img]: ../../images/waf-installation/security-edge/connectors/hosts-locations.png

# Security Edgeコネクタ <a href="../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

[**Security Edge**](overview.md)プラットフォームは、Wallarmがホスティングする環境内で地理的に分散したロケーションにWallarm Nodeをデプロイするためのマネージドサービスを提供します。主要なデプロイオプションの1つが[**コネクタ**](../connectors/overview.md)Nodeのデプロイで、オンサイトでのインストールは不要で、API全体を堅牢に保護します。

![!](../../images/waf-installation/security-edge/connectors/traffic-flow.png)

!!! info "サポート対象プラットフォーム"
    現在、EdgeコネクタはMuleSoft Mule Gateway、CloudFront、Cloudflare、Fastly、IBM DataPowerにのみ対応しています。

## 要件

* [Security Edgeサブスクリプション](../../about-wallarm/subscription-plans.md)（無料または有料）
* 次のいずれかのAPI管理プラットフォーム上で稼働しているAPI:

    * MuleSoft Mule Gateway
    * CloudFront
    * Cloudflare
    * Fastly
    * IBM DataPower

## Security Edgeコネクタの実行

Security Edgeコネクタを実行するには、Wallarm Console → **Security Edge** → **Connectors** → **Add connector**に移動します。このセクションが利用できない場合は、必要なサブスクリプションへのアクセスについてsales@wallarm.comまでご連絡ください。

Free Tierでは、[Quick setup](free-tier.md)でEdge Nodeをデプロイ後、**Security Edge**セクションから設定を調整できます。

### 1. コネクタ用Edge Nodeのデプロイ

指定が必要なのはコネクタの設定のみです。デプロイはWallarmが実施し、プラットフォームからのトラフィックをルーティングするためのエンドポイントを提供します。

1つのエンドポイントで複数の異なるホストからの接続を処理できます。

1. Wallarm Console → **Security Edge** → **Connectors** → **Add connector**に進みます。

    ![!][se-connector-setup-img]
1. Nodeのデプロイ設定を指定します:

    * **Regions**: コネクタ用のWallarm Nodeをデプロイするリージョンを1つ以上選択します。APIやアプリケーションがデプロイされている場所に近いリージョンを選択することを推奨します。複数リージョンを選択すると、いずれかのインスタンスが利用不可になった場合に負荷が分散され、ジオ冗長性が向上します。

        リージョンは**AWS**または**Azure**から選択できます。
    
    * **Filtration mode**: [トラフィック解析モード][filtration-mode-docs]。
    * **Application**: 全体のアプリケーションIDです。Wallarmでは、[Applications](../../user-guides/settings/applications.md)がインフラストラクチャの一部（例: ドメイン、ロケーション、インスタンス）の識別と整理に役立ちます。
    
        各Nodeには全体のアプリケーションIDが必要で、ロケーションやインスタンスごとに個別のIDを割り当てることも可能です。
    
    * **Allowed hosts**: Nodeが受け付けて解析するトラフィックのホストを指定します。

        指定したホストが存在しない、または到達できない場合は415エラーが返され、トラフィックは処理されません。
    
    * **Location configuration**: 必要に応じて、特定のホストやロケーションに一意のアプリケーションIDとトラフィック解析モードを割り当てます。

        ![!][se-connector-hosts-locations-img]
1. **Auto-update strategy**設定では、[Edge Nodeバージョン](../../updating-migrating/native-node/node-artifact-versions.md#all-in-one-installer)を選択し、必要に応じて[Auto update](#upgrading-the-edge-node)を有効化できます。バージョンを明示的に選択しない場合は、最新バージョンが自動的にデプロイされます。

    ![!](../../images/waf-installation/security-edge/connectors/autoupdate.png)
1. 保存後、Wallarmがコネクタ用のNodeをデプロイして設定を完了するまでに3〜5分かかります。

    デプロイ完了時、ステータスは**Pending**から**Active**に変わります。
1. 後でプラットフォームからトラフィックをルーティングするために必要になるので、Nodeのエンドポイントをコピーします。

![!](../../images/waf-installation/security-edge/connectors/copy-endpoint.png)

Nodeが**Active**のステータスの間は、いつでもEdge Nodeのデプロイ設定を変更できます。Nodeは再デプロイされ、ステータスは**Pending**から**Active**へと遷移します。エンドポイントは変わりませんが、再デプロイ中は利用できません。

### 2. APIを実行しているプラットフォームへのWallarmコードの組み込み

Edge Nodeをデプロイしたら、プラットフォームにWallarmコードを組み込み、デプロイ済みNodeへトラフィックをルーティングする必要があります。

1. Wallarm Console UIから、使用プラットフォーム用のコードバンドルをダウンロードします。

    ![!](../../images/waf-installation/security-edge/connectors/download-code-bundle.png)
1. 次の手順に従って、API管理プラットフォームにバンドルを適用します:

    * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
    * [IBM DataPower](../connectors/ibm-api-connect.md#2-obtain-and-apply-the-wallarm-policies-to-apis-in-ibm-api-connect)

## テレメトリポータル

Security Edgeコネクタ向けのテレメトリポータルは、Wallarmが処理したトラフィックのメトリクスをリアルタイムに可視化するGrafanaダッシュボードを提供します。

ダッシュボードには、総処理リクエスト数、RPS、検出・ブロックされた攻撃、デプロイ済みEdge Node数、リソース消費量、5xxレスポンス数などの主要なメトリクスが表示されます。

![!](../../images/waf-installation/security-edge/connectors/telemetry-portal.png)

Nodeが**Active**のステータスになったら、**Run telemetry portal**を実行します。開始から約5分後、Security Edgeセクションからのダイレクトリンクでアクセス可能になります。

![!](../../images/waf-installation/security-edge/connectors/run-telemetry-portal.png)

Grafanaのホームページからダッシュボードへ移動するには、**Dashboards** → **Wallarm** → **Portal Connector Overview**に進みます。複数のNodeがある場合は、各ダッシュボードを表示するためにコネクタのエンドポイントに対応する**Tenant ID**に切り替えてください。

## Edge Nodeのアップグレード

**Auto update**を有効にすると、新しいマイナーまたはパッチバージョンがリリースされ次第（選択したオプションに応じて）、Edge Nodeは自動的にアップグレードされます。初期設定はすべて保持されます。Auto updateはデフォルトでオフです。

Edge Nodeを手動でアップグレードするには、対象Nodeを編集用に開き、**Auto update**セクションでバージョンを選択します。最適なパフォーマンスとセキュリティのため、最新バージョンの使用を推奨します。

新しいメジャーバージョンへのアップグレードは手動でのみ実行できます。

各バージョンの変更履歴は[記事](../../updating-migrating/native-node/node-artifact-versions.md#all-in-one-installer)を参照してください。Edge Nodeのバージョンは`<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>`形式で、リンク先の記事の同一バージョンに対応します。Edge Nodeバージョンのビルド番号は小規模な変更を示します。

また、コネクタのコードバンドルをアップグレードする必要がある場合があります。変更履歴とアップグレード手順は[Connector Code Bundleの変更履歴](../connectors/code-bundle-inventory.md)を参照してください。

## Edge Nodeの削除

Edge Nodeを削除すると、そのエンドポイントは利用できなくなり、セキュリティ解析のためにトラフィックを経由させることができなくなります。

プラットフォームに組み込まれたWallarmのコードバンドルは、バンドル設定で指定されたNodeのエンドポイントへの到達を引き続き試みます。しかし、`failed: Couldn't resolve address`エラーで失敗し、トラフィックはEdge Nodeを経由せずにターゲットへ流れ続けます。

サブスクリプションが失効した場合、14日後にEdge Nodeは自動的に削除されます。

## トラブルシューティング

--8<-- "../include/waf/installation/security-edge/connector-troubleshooting.md"