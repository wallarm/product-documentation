```markdown
[se-connector-setup-img]:           ../images/waf-installation/security-edge/connectors/setup-view.png
[filtration-mode-docs]:             ../admin-en/configure-wallarm-mode.md
[se-connector-hosts-locations-img]: ../images/waf-installation/security-edge/connectors/hosts-locations.png

# Security Edgeコネクタ <a href="../../../about-wallarm/subscription-plans/#security-edge"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

Security Edgeプラットフォームは、Wallarmがホストする環境内の地理的に分散したロケーションにWallarmノードを展開するためのマネージドサービスを提供します。その主要な展開オプションのひとつとして、[**connector**](connectors/overview.md)ノード展開があり、現地にインストールする必要なく、API全体を堅牢に保護します。

![!](../images/waf-installation/security-edge/connectors/traffic-flow.png)

## 動作の仕組み

Security Edgeサービスは、Wallarmノードが展開、ホストされ、Wallarmによって管理される安全なクラウド環境を提供します:

* ターンキー展開: 世界中に分散したロケーションでWallarmノードを自動的に展開するために、最小限のセットアップのみが必要です。
* オートスケーリング: トラフィック負荷に応じて、ノードインスタンスが手動設定なしで自動的に水平スケールします。
* コスト削減: Wallarm管理のノードにより運用オーバーヘッドが低減され、迅速な展開とスケーラビリティが実現されます。

!!! info "サポートされるプラットフォーム"
    現在、EdgeコネクタはMuleSoft、CloudFront、Cloudflare、Fastlyのみ対応しております。

## Security Edgeコネクタの実行

### 1. コネクタ向けEdgeノードの展開

コネクタ設定のみを指定いただければよく、Wallarmが展開を担当し、お使いのプラットフォームからのトラフィックをルーティングするエンドポイントをご提供します。

1つのエンドポイントで複数の異なるホストからの接続を処理可能です。

1. Security Edgeの展開は該当するサブスクリプションでのみご利用いただけます。sales@wallarm.comにお問い合わせいただき、ご利用ください。
1. Wallarm Consoleの**Security Edge** → **Connectors** → **Add connector**に進んでください。

    ![!][se-connector-setup-img]
1. ノード展開設定を指定してください:

    * **Regions**: コネクタ向けのWallarmノードを展開するための1つまたは複数のリージョンを選択してください。APIやアプリケーションが展開されている場所に近いリージョンをお選びいただくことを推奨します。複数のリージョンを利用することで、インスタンスが利用できなくなった場合にロードバランスが行われ、地理冗長性が向上します。
    * **Filtration mode**: [トラフィック解析モード][filtration-mode-docs].
    * **Application**: 一般的なアプリケーションIDです。Wallarmでは、[applications](../user-guides/settings/applications.md)がインフラの各要素（例:ドメイン、ロケーション、インスタンス）を識別・整理するのに役立ちます。  
      
        各ノードには一般的なアプリケーションIDが必要で、必要に応じてロケーションまたはインスタンス用に特定のIDを割り当てることができます。
    * **Allowed hosts**: ノードがトラフィックを受け入れ解析するホストを指定してください。  
      
        指定されたホストが存在しない場合や到達不可能な場合、415エラーが返され、トラフィックは処理されません。
    * **Location configuration**: 必要に応じて、特定のホストやロケーションに固有のアプリケーションIDを割り当ててください.

        ![!][se-connector-hosts-locations-img]
1. 設定を保存後、Wallarmがコネクタ向けノードを展開および設定するまでに3-5分かかります。  
   展開が完了すると、ステータスは**Pending**から**Active**に変更されます。
1. 後でお使いのプラットフォームからのトラフィックをルーティングするために必要となるノードエンドポイントをコピーしてください。

![!](../images/waf-installation/security-edge/connectors/copy-endpoint.png)

ノードが**Active**ステータスの間はいつでもEdgeノードの展開設定を変更できます。設定変更時、ノードは**Pending**ステータスから再展開され**Active**ステータスとなります。エンドポイントは変更されませんが、再展開中は一時的に利用できなくなります。

### 2. APIを実行しているプラットフォームへのWallarmコードの注入

Edgeノードの展開後、お使いのプラットフォームにWallarmコードを注入し、トラフィックを展開されたノードにルーティングする必要があります。

1. Wallarm Console UIからお使いのプラットフォーム用のコードバンドルをダウンロードしてください。

    ![!](../images/waf-installation/security-edge/connectors/download-code-bundle.png)
1. 指示に従い、お使いのAPI管理プラットフォームにコードバンドルを適用してください:

    * [MuleSoft](connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [CloudFront](connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Cloudflare](connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Fastly](connectors/fastly.md#2-deploy-wallarm-code-on-fastly)

## Edgeノードの削除

Edgeノードを削除すると、そのエンドポイントは利用できなくなり、セキュリティ解析のためにトラフィックをリダイレクトすることができなくなります。

お使いのプラットフォームに注入されたWallarmコードバンドルは、バンドル設定で指定されたノードエンドポイントへアクセスを試みます。しかし、`failed: Couldn't resolve address`エラーが発生し、トラフィックはEdgeノードを経由せずにターゲットへ送信されます。

## トラブルシューティング

--8<-- "../include/waf/installation/security-edge/connector-troubleshooting.md"
```