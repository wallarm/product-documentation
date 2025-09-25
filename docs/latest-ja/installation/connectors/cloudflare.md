[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Cloudflare向けWallarmコネクタ

[Cloudflare](https://www.cloudflare.com/)は、Webサイトやインターネットアプリケーションのセキュリティ、速度、信頼性を強化するために設計された機能（CDN、WAF、DNSサービス、SSL/TLS暗号化など）を提供するセキュリティ兼パフォーマンスサービスです。WallarmはCloudflare上で稼働するAPIを保護するコネクタとして動作できます。

CloudflareのコネクタとしてWallarmを使用するには、Wallarmノードを外部にデプロイし、Wallarmが提供するコードを用いたCloudflare workerを実行して、トラフィックを解析のためにWallarmノードへルーティングする必要があります。

<a name="cloudflare-modes"></a> Cloudflareコネクタは、[インライン](../inline/overview.md)と[アウトオブバンド](../oob/overview.md)の両方のトラフィックフローをサポートします:

=== "インラインのトラフィックフロー"

    Wallarmが不正なアクティビティをブロックするように設定されている場合:

    ![CloudflareとWallarm - インライン構成](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-inline.png)
=== "アウトオブバンドのトラフィックフロー"
    ![CloudflareとWallarm - アウトオブバンド構成](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-oob.png)

## ユースケース

アプリケーションへのアクセスをCloudflare経由で提供している場合に本ソリューションの利用を推奨します。

## 制限事項

* [Helmチャート][helm-chart-native-node]で`LoadBalancer`タイプのWallarmサービスをデプロイする場合、ノードインスタンスのドメインには信頼済みのSSL/TLS証明書が必要です。自己署名証明書はまだサポートしていません。
* Wallarmルールによる[レート制限][rate-limiting]はサポートしていません。
* [マルチテナンシー][multi-tenancy]はまだサポートしていません。

## 要件

デプロイを進める前に、以下の要件を満たしていることを確認してください:

* Cloudflareのテクノロジーに関する理解。
* Cloudflareを経由しているAPIまたはトラフィック。

## デプロイ

<a name="1-deploy-a-wallarm-node"></a>
### 1. Wallarmノードをデプロイする

Wallarmノードは、受信トラフィックを検査し、不正なアクティビティを検出し、脅威を緩和するように設定できるWallarmプラットフォームの中核コンポーネントです。

必要な管理レベルに応じて、Wallarmがホストするノードとして、またはお客様のインフラストラクチャ内にデプロイできます。

=== "Edgeノード"
    コネクタ用にWallarmホスト型ノードをデプロイするには、[手順](../security-edge/se-connector.md)に従ってください。
=== "セルフホストノード"
    セルフホストノードのデプロイに使用するアーティファクトを選択し、各手順に従ってください:

    * ベアメタルまたはVM上のLinuxインフラ向けの[All‑in‑oneインストーラー](../native-node/all-in-one.md)
    * コンテナ化されたデプロイを使用する環境向けの[Dockerイメージ](../native-node/docker-image.md)
    * AWSインフラ向けの[AWS AMI](../native-node/aws-ami.md)
    * Kubernetesを利用するインフラ向けの[Helmチャート](../native-node/helm-chart.md)

### 2. Wallarmのworkerコードを取得してデプロイする

トラフィックをWallarmノードへルーティングするCloudflare workerを実行するには:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**に移動し、プラットフォーム用のコードバンドルをダウンロードします。

    セルフホストノードを実行している場合は、sales@wallarm.comに連絡してコードバンドルを入手してください。
1. ダウンロードしたコードを使用して[Cloudflare workerを作成](https://developers.cloudflare.com/workers/get-started/dashboard/)します。
1. `wallarm_node`パラメータにWallarmノードのURLを設定します。
1. [非同期（アウトオブバンド）](../oob/overview.md)モードを使用する場合は、`wallarm_mode`パラメータを`async`に設定します。
1. 必要に応じて、[その他のパラメータ](cloudflare.md#configuration-options)を変更します。

    ![Cloudflare worker](../../images/waf-installation/gateways/cloudflare/worker-deploy.png)
1. **Website** → 対象ドメインで、**Workers Routes** → **Add route**に移動します:

    * **Route**で、解析のためにWallarmへルーティングするパスを指定します（すべてのパスに対しては例: `*.example.com/*`）。
    * **Worker**で、作成したWallarm workerを選択します。

    ![Cloudflareのルート追加](../../images/waf-installation/gateways/cloudflare/add-route.png)

## テスト

デプロイ済みソリューションの機能をテストするには、以下を実行します:

1. APIにテスト用の[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストを送信します:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Console → **Attacks**セクションを[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)で開き、攻撃が一覧に表示されていることを確認します。
    
    ![インターフェースのAttacks][attacks-in-ui-image]

    Wallarmノードのモードが[blocking](../../admin-en/configure-wallarm-mode.md)に設定され、トラフィックがインラインで流れている場合は、このリクエストもブロックされます。

<a name="configuration-options"></a>
## 設定オプション

workerコードでは、以下のパラメータを指定できます:

| パラメータ | 説明 | 必須か |
| --------- | ----- | ------ |
| `wallarm_node` | お使いの[Wallarmノードインスタンス](#1-deploy-a-wallarm-node)のアドレスを設定します。 | はい |
| `wallarm_mode` | トラフィック処理モードを決定します。`inline`（既定）はトラフィックをWallarmノードで直接処理します。`async`はトラフィックの[コピー](../oob/overview.md)を、元のフローに影響を与えずに解析します。 | いいえ |
| `wallarm_send_rsp_body` | スキーマ[ディスカバリー](../../api-discovery/overview.md)および[ブルートフォース](../../admin-en/configuration-guides/protecting-against-bruteforce.md)などの高度な攻撃検出のためにレスポンスボディの解析を有効にします。既定: `true`（有効）。 | いいえ |
| `wallarm_response_body_limit` | ノードが解析できるレスポンスボディサイズ（バイト）の上限です。既定は`0x4000`です。 | いいえ |
| `wallarm_block_page.custom_path`<br>(Workerバージョン1.0.1+) | ノードからのHTTP 403応答で返すカスタムブロッキングページのURL。例: `https://example.com/block-page.html`。<br>既定: `null`（`html_page`が`true`の場合は詳細なWallarm提供のエラーページを使用）。 | いいえ |
| `wallarm_block_page.html_page`<br>(Workerバージョン1.0.1+) | 不正リクエスト向けのカスタムHTMLブロッキングページを有効にします。既定: `false`（単純なHTTP 403を返します）。 | いいえ |
| `wallarm_block_page.support_email`<br>(Workerバージョン1.0.1+) | 問題報告用としてブロッキングページに表示するメールアドレス。既定: `support@mycorp.com`。 | はい（`html_page`が`true`の場合） |

??? info "Wallarm提供のエラーページを表示"
    HTTP 403応答で返されるWallarm提供のエラーページは次のとおりです:

    ![Wallarmのブロッキングページ](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

## Cloudflare workerのアップグレード

デプロイ済みのCloudflare workerを[新しいバージョン](code-bundle-inventory.md#cloudflare)にアップグレードするには:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**に移動し、更新されたWallarm Cloudflareコードバンドルをダウンロードします。

    セルフホストノードを実行している場合は、sales@wallarm.comに連絡して更新済みのコードバンドルを入手してください。
1. デプロイ済みのCloudflare workerのコードを、更新済みバンドルに置き換えます。

    `wallarm_node`、`wallarm_mode`などの既存のパラメータ値は保持してください。
1. **Deploy**で更新済みの関数をデプロイします。

Workerのアップグレードでは、特にメジャーバージョン更新時にWallarmノードのアップグレードが必要な場合があります。セルフホストノードのリリースノートとアップグレード手順は[Native Nodeの変更履歴](../../updating-migrating/native-node/node-artifact-versions.md)を、Edgeノードのアップグレードについては[Edge connectorのアップグレード手順](../security-edge/se-connector.md#upgrading-the-edge-node)を参照してください。非推奨を回避し将来のアップグレードを容易にするため、定期的なノードの更新を推奨します。